import React, { useState, useEffect } from 'react';
import { useRouter, Link } from '../context/RouterContext';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CodeEditor from '../components/CodeEditor';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  AlertTriangle,
  Lightbulb,
  Terminal,
  BookOpen,
  Award,
  Play,
  RotateCcw
} from 'lucide-react';

export default function LessonPage({ courseSlug, lessonSlug }) {
  const { navigate } = useRouter();
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function loadLesson() {
      setLoading(true);
      try {
        const res = await api.courses.getLesson(courseSlug, lessonSlug);
        if (res.success) {
          setData(res.data);
          setIsCompleted(res.data.lesson.isCompleted);
        }
      } catch (err) {
        console.error('Failed to load lesson:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLesson();
  }, [courseSlug, lessonSlug]);

  const handleMarkComplete = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setMarking(true);
    try {
      const res = await api.progress.markComplete(data.lesson.id, data.course.id);
      if (res.success) {
        setIsCompleted(true);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 }
        });

        // If next lesson exists, prompt navigation or auto-update sidebar
        if (data.navigation.next) {
          // Keep current view or let user click Next
        }
      }
    } catch (err) {
      console.error('Failed to mark complete:', err);
    } finally {
      setMarking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500">Loading lesson workspace...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.lesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Lesson Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">Could not load '{lessonSlug}' in course '{courseSlug}'.</p>
        <Link to={`/courses/${courseSlug}`} className="px-6 py-2.5 bg-sky-500 text-white rounded-xl font-semibold">
          Return to Course Outline
        </Link>
      </div>
    );
  }

  const { lesson, course, navigation } = data;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      
      {/* Top Mobile & Sub-nav Header Bar */}
      <div className="sticky top-16 z-30 w-full bg-white/90 dark:bg-[#0E1422]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle Syllabus Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link
            to={`/courses/${course.slug}`}
            className="flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-sky-500 transition-colors"
          >
            <span>{course.languageIcon}</span>
            <span className="truncate max-w-[120px] sm:max-w-xs">{course.title}</span>
          </Link>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[160px] sm:max-w-sm">
            {lesson.title}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            Lesson {navigation.currentIndex} of {navigation.totalLessons}
          </span>
          <button
            onClick={handleMarkComplete}
            disabled={marking}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isCompleted
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-sm hover:from-sky-400 hover:to-indigo-500'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{isCompleted ? 'Completed' : 'Mark as Complete'}</span>
          </button>
        </div>
      </div>

      {/* 3-Column Main Workspace */}
      <div className="flex-1 flex w-full relative">
        
        {/* COLUMN 1: Left Syllabus Sidebar (Desktop + Mobile Slide-over) */}
        <aside
          className={`
            fixed lg:sticky top-28 lg:top-auto bottom-0 lg:bottom-auto left-0 z-40 lg:z-10
            w-72 sm:w-80 h-[calc(100vh-7rem)] shrink-0
            bg-white dark:bg-[#0B0F19] border-r border-slate-200 dark:border-slate-800
            p-4 overflow-y-auto transition-transform duration-200
            ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Course Syllabus</h3>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {navigation.sidebar.map((mod) => (
              <div key={mod.id} className="space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 px-2">
                  {mod.title}
                </p>
                <div className="space-y-0.5">
                  {mod.lessons.map((les) => {
                    const isCurrent = les.isCurrent;
                    return (
                      <Link
                        key={les.id}
                        to={`/courses/${course.slug}/lessons/${les.slug}`}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                          isCurrent
                            ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 font-bold border border-sky-500/20'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <span className="truncate pr-2">{les.title}</span>
                        {les.isCompleted && (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* COLUMN 2: Center Lesson Content */}
        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8 overflow-y-auto">
          
          {/* Header */}
          <div className="space-y-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400">
              {lesson.module_level} &bull; {lesson.module_title}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {lesson.title}
            </h1>
          </div>

          {/* 1. Explanation */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-sky-500" />
              <span>Explanation & Overview</span>
            </h2>
            <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base space-y-2">
              {lesson.explanation.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>

          {/* 2. Syntax Breakdown */}
          {lesson.syntax && (
            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Syntax Format</h2>
              <pre className="p-4 rounded-xl bg-slate-900 text-sky-300 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                {lesson.syntax}
              </pre>
            </section>
          )}

          {/* 3. Interactive Code Example & Output */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Terminal className="w-5 h-5 text-indigo-500" />
                <span>Interactive Code Example</span>
              </h2>
              <span className="text-xs text-slate-500 italic">Edit code and hit "Run"</span>
            </div>

            <CodeEditor
              initialCode={lesson.code_example || lesson.starter_code || '// Example code'}
              language={course.languageSlug}
            />

            {lesson.output_example && (
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#0D121F] border border-slate-200 dark:border-slate-800 space-y-1 text-xs font-mono">
                <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                  Standard Terminal Output:
                </span>
                <pre className="text-emerald-600 dark:text-emerald-400 whitespace-pre-wrap">{lesson.output_example}</pre>
              </div>
            )}
          </section>

          {/* 4. Important Notes Alert */}
          {lesson.important_notes && (
            <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 flex items-start space-x-3 text-sm text-sky-900 dark:text-sky-200">
              <Lightbulb className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-0.5">Important Concept:</strong>
                <p className="text-xs sm:text-sm text-sky-800 dark:text-sky-300 leading-relaxed">{lesson.important_notes}</p>
              </div>
            </div>
          )}

          {/* 5. Common Mistakes Warning */}
          {lesson.common_mistakes && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-start space-x-3 text-sm text-amber-900 dark:text-amber-200">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-0.5">Common Mistake to Avoid:</strong>
                <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 leading-relaxed">{lesson.common_mistakes}</p>
              </div>
            </div>
          )}

          {/* 6. Practice Task */}
          {lesson.practice_task && (
            <section className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Hands-on Practice Task
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {lesson.practice_task}
              </p>
            </section>
          )}

          {/* Navigation Controls Footer */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            {navigation.previous ? (
              <button
                onClick={() => navigate(`/courses/${course.slug}/lessons/${navigation.previous.slug}`)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous: {navigation.previous.title}</span>
              </button>
            ) : <div />}

            <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
              <button
                onClick={handleMarkComplete}
                disabled={marking}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                  isCompleted
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>{isCompleted ? 'Marked Complete' : 'Mark as Complete'}</span>
              </button>

              {navigation.next ? (
                <button
                  onClick={() => navigate(`/courses/${course.slug}/lessons/${navigation.next.slug}`)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-semibold flex items-center justify-center space-x-2 shadow-md transition-all"
                >
                  <span>Next Lesson</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/quizzes/${course.slug}`)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white text-xs font-semibold flex items-center justify-center space-x-2 shadow-md transition-all"
                >
                  <span>Take Course Quiz</span>
                  <Award className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

        </main>

        {/* COLUMN 3: Right Quick Info Panel (Desktop only) */}
        <aside className="hidden xl:block w-72 shrink-0 p-6 border-l border-slate-200 dark:border-slate-800 space-y-6">
          <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Status</h4>
            <div className="flex items-center space-x-2 text-xs">
              <span className={`w-2.5 h-2.5 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {isCompleted ? 'Completed' : 'In Progress'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Marking complete updates your dashboard metrics and unlocks certification eligibility.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Playground</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Want a full-screen coding workspace with multi-file support?
            </p>
            <Link
              to="/playground"
              className="inline-flex items-center space-x-1 text-xs font-semibold text-sky-500 hover:text-sky-400"
            >
              <span>Open Online Playground</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </aside>

      </div>
    </div>
  );
}
