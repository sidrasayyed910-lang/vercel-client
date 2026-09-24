import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, Copy, Check, Terminal, Clock, Cpu, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function CodeEditor({
  initialCode = '',
  language = 'javascript',
  onRun,
  readOnly = false,
  minHeight = '280px',
  showConsole = true
}) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutput('');
    setError('');
    setStats(null);
  };

  const handleRun = async () => {
    if (onRun) {
      onRun(code);
      return;
    }

    setRunning(true);
    setError('');
    setOutput('');

    try {
      const res = await api.execution.run({ language, code });
      if (res.success) {
        setOutput(res.data.output || '');
        setError(res.data.error || '');
        setStats({
          duration: res.data.durationMs,
          engine: res.data.executionEngine,
          isWebPreview: res.data.isWebPreview
        });
      } else {
        setError(res.error || 'Execution failed');
      }
    } catch (err) {
      setError(err.message || 'Execution error');
    } finally {
      setRunning(false);
    }
  };

  // Support Tab key indentation inside textarea
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const val = code.substring(0, start) + '  ' + code.substring(end);
      setCode(val);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const lineCount = (code || '').split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(1, lineCount) }, (_, i) => i + 1);

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-[#0F172A] shadow-xl text-slate-200 flex flex-col">
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0B1120] border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          </div>
          <span className="text-xs font-mono font-medium text-slate-400 ml-2 uppercase tracking-wide">
            {language}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Copy source code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {!readOnly && (
            <button
              onClick={handleReset}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Reset code"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          {!readOnly && (
            <button
              onClick={handleRun}
              disabled={running}
              className="flex items-center space-x-1.5 px-3.5 py-1 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 disabled:opacity-50 transition-all shadow-sm"
            >
              {running ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Executing...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Code</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Code Text Area with Line Numbers */}
      <div className="flex font-mono text-sm leading-relaxed overflow-x-auto relative" style={{ minHeight }}>
        {/* Line Numbers Column */}
        <div className="select-none py-3 px-3 text-right bg-[#0B1120]/60 text-slate-600 border-r border-slate-800/80 shrink-0 min-w-[42px]">
          {lineNumbers.map((num) => (
            <div key={num}>{num}</div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          spellCheck="false"
          className="w-full bg-transparent text-slate-100 p-3 code-font outline-none resize-none leading-relaxed whitespace-pre font-mono overflow-x-auto selection:bg-sky-500/30"
          style={{ minHeight }}
        />
      </div>

      {/* Output Console / Web Preview Drawer */}
      {showConsole && (output || error || stats || running) && (
        <div className="border-t border-slate-800 bg-[#070C18] p-4 text-xs font-mono">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/60 text-slate-400">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-sky-400" />
              <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-300">
                Console Output
              </span>
            </div>
            {stats && (
              <div className="flex items-center space-x-3 text-[10px] text-slate-500">
                {stats.duration !== undefined && (
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{stats.duration}ms</span>
                  </span>
                )}
                {stats.engine && (
                  <span className="flex items-center space-x-1">
                    <Cpu className="w-3 h-3 text-sky-400" />
                    <span>{stats.engine}</span>
                  </span>
                )}
              </div>
            )}
          </div>

          {stats?.isWebPreview ? (
            <div className="w-full bg-white text-black p-4 rounded-xl border border-slate-700 min-h-[160px]">
              <div dangerouslySetInnerHTML={{ __html: output }} />
            </div>
          ) : (
            <div className="space-y-1 overflow-x-auto max-h-48">
              {output && <pre className="text-emerald-400 whitespace-pre-wrap">{output}</pre>}
              {error && <pre className="text-rose-400 whitespace-pre-wrap">{error}</pre>}
              {!output && !error && running && (
                <p className="text-slate-500 italic">Running process in sandboxed container...</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
