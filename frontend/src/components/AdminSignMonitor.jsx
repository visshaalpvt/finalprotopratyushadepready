import React, { useState, useEffect } from 'react';

const AdminSignMonitor = ({ socket }) => {
  const [signMessages, setSignMessages] = useState([]);
  const [stats, setStats] = useState({
    understand: 0,
    question: 0,
    confused: 0,
    total: 0
  });

  useEffect(() => {
    if (!socket) return;

    const handleSignNotification = (data) => {
      if (data.type === 'sign-language') {
        const newMsg = {
          ...data,
          id: Date.now(),
          receivedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };
        
        setSignMessages(prev => [newMsg, ...prev].slice(0, 10));
        
        // Update stats
        setStats(prev => {
          const newStats = { ...prev, total: prev.total + 1 };
          if (data.sign.includes('understand') && !data.sign.includes("don't")) newStats.understand++;
          if (data.sign.includes('question')) newStats.question++;
          if (data.sign.includes("don't understand")) newStats.confused++;
          return newStats;
        });
      }
    };

    socket.on('student-notification', handleSignNotification);
    return () => socket.off('student-notification', handleSignNotification);
  }, [socket]);

  return (
    <div className="flex flex-col gap-6">
      {/* Analytics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Feedback" value={stats.total} color="blue" />
        <StatCard label="Understood" value={stats.understand} color="green" />
        <StatCard label="Questions" value={stats.question} color="yellow" />
        <StatCard label="Confused" value={stats.confused} color="red" />
      </div>

      {/* Smart Alert */}
      {stats.confused > 2 && (
        <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl flex items-center gap-3 animate-pulse">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-bold text-red-800 dark:text-red-200">Clarification Needed</p>
            <p className="text-sm text-red-600 dark:text-red-400">Multiple students are signaling they don't understand the current topic.</p>
          </div>
        </div>
      )}

      {/* Live Feed */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex-1 flex flex-col overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
            Real-time Sign Feed
          </h3>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Last 10 messages</span>
        </div>
        
        <div className="p-4 flex flex-col gap-3 min-h-[300px] overflow-y-auto">
          {signMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 py-10 opacity-50 italic">
               Waiting for student gestures...
            </div>
          ) : (
            signMessages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 animate-slide-right">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
                  {msg.studentName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-900 dark:text-slate-100">{msg.studentName}</p>
                    <span className="text-[10px] text-slate-400">{msg.receivedAt}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xl">{msg.icon}</span>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800">
                      {msg.sign}
                    </p>
                    <p className="text-xs text-slate-500 italic truncate">— "{msg.meaning}"</p>
                  </div>
                </div>
                <div className="shrink-0 pt-1">
                  <span className="text-[10px] font-mono text-slate-400">conf: {(msg.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }) => {
  const colors = {
    blue: 'border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300',
    green: 'border-green-200 bg-green-50 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300',
    yellow: 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300',
    red: 'border-red-200 bg-red-50 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'
  };

  return (
    <div className={`p-4 rounded-xl border ${colors[color]} flex flex-col items-center justify-center`}>
      <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">{label}</p>
      <p className="text-2xl font-black">{value}</p>
    </div>
  );
};

export default AdminSignMonitor;
