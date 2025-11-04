import { useState, useEffect } from 'react';
import insightService from '../services/insightService';
import metricsService from '../services/metricsService';

const Dashboard = () => {
  const [insights, setInsights] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Demo data when services aren't available
  const demoMetrics = [
    { developer: 'Alice Johnson', commits: 42 },
    { developer: 'Bob Smith', commits: 38 },
    { developer: 'Carol Williams', commits: 35 },
    { developer: 'David Brown', commits: 28 },
    { developer: 'Emily Davis', commits: 22 }
  ];

//   const handleViewCommit = (commit) => {
//   setSelectedCommit(commit);
//   setActiveTab("review"); // move user to review tab automatically
// };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [insightsData, metricsData] = await Promise.all([
        insightService.getInsights(),
        metricsService.getMetrics()
      ]);
      setInsights(insightsData);
      setMetrics(metricsData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      // Use demo data when services aren't available
      setMetrics(demoMetrics);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const topDevelopers = metrics.length > 0 
    ? metrics.sort((a, b) => b.commits - a.commits).slice(0, 5)
    : [];

  const totalCommits = metrics.reduce((sum, m) => sum + (m.commits || 0), 0);

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      {/* Demo Mode Banner */}
      {metrics.length > 0 && metrics[0].developer === demoMetrics[0].developer && (
        <div className="bg-linear-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800 font-medium">Demo Mode</p>
              <p className="text-xs text-blue-700 mt-1">
                {/* Backend services aren't configured. Showing demo data. Configure your backend to see real data. */}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Total Reviews Card */}
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group">
          <div className="p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs text-gray-500 font-medium">Total</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{insights?.metrics?.length || metrics.length}</h3>
            <p className="text-sm text-gray-600">Code Reviews</p>
          </div>
        </div>

        {/* Active Developers Card */}
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group">
          <div className="p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-linear-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-xs text-gray-500 font-medium">Active</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{metrics.length}</h3>
            <p className="text-sm text-gray-600">Developers</p>
          </div>
        </div>

        {/* Total Commits Card */}
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group sm:col-span-2 lg:col-span-1">
          <div className="p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs text-gray-500 font-medium">Total</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{totalCommits}</h3>
            <p className="text-sm text-gray-600">Commits</p>
          </div>
        </div>
      </div>

      {/* Top Developers */}
      {topDevelopers.length > 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="px-4 md:px-6 py-4 border-b border-gray-200 bg-linear-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <h3 className="text-lg md:text-xl font-bold text-gray-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Top Developers
              </h3>
              <span className="text-xs text-gray-500">This Week</span>
            </div>
          </div>
          <div className="p-4 md:p-6">
            <div className="space-y-3">
              {topDevelopers.map((dev, index) => (
                <div key={dev.developer} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center flex-1 min-w-0">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm mr-3 ${
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-gray-100 text-gray-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      #{index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm md:text-base font-medium text-gray-900 truncate">{dev.developer}</p>
                      <p className="text-xs text-gray-500">{dev.commits} commits</p>
                    </div>
                  </div>
                  <div className="w-20 md:w-32 bg-gray-200 rounded-full h-2 ml-4">
                    <div
                      className="bg-linear-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(dev.commits / totalCommits) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Insights Banner */}
      {insights?.aiInsights && (
        <div className="bg-linear-to-r from-blue-500 via-purple-600 to-pink-500 rounded-xl p-6 md:p-8 text-white shadow-xl">
          <div className="flex items-start">
            <div className="flex shrink-0">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold mb-2">Recent AI Insights</h3>
              <p className="text-blue-50">Check the Insights tab for detailed code analysis</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
