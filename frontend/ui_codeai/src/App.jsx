import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import RepoDiscovery from "./components/RepoDiscovery";
import CodeReview from "./components/CodeReview";
import CommitReview from "./components/CommitReview";
import Metrics from "./components/Metrics";
import { useState } from "react";
import "./App.css";
import RdsReportButton from "./components/RdsReportButton";

function App() {
  const [selectedCommit, setSelectedCommit] = useState(null);

  const tabs = [
    { id: "dashboard", name: "Dashboard", icon: "📊", path: "/" },
    { id: "discovery", name: "Repos", icon: "🔍", path: "/discovery" },
    { id: "review", name: "Code Review", icon: "🔎", path: "/review" },
    { id: "metrics", name: "Metrics", icon: "📈", path: "/metrics" },
  ];

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-3 md:py-4">
              <div className="flex items-center">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 md:w-6 md:h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <h1 className="text-xl md:text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    CodeGuardian
                  </h1>
                </div>
                <span className="hidden md:inline-block ml-3 px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                  AI-Powered
                </span>
              </div>
              <div className="flex items-center space-x-2 md:space-x-4">
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-xs">Live</span>
                </div>
                <button className="px-3 md:px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all text-xs md:text-sm font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-[73px] md:top-[81px] z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto scrollbar-hide space-x-1 md:space-x-8">
              {tabs.map((tab) => (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className="py-3 md:py-4 px-2 md:px-1 border-b-2 font-medium text-xs md:text-sm transition-all whitespace-nowrap text-gray-600 hover:text-blue-600 hover:border-blue-300"
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Routes */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/discovery"
              element={
                <RepoDiscovery
                  onCommitSelect={(commitData) => {
                    setSelectedCommit(commitData);
                  }}
                />
              }
            />
            <Route
              path="/review"
              element={
                <div className="p-6 space-y-6">
                  <CodeReview />
                  {selectedCommit && (
                    <CommitReview
                      owner={selectedCommit.owner}
                      repo={selectedCommit.repo}
                      sha={selectedCommit.sha}
                    />
                  )}
                </div>
              }
            />
            <Route path="/metrics" element={<Metrics />} />
            <Route path="/report" element={<RdsReportButton />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-sm text-gray-600">
                © 2024 CodeGuardian. Built with React & Tailwind CSS
              </p>
              <div className="flex space-x-4 md:space-x-6 mt-4 sm:mt-0">
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Documentation</a>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">GitHub</a>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Support</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
