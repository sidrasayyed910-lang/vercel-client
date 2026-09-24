import React, { useState, useEffect } from 'react';
import { useRouter, Link } from '../context/RouterContext';
import { api } from '../services/api';
import {
  Compass,
  ArrowDown,
  CheckCircle,
  Clock,
  ArrowRight,
  Layers,
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function RoadmapsPage() {
  const { navigate } = useRouter();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRoadmapId, setActiveRoadmapId] = useState('beginner');

  useEffect(() => {
    async function loadRoadmaps() {
      setLoading(true);
      try {
        const res = await api.roadmaps.getAll();
        if (res.success) {
          setRoadmaps(res.data);
        }
      } catch (err) {
        console.error('Failed to load roadmaps:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRoadmaps();
  }, []);

  const activeRoadmap = roadmaps.find(r => r.id === activeRoadmapId) || roadmaps[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-semibold mb-3">
          <Compass className="w-4 h-4 text-sky-500" />
          <span>9 Developer Learning Paths</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Coding Career Roadmaps
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl">
          Follow step-by-step visual pathways crafted to take you from foundational concepts to production-grade engineering.
        </p>
      </div>

      {/* Roadmap Selector Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {roadmaps.map((r) => {
          const isActive = r.id === activeRoadmapId;
          return (
            <button
              key={r.id}
              onClick={() => setActiveRoadmapId(r.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all flex items-center space-x-2 ${
                isActive
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              <span>{r.icon}</span>
              <span>{r.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Roadmap Visual Display */}
      {activeRoadmap && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm space-y-10">
          
          {/* Roadmap Header Meta */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{activeRoadmap.icon}</span>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {activeRoadmap.title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {activeRoadmap.subtitle} &bull; {activeRoadmap.description}
              </p>
            </div>

            <div className="flex items-center space-x-2 self-start sm:self-center px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Clock className="w-3.5 h-3.5 text-sky-500" />
              <span>Est: {activeRoadmap.estimatedMonths}</span>
            </div>
          </div>

          {/* Visual Progression Nodes (Step by Step with Connecting Lines) */}
          <div className="max-w-2xl mx-auto space-y-3">
            {activeRoadmap.steps.map((step, idx) => {
              const isLast = idx === activeRoadmap.steps.length - 1;

              return (
                <div key={step.step} className="flex flex-col items-center">
                  
                  {/* Step Card Node */}
                  <div className="w-full bg-slate-50 dark:bg-slate-800/60 hover:border-sky-500/50 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                        {step.step}
                      </div>

                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-400 transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>

                    {step.courseLink && (
                      <Link
                        to={step.courseLink}
                        className="self-end sm:self-center shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 border border-slate-200 dark:border-slate-700 hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-colors flex items-center space-x-1"
                      >
                        <span>Learn Course</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>

                  {/* Down Arrow Connector */}
                  {!isLast && (
                    <div className="py-2 flex flex-col items-center text-slate-300 dark:text-slate-700">
                      <div className="w-0.5 h-4 bg-slate-300 dark:bg-slate-700"></div>
                      <ArrowDown className="w-4 h-4 -mt-1 text-slate-400 dark:text-slate-600" />
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}
