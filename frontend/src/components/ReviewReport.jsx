import React from "react";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  TrendingUp,
  Code,
  Shield,
  Zap,
  FileCode2,
} from "lucide-react";

function ReviewReport({ data }) {
  const { filename, language, review, report_id, timestamp } = data;

  const overallScore = review?.overall_score || 0;
  const readabilityScore = review?.readability?.score || 0;
  const modularityScore = review?.modularity?.score || 0;

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical":
      case "high":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "medium":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "low":
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-white/20">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 mb-3">
              Code Review Report
            </h1>
            <div className="flex items-center space-x-4 text-base text-gray-300">
              <span className="flex items-center">
                <FileCode2 className="h-5 w-5 mr-2 text-purple-400" />
                <span className="text-white font-semibold">{filename}</span>
              </span>
              <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-bold shadow-lg">
                {language}
              </span>
              {timestamp && (
                <span className="text-gray-400">
                  {new Date(timestamp).toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-3xl p-6 border-2 border-purple-400/50 shadow-xl">
            <div className="text-center">
              <div className="text-5xl font-black text-white mb-1">
                {overallScore}
              </div>
              <div className="text-sm font-bold text-purple-300">
                Overall Score
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        {review?.summary && (
          <div className="mt-6 p-6 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-white text-lg leading-relaxed">
              {review.summary}
            </p>
          </div>
        )}
      </div>

      {/* Score Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Readability */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl mr-3 shadow-lg">
                <Code className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-black text-white">Readability</h2>
            </div>
            <div className="text-4xl font-black text-white">
              {readabilityScore}
            </div>
          </div>

          {review?.readability?.strengths &&
            review.readability.strengths.length > 0 && (
              <div className="mb-6">
                <h3 className="text-base font-bold text-green-400 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Strengths:
                </h3>
                <ul className="space-y-2">
                  {review.readability.strengths.map((strength, idx) => (
                    <li
                      key={idx}
                      className="flex items-start text-base text-white bg-white/5 p-3 rounded-xl"
                    >
                      <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {review?.readability?.issues &&
            review.readability.issues.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-red-400 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Issues:
                </h3>
                <div className="space-y-3">
                  {review.readability.issues.map((issue, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white/5 rounded-xl border border-white/10"
                    >
                      <div className="flex items-start">
                        {getSeverityIcon(issue.severity)}
                        <div className="ml-3 flex-1">
                          <p className="text-base font-semibold text-white mb-1">
                            {issue.description}
                          </p>
                          {issue.suggestion && (
                            <p className="text-sm text-gray-300 mt-2">
                              💡 {issue.suggestion}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* Modularity */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-indigo-500 to-blue-500 p-3 rounded-xl mr-3 shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-black text-white">Modularity</h2>
            </div>
            <div className="text-4xl font-black text-white">
              {modularityScore}
            </div>
          </div>

          {review?.modularity?.strengths &&
            review.modularity.strengths.length > 0 && (
              <div className="mb-6">
                <h3 className="text-base font-bold text-green-400 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Strengths:
                </h3>
                <ul className="space-y-2">
                  {review.modularity.strengths.map((strength, idx) => (
                    <li
                      key={idx}
                      className="flex items-start text-base text-white bg-white/5 p-3 rounded-xl"
                    >
                      <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {review?.modularity?.issues &&
            review.modularity.issues.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-red-400 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Issues:
                </h3>
                <div className="space-y-3">
                  {review.modularity.issues.map((issue, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white/5 rounded-xl border border-white/10"
                    >
                      <div className="flex items-start">
                        {getSeverityIcon(issue.severity)}
                        <div className="ml-3 flex-1">
                          <p className="text-base font-semibold text-white mb-1">
                            {issue.description}
                          </p>
                          {issue.suggestion && (
                            <p className="text-sm text-gray-300 mt-2">
                              💡 {issue.suggestion}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Bugs */}
      {review?.bugs && review.bugs.length > 0 && (
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-white/20">
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-br from-red-500 to-pink-500 p-3 rounded-xl mr-3 shadow-lg">
              <XCircle className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white">
              Potential Bugs ({review.bugs.length})
            </h2>
          </div>
          <div className="space-y-4">
            {review.bugs.map((bug, idx) => (
              <div
                key={idx}
                className="p-5 border-l-4 border-red-400 bg-white/5 rounded-xl backdrop-blur-xl"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-lg ${
                          bug.severity === "critical"
                            ? "bg-gradient-to-r from-red-600 to-pink-600 text-white"
                            : bug.severity === "high"
                            ? "bg-gradient-to-r from-red-500 to-orange-500 text-white"
                            : "bg-gradient-to-r from-red-400 to-pink-400 text-white"
                        }`}
                      >
                        {bug.severity}
                      </span>
                      {bug.line && (
                        <span className="ml-3 text-sm text-gray-300 font-semibold">
                          Line {bug.line}
                        </span>
                      )}
                    </div>
                    <p className="text-base font-bold text-white mb-2">
                      {bug.type || "Bug"}
                    </p>
                    <p className="text-sm text-gray-300 mb-3">
                      {bug.description}
                    </p>
                    {bug.suggestion && (
                      <div className="mt-3 p-3 bg-white/10 rounded-lg border border-white/20">
                        <p className="text-xs font-bold text-green-400 mb-1">
                          💡 Suggestion:
                        </p>
                        <p className="text-xs text-white">{bug.suggestion}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Issues */}
      {review?.security && review.security.length > 0 && (
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-white/20">
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-xl mr-3 shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white">
              Security Vulnerabilities ({review.security.length})
            </h2>
          </div>
          <div className="space-y-4">
            {review.security.map((issue, idx) => (
              <div
                key={idx}
                className="p-5 border-l-4 border-orange-400 bg-white/5 rounded-xl backdrop-blur-xl"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-lg ${
                          issue.severity === "critical"
                            ? "bg-gradient-to-r from-orange-600 to-red-600 text-white"
                            : issue.severity === "high"
                            ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                            : "bg-gradient-to-r from-orange-400 to-yellow-400 text-white"
                        }`}
                      >
                        {issue.severity}
                      </span>
                      {issue.line && (
                        <span className="ml-3 text-sm text-gray-300 font-semibold">
                          Line {issue.line}
                        </span>
                      )}
                    </div>
                    <p className="text-base font-bold text-white mb-2">
                      {issue.vulnerability}
                    </p>
                    <p className="text-sm text-gray-300 mb-3">
                      {issue.description}
                    </p>
                    {issue.suggestion && (
                      <div className="mt-3 p-3 bg-white/10 rounded-lg border border-white/20">
                        <p className="text-xs font-bold text-green-400 mb-1">
                          🔒 How to fix:
                        </p>
                        <p className="text-xs text-white">{issue.suggestion}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Issues */}
      {review?.performance && review.performance.length > 0 && (
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-white/20">
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-3 rounded-xl mr-3 shadow-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white">
              Performance Issues ({review.performance.length})
            </h2>
          </div>
          <div className="space-y-4">
            {review.performance.map((issue, idx) => (
              <div
                key={idx}
                className="p-5 border-l-4 border-yellow-400 bg-white/5 rounded-xl backdrop-blur-xl"
              >
                <div className="flex items-start">
                  {getSeverityIcon(issue.severity)}
                  <div className="ml-3 flex-1">
                    {issue.line && (
                      <span className="text-sm text-gray-300 font-semibold mb-2 block">
                        Line {issue.line}
                      </span>
                    )}
                    <p className="text-base font-bold text-white mb-2">
                      {issue.issue}
                    </p>
                    <p className="text-sm text-gray-300 mb-3">{issue.impact}</p>
                    {issue.suggestion && (
                      <div className="mt-3 p-3 bg-white/10 rounded-lg border border-white/20">
                        <p className="text-xs font-bold text-green-400 mb-1">
                          ⚡ Optimization:
                        </p>
                        <p className="text-xs text-white">{issue.suggestion}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {review?.suggestions && review.suggestions.length > 0 && (
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 overflow-hidden">
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-3 rounded-xl mr-3 shadow-lg">
              <Info className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white break-words">
              Improvement Suggestions
            </h2>
          </div>
          <div className="space-y-4">
            {review.suggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className="p-5 bg-white/5 rounded-xl border border-white/10 overflow-hidden"
              >
                <div className="flex items-start">
                  <Info className="h-6 w-6 text-blue-400 mr-4 flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-2 flex-wrap gap-2">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-lg ${
                          suggestion.priority === "high"
                            ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                            : suggestion.priority === "medium"
                            ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                            : "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                        }`}
                      >
                        {suggestion.priority}
                      </span>
                      <span className="text-xs text-purple-300 font-semibold break-words">
                        {suggestion.category}
                      </span>
                    </div>
                    <p className="text-base font-bold text-white mb-2 break-words">
                      {suggestion.title}
                    </p>
                    <p className="text-sm text-gray-300 mb-3 break-words">
                      {suggestion.description}
                    </p>
                    {suggestion.code_example && (
                      <div className="mt-3 p-3 bg-slate-900 text-green-400 rounded-lg text-xs font-mono overflow-x-auto border border-white/10 max-w-full">
                        <pre className="whitespace-pre-wrap break-all">
                          {suggestion.code_example}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewReport;
