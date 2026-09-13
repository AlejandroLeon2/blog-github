export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: "file" | "dir";
  content?: string;
  encoding?: string;
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
  bio: string | null;
}

export interface GitHubCreateResponse {
  content: GitHubFile;
  commit: {
    sha: string;
    message: string;
    author: {
      name: string;
      email: string;
    };
  };
}

export interface GitHubApiError {
  message: string;
  documentation_url?: string;
}
