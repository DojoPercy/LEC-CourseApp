
class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
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
  const fullUrl = `http://localhost:3001${path}`;
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
