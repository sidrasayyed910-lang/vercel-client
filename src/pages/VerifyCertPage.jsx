import React, { useState, useEffect } from 'react';
import { useRouter, Link } from '../context/RouterContext';
import { api } from '../services/api';
import CertificateCard from '../components/CertificateCard';
import {
  ShieldCheck,
  XCircle,
  Search,
  CheckCircle,
  Calendar,
  User,
  BookOpen,
  Award,
  Clock,
  Share2,
  ExternalLink
} from 'lucide-react';

export default function VerifyCertPage({ certId: initialCertId }) {
  const { navigate } = useRouter();
  const [certIdInput, setCertIdInput] = useState(initialCertId || 'CV-2026-000123');
  const [certData, setCertData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const verifyCertificate = async (idToVerify) => {
    if (!idToVerify) return;
    setLoading(true);
    setError(null);
    setCertData(null);

    try {
      const res = await api.certificates.verify(idToVerify.trim());
      if (res.success) {
        setCertData(res.data);
      } else {
        setError(res.error || 'Certificate not recognized.');
      }
    } catch (err) {
      setError(err.message || 'Verification failed. Certificate ID not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCertId) {
      verifyCertificate(initialCertId);
    } else {
      verifyCertificate('CV-2026-000123');
    }
  }, [initialCertId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (certIdInput.trim()) {
      navigate(`/verify-certificate/${certIdInput.trim()}`);
      verifyCertificate(certIdInput.trim());
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Verification Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>CodeVerse Official Certificate Registry</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Certificate Verification
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Verify the authenticity of digital certificates issued by CodeVerse Learning Academy.
        </p>

        {/* Search / Lookup Input Form */}
        <form onSubmit={handleSearch} className="pt-4 max-w-md mx-auto flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. CV-2026-000123"
              value={certIdInput}
              onChange={(e) => setCertIdInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 shadow-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            {loading ? 'Checking...' : 'Verify'}
          </button>
        </form>
      </div>

      {/* Verification Result Banner */}
      {loading && (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-slate-500">Querying cryptographic records...</p>
        </div>
      )}

      {error && !loading && (
        <div className="p-8 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-center space-y-3 max-w-lg mx-auto">
          <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="text-xl font-bold text-rose-900 dark:text-rose-200">
            Certificate Not Found or Invalid
          </h3>
          <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed">
            {error}
          </p>
          <p className="text-[11px] text-slate-500 pt-2">
            Please double-check the exact Certificate ID (case-sensitive) or contact CodeVerse support.
          </p>
        </div>
      )}

      {certData && !loading && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Validity Badge Alert Box */}
          <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                    Status: VALID & VERIFIED
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {certData.cert_id}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-emerald-950 dark:text-emerald-100 mt-0.5">
                  Official Credential Confirmed
                </h3>
                <p className="text-xs text-emerald-800 dark:text-emerald-200">
                  Issued by CodeVerse Learning Academy for {certData.course_title}
                </p>
              </div>
            </div>

            <div className="text-right text-xs text-slate-500 self-end sm:self-center">
              <p>Issue Date: <strong className="text-slate-900 dark:text-white">{certData.issue_date}</strong></p>
              <p>Student: <strong className="text-slate-900 dark:text-white">{certData.user_name}</strong></p>
            </div>
          </div>

          {/* Render Full Certificate View */}
          <div className="pt-2">
            <CertificateCard certificate={certData} isModal={true} />
          </div>

        </div>
      )}

    </div>
  );
}
