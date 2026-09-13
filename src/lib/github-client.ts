import { getToken } from "./auth";
import { OWNER, REPO, BRANCH, CONTENT_PATH, IMAGES_PATH } from "./config";

const API = "https://api.github.com";

export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  type: string;
  content?: string;
}

export class GitHubClient {
  private headers(): Record<string, string> {
    const token = getToken();
    if (!token) throw new Error("No hay token.");
    return {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };
  }

  async request<T = any>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      ...this.headers(),
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    };

    const res = await fetch(`${API}${path}`, { ...options, headers });
    const text = await res.text();

    // Handle non-JSON responses (GitHub HTML error pages)
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`Error ${res.status}: respuesta no válida del servidor.`);
    }

    if (!res.ok) {
      const msg = data.message || `Error ${res.status}`;
      const details = data.documentation_url ? `\nVer: ${data.documentation_url}` : "";
      throw new Error(`${msg}${details}`);
    }
    return data;
  }

  async getUser() {
    return this.request<{ login: string }>("/user");
  }

  async listFiles(): Promise<GitHubFile[]> {
    try {
      return await this.request<GitHubFile[]>(
        `/repos/${OWNER}/${REPO}/contents/${CONTENT_PATH}?ref=${BRANCH}`
      );
    } catch (e: any) {
      if (e.message.includes("Not Found")) return [];
      throw e;
    }
  }

  async getFile(filePath: string): Promise<{ content: string; sha: string; name: string }> {
    const data = await this.request<any>(
      `/repos/${OWNER}/${REPO}/contents/${filePath}?ref=${BRANCH}`
    );
    return {
      content: decodeBase64Utf8(data.content),
      sha: data.sha,
      name: data.name,
    };
  }

  async createFile(filename: string, content: string) {
    return this.request(`/repos/${OWNER}/${REPO}/contents/${CONTENT_PATH}/${filename}`, {
      method: "PUT",
      body: JSON.stringify({
        message: `Create ${filename}`,
        content: encodeBase64Utf8(content),
        branch: BRANCH,
      }),
    });
  }

  async updateFile(filePath: string, content: string, sha: string, filename: string) {
    return this.request(`/repos/${OWNER}/${REPO}/contents/${filePath}`, {
      method: "PUT",
      body: JSON.stringify({
        message: `Update ${filename}`,
        content: encodeBase64Utf8(content),
        branch: BRANCH,
        sha,
      }),
    });
  }

  async deleteFile(filePath: string, sha: string) {
    return this.request(`/repos/${OWNER}/${REPO}/contents/${filePath}`, {
      method: "DELETE",
      body: JSON.stringify({
        message: `Delete ${filePath}`,
        sha,
        branch: BRANCH,
      }),
    });
  }

  async listImages(): Promise<GitHubFile[]> {
    try {
      return await this.request<GitHubFile[]>(
        `/repos/${OWNER}/${REPO}/contents/${IMAGES_PATH}?ref=${BRANCH}`
      );
    } catch (e: any) {
      if (e.message.includes("Not Found")) return [];
      throw e;
    }
  }

  async uploadImage(filename: string, base64Content: string) {
    return this.request(`/repos/${OWNER}/${REPO}/contents/${IMAGES_PATH}/${filename}`, {
      method: "PUT",
      body: JSON.stringify({
        message: `Upload image: ${filename}`,
        content: base64Content,
        branch: BRANCH,
      }),
    });
  }
}

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
