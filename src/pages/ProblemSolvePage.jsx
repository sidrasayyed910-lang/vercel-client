import React, { useState, useEffect } from 'react';
import { useRouter, Link } from '../context/RouterContext';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CodeEditor from '../components/CodeEditor';
import confetti from 'canvas-confetti';
import {
  Code,
  CheckCircle,
  XCircle,
  Play,
  Send,
  RotateCcw,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Clock
} from 'lucide-react';

export default function ProblemSolvePage({ slug }) {
  const { navigate } = useRouter();
  const { isAuthenticated } = useAuth();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeTab, setActiveTab] = useState('problem'); // 'problem' | 'solution'

  useEffect(() => {
    async function loadProblem() {
      setLoading(true);
      try {
        const res = await api.practice.getBySlug(slug);
        if (res.success) {
          setProblem(res.data);
          setCode(res.data.starterCode || '// Write your solution here');
        }
      } catch (err) {
        console.error('Failed to load problem:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProblem();
  }, [slug]);

  const handleRunSample = async () => {
    setRunning(true);
    setRunResult(null);
    setSubmitResult(null);
    try {
      const res = await api.practice.runCode(slug, { code, language });
      if (res.success) {
        setRunResult(res.data);
      }
    } catch (err) {
      console.error('Run failed:', err);
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    setRunResult(null);
    setSubmitResult(null);

    try {
      const res = await api.practice.submitSolution(slug, { code, language });
      if (res.success) {
        setSubmitResult(res.data);
        if (res.data.isSolved) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500">Loading problem arena...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Problem Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">Could not find problem '{slug}'.</p>
        <Link to="/practice" className="px-6 py-2.5 bg-sky-500 text-white rounded-xl font-semibold">
          Return to Practice Arena
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col min-h-[calc(100vh-6rem)]">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/practice"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-sky-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Practice Arena</span>
        </Link>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-500">
            {problem.difficulty}
          </span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {problem.topic}
          </span>
        </div>
      </div>

      {/* Split Pane Interface */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Left: Problem Statement & Examples */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 overflow-y-auto max-h-[calc(100vh-12rem)]">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {problem.title}
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-3 leading-relaxed">
              {problem.statement}
            </p>
          </div>

          {/* Formats & Constraints */}
          {(problem.inputFormat || problem.outputFormat || problem.constraints) && (
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              {problem.inputFormat && (
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Input Format:</h4>
                  <p className="text-slate-600 dark:text-slate-400 font-mono">{problem.inputFormat}</p>
                </div>
              )}
              {problem.outputFormat && (
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Output Format:</h4>
                  <p className="text-slate-600 dark:text-slate-400 font-mono">{problem.outputFormat}</p>
                </div>
              )}
              {problem.constraints && (
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Constraints:</h4>
                  <p className="text-slate-600 dark:text-slate-400 font-mono">{problem.constraints}</p>
                </div>
              )}
            </div>
          )}

          {/* Examples */}
          {problem.examples && problem.examples.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Examples</h3>
              {problem.examples.map((ex, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono text-xs space-y-1.5 border border-slate-200 dark:border-slate-700/60">
                  {ex.input && (
                    <p><strong className="text-slate-500">Input:</strong> <span className="text-slate-800 dark:text-slate-200">{ex.input}</span></p>
                  )}
                  <p><strong className="text-slate-500">Output:</strong> <span className="text-emerald-500">{ex.output}</span></p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Code Workspace & Results */}
        <div className="space-y-4">
          
          {/* Action Header */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center space-x-2">
              <Code className="w-4 h-4 text-sky-500" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Solution Editor</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleRunSample}
                disabled={running || submitting}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center space-x-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{running ? 'Running...' : 'Run Test'}</span>
              </button>

              <button
                onClick={handleSubmit}
                disabled={running || submitting}
                className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-sm transition-all flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Testing All Cases...' : 'Submit Code'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Code Editor */}
          <CodeEditor
            initialCode={code}
            language={language}
            readOnly={false}
            minHeight="340px"
            showConsole={false}
            onRun={(newCode) => {
              setCode(newCode);
              handleRunSample();
            }}
          />

          {/* Results Panel */}
          {runResult && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs space-y-2 text-slate-200 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400">Sample Test Result</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  runResult.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {runResult.passed ? 'PASSED' : 'FAILED'}
                </span>
              </div>
              <div className="space-y-1">
                <p><span className="text-slate-500">Input:</span> {runResult.input || '(None)'}</p>
                <p><span className="text-slate-500">Expected:</span> <span className="text-emerald-400">{runResult.expected}</span></p>
                <p><span className="text-slate-500">Actual:</span> <span className={runResult.passed ? 'text-emerald-400' : 'text-rose-400'}>{runResult.actual}</span></p>
              </div>
            </div>
          )}

          {submitResult && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs space-y-4 text-slate-200 animate-in fade-in duration-150 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  {submitResult.isSolved ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400" />
                  )}
                  <span className="font-bold text-sm text-white">
                    {submitResult.isSolved ? 'Accepted! All Test Cases Passed' : 'Wrong Answer'}
                  </span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 text-slate-300">
                  {submitResult.passedTests} / {submitResult.totalTests} Passed
                </span>
              </div>

              {/* Per-test case breakdown */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {submitResult.testCaseResults?.map((tc) => (
                  <div
                    key={tc.testCaseIndex}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-[11px] ${
                      tc.passed
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/5 border-rose-500/20 text-rose-300'
                    }`}
                  >
                    <span>Test Case #{tc.testCaseIndex}</span>
                    <span className="font-bold">{tc.passed ? 'PASSED' : 'FAILED'}</span>
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
