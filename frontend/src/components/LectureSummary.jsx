/**
 * LectureSummary.jsx
 * Displays AI-generated summaries and analytics.
 */
import React from 'react';

const LectureSummary = ({ summary, onGenerate, isLoading }) => {
    return (
        <div className="glass-panel p-6 animate-slide-up border-emerald-500/30">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-2xl font-black text-emerald-500 flex items-center gap-3">
                        <span className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">🤖</span>
                        AI Lecture Summary
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Intelligent synthesis of key concepts</p>
                </div>
                <button 
                    onClick={onGenerate}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        isLoading 
                        ? 'bg-slate-700 text-slate-500' 
                        : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 active:scale-95'
                    }`}
                >
                    {isLoading ? '⏳ Synthesizing...' : '🪄 Generate Summary'}
                </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 min-h-[100px] relative overflow-hidden">
                {isLoading && (
                    <div className="absolute inset-0 bg-emerald-500/5 backdrop-blur-sm flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {summary ? (
                    <div className="space-y-4 animate-fade-in">
                        {summary.split('\n').map((line, i) => (
                            <div key={i} className="flex gap-4 items-start">
                                <span className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                                    {line.replace(/^[•\s*-]+/, '')}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 py-6 opacity-60">
                        <p className="text-sm italic">Click the button above to generate a summary of the current lecture.</p>
                    </div>
                )}
            </div>

            {/* Analytics Hackathon Preview */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                    <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-1">Engagement</p>
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-blue-700 dark:text-blue-300">82%</span>
                        <div className="flex-1 h-1.5 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[82%]"></div>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-100 dark:border-purple-900/30">
                    <p className="text-[10px] text-purple-500 font-black uppercase tracking-widest mb-1">Understanding</p>
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-purple-700 dark:text-purple-300">74%</span>
                        <div className="flex-1 h-1.5 bg-purple-200 dark:bg-purple-800 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 w-[74%]"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LectureSummary;
