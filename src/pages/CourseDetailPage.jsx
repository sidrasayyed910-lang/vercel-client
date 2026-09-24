import React, { useState, useEffect } from 'react';
import { useRouter, Link } from '../context/RouterContext';
import { api } from '../services/api';
import {
  BookOpen,
  Clock,
  Award,
  CheckCircle,
  Play,
  ArrowRight,
  ChevronDown,
  FileCode,
  Shield,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export default function CourseDetailPage({ slug }) {
  const { navigate } = useRouter();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModules, setOpenModules] = useState({});

  useEffect(() => {
    async function loadCourse() {
      setLoading(true);
      try {
        const res = await api.courses.getBySlug(slug);
        if (res.success) {
          setCourseData(res.data);
          // Open all modules by default
          const openState = {};
          res.data.syllabus.forEach((m) => { openState[m.id] = true; });
          setOpenModules(openState);
        }
      } catch (err) {
        console.error('Failed to load course details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 text-sm">Loading course syllabus...</p>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Course Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">Could not find a course matching '{slug}'.</p>
        <Link to="/languages" className="px-6 py-2.5 bg-sky-500 text-white rounded-xl font-semibold">
          Browse Languages
        </Link>
      </div>
    );
  }

  const toggleModule = (id) => {
    setOpenModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const { syllabus, progress } = courseData;
  const firstLesson = syllabus[0]?.lessons[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
        <Link to="/languages" className="hover:text-sky-500">Languages</Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-medium">{courseData.language_name}</span>
      </div>

      {/* Course Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden mb-12">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial-gradient from-sky-500/20 to-transparent pointer-events-none"></div>

        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="flex items-center space-x-3">
            <span className="text-4xl p-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
              {courseData.language_icon}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
              {courseData.level}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            {courseData.title}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {courseData.description}
          </p>

          {/* Quick Meta Badges */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2">
            <span className="flex items-center space-x-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>{courseData.total_lessons} Structured Lessons</span>
            </span>
            <span className="flex items-center space-x-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>~{courseData.estimated_hours || 30} Hours Study</span>
            </span>
            <span className="flex items-center space-x-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Official Certificate</span>
            </span>
          </div>

          {/* Action Row */}
          <div className="pt-6 flex flex-wrap items-center gap-4">
            {firstLesson && (
              <button
                onClick={() => navigate(`/courses/${courseData.slug}/lessons/${firstLesson.slug}`)}
                className="px-6 py-3 rounded-xl font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 shadow-lg shadow-sky-400/20 transition-all flex items-center space-x-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{progress.completedLessons > 0 ? 'Continue Lesson' : 'Start Course'}</span>
              </button>
            )}

            <button
              onClick={() => navigate(`/quizzes/${courseData.slug}`)}
              className="px-6 py-3 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all flex items-center space-x-2"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Course Quiz</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress & Syllabus Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left 2 Cols: Syllabus Modules & Lessons */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Course Syllabus
            </h2>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {syllabus.length} Modules &bull; {courseData.total_lessons} Lessons
            </span>
          </div>

          <div className="space-y-4">
            {syllabus.map((module) => {
              const isOpen = openModules[module.id];
              return (
                <div
                  key={module.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
                >
                  {/* Module Header Accordion Button */}
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full text-left p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/10 text-sky-500">
                          {module.level}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {module.title}
                        </h3>
                      </div>
                      {module.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">{module.description}</p>
                      )}
                    </div>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Lessons in Module */}
                  {isOpen && (
                    <div className="border-t border-slate-100 dark:border-slate-800/80 divide-y divide-slate-100 dark:divide-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30">
                      {module.lessons.map((les, lIdx) => (
                        <div
                          key={les.id}
                          onClick={() => navigate(`/courses/${courseData.slug}/lessons/${les.slug}`)}
                          className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                              les.isCompleted
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}>
                              {les.isCompleted ? <CheckCircle className="w-4 h-4" /> : lIdx + 1}
                            </div>
                            <span className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-sky-500 transition-colors">
                              {les.title}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-slate-400 group-hover:text-sky-500 group-hover:translate-x-0.5 transition-all flex items-center space-x-1">
                            <span>Open</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Progress & Certification Requirements */}
        <div className="space-y-6">
          {/* Progress Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Your Course Progress
            </h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">Completion</span>
                <span className="text-sky-500">{progress.progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress.progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500">
                {progress.completedLessons} of {progress.totalLessons} lessons marked complete
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <CheckCircle className={`w-4 h-4 ${progress.completedLessons >= progress.totalLessons ? 'text-emerald-500' : 'text-slate-400'}`} />
                  <span>All Lessons Completed</span>
                </span>
                <span className="font-semibold">{progress.completedLessons}/{progress.totalLessons}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <CheckCircle className={`w-4 h-4 ${progress.quizPassed ? 'text-emerald-500' : 'text-slate-400'}`} />
                  <span>Final Quiz Passed ({courseData.passing_score}%)</span>
                </span>
                <span className="font-semibold">{progress.quizPassed ? 'Passed' : 'Pending'}</span>
              </div>
            </div>

            {/* Certificate Status */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              {progress.hasCertificate ? (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center space-y-2">
                  <Award className="w-6 h-6 text-emerald-500 mx-auto" />
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Official Certificate Earned!</p>
                  <Link
                    to="/certificates"
                    className="block text-xs font-semibold py-1.5 px-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    View in Certificates
                  </Link>
                </div>
              ) : progress.isCourseComplete ? (
                <button
                  onClick={() => navigate(`/quizzes/${courseData.slug}`)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <Award className="w-4 h-4" />
                  <span>Claim Your Certificate</span>
                </button>
              ) : (
                <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                  Complete all lessons and pass the final quiz to unlock your official verified certificate.
                </div>
              )}
            </div>
          </div>

          {/* Practice Challenge Quick Link */}
          <div className="bg-gradient-to-br from-indigo-900/30 to-sky-900/30 rounded-2xl border border-sky-500/20 p-5 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Practice Arena</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Sharpen your algorithmic skills with practice problems tailored to {courseData.language_name}.
            </p>
            <Link
              to="/practice"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-sky-500 hover:text-sky-400"
            >
              <span>Explore Practice Problems</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
