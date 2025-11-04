import { useState } from "react";
import repoService from "../services/repoService";
import aiReviewService from "../services/aiReviewService";
import notificationService from "../services/notificationService";

const RepoDiscovery = () => {
  const [username, setUsername] = useState("");
  const [repos, setRepos] = useState([]);
  const [commits, setCommits] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [selectedCommit, setSelectedCommit] = useState(null);
  const [commitDiff, setCommitDiff] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reviewResult, setReviewResult] = useState(null);

  // 🧩 Fetch all repos for user
  const fetchRepos = async () => {
    if (!username.trim()) {
      setError("Please enter a GitHub username");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await repoService.getUserRepos(username);
      setRepos(data);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch repos:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Fetch all commits for a repo
  const fetchCommits = async (repoName) => {
    try {
      setLoading(true);
      setError(null);
      const data = await repoService.getRepoCommits(username, repoName);
      setCommits(data);
      setSelectedRepo(repoName);
      setSelectedCommit(null);
      setCommitDiff("");
      setReviewResult(null);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch commits:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Fetch code diff for a specific commit
  const viewCommitCode = async (commitSha) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedCommit(commitSha);
      const diff = await repoService.getCommitDiff(username, selectedRepo, commitSha);
      setCommitDiff(diff);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch commit diff:", err);
    } finally {
      setLoading(false);
    }
  };

  //  Send diff to AI review service
  const reviewCommit = async () => {
    if (!commitDiff) {
      setError("Please load commit code first.");
      return;
    }
    try {
      setLoading(true);
      const payload = {
        repo: `${username}/${selectedRepo}`,
        commit_id: selectedCommit,
        files: [{ path: "commit.diff", diff: commitDiff }],
      };
      const result = await aiReviewService.runAIReview(payload);
      setReviewResult({ commit_id: selectedCommit, review: result });

      // Notify
      await notificationService.receiveNotification({
        subject: `Code Review Completed for ${selectedCommit.substring(0, 7)}`,
        message: `AI Review completed for commit ${selectedCommit}`,
        attributes: {
          commit_id: selectedCommit,
          repo: `${username}/${selectedRepo}`,
        },
      });
    } catch (err) {
      setError(err.message);
      console.error("Failed to review code:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* 🔍 Search Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 md:p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Repository Discovery</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Enter GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && fetchRepos()}
            className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={fetchRepos}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>
        {error && <div className="mt-3 text-red-600">{error}</div>}
      </div>

      {/* 📦 Repo List */}
      {repos.length > 0 && (
        <div className="bg-white rounded-xl shadow border">
          <div className="p-4 border-b">
            <h3 className="text-lg font-bold">Repositories for @{username}</h3>
          </div>
          {repos.map((repo) => (
            <div key={repo.id} className="p-4 border-b hover:bg-gray-50 flex justify-between">
              <div>
                <h4 className="font-semibold">{repo.name}</h4>
                <p className="text-sm text-gray-600">{repo.description || "No description"}</p>
              </div>
              <button
                onClick={() => fetchCommits(repo.name)}
                className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600"
              >
                View Commits
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 📜 Commits */}
      {commits.length > 0 && (
        <div className="bg-white rounded-xl shadow border">
          <div className="p-4 border-b">
            <h3 className="text-lg font-bold">Commits for {selectedRepo}</h3>
          </div>
          {commits.slice(0, 10).map((commit) => (
            <div key={commit.commit_id} className="p-4 border-b hover:bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <code className="text-blue-600 font-mono mr-2">
                    {commit.commit_id.substring(0, 7)}
                  </code>
                  <span className="text-sm text-gray-600">{commit.message}</span>
                </div>
                <button
                  onClick={() => viewCommitCode(commit.commit_id)}
                  className="text-sm bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
                >
                  View Code
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🧠 Diff Viewer */}
      {commitDiff && (
        <div className="bg-gray-50 border rounded-xl p-4">
          <h4 className="font-semibold mb-2">
            Commit Code for {selectedCommit.substring(0, 7)}
          </h4>
          <pre className="bg-white p-3 border rounded overflow-x-auto text-sm">
            {commitDiff}
          </pre>
          <button
            onClick={reviewCommit}
            disabled={loading}
            className="mt-3 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            {loading ? "Reviewing..." : "Review Code with AI"}
          </button>
        </div>
      )}

      {/* ✅ Review Result */}
      {reviewResult && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <h4 className="font-bold mb-2">AI Review Results</h4>
          <pre className="bg-white p-3 rounded text-sm text-gray-700 whitespace-pre-wrap">
            {reviewResult.review.content ||
              reviewResult.review.review ||
              "Review completed successfully."}
          </pre>
        </div>
      )}
    </div>
  );
};

export default RepoDiscovery;
