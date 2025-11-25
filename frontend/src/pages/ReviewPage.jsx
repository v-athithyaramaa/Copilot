import React, { useState } from "react";
import {
  Upload,
  FileCode2,
  Loader2,
  CheckCircle,
  XCircle,
  Sparkles,
  Zap,
  Brain,
} from "lucide-react";
import { reviewCode } from "../services/api";
import ReviewReport from "../components/ReviewReport";

function ReviewPage() {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const languages = [
    "Python",
    "JavaScript",
    "TypeScript",
    "Java",
    "C++",
    "C#",
    "Go",
    "Ruby",
    "PHP",
    "Swift",
    "Kotlin",
    "Rust",
    "Scala",
    "HTML",
    "CSS",
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setResult(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
      setResult(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file to review");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await reviewCode(file, language);
      setResult(response);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to review code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setLanguage("");
    setResult(null);
    setError(null);
  };

  if (result) {
    return (
      <div className="px-6 py-8 max-w-7xl mx-auto">
        <button
          onClick={resetForm}
          className="mb-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          ← Review Another File
        </button>
        <ReviewReport data={result} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 p-5 rounded-3xl shadow-2xl">
            <FileCode2 className="h-16 w-16 text-white" />
          </div>
        </div>
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 mb-4">
          Upload Code for Review
        </h1>
        <p className="text-xl text-gray-300 flex items-center justify-center gap-2">
          <Brain className="h-5 w-5 text-purple-400" />
          Get instant AI-powered feedback on your code quality
          <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border border-white/20"
      >
        {/* File Upload */}
        <div className="mb-8">
          <label className="block text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Upload className="h-5 w-5 text-purple-400" />
            Code File
          </label>
          <div
            className={`relative border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
              dragActive
                ? "border-purple-400 bg-purple-500/20 scale-105 shadow-xl shadow-purple-500/50"
                : "border-white/30 hover:border-purple-400/50 hover:bg-white/5"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".py,.js,.jsx,.ts,.tsx,.java,.cpp,.c,.h,.cs,.go,.rb,.php,.swift,.kt,.rs,.scala,.html,.css,.sql,.sh"
            />
            {file ? (
              <div className="flex items-center justify-center">
                <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-3 mr-4 shadow-lg">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold text-white">{file.name}</p>
                  <p className="text-sm text-gray-300">
                    {(file.size / 1024).toFixed(2)} KB • Ready for analysis
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <Upload className="h-10 w-10 text-white" />
                </div>
                <p className="text-lg text-white mb-2">
                  <span className="text-purple-400 font-bold">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-sm text-gray-300">
                  Supports 20+ languages: Python, JavaScript, Java, C++, Go, and
                  more
                </p>
              </>
            )}
          </div>
        </div>

        {/* Language Selection */}
        <div className="mb-8">
          <label className="block text-lg font-bold text-white mb-4 flex items-center gap-2">
            <FileCode2 className="h-5 w-5 text-purple-400" />
            Programming Language{" "}
            <span className="text-sm font-normal text-gray-400">
              (Optional)
            </span>
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-6 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white font-semibold focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 hover:bg-white/20"
          >
            <option value="" className="bg-slate-800">
              🤖 Auto-detect from file extension
            </option>
            {languages.map((lang) => (
              <option key={lang} value={lang} className="bg-slate-800">
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-6 bg-gradient-to-r from-red-500/20 to-pink-500/20 border-2 border-red-400/50 rounded-2xl flex items-start backdrop-blur-xl">
            <div className="bg-red-500 rounded-full p-2 mr-4">
              <XCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-white mb-1">Error</p>
              <p className="text-sm text-red-200">{error}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!file || loading}
          className="group w-full px-8 py-5 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white font-bold text-lg rounded-2xl hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-2xl hover:shadow-purple-500/50 hover:scale-105 disabled:scale-100"
        >
          {loading ? (
            <>
              <Loader2 className="h-6 w-6 mr-3 animate-spin" />
              <span>Analyzing Code with AI Magic...</span>
              <Sparkles className="h-6 w-6 ml-3 animate-pulse" />
            </>
          ) : (
            <>
              <Zap className="h-6 w-6 mr-3 group-hover:animate-bounce" />
              <span>Review Code with AI</span>
              <FileCode2 className="h-6 w-6 ml-3 group-hover:rotate-12 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Info Cards */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <div className="group bg-gradient-to-br from-yellow-400/20 to-orange-500/20 backdrop-blur-xl p-6 rounded-2xl border border-yellow-400/30 hover:border-yellow-400 transition-all duration-300 hover:scale-105">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <h3 className="font-bold text-white text-lg mb-2">Lightning Fast</h3>
          <p className="text-sm text-gray-300">
            Get results in seconds, not minutes
          </p>
        </div>
        <div className="group bg-gradient-to-br from-purple-400/20 to-pink-500/20 backdrop-blur-xl p-6 rounded-2xl border border-purple-400/30 hover:border-purple-400 transition-all duration-300 hover:scale-105">
          <div className="bg-gradient-to-br from-purple-400 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <h3 className="font-bold text-white text-lg mb-2">
            Comprehensive AI
          </h3>
          <p className="text-sm text-gray-300">
            All code aspects thoroughly analyzed
          </p>
        </div>
        <div className="group bg-gradient-to-br from-green-400/20 to-emerald-500/20 backdrop-blur-xl p-6 rounded-2xl border border-green-400/30 hover:border-green-400 transition-all duration-300 hover:scale-105">
          <div className="bg-gradient-to-br from-green-400 to-emerald-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h3 className="font-bold text-white text-lg mb-2">
            Actionable Insights
          </h3>
          <p className="text-sm text-gray-300">
            Clear, practical improvement suggestions
          </p>
        </div>
      </div>
    </div>
  );
}

export default ReviewPage;
