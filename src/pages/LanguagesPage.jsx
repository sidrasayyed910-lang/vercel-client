import React, { useState, useEffect } from 'react';
import { useRouter, Link } from '../context/RouterContext';
import { api } from '../services/api';
import { Search, Filter, ArrowUpDown, ArrowRight, BookOpen, Clock, CheckCircle } from 'lucide-react';

export default function LanguagesPage() {
  const { navigate } = useRouter();
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const [sort, setSort] = useState('popular');

  const fetchLanguages = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (difficulty !== 'All') params.difficulty = difficulty;
      if (sort) params.sort = sort;

      const res = await api.languages.getAll(params);
      if (res.success) {
        setLanguages(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch languages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, [difficulty, sort]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLanguages();
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Programming Languages
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
          Explore comprehensive, structured curriculums across 20 programming languages from Beginner to Advanced.
        </p>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search language by name, paradigm, or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-sky-500 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Difficulty Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:inline" />
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold py-2 px-3 rounded-xl focus:outline-none"
            >
              <option value="All">All Difficulties</option>
              <option value="Beginner">Beginner Friendly</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400 hidden sm:inline" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold py-2 px-3 rounded-xl focus:outline-none"
            >
              <option value="popular">Most Popular</option>
              <option value="alpha">Alphabetical (A-Z)</option>
              <option value="difficulty">Estimated Duration</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of 20 Language Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-800/40 animate-pulse" />
          ))}
        </div>
      ) : languages.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <p className="text-lg font-bold text-slate-900 dark:text-white">No languages found</p>
          <p className="text-sm text-slate-500 mt-1">Try relaxing your search terms or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {languages.map((lang) => {
            const progress = lang.userProgress || { progressPercent: 0, isCompleted: false };
            return (
              <div
                key={lang.id}
                onClick={() => navigate(`/courses/${lang.slug}`)}
                className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header: Icon and Difficulty badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl shadow-sm">
                      {lang.icon}
                    </div>
                    <div className="flex items-center space-x-1">
                      {progress.isCompleted && (
                        <span className="p-1 rounded-full bg-emerald-500/10 text-emerald-500" title="Course Completed">
                          <CheckCircle className="w-4 h-4" />
                        </span>
                      )}
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400">
                        {lang.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-400 transition-colors">
                    {lang.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-3 leading-relaxed">
                    {lang.description}
                  </p>

                  {/* Paradigm / Tag */}
                  {lang.paradigm && (
                    <div className="mt-3">
                      <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80">
                        {lang.paradigm.split(',')[0]}
                      </span>
                    </div>
                  )}

                  {/* Progress Bar (if active) */}
                  {progress.progressPercent > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-[11px] font-medium mb-1 text-slate-500">
                        <span>Progress</span>
                        <span className="font-semibold text-sky-500">{progress.progressPercent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full transition-all duration-300"
                          style={{ width: `${progress.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Meta & Button */}
                <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
                    <span className="flex items-center space-x-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{lang.course?.totalLessons || 3} Lessons</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{lang.estimatedHours}h est.</span>
                    </span>
                  </div>

                  <button
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 group-hover:bg-gradient-to-r group-hover:from-sky-500 group-hover:to-indigo-600 transition-all flex items-center justify-center space-x-1.5 shadow-sm"
                  >
                    <span>{progress.progressPercent > 0 ? 'Continue Learning' : 'Start Course'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
