import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Terminal,
  Clock,
  Cpu,
  Sparkles,
  Layout,
  Code,
  Eye
} from 'lucide-react';

export default function PlaygroundPage() {
  const [languages, setLanguages] = useState([]);
  const [templates, setTemplates] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [stdin, setStdin] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('console'); // 'console' | 'preview'

  useEffect(() => {
    async function loadTemplates() {
      try {
        const res = await api.execution.getTemplates();
        if (res.success) {
          setLanguages(res.supportedLanguages || []);
          setTemplates(res.templates || {});
          setCode(res.templates?.python || 'print("Hello from Python CodeVerse!")');
        }
      } catch (err) {
        console.error('Failed to load templates:', err);
      }
    }
    loadTemplates();
  }, []);

  const handleLanguageChange = (newLang) => {
    setSelectedLanguage(newLang);
    const templateCode = templates[newLang] || `// Welcome to ${newLang} playground`;
    setCode(templateCode);
    setOutput('');
    setError('');
    setStats(null);
    if (newLang === 'html' || newLang === 'css') {
      setActiveTab('preview');
    } else {
      setActiveTab('console');
    }
  };

  const handleRun = async () => {
    setRunning(true);
    setError('');
    setOutput('');

    try {
      const res = await api.execution.run({
        language: selectedLanguage,
        code,
        stdin
      });

      if (res.success) {
        setOutput(res.data.output || '');
        setError(res.data.error || '');
        setStats({
          duration: res.data.durationMs,
          engine: res.data.executionEngine,
          isWebPreview: res.data.isWebPreview
        });
        if (res.data.isWebPreview) {
          setActiveTab('preview');
        } else {
          setActiveTab('console');
        }
      } else {
        setError(res.error || 'Execution failed');
      }
    } catch (err) {
      setError(err.message || 'Execution error');
    } finally {
      setRunning(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    const templateCode = templates[selectedLanguage] || '';
    setCode(templateCode);
    setOutput('');
    setError('');
    setStats(null);
  };

  const lineCount = (code || '').split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(1, lineCount) }, (_, i) => i + 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col h-[calc(100vh-6rem)]">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2.5">
            <Terminal className="w-7 h-7 text-sky-500" />
            <span>Online Code Playground</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Write and execute code in real-time across 20+ programming languages.
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center space-x-3">
          {/* Language Selector */}
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:border-sky-500 shadow-sm"
            >
              <option value="python">Python 3</option>
              <option value="javascript">JavaScript (Node.js)</option>
              <option value="typescript">TypeScript</option>
              <option value="c">C (GCC)</option>
              <option value="cpp">C++ (G++)</option>
              <option value="java">Java 15+</option>
              <option value="csharp">C# (.NET)</option>
              <option value="go">Go 1.16</option>
              <option value="rust">Rust</option>
              <option value="php">PHP 8</option>
              <option value="ruby">Ruby 3</option>
              <option value="kotlin">Kotlin</option>
              <option value="swift">Swift</option>
              <option value="dart">Dart</option>
              <option value="r">R Language</option>
              <option value="sql">SQL (SQLite)</option>
              <option value="html">HTML5 Live</option>
              <option value="css">CSS3 Live</option>
              <option value="bash">Bash Shell</option>
              <option value="matlab">MATLAB / Octave</option>
            </select>
          </div>

          <button
            onClick={handleCopy}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl"
            title="Copy Code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleReset}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl"
            title="Reset Starter Template"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleRun}
            disabled={running}
            className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            {running ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Executing...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Run Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        
        {/* Left: Code Editor Container */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#0F172A] shadow-lg flex flex-col overflow-hidden">
          <div className="px-4 py-2 bg-[#0B1120] border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center space-x-2">
              <Code className="w-3.5 h-3.5 text-sky-400" />
              <span className="uppercase">{selectedLanguage} editor</span>
            </span>
            <span>{lineCount} lines</span>
          </div>

          <div className="flex-1 flex overflow-hidden font-mono text-sm leading-relaxed">
            {/* Line Numbers */}
            <div className="select-none py-3 px-3 text-right bg-[#0B1120]/60 text-slate-600 border-r border-slate-800 shrink-0 min-w-[44px] overflow-hidden">
              {lineNumbers.map(n => (
                <div key={n}>{n}</div>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
              className="flex-1 w-full bg-transparent text-slate-100 p-3 code-font outline-none resize-none leading-relaxed font-mono overflow-y-auto selection:bg-sky-500/30"
              placeholder="Type your code here..."
            />
          </div>
        </div>

        {/* Right: Output Console / Web Preview */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#0F172A] shadow-lg flex flex-col overflow-hidden">
          
          {/* Header Tabs */}
          <div className="px-4 py-2 bg-[#0B1120] border-b border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('console')}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                  activeTab === 'console'
                    ? 'bg-slate-800 text-sky-400 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Console</span>
              </button>

              {(selectedLanguage === 'html' || selectedLanguage === 'css') && (
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                    activeTab === 'preview'
                      ? 'bg-slate-800 text-sky-400 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>DOM Preview</span>
                </button>
              )}
            </div>

            {stats && (
              <div className="flex items-center space-x-3 text-[10px] text-slate-400">
                {stats.duration !== undefined && (
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{stats.duration}ms</span>
                  </span>
                )}
                {stats.engine && (
                  <span className="flex items-center space-x-1 text-sky-400">
                    <Cpu className="w-3 h-3" />
                    <span>{stats.engine}</span>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Body */}
          <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-200">
            {activeTab === 'preview' ? (
              <div className="w-full h-full bg-white rounded-xl overflow-hidden p-2">
                <iframe
                  title="Web Preview"
                  srcDoc={code}
                  className="w-full h-full border-0"
                  sandbox="allow-scripts"
                />
              </div>
            ) : (
              <div className="space-y-2">
                {running && (
                  <div className="flex items-center space-x-2 text-slate-400 italic">
                    <span className="w-3.5 h-3.5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></span>
                    <span>Compiling and running process...</span>
                  </div>
                )}

                {output && (
                  <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed">
                    {output}
                  </pre>
                )}

                {error && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 whitespace-pre-wrap">
                    {error}
                  </div>
                )}

                {!running && !output && !error && (
                  <p className="text-slate-500 italic">
                    Click "Run Code" to compile and view program output.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
