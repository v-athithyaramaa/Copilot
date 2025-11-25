import React, { useEffect, useState } from "react";
import {
  Loader2,
  Search,
  Trash2,
  Eye,
  Calendar,
  Code,
  Sparkles,
  FileText,
} from "lucide-react";
import { getAllReports, deleteReport } from "../services/api";
import ReviewReport from "../components/ReviewReport";

function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await getAllReports();
      setReports(response.reports);
      setError(null);
    } catch (err) {
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this report?")) {
      return;
    }

    try {
      await deleteReport(reportId);
      setReports(reports.filter((r) => r.id !== reportId));
    } catch (err) {
      alert("Failed to delete report");
    }
  };

  const handleView = (report) => {
    const reviewData = JSON.parse(report.review_data);
    setSelectedReport({
      ...reviewData,
      filename: report.filename,
      language: report.language,
      report_id: report.id,
      timestamp: report.created_at,
    });
  };

  const filteredReports = reports.filter(
    (report) =>
      report.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedReport) {
    return (
      <div className="px-6 py-8 max-w-7xl mx-auto">
        <button
          onClick={() => setSelectedReport(null)}
          className="mb-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          ← Back to Reports
        </button>
        <ReviewReport data={selectedReport} />
      </div>
    );
  }

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <FileText className="h-12 w-12 text-purple-400" />
          <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse" />
        </div>
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 mb-4">
          Review History
        </h1>
        <p className="text-xl text-gray-300">
          View and manage your past code reviews
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by filename or language..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-500/20 border-2 border-red-400/50 rounded-2xl p-6 text-white backdrop-blur-xl">
          {error}
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-16 text-center border border-white/20">
          <Code className="h-20 w-20 text-purple-400 mx-auto mb-6" />
          <h3 className="text-3xl font-bold text-white mb-3">
            No reports found
          </h3>
          <p className="text-xl text-gray-300">
            {searchTerm
              ? "Try a different search term"
              : "Start by reviewing some code!"}
          </p>
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-8 py-5 text-left text-sm font-bold text-purple-300 uppercase tracking-wider">
                    Filename
                  </th>
                  <th className="px-8 py-5 text-left text-sm font-bold text-purple-300 uppercase tracking-wider">
                    Language
                  </th>
                  <th className="px-8 py-5 text-left text-sm font-bold text-purple-300 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-8 py-5 text-left text-sm font-bold text-purple-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-8 py-5 text-right text-sm font-bold text-purple-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredReports.map((report) => {
                  const reviewData = JSON.parse(report.review_data);
                  const score = reviewData.overall_score || 0;

                  return (
                    <tr
                      key={report.id}
                      className="hover:bg-white/5 transition-colors duration-200"
                    >
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg mr-3 shadow-lg">
                            <Code className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-base font-bold text-white">
                            {report.filename}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className="px-4 py-2 inline-flex text-sm font-bold rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg">
                          {report.language}
                        </span>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-24 bg-white/20 rounded-full h-3 mr-3 overflow-hidden">
                            <div
                              className={`h-3 rounded-full transition-all duration-1000 ${
                                score >= 80
                                  ? "bg-gradient-to-r from-green-400 to-emerald-500"
                                  : score >= 60
                                  ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                                  : "bg-gradient-to-r from-red-400 to-pink-500"
                              }`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                          <span className="text-lg font-black text-white">
                            {score}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-base text-gray-300">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 mr-2 text-purple-400" />
                          {new Date(report.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleView(report)}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 p-3 rounded-xl mr-3 transition-all duration-300 shadow-lg hover:scale-110"
                          title="View Report"
                        >
                          <Eye className="h-5 w-5 text-white" />
                        </button>
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 p-3 rounded-xl transition-all duration-300 shadow-lg hover:scale-110"
                          title="Delete Report"
                        >
                          <Trash2 className="h-5 w-5 text-white" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportsPage;
