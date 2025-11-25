import React, { useEffect, useState } from "react";
import { Loader2, TrendingUp, FileCode2, CheckCircle } from "lucide-react";
import { getStats, getAllReports } from "../services/api";

function StatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentReviews, setRecentReviews] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [statsResponse, reportsResponse] = await Promise.all([
        getStats(),
        getAllReports(1, 5),
      ]);
      setStats(statsResponse.stats);
      setRecentReviews(reportsResponse.reports);
      setError(null);
    } catch (err) {
      setError("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        {error}
      </div>
    );
  }

  const languageData = Object.entries(stats.languages || {}).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 mb-4">
          Statistics
        </h1>
        <p className="text-xl text-gray-300">
          Overview of your code review activity
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300 mb-2 font-semibold">
                Total Reviews
              </p>
              <p className="text-5xl font-black text-white">
                {stats.total_reviews}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-2xl shadow-xl">
              <FileCode2 className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300 mb-2 font-semibold">
                Average Score
              </p>
              <p className="text-5xl font-black text-white">
                {stats.average_score}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-4 rounded-2xl shadow-xl">
              <TrendingUp className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300 mb-2 font-semibold">
                Languages Used
              </p>
              <p className="text-5xl font-black text-white">
                {Object.keys(stats.languages || {}).length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-400 to-indigo-500 p-4 rounded-2xl shadow-xl">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Language Distribution */}
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-12 border border-white/20">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-8">
          Language Distribution
        </h2>
        {languageData.length > 0 ? (
          <div className="space-y-6">
            {languageData.map(([language, count]) => {
              const percentage = (count / stats.total_reviews) * 100;
              return (
                <div key={language}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-bold text-white">
                      {language}
                    </span>
                    <span className="text-sm text-gray-300 font-semibold">
                      {count} reviews ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-300 text-center py-8 text-lg">
            No data available
          </p>
        )}
      </div>

      {/* Recent Reviews */}
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-8">
          Recent Reviews
        </h2>
        {recentReviews.length > 0 ? (
          <div className="space-y-4">
            {recentReviews.map((review) => {
              const reviewData = JSON.parse(review.review_data);
              const score = reviewData.overall_score || 0;
              return (
                <div
                  key={review.id}
                  className="flex items-center justify-between p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-all duration-300 border border-white/10"
                >
                  <div className="flex items-center">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl mr-4 shadow-lg">
                      <FileCode2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg">
                        {review.filename}
                      </p>
                      <p className="text-sm text-gray-300">
                        {new Date(review.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-4 py-2 text-sm font-bold rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg">
                      {review.language}
                    </span>
                    <span
                      className={`px-5 py-2 text-lg font-black rounded-xl shadow-lg ${
                        score >= 80
                          ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                          : score >= 60
                          ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                          : "bg-gradient-to-r from-red-400 to-pink-500 text-white"
                      }`}
                    >
                      {score}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-300 text-center py-8 text-lg">
            No reviews yet
          </p>
        )}
      </div>
    </div>
  );
}

export default StatsPage;
