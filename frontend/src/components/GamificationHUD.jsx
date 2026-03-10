import React, { useState, useEffect } from 'react';

const GamificationHUD = ({ xp, lastXpReason }) => {
  const [level, setLevel] = useState(1);
  const [progress, setProgress] = useState(0);
  const xpPerLevel = 50;

  useEffect(() => {
    const newLevel = Math.floor(xp / xpPerLevel) + 1;
    const currentProgress = ((xp % xpPerLevel) / xpPerLevel) * 100;
    setLevel(newLevel);
    setProgress(currentProgress);
  }, [xp]);

  return (
    <div className="glass-panel p-4 flex items-center justify-between animate-slide-up border-yellow-500/30">
      <div className="flex items-center gap-4">
        {/* Animated Avatar */}
        <div className="relative">
          <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(234,179,8,0.5)] animate-bounce-slow">
            🦊
          </div>
          <div className="absolute -bottom-2 -right-2 bg-slate-900 border-2 border-yellow-500 text-yellow-500 text-xs font-black px-2 py-0.5 rounded-full">
            Lv.{level}
          </div>
        </div>

        <div>
          <h3 className="font-black text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
            Learning Buddy
            {lastXpReason && (
              <span className="text-[10px] bg-green-500/20 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full animate-pulse">
                +{lastXpReason}
              </span>
            )}
          </h3>
          <div className="flex items-center gap-3 mt-1">
            <div className="w-48 h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-xs font-bold text-slate-500">{xp} XP</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamificationHUD;
