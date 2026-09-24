import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Users,
  BookOpen,
  Award,
  Plus,
  Trash2,
  CheckCircle,
  FileCode,
  Terminal,
  Activity
} from 'lucide-react';

export default function AdminPage() {
  const { user } = useAuth();
  const [statsData, setStatsData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'lessons' | 'new-lesson' | 'new-problem'

  // New Lesson form state
  const [lessonForm, setLessonForm] = useState({
    courseId: '',
    moduleId: '1',
    title: '',
    slug: '',
    explanation: '',
    syntax: '',
    codeExample: '',
    outputExample: '',
    importantNotes: '',
    commonMistakes: '',
    practiceTask: ''
  });
  const [creatingLesson, setCreatingLesson] = useState(false);
  const [lessonMsg, setLessonMsg] = useState('');

  // New Problem form state
  const [probForm, setProbForm] = useState({
    title: '',
    slug: '',
    difficulty: 'Easy',
    topic: 'Arrays',
    statement: '',
    inputFormat: '',
    outputFormat: '',
    starterCode: '// Write code here'
  });
  const [creatingProb, setCreatingProb] = useState(false);
  const [probMsg, setProbMsg] = useState('');

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, coursesRes, lessonsRes] = await Promise.all([
        api.admin.getStats(),
        api.admin.getCourses(),
        api.admin.getLessons()
      ]);

      if (statsRes.success) setStatsData(statsRes.data);
      if (coursesRes.success) {
        setCourses(coursesRes.data);
        if (coursesRes.data.length > 0) {
          setLessonForm(prev => ({ ...prev, courseId: coursesRes.data[0].id }));
        }
      }
      if (lessonsRes.success) setLessons(lessonsRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    setCreatingLesson(true);
    setLessonMsg('');
    try {
      const res = await api.admin.createLesson(lessonForm);
      if (res.success) {
        setLessonMsg('Lesson created successfully!');
        setLessonForm({
          courseId: courses[0]?.id || '',
          moduleId: '1',
          title: '',
          slug: '',
          explanation: '',
          syntax: '',
          codeExample: '',
          outputExample: '',
          importantNotes: '',
          commonMistakes: '',
          practiceTask: ''
        });
        loadAdminData();
      }
    } catch (err) {
      setLessonMsg(`Error: ${err.message}`);
    } finally {
      setCreatingLesson(false);
    }
  };

  const handleDeleteLesson = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;
    try {
      await api.admin.deleteLesson(id);
      loadAdminData();
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    }
  };

  const handleCreateProblem = async (e) => {
    e.preventDefault();
    setCreatingProb(true);
    setProbMsg('');
    try {
      const res = await api.admin.createProblem({
        ...probForm,
        examples: [{ input: 'sample', output: 'result' }],
        testCases: [{ input: 'sample', expected: 'result' }]
      });
      if (res.success) {
        setProbMsg('Practice problem created successfully!');
        setProbForm({
          title: '',
          slug: '',
          difficulty: 'Easy',
          topic: 'Arrays',
          statement: '',
          inputFormat: '',
          outputFormat: '',
          starterCode: '// Write code here'
        });
      }
    } catch (err) {
      setProbMsg(`Error: ${err.message}`);
    } finally {
      setCreatingProb(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-slate-500 text-sm">Loading administrator telemetry...</p>
      </div>
    );
  }

  const { stats, recentUsers, recentCertificates } = statsData || {
    stats: {},
    recentUsers: [],
    recentCertificates: []
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Admin Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20 shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                Staff Control Hub
              </span>
              <span className="text-xs text-slate-400">v1.0.0</span>
            </div>
            <h1 className="text-2xl font-bold mt-0.5">CodeVerse Platform Administration</h1>
          </div>
        </div>

        <div className="text-xs text-slate-400 self-start sm:self-center">
          Signed in as: <strong className="text-white">{user?.name}</strong> ({user?.email})
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'overview'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Platform Telemetry
        </button>

        <button
          onClick={() => setActiveTab('lessons')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'lessons'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Manage Lessons ({lessons.length})
        </button>

        <button
          onClick={() => setActiveTab('new-lesson')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'new-lesson'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Add New Lesson
        </button>

        <button
          onClick={() => setActiveTab('new-problem')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'new-problem'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Add Practice Problem
        </button>
      </div>

      {/* Tab 1: Overview Telemetry */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-medium">Registered Users</span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.totalUsers}</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-medium">Active Courses</span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.totalCourses}</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-medium">Certificates Issued</span>
              <p className="text-2xl font-extrabold text-amber-500">{stats.totalCertificates}</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-medium">Problem Submissions</span>
              <p className="text-2xl font-extrabold text-emerald-500">{stats.totalSubmissions}</p>
            </div>
          </div>

          {/* Tables Row: Users & Certificates */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Recent Users */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Users className="w-5 h-5 text-sky-500" />
                <span>Recent Registrations</span>
              </h3>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                {recentUsers.map((u) => (
                  <div key={u.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{u.name}</p>
                      <p className="text-slate-400">{u.email}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      u.role === 'ADMIN' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Issued Certificates */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>Issued Certificates</span>
              </h3>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                {recentCertificates.map((cert) => (
                  <div key={cert.cert_id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{cert.user_name}</p>
                      <p className="text-slate-400">{cert.course_title}</p>
                    </div>
                    <span className="font-mono font-bold text-sky-500 text-[11px]">{cert.cert_id}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab 2: Manage Lessons */}
      {activeTab === 'lessons' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Curriculum Lessons Directory</h3>
            <button
              onClick={() => setActiveTab('new-lesson')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-amber-500 hover:bg-amber-400 flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Lesson</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-[60vh] overflow-y-auto text-xs">
            {lessons.map((les) => (
              <div key={les.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 dark:text-white">{les.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">{les.slug}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">{les.course_title} &bull; {les.module_title}</p>
                </div>

                <button
                  onClick={() => handleDeleteLesson(les.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                  title="Delete Lesson"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Create Lesson Form */}
      {activeTab === 'new-lesson' && (
        <form onSubmit={handleCreateLesson} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create New Course Lesson</h3>
            {lessonMsg && (
              <span className={`text-xs font-semibold ${lessonMsg.includes('Error') ? 'text-rose-500' : 'text-emerald-500'}`}>
                {lessonMsg}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Course</label>
              <select
                value={lessonForm.courseId}
                onChange={(e) => setLessonForm({ ...lessonForm, courseId: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title} ({c.language_name})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Module ID</label>
              <input
                type="number"
                value={lessonForm.moduleId}
                onChange={(e) => setLessonForm({ ...lessonForm, moduleId: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Lesson Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Asynchronous Streams and Reactive State"
                value={lessonForm.title}
                onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">URL Slug</label>
              <input
                type="text"
                required
                placeholder="e.g. async-streams-reactive"
                value={lessonForm.slug}
                onChange={(e) => setLessonForm({ ...lessonForm, slug: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Lesson Explanation</label>
            <textarea
              required
              rows={4}
              placeholder="Explain core principles, mechanisms, and usage..."
              value={lessonForm.explanation}
              onChange={(e) => setLessonForm({ ...lessonForm, explanation: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Code Example</label>
              <textarea
                rows={5}
                placeholder="// Source code snippet"
                value={lessonForm.codeExample}
                onChange={(e) => setLessonForm({ ...lessonForm, codeExample: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-900 text-xs font-mono text-sky-300 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Output Example</label>
              <textarea
                rows={5}
                placeholder="Console output string"
                value={lessonForm.outputExample}
                onChange={(e) => setLessonForm({ ...lessonForm, outputExample: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-900 text-xs font-mono text-emerald-400 leading-relaxed"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={creatingLesson}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-500 hover:bg-amber-400 shadow-md transition-all"
          >
            {creatingLesson ? 'Creating Lesson...' : 'Save and Publish Lesson'}
          </button>
        </form>
      )}

      {/* Tab 4: Create Problem Form */}
      {activeTab === 'new-problem' && (
        <form onSubmit={handleCreateProblem} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add Practice Problem</h3>
            {probMsg && (
              <span className={`text-xs font-semibold ${probMsg.includes('Error') ? 'text-rose-500' : 'text-emerald-500'}`}>
                {probMsg}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Problem Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Valid Anagram"
                value={probForm.title}
                onChange={(e) => setProbForm({ ...probForm, title: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Slug</label>
              <input
                type="text"
                required
                placeholder="e.g. valid-anagram"
                value={probForm.slug}
                onChange={(e) => setProbForm({ ...probForm, slug: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Difficulty</label>
              <select
                value={probForm.difficulty}
                onChange={(e) => setProbForm({ ...probForm, difficulty: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Topic</label>
              <input
                type="text"
                required
                value={probForm.topic}
                onChange={(e) => setProbForm({ ...probForm, topic: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Statement</label>
            <textarea
              required
              rows={3}
              placeholder="State problem requirements clearly..."
              value={probForm.statement}
              onChange={(e) => setProbForm({ ...probForm, statement: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={creatingProb}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition-all"
          >
            {creatingProb ? 'Creating Problem...' : 'Publish Challenge'}
          </button>
        </form>
      )}

    </div>
  );
}
