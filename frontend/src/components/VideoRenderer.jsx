import React, { useRef, useEffect } from 'react';

export const VideoRenderer = ({ stream, isLocal = false, name, isTeacher }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className={`relative rounded-2xl overflow-hidden bg-slate-900 border-4 ${isTeacher ? 'border-indigo-500 shadow-indigo-500/50' : 'border-slate-700 shadow-xl'} shadow-lg group`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className="w-full h-full object-cover transform scale-x-[-1]" 
      />
      <div className="absolute bottom-3 left-3 flex items-center gap-2">
        <div className={`px-3 py-1.5 rounded-xl backdrop-blur-md font-bold text-xs uppercase tracking-widest ${isTeacher ? 'bg-indigo-600/80 text-white' : 'bg-slate-800/80 text-slate-200'}`}>
           {isTeacher ? '👨‍🏫 Teacher' : '🎓 '} {name || (isLocal ? 'You' : 'Student')}
        </div>
      </div>
    </div>
  );
};
