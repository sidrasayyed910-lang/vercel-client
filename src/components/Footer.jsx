import React from 'react';
import { Link } from '../context/RouterContext';
import { Code2, Heart, ShieldCheck, Terminal, Award } from 'lucide-react';

export default function Footer() {
  const topLanguages = [
    { name: 'Python', path: '/courses/python' },
    { name: 'JavaScript', path: '/courses/javascript' },
    { name: 'TypeScript', path: '/courses/typescript' },
    { name: 'C++', path: '/courses/cpp' },
    { name: 'Rust', path: '/courses/rust' },
    { name: 'Go', path: '/courses/go' },
    { name: 'Java', path: '/courses/java' },
    { name: 'SQL', path: '/courses/sql' }
  ];

  return (
    <footer className="w-full bg-slate-100 dark:bg-[#070A11] border-t border-slate-200 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-md shadow-sky-500/20">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                CodeVerse
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Master modern software engineering across 20 programming languages. Write live code, solve algorithmic challenges, take graded quizzes, and earn verifiable e-certificates.
            </p>
            <div className="flex items-center space-x-3 text-slate-500 dark:text-slate-400 pt-2">
              <span className="flex items-center space-x-1.5 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Certificate Authority</span>
              </span>
            </div>
          </div>

          {/* Languages Column */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
              Top Languages
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              {topLanguages.map((l) => (
                <li key={l.name}>
                  <Link to={l.path} className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
                    {l.name} Course
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform Column */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/languages" className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
                  All 20 Languages
                </Link>
              </li>
              <li>
                <Link to="/practice" className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
                  Coding Arena (Practice)
                </Link>
              </li>
              <li>
                <Link to="/playground" className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
                  Online Code Playground
                </Link>
              </li>
              <li>
                <Link to="/roadmaps" className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
                  Developer Roadmaps
                </Link>
              </li>
              <li>
                <Link to="/certificates" className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
                  Verify Certificate
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
              Connect & Learn
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/login" className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
                  Student Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
                  Sign Up Free
                </Link>
              </li>
              <li>
                <Link to="/verify-certificate/CV-2026-000123" className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
                  Sample Certificate
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <p>&copy; 2026 CodeVerse Learning Academy. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Accreditation</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
