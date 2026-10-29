import { keycloak } from "../auth/keycloak";
import { AUTH_DISABLED } from "../auth/AuthContext";

const API_URL = import.meta.env.VITE_API_URL as string;
const DEV_USER_ID = import.meta.env.VITE_DEV_USER_ID ?? "dev-user-1";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function http<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (options.body) headers.set("Content-Type", "application/json");

  if (AUTH_DISABLED) {
  headers.set("X-User-Id", import.meta.env.VITE_DEV_USER_ID ?? "dev-user-1");
  } else if (keycloak.authenticated) {
    try {
      await keycloak.updateToken(30);
      headers.set("Authorization", `Bearer ${keycloak.token}`);
    } catch {
      keycloak.clearToken();
      keycloak.login();
      return new Promise<T>(() => {}); 
    }
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  console.log("response info {}", response);
  if (!response.ok) {
    let message = response.statusText;
    try {
      const problem = await response.json();
      message = problem.detail ?? problem.title ?? message;
    } catch {
    }
    throw new ApiError(response.status, message);
  }

  return response.status === 204 ? (undefined as T) : response.json();
}

export async function fetchBlob(path: string): Promise<Blob> {
  const headers = new Headers({ Accept: "application/pdf, application/json" });

  if (AUTH_DISABLED) {
    headers.set("X-User-Id", DEV_USER_ID);
  } else if (keycloak.authenticated) {
    await keycloak.updateToken(30);
    headers.set("Authorization", `Bearer ${keycloak.token}`);
  }

  const response = await fetch(`${API_URL}${path}`, { headers });

  if (!response.ok) {
    let message = response.statusText || "No se pudo descargar el PDF";
    try {
      const problem = await response.json();
      message = problem.detail ?? problem.title ?? message;
    } catch(e) {
      console.error("error fetching file ", e);
    }
    throw new ApiError(response.status, message);
  }

  return response.blob();
}