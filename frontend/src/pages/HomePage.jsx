import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FileCode2,
  Zap,
  Shield,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Brain,
  Rocket,
  Star,
} from "lucide-react";

function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description:
        "Leverage Google Gemini AI for intelligent code review with deep insights",
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      icon: Shield,
      title: "Security First",
      description:
        "Detect vulnerabilities, security risks, and potential exploits in your code",
      gradient: "from-red-400 to-pink-500",
    },
    {
      icon: TrendingUp,
      title: "Best Practices",
      description:
        "Get recommendations based on industry standards and coding conventions",
      gradient: "from-green-400 to-emerald-500",
    },
    {
      icon: FileCode2,
      title: "Multi-Language",
      description:
        "Support for Python, JavaScript, Java, C++, Go, and 20+ languages",
      gradient: "from-blue-400 to-indigo-500",
    },
  ];

  return (
    <div className="px-6 py-16 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-20 relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <Sparkles className="h-64 w-64 text-purple-500 animate-pulse" />
        </div>
        <div className="relative">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Star className="h-8 w-8 text-yellow-400 fill-yellow-400 animate-bounce" />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-4 py-1 rounded-full text-sm font-bold">
              AI-Powered Code Reviews
            </span>
            <Star
              className="h-8 w-8 text-yellow-400 fill-yellow-400 animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
          </div>
          <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 mb-6 leading-tight">
            Elevate Your Code Quality
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Harness the power of{" "}
            <span className="text-purple-400 font-bold">Google Gemini AI</span>{" "}
            for instant, comprehensive code reviews. Get intelligent feedback on
            readability, security, performance, and best practices.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => navigate("/review")}
              className="group relative inline-flex items-center px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 hover:scale-105"
            >
              <Rocket className="mr-2 h-5 w-5 group-hover:animate-bounce" />
              Start Reviewing Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/stats")}
              className="inline-flex items-center px-8 py-4 bg-white/10 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all duration-300 backdrop-blur-lg border border-white/20"
            >
              View Demo
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="group relative bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-white/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              ></div>
              <div
                className={`relative bg-gradient-to-br ${feature.gradient} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="relative text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="relative text-gray-300 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 p-12 mb-20 shadow-2xl">
        <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-12 text-center">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center group">
            <div className="relative mx-auto mb-6 w-24 h-24">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl rotate-6 group-hover:rotate-12 transition-transform duration-300"></div>
              <div className="relative bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl w-24 h-24 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl font-black text-white">1</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Upload Code</h3>
            <p className="text-gray-300 leading-relaxed">
              Select and upload your code file for comprehensive AI analysis
            </p>
          </div>
          <div className="text-center group">
            <div className="relative mx-auto mb-6 w-24 h-24">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl rotate-6 group-hover:rotate-12 transition-transform duration-300"></div>
              <div className="relative bg-gradient-to-br from-blue-400 to-indigo-400 rounded-3xl w-24 h-24 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl font-black text-white">2</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">AI Analysis</h3>
            <p className="text-gray-300 leading-relaxed">
              Gemini AI performs deep analysis on security, performance &
              quality
            </p>
          </div>
          <div className="text-center group">
            <div className="relative mx-auto mb-6 w-24 h-24">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl rotate-6 group-hover:rotate-12 transition-transform duration-300"></div>
              <div className="relative bg-gradient-to-br from-green-400 to-emerald-400 rounded-3xl w-24 h-24 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl font-black text-white">3</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Get Report</h3>
            <p className="text-gray-300 leading-relaxed">
              Receive detailed insights with actionable improvement suggestions
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-3xl shadow-2xl p-16 text-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEyYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMmMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="relative">
          <div className="flex items-center justify-center mb-4">
            <Zap className="h-12 w-12 text-yellow-400 animate-pulse" />
          </div>
          <h2 className="text-5xl font-black mb-6">
            Ready to Transform Your Code?
          </h2>
          <p className="text-2xl mb-10 opacity-90 max-w-2xl mx-auto">
            Join thousands of developers using AI to write{" "}
            <span className="font-bold underline decoration-yellow-400">
              better
            </span>
            ,{" "}
            <span className="font-bold underline decoration-yellow-400">
              safer
            </span>
            , and{" "}
            <span className="font-bold underline decoration-yellow-400">
              cleaner
            </span>{" "}
            code
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => navigate("/review")}
              className="group px-10 py-5 bg-white text-purple-600 font-black text-lg rounded-2xl hover:bg-yellow-400 hover:text-purple-900 transition-all duration-300 shadow-2xl hover:scale-110"
            >
              Get Started Free
              <ArrowRight className="inline-block ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
          <p className="mt-6 text-sm opacity-75">
            ✨ No credit card required • Free forever • Instant results
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
