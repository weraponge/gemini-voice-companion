
export interface GitHubFile {
  path: string;
  content: string;
}

export class GitHubService {
  private token: string;
  private owner: string | null = null;

  constructor(token: string) {
    this.token = token;
  }

  private async fetchGitHub(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`https://api.github.com${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `token ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `GitHub API error: ${response.status}`);
    }

    return response.json();
  }

  async getAuthenticatedUser() {
    const user = await this.fetchGitHub('/user');
    this.owner = user.login;
    return user;
  }

  async ensureRepoExists(repoName: string) {
    if (!this.owner) await this.getAuthenticatedUser();
    
    try {
      await this.fetchGitHub(`/repos/${this.owner}/${repoName}`);
      return true; // Exists
    } catch (e) {
      // Create it
      await this.fetchGitHub('/user/repos', {
        method: 'POST',
        body: JSON.stringify({
          name: repoName,
          description: 'Gemini Voice Companion - AI Assistant',
          private: false,
          auto_init: true
        }),
      });
      return false; // Created
    }
  }

  async pushFiles(repoName: string, files: GitHubFile[]) {
    if (!this.owner) await this.getAuthenticatedUser();

    for (const file of files) {
      const path = file.path;
      let sha: string | null = null;

      // Try to get existing file SHA to update it
      try {
        const existing = await this.fetchGitHub(`/repos/${this.owner}/${repoName}/contents/${path}`);
        sha = existing.sha;
      } catch (e) {
        // File doesn't exist, that's fine
      }

      await this.fetchGitHub(`/repos/${this.owner}/${repoName}/contents/${path}`, {
        method: 'PUT',
        body: JSON.stringify({
          message: `Sync ${path} from Gemini Voice Companion`,
          content: btoa(unescape(encodeURIComponent(file.content))),
          sha: sha || undefined,
        }),
      });
    }
  }
}
