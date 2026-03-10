/**
 * StudentDashboard.jsx
 * Student interface: join session, receive live transcript,
 * switch accessibility modes, interact with teacher.
 */
import { useState, useEffect, useRef, useMemo } from 'react';
import { io } from 'socket.io-client';
import TranscriptPanel from './TranscriptPanel';
import AccessibilityPanel from './AccessibilityPanel';
import TranslationPanel, { LANGUAGES } from './TranslationPanel';
import AudioPlayer from './AudioPlayer';
import SignLanguageViewer from './SignLanguageViewer';
import SignPanel from './SignPanel';
import BraillePanel from './BraillePanel';
import LectureSummary from './LectureSummary';
import GamificationHUD from './GamificationHUD';
import AIQuestionPanel from './AIQuestionPanel';
import { jsPDF } from 'jspdf';


const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export default function StudentDashboard() {
  /* ---- State ---- */
  const [joined, setJoined] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [transcript, setTranscript] = useState([]);
  const [lectureStatus, setLectureStatus] = useState('idle');
  const [sessionInfo, setSessionInfo] = useState(null);
  const [connected, setConnected] = useState(false);
  const [question, setQuestion] = useState('');
  const [feedback, setFeedback] = useState('');
  const [sentMsg, setSentMsg] = useState('');
  const [summaryText, setSummaryText] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  
  // Gamification state
  const [xp, setXp] = useState(0);
  const [lastXpReason, setLastXpReason] = useState('');

  // Translation State lifted up
  const [language, setLanguage] = useState('hi');
  const [translations, setTranslations] = useState({});

  const [settings, setSettings] = useState({
    mode: 'text',
    fontSize: 'base',
    highContrast: false,
    fontFamily: 'sans',
  });

  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  /* ---- Socket connection ---- */
  useEffect(() => {
    const s = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    socketRef.current = s;
    setSocket(s);

    s.on('connect', () => setConnected(true));
    s.on('disconnect', () => setConnected(false));
    s.on('session-info', (data) => setSessionInfo(data));
    s.on('lecture-status', (data) => setLectureStatus(data.status));
    s.on('transcript-history', (history) => setTranscript(history));
    s.on('transcript-broadcast', (entry) => {
      setTranscript((prev) => [...prev, entry]);
    });
    s.on('transcript-cleared', () => setTranscript([]));
    s.on('summary-generated', (data) => {
      setSummaryText(data.summary);
      setIsSummaryLoading(false);
    });
    s.on('xp-update', (data) => {
      setXp(data.xp);
      setLastXpReason(data.reason);
      setTimeout(() => setLastXpReason(''), 3000);
    });

    // Fetch initial state via HTTP
    const fetchSession = async () => {
      try {
        const res = await fetch(`${SOCKET_URL}/api/session`);
        const data = await res.json();
        if (data && data.active !== false) {
          setSessionInfo(data);
          setLectureStatus(data.status || 'running');
          if (data.transcript) setTranscript(data.transcript);
        }
      } catch (err) {
        console.error('[Student] Failed to fetch session:', err);
      }
    };
    fetchSession();

    return () => {
      s.disconnect();
    };
  }, []);

  /* ---- Join session ---- */
  const handleJoin = (e) => {
    e.preventDefault();
    const name = studentName.trim() || 'Anonymous';
    socketRef.current?.emit('join-session', { name });
    setStudentName(name);
    setJoined(true);
  };

  /* ---- Student interactions ---- */
  const sendQuestion = () => {
    if (!question.trim()) return;
    socketRef.current?.emit('student-question', { message: question.trim() });
    setSentMsg('Question sent! ✅');
    setQuestion('');
    setTimeout(() => setSentMsg(''), 3000);
  };

  const sendFeedback = () => {
    if (!feedback.trim()) return;
    socketRef.current?.emit('student-feedback', { message: feedback.trim() });
    setSentMsg('Feedback sent! ✅');
    setFeedback('');
    setTimeout(() => setSentMsg(''), 3000);
  };

  /* ---- Export / download helpers ---- */
  const downloadTranscript = () => {
    const content = transcript.map((t) => `[${new Date(t.timestamp).toLocaleTimeString()}] ${t.text}`).join('\n');
    download('transcript.txt', content);
  };

  const downloadSummary = () => {
    const keywords = extractKeywords(transcript.map((t) => t.text).join(' '));
    const summary = `Lecture Summary\n${'='.repeat(40)}\n\nTotal Sentences: ${transcript.length}\nKey Topics: ${keywords.join(', ')}\n\nTranscript:\n${transcript.map((t) => `• ${t.text}`).join('\n')}`;
    download('lecture-summary.txt', summary);
  };

  const download = (filename, content) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Inclusive Classroom AI", 105, 20, { align: "center" });
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Lecture Notes & Accessibility Export", 105, 30, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Student: ${studentName}`, 20, 45);
    doc.text(`Session ID: ${sessionInfo?.sessionId || 'N/A'}`, 20, 50);
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 55);
    
    doc.line(20, 60, 190, 60);
    doc.setTextColor(0);
    
    let y = 70;
    
    if (summaryText) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("AI Lecture Summary", 20, y);
      y += 8;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const splitSummary = doc.splitTextToSize(summaryText, 170);
      doc.text(splitSummary, 20, y);
      y += (splitSummary.length * 5) + 15;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Lecture Transcript", 20, y);
    y += 10;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    
    transcript.forEach((t) => {
      const time = new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const line = `[${time}] ${t.text}`;
      const splitText = doc.splitTextToSize(line, 170);
      
      if (y + (splitText.length * 5) > 280) {
        doc.addPage();
        y = 20;
      }
      
      doc.text(splitText, 20, y);
      y += (splitText.length * 5) + 2;
    });

    doc.save(`inclusive-lecture-${sessionInfo?.sessionId || 'notes'}.pdf`);
  };

  /* ---- Simple keyword extraction ---- */
  const extractKeywords = (text) => {
    const skipWords = ['the', 'is', 'in', 'at', 'of', 'and', 'a', 'to', 'it', 'for', 'on', 'with', 'as', 'by', 'this', 'that'];
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const counts = {};
    for (const w of words) {
      if (w.length > 3 && !skipWords.includes(w)) counts[w] = (counts[w] || 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map((e) => e[0]);
  };

  const summary = useMemo(() => {
    if (transcript.length === 0) return null;
    const allText = transcript.map((t) => t.text).join(' ');
    const keywords = extractKeywords(allText);
    return { totalLines: transcript.length, keywords };
  }, [transcript]);

  const handleGenerateSummary = () => {
    if (transcript.length === 0) return;
    setIsSummaryLoading(true);
    socketRef.current?.emit('request-summary');
  };

  const activeId = transcript.length > 0 ? transcript[transcript.length - 1].id : null;

  // Build translated transcript array for AudioPlayer
  const translatedTranscript = useMemo(() => {
    if (language === 'en') return transcript;
    return transcript.map(entry => ({
      ...entry,
      text: translations[entry.id] || entry.text // fallback to English if not yet translated
    }));
  }, [transcript, language, translations]);


  /* ---- Join screen ---- */
  if (!joined) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <div className="glass-panel p-8 w-full max-w-md animate-slide-up text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold mb-2">Join Classroom</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Enter your name to join the live lecture session
          </p>
          <form onSubmit={handleJoin} className="space-y-4">
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Your name…"
              className="input-field text-center text-lg"
              autoFocus
            />
            <button type="submit" className="btn-primary w-full text-lg py-3">
              🚀 Join Session
            </button>
          </form>
          {/* Connection status */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse-soft'}`} />
            {connected ? 'Connected to server' : 'Connecting…'}
          </div>
        </div>
      </div>
    );
  }

  /* ---- Main student dashboard ---- */
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 ${settings.highContrast ? 'high-contrast' : ''}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-fade-in">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">📚 Student Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Welcome, <span className="font-semibold text-brand-600 dark:text-brand-400">{studentName}</span>
          </p>
        </div>
        {/* Status bar */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className={lectureStatus === 'running' ? 'badge-success' : lectureStatus === 'paused' ? 'badge-warning' : 'badge-info'}>
            {lectureStatus === 'running' ? '🔴 Live' : lectureStatus === 'paused' ? '⏸️ Paused' : lectureStatus === 'ended' ? '⏹️ Ended' : '⏳ Waiting'}
          </span>
          {sessionInfo?.sessionId && (
            <span className="badge-info text-[10px] font-mono">ID: {sessionInfo.sessionId}</span>
          )}
          <span className={`flex items-center gap-1 text-xs ${connected ? 'text-emerald-500' : 'text-rose-500'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse-soft'}`} />
            {connected ? 'Connected' : 'Reconnecting…'}
          </span>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Transcript (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          <GamificationHUD xp={xp} lastXpReason={lastXpReason} />
          
          <TranscriptPanel
            transcript={transcript}
            activeId={activeId}
            fontSize={settings.fontSize}
            fontFamily={settings.fontFamily}
          />

          {settings.mode === 'sign-recognition' && (
            <div className="animate-slide-up">
              <SignPanel socket={socket} studentName={studentName} />
            </div>
          )}

          {settings.mode === 'braille' && (
            <div className="animate-slide-up">
              <BraillePanel transcript={transcript} />
            </div>
          )}

          {/* Summary & Downloads */}
          {(summary || summaryText) && (
            <div className="animate-slide-up space-y-4">
              <LectureSummary 
                summary={summaryText} 
                onGenerate={handleGenerateSummary} 
                isLoading={isSummaryLoading} 
              />
              
              <div className="glass-panel p-5">
                <h3 className="font-bold flex items-center gap-2 mb-3">📊 Lecture Insights</h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 text-center">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Sentences</p>
                    <p className="text-lg font-bold mt-1">{summary?.totalLines || 0}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 text-center">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Key Topics</p>
                    <p className="text-lg font-bold mt-1">{summary?.keywords?.length || 0}</p>
                  </div>
                </div>
                {summary?.keywords?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {summary.keywords.map((kw, i) => (
                      <span key={i} className="badge-info text-[10px]">{kw}</span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <button onClick={downloadTranscript} className="btn-secondary text-xs flex-1">
                    📥 Transcript (TXT)
                  </button>
                  <button onClick={downloadPDF} className="btn-primary text-xs flex-1 bg-indigo-600">
                    📄 Export PDF
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Interaction panel */}
          <div className="glass-panel p-5 animate-slide-up">
            <h3 className="font-bold flex items-center gap-2 mb-4">💬 Interact with Teacher</h3>
            {sentMsg && (
              <div className="mb-3 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm text-center animate-fade-in">
                {sentMsg}
              </div>
            )}
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendQuestion()}
                  placeholder="Ask a question…"
                  className="input-field text-sm"
                />
                <button onClick={sendQuestion} className="btn-primary text-sm whitespace-nowrap" disabled={!question.trim()}>
                  ❓ Ask
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendFeedback()}
                  placeholder="Send feedback…"
                  className="input-field text-sm"
                />
                <button onClick={sendFeedback} className="btn-secondary text-sm whitespace-nowrap" disabled={!feedback.trim()}>
                  💬 Send
                </button>
              </div>
            </div>
          </div>
          
          <AIQuestionPanel socket={socket} />
        </div>

        {/* Right sidebar: Accessibility tools */}
        <div className="space-y-6">
          <AccessibilityPanel settings={settings} onSettingsChange={setSettings} />

          {/* Conditional mode panels */}
          {settings.mode === 'translation' && (
            <TranslationPanel
              transcript={transcript}
              fontSize={settings.fontSize}
              fontFamily={settings.fontFamily}
            />
          )}

          {settings.mode === 'audio' && (
            <AudioPlayer transcript={transcript} />
          )}

          {settings.mode === 'sign' && (
            <SignLanguageViewer transcript={transcript} />
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 dark:text-slate-500 py-4 border-t border-slate-200/50 dark:border-slate-700/50">
        <p>
          Inclusive Classroom AI • Session {sessionInfo?.sessionId || '—'} •{' '}
          {connected ? '🟢 Connected' : '🔴 Disconnected'}
        </p>
      </footer>
    </div>
  );
}

/**
 * Simple keyword extraction: finds the most frequent meaningful words.
 */
function extractKeywords(text) {
  const stopWords = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'shall', 'can', 'to', 'of', 'in', 'for',
    'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during',
    'before', 'after', 'above', 'below', 'between', 'out', 'off', 'over',
    'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when',
    'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more',
    'most', 'other', 'some', 'such', 'no', 'not', 'only', 'own', 'same',
    'so', 'than', 'too', 'very', 'just', 'because', 'but', 'and', 'or',
    'if', 'while', 'about', 'up', 'it', 'its', 'this', 'that', 'these',
    'those', 'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'she',
    'they', 'them', 'what', 'which', 'who', 'whom', 'this', 'that',
  ]);

  const words = text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
  const freq = {};
  for (const w of words) {
    if (w.length < 3 || stopWords.has(w)) continue;
    freq[w] = (freq[w] || 0) + 1;
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word);
}
