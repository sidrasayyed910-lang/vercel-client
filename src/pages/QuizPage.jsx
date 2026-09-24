import React, { useState, useEffect } from 'react';
import { useRouter, Link } from '../context/RouterContext';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  CheckCircle,
  XCircle,
  Award,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function QuizPage({ courseSlug }) {
  const { navigate } = useRouter();
  const { isAuthenticated } = useAuth();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    async function loadQuiz() {
      setLoading(true);
      try {
        const res = await api.quizzes.getQuiz(courseSlug);
        if (res.success) {
          setQuizData(res.data);
        }
      } catch (err) {
        console.error('Failed to load quiz:', err);
      } finally {
        setLoading(false);
      }
    }
    loadQuiz();
  }, [courseSlug]);

  const handleSelectAnswer = (qId, option) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.quizzes.submitQuiz(courseSlug, answers);
      if (res.success) {
        setResults(res.data);
        setSubmitted(true);
        if (res.data.passed) {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 }
          });
        }
      }
    } catch (err) {
      console.error('Quiz submission failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClaimCertificate = async () => {
    setClaiming(true);
    try {
      const res = await api.certificates.generate(quizData.courseId);
      if (res.success) {
        navigate(`/verify-certificate/${res.data.cert_id}`);
      }
    } catch (err) {
      alert(err.message || 'Failed to generate certificate.');
    } finally {
      setClaiming(false);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setSubmitted(false);
    setResults(null);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500">Loading course quiz examination...</p>
        </div>
      </div>
    );
  }

  if (!quizData || !quizData.questions || quizData.questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Quiz Available</h2>
        <p className="text-slate-500 text-sm mb-6">Quiz questions are being updated for this course.</p>
        <Link to={`/courses/${courseSlug}`} className="px-6 py-2.5 bg-sky-500 text-white rounded-xl font-semibold">
          Return to Course Outline
        </Link>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = quizData.questions.length;
  const isAllAnswered = answeredCount === totalQuestions;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="mb-8">
        <Link
          to={`/courses/${courseSlug}`}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-sky-500 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {quizData.courseTitle}</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-500">Final Assessment</span>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              {quizData.courseTitle} Examination
            </h1>
          </div>

          <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
            <span>Passing Score: <strong className="text-sky-500">{quizData.passingScore}%</strong></span>
            <span>&bull;</span>
            <span>Questions: <strong>{totalQuestions}</strong></span>
          </div>
        </div>
      </div>

      {/* Result Card (When submitted) */}
      {submitted && results && (
        <div className={`mb-10 p-6 sm:p-8 rounded-3xl border shadow-xl animate-in zoom-in-95 duration-200 ${
          results.passed
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-100'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-100'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                {results.passed ? (
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                    <Award className="w-7 h-7" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg">
                    <XCircle className="w-7 h-7" />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-extrabold">
                    {results.passed ? 'Assessment Passed!' : 'Assessment Not Passed'}
                  </h2>
                  <p className="text-sm opacity-90">
                    You scored <strong className="text-lg">{results.score} / {results.totalQuestions}</strong> ({results.percentage}%)
                  </p>
                </div>
              </div>
              <p className="text-xs opacity-80 pt-1">
                {results.passed
                  ? 'Congratulations! You have verified your proficiency in this course curriculum.'
                  : `You need at least ${results.passingScore}% to pass. Review the explanations below and try again.`}
              </p>
            </div>

            {/* Certificate Action */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {results.certificateReady ? (
                <button
                  onClick={handleClaimCertificate}
                  disabled={claiming}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 shadow-xl transition-all flex items-center justify-center space-x-2 animate-bounce"
                >
                  <Award className="w-5 h-5" />
                  <span>{claiming ? 'Generating...' : 'Claim Official Certificate'}</span>
                </button>
              ) : results.existingCertificateId ? (
                <Link
                  to={`/verify-certificate/${results.existingCertificateId}`}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all text-center flex items-center justify-center space-x-2"
                >
                  <Award className="w-5 h-5" />
                  <span>View Certificate</span>
                </Link>
              ) : null}

              <button
                onClick={handleRetake}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl font-semibold text-xs border border-current hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Quiz</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question Cards */}
      <div className="space-y-6">
        {quizData.questions.map((q, idx) => {
          const breakdown = results?.breakdown?.find(b => b.questionId === q.id);
          const selectedAnswer = answers[q.id];

          return (
            <div
              key={q.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Question {idx + 1} of {totalQuestions}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {q.question}
                  </h3>
                </div>

                {submitted && breakdown && (
                  <div>
                    {breakdown.isCorrect ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Correct</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Incorrect</span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Code Snippet if present */}
              {q.codeSnippet && (
                <pre className="p-4 rounded-xl bg-slate-900 text-sky-300 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                  {q.codeSnippet}
                </pre>
              )}

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {q.options.map((opt, oIdx) => {
                  const isSelected = selectedAnswer === opt;
                  let optStyle = 'border-slate-200 dark:border-slate-800 hover:border-sky-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/60';

                  if (submitted && breakdown) {
                    if (opt === breakdown.correctAnswer) {
                      optStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold';
                    } else if (isSelected && !breakdown.isCorrect) {
                      optStyle = 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 line-through';
                    }
                  } else if (isSelected) {
                    optStyle = 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 font-bold shadow-sm';
                  }

                  return (
                    <div
                      key={oIdx}
                      onClick={() => handleSelectAnswer(q.id, opt)}
                      className={`p-3.5 rounded-xl border text-sm flex items-center space-x-3 cursor-pointer transition-all ${optStyle}`}
                    >
                      <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs shrink-0 font-bold">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="leading-snug">{opt}</span>
                    </div>
                  );
                })}
              </div>

              {/* Detailed Explanation Breakdown */}
              {submitted && breakdown && (
                <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <strong className="font-semibold block text-slate-900 dark:text-white">Explanation:</strong>
                  <p className="leading-relaxed">{breakdown.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Submit Button */}
      {!submitted && (
        <div className="mt-10 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {answeredCount} of {totalQuestions} answered
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {!isAllAnswered ? 'Please answer all questions before submitting.' : 'Ready for grading!'}
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!isAllAnswered || submitting}
            className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition-all flex items-center justify-center space-x-2"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Grading Quiz...</span>
              </>
            ) : (
              <>
                <span>Submit Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
