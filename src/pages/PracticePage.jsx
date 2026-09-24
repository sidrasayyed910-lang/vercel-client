import React, { useState, useEffect } from 'react';
import { useRouter, Link } from '../context/RouterContext';
import { api } from '../services/api';
import {
  Code,
  CheckCircle,
  Clock,
  Filter,
  Search,
  ArrowRight,
  TrendingUp,
  Circle,
  HelpCircle
} from 'lucide-react';

export default function PracticePage() {
  const { navigate } = useRouter();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const [topic, setTopic] = useState('All');
  const [status, setStatus] = useState('All');

  const topicsList = [
    'All',
    'Variables',
    'Conditions',
    'Loops',
    'Functions',
    'Arrays',
    'Strings',
    'Recursion',
    'Data Structures',
    'Algorithms'
  ];

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (difficulty !== 'All') params.difficulty = difficulty;
      if (topic !== 'All') params.topic = topic;
      if (status !== 'All') params.status = status;

      const res = await api.practice.getAll(params);
      if (res.success) {
        setProblems(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch problems:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [difficulty, topic, status]);

  useEffect(() => {
    const timer = setTimeout(fetchProblems, 250);
    return () => clearTimeout(timer);
  }, [search]);

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Beginner': return 'bg-sky-500/10 text-sky-500';
      case 'Easy': return 'bg-emerald-500/10 text-emerald-500';
      case 'Medium': return 'bg-amber-500/10 text-amber-500';
      case 'Hard': return 'bg-rose-500/10 text-rose-500';
      default: return 'bg-slate-500/10 text-slate-500';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Coding Practice Arena
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
          Solve algorithmic challenges, debug real edge cases, and run your code against automated test runners.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 mb-8 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search problem title or statement..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-sky-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Difficulty and Status Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold py-2 px-3 rounded-xl focus:outline-none"
            >
              <option value="All">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold py-2 px-3 rounded-xl focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="solved">Solved</option>
              <option value="attempted">Attempted</option>
              <option value="unattempted">Unattempted</option>
            </select>
          </div>
        </div>

        {/* Topic Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-semibold uppercase text-[10px] mr-1 shrink-0">Topics:</span>
          {topicsList.map((t) => (
            <button
              key={t}
              onClick={() => setTopic(t)}
              className={`px-3 py-1 rounded-lg shrink-0 font-medium transition-colors ${
                topic === t
                  ? 'bg-sky-500 text-white font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Problems Table / Cards */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800/40 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : problems.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <p className="text-lg font-bold text-slate-900 dark:text-white">No coding challenges found</p>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/80">
          {problems.map((prob) => {
            const isSolved = prob.userStatus === 'solved';
            const isAttempted = prob.userStatus === 'attempted';

            return (
              <div
                key={prob.id}
                onClick={() => navigate(`/practice/${prob.slug}`)}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
              >
                <div className="flex items-start sm:items-center space-x-3.5">
                  <div className="mt-1 sm:mt-0">
                    {isSolved ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" title="Solved" />
                    ) : isAttempted ? (
                      <Clock className="w-5 h-5 text-amber-500" title="Attempted" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-500 transition-colors">
                        {prob.title}
                      </h3>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getDifficultyColor(prob.difficulty)}`}>
                        {prob.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                      {prob.shortStatement}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 self-end sm:self-center">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {prob.topic}
                  </span>
                  <button className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 group-hover:bg-sky-500 group-hover:text-white text-slate-700 dark:text-slate-300 transition-all flex items-center space-x-1">
                    <span>{isSolved ? 'Review' : 'Solve'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
