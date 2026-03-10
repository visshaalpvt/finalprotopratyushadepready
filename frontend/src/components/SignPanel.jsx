import React, { useState, useEffect, useCallback } from 'react';
import SignCamera from './SignCamera';
import { CLASSROOM_SIGNS } from '../utils/signMapping';

const SignPanel = ({ socket, studentName }) => {
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [history, setHistory] = useState([]);
  const lastSignRef = React.useRef({ id: null, time: 0 });

  const handleSignDetected = useCallback((sign, confidence) => {
    const now = Date.now();
    const { id: lastSignId, time: lastSignTime } = lastSignRef.current;
    
    // Throttling: only send if it's a new sign or sufficient time has passed (3 seconds)
    if (sign.id === lastSignId && now - lastSignTime < 3000) return;

    lastSignRef.current = { id: sign.id, time: now };

    const newEntry = {
      ...sign,
      confidence,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      id: now // unique key for list
    };

    setHistory(prev => [newEntry, ...prev].slice(0, 5));

    // Send to server
    if (socket) {
      socket.emit('student-sign', {
        sign: sign.label,
        meaning: sign.meaning,
        icon: sign.icon,
        confidence: confidence
      });
    }
  }, [socket]);


  return (
    <div className="glass-panel p-6 animate-slide-up bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-brand-200 dark:border-brand-900 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-black flex items-center gap-3">
            <span className="p-2 bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 rounded-xl shadow-inner">🖐️</span>
            Sign Language Chat
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Communicate with your teacher using hand gestures</p>
        </div>
        <button
          onClick={() => setIsCameraActive(!isCameraActive)}
          className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 transform active:scale-95 shadow-lg ${
            isCameraActive 
              ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/20' 
              : 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white hover:shadow-brand-500/40'
          }`}
        >
          {isCameraActive ? '⏹️ Stop Camera' : '🎥 Start Live Camera'}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-6 gap-6">
        {/* Camera Section - 4/6 width */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-500 to-purple-600 rounded-[2rem] blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative">
              <SignCamera 
                isEnabled={isCameraActive} 
                onSignDetected={handleSignDetected} 
              />
              {isCameraActive && (
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">Live Recognition</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <SignGuideItem icon="👍" label="Understand" />
            <SignGuideItem icon="✋" label="Slow Down" />
            <SignGuideItem icon="☝️" label="Question" />
            <SignGuideItem icon="✌️" label="Repeat" />
            <SignGuideItem icon="🤙" label="Thank You" />
            <SignGuideItem icon="🤙" label="Try pinky for 'Don't Understand'" isNote={true} />
          </div>
        </div>

        {/* History Section - 2/6 width */}
        <div className="xl:col-span-2 flex flex-col gap-2">
          <div className="bg-slate-50 dark:bg-slate-900/80 rounded-3xl border border-slate-200 dark:border-slate-800 h-full flex flex-col overflow-hidden shadow-inner">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-slate-800/50">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Interaction History</h4>
              <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full font-bold">{history.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-60 text-center py-10 px-6">
                   <div className="text-4xl mb-3">🛰️</div>
                   <p className="text-sm font-medium">No gestures detected yet.<br/>Start the camera and show a sign!</p>
                </div>
              ) : (
                history.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 animate-slide-right shadow-sm hover:shadow-md transition-shadow">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-slate-50 dark:bg-slate-900 shadow-inner`}>
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-extrabold text-slate-800 dark:text-slate-100">{item.label}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.timestamp}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1.5 bg-green-500/10 px-2 py-1 rounded-lg border border-green-500/20">
                         <span className="text-[10px] font-black text-green-600 dark:text-green-400">{(item.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SignGuideItem = ({ icon, label, isNote }) => (
  <div className={`p-2.5 rounded-xl border ${isNote ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 shadow-sm'} flex items-center gap-2`}>
    <span className="text-lg">{icon}</span>
    <span className={`text-[10px] font-bold ${isNote ? 'text-slate-400 italic' : 'text-slate-600 dark:text-slate-300'}`}>{label}</span>
  </div>
);

export default SignPanel;
