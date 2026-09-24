import React, { useRef, useState } from 'react';
import { Award, Download, CheckCircle, ExternalLink, Shield, Calendar, Clock, Share2 } from 'lucide-react';
import { useRouter, Link } from '../context/RouterContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function CertificateCard({ certificate, isModal = false, onClose }) {
  const { navigate } = useRouter();
  const certRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const certId = certificate.cert_id;
  const verifyUrl = `${window.location.origin}/verify-certificate/${certId}`;

  const handleDownloadPdf = async () => {
    if (!certRef.current) return;
    setDownloading(true);

    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`CodeVerse-Certificate-${certId}.pdf`);
    } catch (err) {
      console.error('PDF export failed, opening print dialogue:', err);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Card Preview Mode
  if (!isModal) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <Award className="w-6 h-6" />
          </div>
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>VERIFIED</span>
          </span>
        </div>

        <div>
          <p className="text-xs font-mono font-medium text-slate-400 dark:text-slate-500 mb-1">{certId}</p>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">{certificate.course_title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Awarded to <span className="font-semibold text-slate-900 dark:text-slate-200">{certificate.user_name}</span></p>
          
          <div className="flex items-center space-x-4 mt-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{certificate.issue_date}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{certificate.duration_hours || 30}h course</span>
            </span>
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <Link
            to={`/verify-certificate/${certId}`}
            className="flex-1 text-center py-2 px-3 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40 rounded-xl transition-colors border border-sky-500/20"
          >
            Verify Online
          </Link>
          <button
            onClick={() => navigate(`/verify-certificate/${certId}`)}
            className="flex-1 text-center py-2 px-3 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            View Official
          </button>
        </div>
      </div>
    );
  }

  // Full Official Certificate View (for Modal or Dedicated Page)
  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-6">
      {/* Top Action Bar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <Shield className="w-4 h-4 text-emerald-500" />
          <span>Certificate ID: <strong className="text-slate-900 dark:text-white font-mono">{certId}</strong></span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link Copied!' : 'Share Link'}</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="flex items-center space-x-1.5 px-4 py-1.5 text-xs font-semibold rounded-xl text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Rendering PDF...' : 'Download Certificate PDF'}</span>
          </button>
        </div>
      </div>

      {/* Official Certificate Canvas Container */}
      <div
        ref={certRef}
        className="w-full bg-[#FCFBF7] text-slate-900 p-8 sm:p-14 rounded-2xl shadow-2xl border-8 border-double border-amber-600/80 relative overflow-hidden select-none"
        style={{ minHeight: '560px' }}
      >
        {/* Ornate Corner Accents */}
        <div className="absolute top-3 left-3 w-12 h-12 border-t-2 border-l-2 border-amber-600"></div>
        <div className="absolute top-3 right-3 w-12 h-12 border-t-2 border-r-2 border-amber-600"></div>
        <div className="absolute bottom-3 left-3 w-12 h-12 border-b-2 border-l-2 border-amber-600"></div>
        <div className="absolute bottom-3 right-3 w-12 h-12 border-b-2 border-r-2 border-amber-600"></div>

        {/* Faint Watermark Logo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <Award className="w-[420px] h-[420px]" />
        </div>

        {/* Certificate Content */}
        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          
          {/* Institution Header */}
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎓</span>
            <span className="text-sm font-semibold tracking-widest uppercase text-amber-800">
              CodeVerse Learning Academy
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight mt-2">
            Certificate of Completion
          </h1>

          <p className="text-xs uppercase tracking-widest text-slate-500 mt-2 font-medium">
            This certificate is proudly presented to
          </p>

          {/* Student Name */}
          <div className="py-2 border-b-2 border-amber-600/60 min-w-[280px] max-w-lg">
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 capitalize tracking-wide">
              {certificate.user_name}
            </h2>
          </div>

          <p className="text-xs uppercase tracking-widest text-slate-500 font-medium">
            For successfully completing the comprehensive professional course
          </p>

          {/* Course Name */}
          <h3 className="text-xl sm:text-2xl font-bold text-amber-900 max-w-xl">
            {certificate.course_title}
          </h3>

          <p className="text-xs text-slate-600 max-w-md italic leading-relaxed">
            Demonstrating verified proficiency in core concepts, algorithmic problem solving, hands-on programming projects, and passing the final proctored examination.
          </p>

          {/* Signatures and Seal Section */}
          <div className="w-full pt-8 mt-6 flex items-end justify-between px-4 sm:px-12 border-t border-amber-200/80">
            
            {/* Left Signature */}
            <div className="text-center">
              <div className="font-serif italic text-lg sm:text-xl text-slate-800 border-b border-slate-400 pb-1 px-4">
                Sarah Jenkins, Ph.D.
              </div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1 font-medium">
                Dean of Computer Science
              </p>
            </div>

            {/* Center Gold Stamp Seal */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-500 border-4 border-amber-700/60 shadow-lg flex flex-col items-center justify-center text-white text-center p-1">
              <Award className="w-6 h-6 sm:w-8 sm:h-8" />
              <span className="text-[8px] sm:text-[9px] font-bold tracking-wider uppercase mt-0.5">
                Official
              </span>
              <span className="text-[7px] uppercase opacity-90">Verified</span>
            </div>

            {/* Right Signature */}
            <div className="text-center">
              <div className="font-serif italic text-lg sm:text-xl text-slate-800 border-b border-slate-400 pb-1 px-4">
                David K. Chen
              </div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1 font-medium">
                Chief Technology Officer
              </p>
            </div>
          </div>

          {/* Certificate Footer Metadata */}
          <div className="w-full pt-4 flex flex-wrap items-center justify-between text-[10px] font-mono text-slate-500">
            <span>Issue Date: {certificate.issue_date}</span>
            <span>ID: {certId}</span>
            <span>Validation: codeverse.dev/verify-certificate/{certId}</span>
          </div>

        </div>
      </div>
    </div>
  );
}
