import Constants from 'expo-constants';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

function getBaseUrl(): string {
  // Explicit env var takes priority (used in EAS builds)
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  // In Expo Go dev mode, derive host from the Metro bundler address
  if (__DEV__) {
    const host = Constants.expoConfig?.hostUri?.split(':')[0] ?? 'localhost';
    return `http://${host}:3000`;
  }
  return 'https://yxoedr2d31.execute-api.us-east-1.amazonaws.com';
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const method = options.method ?? "GET";
  const fullUrl = `${getBaseUrl()}${path}`;
  console.log(`[API] ${method} ${fullUrl}`);

  const res = await fetch(fullUrl, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string> ?? {}) },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error(`[API] ${method} ${fullUrl} → ${res.status}`, data?.error ?? "");
    throw new ApiError(res.status, data?.error ?? `Request failed: ${res.status}`);
  }

  console.log(`[API] ${method} ${fullUrl} → ${res.status}`);
  return data as T;
}

export { ApiError };
