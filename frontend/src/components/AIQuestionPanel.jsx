import React, { useState, useEffect } from 'react';

const AIQuestionPanel = ({ socket }) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [recentQuestion, setRecentQuestion] = useState(null);

  useEffect(() => {
    if (!socket) return;
    socket.on('ai-answer-start', () => setLoading(true));
    socket.on('ai-answer-done', (data) => {
      setLoading(false);
      setRecentQuestion(data.question);
      setAnswer(data.answer);
    });

    return () => {
      socket.off('ai-answer-start');
      socket.off('ai-answer-done');
    };
  }, [socket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    socket.emit('ask-ai', { question: question.trim() });
    setQuestion('');
  };

  return (
    <div className="glass-panel p-6 animate-slide-up border-indigo-500/30">
      <div className="flex items-center gap-3 mb-4">
        <span className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-xl animate-pulse">🤖</span>
        <div>
          <h3 className="font-black text-lg text-indigo-600 dark:text-indigo-400">AI Learning Assistant</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Ask any question about the current lecture!</p>
        </div>
      </div>

      {answer && (
        <div className="mb-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800 animate-fade-in shadow-inner">
          <p className="text-xs font-bold text-indigo-500 mb-2 font-mono break-words">Q: "{recentQuestion}"</p>
          <div className="flex gap-3">
             <div className="w-1 h-auto bg-indigo-400 rounded-full shrink-0"></div>
             <p className="text-sm font-medium leading-relaxed dark:text-slate-300">
               {answer}
             </p>
          </div>
        </div>
      )}

      {loading && (
        <div className="mb-4 flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></span>
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce delay-100"></span>
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce delay-200"></span>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Thinking...</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input 
          type="text" 
          value={question} 
          onChange={(e) => setQuestion(e.target.value)} 
          placeholder="e.g. Can you explain that last concept simply?" 
          className="input-field flex-1 text-sm bg-slate-50 dark:bg-slate-900/50 focus:border-indigo-500" 
          disabled={loading}
        />
        <button 
          type="submit" 
          disabled={!question.trim() || loading} 
          className="btn-primary bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/25 px-5 disabled:opacity-50"
        >
          ✨ Ask
        </button>
      </form>
    </div>
  );
};

export default AIQuestionPanel;
