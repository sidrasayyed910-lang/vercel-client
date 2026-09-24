import React, { useState, useEffect } from 'react';
import { useRouter, Link } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Code2,
  Terminal,
  Award,
  BookOpen,
  ArrowRight,
  CheckCircle,
  Play,
  Layers,
  Sparkles,
  Users,
  Compass,
  ChevronDown,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Star
} from 'lucide-react';

export default function HomePage() {
  const { navigate } = useRouter();
  const { isAuthenticated } = useAuth();
  const [popularLanguages, setPopularLanguages] = useState([]);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.languages.getAll({ sort: 'popular' });
        if (res.success) {
          setPopularLanguages(res.data.slice(0, 8));
        }
      } catch (err) {
        console.error('Failed to load popular languages:', err);
      }
    }
    loadData();
  }, []);

  const features = [
    {
      icon: <Terminal className="w-6 h-6 text-sky-500" />,
      title: 'Interactive Code Playground',
      description: 'Write, execute, and debug code directly in the browser across 20 programming languages with real-time output.'
    },
    {
      icon: <Award className="w-6 h-6 text-amber-500" />,
      title: 'Verifiable E-Certificates',
      description: 'Complete hands-on projects and pass final proctored quizzes to earn verified, employer-shareable credentials.'
    },
    {
      icon: <Layers className="w-6 h-6 text-indigo-500" />,
      title: 'Structured Zero-to-Hero Paths',
      description: 'Progress logically from Beginner fundamentals to Intermediate data structures and Advanced production architectures.'
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-emerald-500" />,
      title: 'Algorithmic Problem Arena',
      description: 'Test your problem-solving skills against automated test cases covering arrays, recursion, dynamic programming, and OOP.'
    }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Full Stack Engineer @ FinTech',
      quote: 'The Python and Go courses on CodeVerse gave me the exact hands-on depth I needed to transition from junior to senior engineer.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    },
    {
      name: 'Marcus Vance',
      role: 'DevOps & Cloud Specialist',
      quote: 'Being able to practice Bash and Rust in an instant playground without installing local toolchains made learning ridiculously fast.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    {
      name: 'Elena Rostova',
      role: 'Computer Science Student',
      quote: 'The verified certificates are legitimate! My recruiter validated my C++ certificate directly using the unique verification link on my CV.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    }
  ];

  const faqs = [
    {
      q: 'How does CodeVerse teach 20 programming languages?',
      a: 'Each language follows a rigorous curriculum structured into Beginner, Intermediate, and Advanced tiers. Every lesson contains clean syntax breakdowns, annotated real-world code snippets, common mistakes, and interactive exercises.'
    },
    {
      q: 'Are the e-certificates verifiable by employers?',
      a: 'Yes! Every certificate issued generates a unique Certificate ID (e.g. CV-2026-000123) and cryptographic SHA-256 validation hash with a permanent public verification page.'
    },
    {
      q: 'Do I need to install any compilers or interpreters locally?',
      a: 'Not at all! CodeVerse features an integrated online execution sandbox powered by modern secure compute runtimes so you can run Python, C++, Rust, Go, JavaScript, and more straight in your browser.'
    },
    {
      q: 'What is required to earn a course certificate?',
      a: 'To maintain high academic standards, you must mark all required course lessons as complete, solve the associated practice tasks, and score at least 70% on the final course quiz.'
    }
  ];

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-gradient-to-b from-sky-500/5 via-transparent to-transparent">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(56,189,248,0.15),rgba(255,255,255,0))]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-semibold mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>Start Learn Coding</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Learn to Code:{' '}
            <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Build Your Future.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Master programming languages, practice real code, take interactive quizzes, and earn verifiable industry certificates.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-lg shadow-sky-500/25 transition-all text-center flex items-center justify-center space-x-2 group"
            >
              <span>{isAuthenticated ? 'Go to Dashboard' : 'Start Learning Free'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/languages"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-sm transition-all text-center"
            >
              Explore Languages
            </Link>
          </div>

          {/* Social Proof Stats */}
          <div className="mt-14 pt-10 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">20+</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Languages Supported</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">100%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Interactive In-Browser</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">9</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Career Roadmaps</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Verifiable</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Official Certificates</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Languages Grid */}
      <section className="py-16 bg-slate-50/50 dark:bg-[#0E1322]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-sky-500 mb-2">Popular Languages</h2>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Start With The World's Most In-Demand Technologies
              </p>
            </div>
            <Link
              to="/languages"
              className="mt-4 sm:mt-0 inline-flex items-center space-x-1.5 text-sm font-semibold text-sky-500 hover:text-sky-400"
            >
              <span>View All Languages</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularLanguages.map((lang) => (
              <div
                key={lang.id}
                onClick={() => navigate(`/courses/${lang.slug}`)}
                className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl p-2 rounded-xl bg-slate-100 dark:bg-slate-800">{lang.icon}</span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-500">
                      {lang.difficulty}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-400 transition-colors">
                    {lang.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {lang.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>{lang.course?.totalLessons || 3} Lessons</span>
                  <span className="font-semibold text-sky-500 group-hover:translate-x-0.5 transition-transform flex items-center space-x-1">
                    <span>Start Course</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Why Learn With CodeVerse? */}
      <section className="py-20 bg-white dark:bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-500 mb-2">Designed for Mastery</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Why Learn With CodeVerse?
            </p>
            <p className="text-slate-600 dark:text-slate-400 mt-4 text-base">
              Built by developers for developers. Every tool, lesson, and quiz is designed to build real muscle memory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center border border-slate-200 dark:border-slate-700">
                  {feat.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{feat.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Interactive Code Playground Preview Banner */}
      <section className="py-16 bg-white dark:bg-slate-900 text-slate-900 dark:text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-sky-100 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-500/30 rounded-full">
            Live Interactive Sandbox
          </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Don't Just Read About Code. <br className="hidden sm:inline" />
             <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
               Execute It Live.
          </span>
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              Every lesson comes equipped with interactive code snippets. Experiment with logic, test boundary cases, and observe immediate terminal outputs without switching windows.
            </p>
            <div className="flex items-center space-x-4">
              <Link
                to="/playground"
                className="px-6 py-3 rounded-xl text-sm font-semibold text-slate-900 bg-sky-400 hover:bg-sky-300 transition-colors flex items-center space-x-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Launch Code Playground</span>
              </Link>
            </div>
          </div>

          {/* Mini Interactive Preview Graphic */}
          <div className="rounded-2xl border border-slate-700 bg-[#0B1120] p-4 font-mono text-xs shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
              <div className="flex space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              </div>
              <span>demo.py</span>
            </div>
            <pre className="text-sky-300 leading-relaxed">
{`# Calculating Prime Numbers in Python
def is_prime(n):
    if n <= 1: return False
    return all(n % i != 0 for i in range(2, int(n**0.5) + 1))

primes = [x for x in range(2, 30) if is_prime(x)]
print(f"Discovered primes: {primes}")`}
            </pre>
            <div className="pt-3 border-t border-slate-800 text-emerald-400">
              Output: Discovered primes: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
            </div>
          </div>
        </div>
      </section>

      {/* 5. Verifiable Certificate Banner */}
      <section className="py-20 bg-slate-50 dark:bg-[#0E1322]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-6 shadow-sm border border-amber-500/20">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">  
            Earn Industry-Recognized E-Certificates                                           
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-4 text-base leading-relaxed">
            Every completed course awards a tamper-proof digital certificate backed by cryptographic verification hashes and instant online verification.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/verify-certificate/CV-2026-000123"
              className="px-6 py-3 rounded-xl text-sm font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              View Sample Certificate
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="py-20 bg-white dark:bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-500 mb-2">Testimonials</h2>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">Loved by Developers Worldwide</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex space-x-1 text-amber-400">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>
                <div className="flex items-center space-x-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ Accordion */}
      <section className="py-20 bg-slate-50 dark:bg-[#0E1322]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-500 mb-2">FAQ</h2>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">Frequently Asked Questions</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left px-6 py-4 flex items-center justify-between font-semibold text-slate-900 dark:text-white hover:text-sky-500 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-sm text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/80 pt-3 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Bottom Call to Action */}
      <section className="py-20 bg-gradient-to-tr from-sky-600 to-indigo-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to Boost Your Coding Career?
          </h2>
          <p className="text-sky-100 text-base sm:text-lg max-w-2xl mx-auto">
            Join thousands of developers mastering new languages and earning official certificates today.
          </p>
          <div className="pt-4">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="px-8 py-4 rounded-xl font-bold text-slate-950 bg-white hover:bg-slate-100 shadow-xl transition-all inline-block"
            >
              {isAuthenticated ? 'Open Dashboard' : 'Get Started for Free'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
