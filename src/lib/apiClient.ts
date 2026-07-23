/**
 * Cliente API reutilizable. ÚNICO lugar donde se hace `fetch`.
 * Los componentes nunca llaman fetch: usan los `services/*`, que usan este cliente.
 */
import { API_BASE_URL } from "../config/api";

export class ApiError extends Error {
  public readonly status: number;
  public readonly details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = (data && (data.message as string)) || `Error HTTP ${res.status}`;
    throw new ApiError(res.status, message, data?.details);
  }
  return data as T;
}

export const apiClient = {
  get: <T>(path: string): Promise<T> => request<T>("GET", path),
  post: <T>(path: string, body?: unknown): Promise<T> => request<T>("POST", path, body),
  patch: <T>(path: string, body?: unknown): Promise<T> => request<T>("PATCH", path, body),
  put: <T>(path: string, body?: unknown): Promise<T> => request<T>("PUT", path, body),
  delete: <T>(path: string): Promise<T> => request<T>("DELETE", path),
};
