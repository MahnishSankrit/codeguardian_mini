import api from "./api.js";

class RepoService {
  async getUserRepos(username) {
    return api.api(`/repos/${username}`, "REPO_SERVICE");
  }

  async getRepoCommits(username, repo) {
    return api.api(`/repos/${username}/${repo}/commits`, "REPO_SERVICE");
  }

  async getCommitsByQuery(owner, repo) {
    return api.api(`/commits?owner=${owner}&repo=${repo}`, "REPO_SERVICE");
  }

  async getPullsByQuery(owner, repo) {
    return api.api(`/pulls?owner=${owner}&repo=${repo}`, "REPO_SERVICE");
  }

  async getCommitDetails(owner, repo, sha) {
    return api.api(`/repos/${owner}/${repo}/commits/${sha}`, "REPO_SERVICE");
  }

  async getCommitDiff(owner, repo, sha) {
    const githubUrl = `https://api.github.com/repos/${owner}/${repo}/commits/${sha}`;
    const res = await fetch(githubUrl, {
      headers: { Accept: "application/vnd.github.v3.diff" },
    });
    if (!res.ok) throw new Error("Failed to fetch commit diff from GitHub");
    return await res.text();
  }
}

export default new RepoService();
