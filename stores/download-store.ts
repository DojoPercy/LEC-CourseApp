import * as FileSystem from "expo-file-system/legacy";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type DownloadStatus = "idle" | "downloading" | "downloaded" | "error";

interface DownloadEntry {
  status: DownloadStatus;
  localUri: string | null;
  progress: number; // 0–1
}

interface DownloadState {
  downloads: Record<string, DownloadEntry>;

  getDownload: (sectionId: string) => DownloadEntry;
  downloadSection: (sectionId: string, remoteUrl: string) => Promise<void>;
  downloadAll: (sections: { id: string; videoUrl: string }[]) => Promise<void>;
  getLocalUri: (sectionId: string, remoteUrl: string) => string;
  deleteDownload: (sectionId: string) => Promise<void>;
}

const DIR = FileSystem.documentDirectory + "videos/";

async function ensureDir() {
  const info = await FileSystem.getInfoAsync(DIR);
  if (!info.exists) await FileSystem.makeDirectoryAsync(DIR, { intermediates: true });
}

function localPath(sectionId: string) {
  return DIR + sectionId + ".mp4";
}

export const useDownloadStore = create<DownloadState>()(
  persist(
    (set, get) => ({
  downloads: {},

  getDownload: (sectionId) =>
    get().downloads[sectionId] ?? { status: "idle", localUri: null, progress: 0 },

  getLocalUri: (sectionId, remoteUrl) => {
    const entry = get().downloads[sectionId];
    if (entry?.status === "downloaded" && entry.localUri) return entry.localUri;
    return remoteUrl;
  },

  downloadSection: async (sectionId, remoteUrl) => {
    const existing = get().downloads[sectionId];
    if (existing?.status === "downloading" || existing?.status === "downloaded") return;

    await ensureDir();
    const path = localPath(sectionId);

    set((s) => ({
      downloads: {
        ...s.downloads,
        [sectionId]: { status: "downloading", localUri: null, progress: 0 },
      },
    }));

    try {
      const task = FileSystem.createDownloadResumable(
        remoteUrl,
        path,
        {},
        ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
          const progress =
            totalBytesExpectedToWrite > 0
              ? totalBytesWritten / totalBytesExpectedToWrite
              : 0;
          set((s) => ({
            downloads: {
              ...s.downloads,
              [sectionId]: { ...s.downloads[sectionId], progress },
            },
          }));
        }
      );

      const result = await task.downloadAsync();
      if (result?.uri) {
        set((s) => ({
          downloads: {
            ...s.downloads,
            [sectionId]: { status: "downloaded", localUri: result.uri, progress: 1 },
          },
        }));
      } else {
        throw new Error("Download returned no URI");
      }
    } catch {
      set((s) => ({
        downloads: {
          ...s.downloads,
          [sectionId]: { status: "error", localUri: null, progress: 0 },
        },
      }));
    }
  },

  downloadAll: async (sections) => {
    for (const section of sections) {
      await get().downloadSection(section.id, section.videoUrl);
    }
  },

  deleteDownload: async (sectionId) => {
    const entry = get().downloads[sectionId];
    if (entry?.localUri) {
      await FileSystem.deleteAsync(entry.localUri, { idempotent: true });
    }
    set((s) => {
      const next = { ...s.downloads };
      delete next[sectionId];
      return { downloads: next };
    });
  },
    }),
    {
      name: "download-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // On rehydration, reset any interrupted downloads back to idle
      // so they can be retried — don't leave them stuck as "downloading"
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const fixed: Record<string, DownloadEntry> = {};
        for (const [id, entry] of Object.entries(state.downloads)) {
          fixed[id] = entry.status === "downloading"
            ? { status: "idle", localUri: null, progress: 0 }
            : entry;
        }
        state.downloads = fixed;
      },
    }
  )
);
