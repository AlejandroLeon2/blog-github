const TOKEN_KEY = "github_cms_token";

/**
 * Get the saved GitHub token from localStorage.
 */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Save a GitHub token to localStorage.
 */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Remove the saved GitHub token.
 */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Check if a token exists (client-side only).
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return getToken() !== null;
}
