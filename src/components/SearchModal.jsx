import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from '../context/RouterContext';
import { api } from '../services/api';
import { Search, X, BookOpen, Code, FileText, ChevronRight, Terminal, Sparkles } from 'lucide-react';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const { navigate } = useRouter();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults(null);
    }
  }, [isOpen]);

  // Handle Ctrl+K shortcut globally
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(false); // toggle handled by parent
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.search.query(query);
        if (res.success) {
          setResults(res.results);
        }
      } catch (err) {
        console.error('Search query failed:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  const hasMatches = results && (
    results.languages.length > 0 ||
    results.courses.length > 0 ||
    results.lessons.length > 0 ||
    results.practiceProblems.length > 0
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Header */}
        <div className="flex items-center px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search languages, lessons, or practice problems..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-base focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            Esc
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {loading && (
            <div className="flex items-center justify-center py-8 text-sm text-slate-400">
              <span className="inline-block w-4 h-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mr-2"></span>
              Searching CodeVerse...
            </div>
          )}

          {!loading && !query && (
            <div className="py-8 text-center text-slate-400 text-sm">
              <Sparkles className="w-8 h-8 text-sky-400 mx-auto mb-2 opacity-60" />
              <p>Type to instantly find languages, lessons, topics, and practice questions.</p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                {['Python', 'JavaScript', 'Rust', 'Loops', 'Two Sum', 'Pointers'].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => setQuery(chip)}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-500"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!loading && query && !hasMatches && (
            <div className="py-8 text-center text-slate-400 text-sm">
              <p>No matches found for "{query}".</p>
              <p className="text-xs text-slate-500 mt-1">Try searching for a language like "Go" or a topic like "Recursion".</p>
            </div>
          )}

          {/* Languages Matches */}
          {results && results.languages.length > 0 && (
            <div>
              <h5 className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-2">Languages</h5>
              <div className="space-y-1">
                {results.languages.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => handleSelect(`/courses/${l.slug}`)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{l.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{l.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{l.description}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-sky-500/10 text-sky-500 font-medium">
                      {l.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lessons Matches */}
          {results && results.lessons.length > 0 && (
            <div>
              <h5 className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-2">Lessons</h5>
              <div className="space-y-1">
                {results.lessons.map((les) => (
                  <div
                    key={les.id}
                    onClick={() => handleSelect(`/courses/${les.course_slug}/lessons/${les.slug}`)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{les.language_icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{les.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{les.course_title}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Practice Problems Matches */}
          {results && results.practiceProblems.length > 0 && (
            <div>
              <h5 className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-2">Practice Problems</h5>
              <div className="space-y-1">
                {results.practiceProblems.map((prob) => (
                  <div
                    key={prob.id}
                    onClick={() => handleSelect(`/practice/${prob.slug}`)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Code className="w-4 h-4 text-emerald-500" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{prob.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Topic: {prob.topic}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-medium">
                      {prob.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
