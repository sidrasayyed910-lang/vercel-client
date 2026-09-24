import React, { useState, useEffect } from 'react';
import { useRouter, Link } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  LayoutDashboard,
  BookOpen,
  Award,
  CheckCircle,
  Code,
  ArrowRight,
  Clock,
  TrendingUp,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { navigate } = useRouter();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const res = await api.progress.getDashboard();
        if (res.success) {
          setDashboard(res.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 text-sm">Loading your personalized dashboard...</p>
      </div>
    );
  }

  const stats = dashboard?.stats || {
    coursesStarted: 0,
    coursesCompleted: 0,
    overallProgress: 0,
    certificatesEarned: 0,
    problemsSolved: 0
  };

  const continueLearning = dashboard?.continueLearning || [];
  const recommended = dashboard?.recommended || [];
  const certificates = dashboard?.certificates || [];
  const recentActivity = dashboard?.recentActivity || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Welcome Greeting Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Developer Learning Portal</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Developer'}!
          </h1>
          <p className="text-sky-100 text-xs sm:text-sm leading-relaxed">
            Pick up right where you left off. Continue your lessons or challenge your problem solving skills in the coding arena.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/practice"
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-white text-slate-900 hover:bg-slate-100 shadow-md transition-all"
          >
            Practice Problems
          </Link>
          <Link
            to="/playground"
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-black/20 hover:bg-black/30 border border-white/20 text-white backdrop-blur-md transition-all"
          >
            Code Playground
          </Link>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.coursesStarted}</p>
          <p className="text-xs text-slate-500 font-medium">Courses Started</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.coursesCompleted}</p>
          <p className="text-xs text-slate-500 font-medium">Courses Completed</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.overallProgress}%</p>
          <p className="text-xs text-slate-500 font-medium">Overall Progress</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.certificatesEarned}</p>
          <p className="text-xs text-slate-500 font-medium">Certificates Earned</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 col-span-2 lg:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <Code className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.problemsSolved}</p>
          <p className="text-xs text-slate-500 font-medium">Problems Solved</p>
        </div>
      </div>

      {/* Continue Learning Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Continue Learning
          </h2>
          <Link to="/courses" className="text-xs font-semibold text-sky-500 hover:text-sky-400">
            View All Courses &rarr;
          </Link>
        </div>

        {continueLearning.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              You haven't started any courses yet.
            </p>
            <Link
              to="/languages"
              className="inline-block px-5 py-2 rounded-xl text-xs font-semibold bg-sky-500 text-white"
            >
              Browse 20 Programming Languages
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {continueLearning.map((c) => (
              <div
                key={c.courseId}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{c.languageIcon}</span>
                    <span className="text-xs font-semibold text-sky-500">
                      {c.progressPercent}% Completed
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {c.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Last active: <strong className="text-slate-700 dark:text-slate-300">{c.lastLesson}</strong>
                  </p>

                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-3">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full transition-all"
                      style={{ width: `${c.progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {c.completedLessons} / {c.totalLessons} lessons
                  </span>

                  {c.isCompleted ? (
                    <Link
                      to={`/verify-certificate/${c.certId}`}
                      className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                    >
                      View Certificate
                    </Link>
                  ) : (
                    <button
                      onClick={() => navigate(c.lastLessonSlug ? `/courses/${c.slug}/lessons/${c.lastLessonSlug}` : `/courses/${c.slug}`)}
                      className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-sky-500 hover:bg-sky-400 shadow-sm transition-colors flex items-center space-x-1"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recommended Courses & Certificates Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Recommended Courses (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Recommended Next Steps
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recommended.map((rec) => (
              <div
                key={rec.id}
                onClick={() => navigate(`/courses/${rec.slug}`)}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-sky-500/40 cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl mb-2 block">{rec.language_icon}</span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{rec.title}</h4>
                  <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-500 font-semibold">
                    {rec.difficulty}
                  </span>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-sky-500 flex items-center justify-between">
                  <span>Enroll</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Earned Certificates (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Certificates
            </h2>
            <Link to="/certificates" className="text-xs font-semibold text-sky-500">
              View All &rarr;
            </Link>
          </div>

          {certificates.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
              <Award className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500">No certificates claimed yet. Complete a course to earn your first one!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {certificates.map((cert) => (
                <div
                  key={cert.cert_id}
                  onClick={() => navigate(`/verify-certificate/${cert.cert_id}`)}
                  className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-500/50 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{cert.course_title}</p>
                      <p className="text-[10px] font-mono text-slate-400">{cert.cert_id}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
