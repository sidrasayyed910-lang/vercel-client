import React, { useState } from 'react';
import { RouterProvider, useRouter, matchRoute } from './context/RouterContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchModal from './components/SearchModal';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LanguagesPage from './pages/LanguagesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LessonPage from './pages/LessonPage';
import PlaygroundPage from './pages/PlaygroundPage';
import PracticePage from './pages/PracticePage';
import ProblemSolvePage from './pages/ProblemSolvePage';
import QuizPage from './pages/QuizPage';
import DashboardPage from './pages/DashboardPage';
import CertificatesPage from './pages/CertificatesPage';
import VerifyCertPage from './pages/VerifyCertPage';
import RoadmapsPage from './pages/RoadmapsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';

function AppContent() {
  const { currentPath } = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);

  // Route matching logic
  const renderRoute = () => {
    // Exact paths
    if (currentPath === '/' || currentPath === '') {
      return <HomePage />;
    }
    if (currentPath === '/languages' || currentPath === '/courses') {
      return <LanguagesPage />;
    }
    if (currentPath === '/playground') {
      return <PlaygroundPage />;
    }
    if (currentPath === '/practice') {
      return <PracticePage />;
    }
    if (currentPath === '/roadmaps') {
      return <RoadmapsPage />;
    }
    if (currentPath === '/login') {
      return <LoginPage />;
    }
    if (currentPath === '/register') {
      return <RegisterPage />;
    }
    if (currentPath === '/dashboard') {
      return (
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      );
    }
    if (currentPath === '/certificates') {
      return (
        <ProtectedRoute>
          <CertificatesPage />
        </ProtectedRoute>
      );
    }
    if (currentPath === '/verify-certificate') {
      return <VerifyCertPage />;
    }
    if (currentPath === '/admin') {
      return (
        <ProtectedRoute adminOnly={true}>
          <AdminPage />
        </ProtectedRoute>
      );
    }

    // Dynamic Parameterized Routes
    // 1. Lesson Page: /courses/:slug/lessons/:lessonSlug
    const lessonMatch = matchRoute('/courses/:slug/lessons/:lessonSlug', currentPath);
    if (lessonMatch) {
      return <LessonPage courseSlug={lessonMatch.slug} lessonSlug={lessonMatch.lessonSlug} />;
    }

    // 2. Course Detail: /courses/:slug
    const courseMatch = matchRoute('/courses/:slug', currentPath);
    if (courseMatch) {
      return <CourseDetailPage slug={courseMatch.slug} />;
    }

    // 3. Problem Solve Page: /practice/:slug
    const practiceMatch = matchRoute('/practice/:slug', currentPath);
    if (practiceMatch) {
      return <ProblemSolvePage slug={practiceMatch.slug} />;
    }

    // 4. Quiz Page: /quizzes/:courseSlug
    const quizMatch = matchRoute('/quizzes/:courseSlug', currentPath);
    if (quizMatch) {
      return <QuizPage courseSlug={quizMatch.courseSlug} />;
    }

    // 5. Verify Certificate: /verify-certificate/:certId
    const verifyMatch = matchRoute('/verify-certificate/:certId', currentPath);
    if (verifyMatch) {
      return <VerifyCertPage certId={verifyMatch.certId} />;
    }

    // 404 Fallback
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-6xl font-extrabold text-sky-500 mb-2 font-mono">404</h1>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Page Not Found</h2>
        <p className="text-slate-500 text-sm max-w-sm mb-6">
          The route <code className="text-sky-500">{currentPath}</code> does not exist on CodeVerse.
        </p>
        <a
          href="/"
          className="px-6 py-2.5 rounded-xl font-semibold text-white bg-sky-500 hover:bg-sky-400 transition-colors shadow-md"
        >
          Return to Home
        </a>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar onOpenSearch={() => setSearchOpen(true)} />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <main className="flex-1 w-full">
        {renderRoute()}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider>
          <AppContent />
        </RouterProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
