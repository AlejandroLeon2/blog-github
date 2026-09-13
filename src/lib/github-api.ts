import { API_BASE, OWNER, REPO, BRANCH, CONTENT_PATH } from "./config";
import { getToken } from "./auth";
import type { GitHubFile, GitHubUser, GitHubCreateResponse } from "../types/github";

/**
 * Make an authenticated request to the GitHub API.
 */
async function githubFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getToken();
  if (!token) throw new Error("No hay token de autenticación.");

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (options.body) {
    headers["Content-Type"] = "application/json";
  }

  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...headers, ...options.headers as Record<string, string> },
  });
}

/**
 * Validate a token by fetching the authenticated user.
 */
export async function getUser(): Promise<GitHubUser> {
  const res = await githubFetch("/user");
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Token inválido.");
  return data;
}

/**
 * List all .md files in the content directory.
 */
export async function listFiles(): Promise<GitHubFile[]> {
  const res = await githubFetch(
    `/repos/${OWNER}/${REPO}/contents/${CONTENT_PATH}?ref=${BRANCH}`
  );

  if (res.status === 404) return [];

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "No se pudieron listar los archivos.");

  return Array.isArray(data)
    ? data.filter((f: GitHubFile) => f.type === "file" && f.name.endsWith(".md"))
    : [];
}

/**
 * Read a single file by its path in the repo.
 */
export async function getFile(filePath: string): Promise<{
  content: string;
  sha: string;
  name: string;
}> {
  const res = await githubFetch(
    `/repos/${OWNER}/${REPO}/contents/${filePath}?ref=${BRANCH}`
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "No se pudo leer el archivo.");

  const decoded = decodeBase64Utf8(data.content);
  return { content: decoded, sha: data.sha, name: data.name };
}

/**
 * Create a new file in the repo.
 */
export async function createFile(
  filename: string,
  content: string
): Promise<GitHubCreateResponse> {
  const path = `${CONTENT_PATH}/${filename}`;
  const res = await githubFetch(`/repos/${OWNER}/${REPO}/contents/${path}`, {
    method: "PUT",
    body: JSON.stringify({
      message: `Create ${filename}`,
      content: encodeBase64Utf8(content),
      branch: BRANCH,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "No se pudo crear el archivo.");
  return data;
}

/**
 * Update an existing file (requires current SHA).
 */
export async function updateFile(
  filePath: string,
  content: string,
  sha: string,
  filename: string
): Promise<GitHubCreateResponse> {
  const res = await githubFetch(`/repos/${OWNER}/${REPO}/contents/${filePath}`, {
    method: "PUT",
    body: JSON.stringify({
      message: `Update ${filename}`,
      content: encodeBase64Utf8(content),
      branch: BRANCH,
      sha,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "No se pudo guardar el archivo.");
  return data;
}

/**
 * Delete a file from the repo (requires current SHA).
 */
export async function deleteFile(
  filePath: string,
  sha: string
): Promise<void> {
  const res = await githubFetch(`/repos/${OWNER}/${REPO}/contents/${filePath}`, {
    method: "DELETE",
    body: JSON.stringify({
      message: `Delete ${filePath}`,
      sha,
      branch: BRANCH,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "No se pudo eliminar el archivo.");
}

/* ---------- internal helpers ---------- */

function encodeBase64Utf8(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function decodeBase64Utf8(base64: string): string {
  const binary = atob(base64.replace(/\n/g, ""));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
