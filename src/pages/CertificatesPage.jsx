import React, { useState, useEffect } from 'react';
import { useRouter, Link } from '../context/RouterContext';
import { api } from '../services/api';
import CertificateCard from '../components/CertificateCard';
import { Award, Shield, Download, ExternalLink, CheckCircle, Sparkles } from 'lucide-react';

export default function CertificatesPage() {
  const { navigate } = useRouter();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCerts() {
      setLoading(true);
      try {
        const res = await api.certificates.getMyCertificates();
        if (res.success) {
          setCertificates(res.data);
        }
      } catch (err) {
        console.error('Failed to load certificates:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCerts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-3">
            <Award className="w-8 h-8 text-amber-500" />
            <span>My Verified Certificates</span>
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Official credentials earned through comprehensive course completion and examination.
          </p>
        </div>

        <Link
          to="/verify-certificate/CV-2026-000123"
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-sky-500 transition-colors self-start"
        >
          <Shield className="w-4 h-4 text-emerald-500" />
          <span>Verify Any Certificate ID</span>
        </Link>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800/40 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : certificates.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Certificates Earned Yet</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Certificates are issued automatically once you complete all lessons in a course and achieve a passing score (at least 70%) on the final course quiz.
          </p>
          <Link
            to="/courses"
            className="inline-block px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 shadow-md"
          >
            Explore Courses to Start
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <CertificateCard key={cert.id} certificate={cert} />
          ))}
        </div>
      )}
    </div>
  );
}
