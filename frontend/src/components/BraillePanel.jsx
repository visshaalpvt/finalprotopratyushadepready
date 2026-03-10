/**
 * BraillePanel.jsx
 * Displays a tactile-simulated Braille output of the live transcript.
 */
import React, { useMemo } from 'react';
import { convertToBraille } from '../utils/brailleMap';

const BraillePanel = ({ transcript }) => {
    const fullText = useMemo(() => {
        return transcript.map(t => t.text).join(' ');
    }, [transcript]);

    const brailleText = useMemo(() => {
        return convertToBraille(fullText);
    }, [fullText]);

    return (
        <div className="glass-panel p-6 animate-slide-up bg-slate-900 border-indigo-500/30">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black text-indigo-400 flex items-center gap-2">
                    <span className="text-2xl">⠝⠑⠺</span> Braille / Tactile Learning Mode
                </h3>
            </div>
            
            <div className="bg-black/40 rounded-2xl p-6 min-h-[150px] font-mono break-all leading-relaxed">
                {brailleText ? (
                    <div className="text-2xl text-white tracking-[0.3em] animate-pulse-soft">
                        {brailleText}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 py-10">
                        <span className="text-4xl mb-3">⠿</span>
                        <p className="text-sm font-bold uppercase tracking-widest">Awaiting tactile input...</p>
                    </div>
                )}
            </div>

            <div className="mt-4 flex gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Live Conversion</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Unicode 6-Dot</span>
            </div>
        </div>
    );
};

export default BraillePanel;
