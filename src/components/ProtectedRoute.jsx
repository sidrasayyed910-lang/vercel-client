import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const { navigate } = useRouter();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500">Checking credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center mb-4">
          🔒
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Authentication Required</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mb-6">
          You must be logged in to view your dashboard, track progress, or access this section.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 shadow-md hover:from-sky-400 hover:to-indigo-500 transition-all"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4">
          🛡️
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Administrator Access Required</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mb-6">
          Your current account does not have sufficient administrative permissions to access this control panel.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded-xl font-semibold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return children;
}
