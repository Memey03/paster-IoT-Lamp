import React from 'react';
import { useMqtt } from '../mqttContext';
import { Sparkles, StopCircle, Zap } from 'lucide-react';
import { clsx } from 'clsx';

export function VariationControl() {
  const { variationState, setVariation } = useMqtt();

  return (
    <div className="bg-white/40 border border-white backdrop-blur-md rounded-[2.5rem] p-8 flex-grow flex flex-col justify-center">
      <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 text-slate-400">Light Variations</h3>
      <div className="flex gap-4">
        <button
          onClick={() => setVariation('VARIASI1')}
          className={clsx(
            "flex-1 py-4 sm:py-6 rounded-[2rem] font-black transition-all text-xs sm:text-sm",
            variationState === 'VARIASI1' 
              ? "bg-pink-400 text-white shadow-lg shadow-pink-200" 
              : "border-2 border-slate-200 text-slate-400 hover:border-pink-300 hover:text-pink-400 bg-white/50"
          )}
        >
          VARIASI 1
        </button>
        <button
          onClick={() => setVariation('VARIASI2')}
          className={clsx(
            "flex-1 py-4 sm:py-6 rounded-[2rem] font-black transition-all text-xs sm:text-sm",
            variationState === 'VARIASI2' 
              ? "bg-emerald-400 text-white shadow-lg shadow-emerald-200" 
              : "border-2 border-slate-200 text-slate-400 hover:border-emerald-300 hover:text-emerald-400 bg-white/50"
          )}
        >
          VARIASI 2
        </button>
        <button
          onClick={() => setVariation('STOP')}
          className={clsx(
            "flex-1 py-4 sm:py-6 rounded-[2rem] font-black transition-all text-xs sm:text-sm",
            variationState === 'STOP' 
              ? "bg-slate-800 text-white shadow-lg shadow-slate-300" 
              : "border-2 border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-600 bg-white/50"
          )}
        >
          STOP
        </button>
      </div>
      <div className="mt-8 p-6 bg-white/60 rounded-[2rem] border border-white flex items-center gap-4">
        {variationState !== 'STOP' ? (
           <div className={clsx("w-3 h-3 rounded-full animate-pulse", variationState === 'VARIASI1' ? "bg-pink-400" : "bg-emerald-400")} />
        ) : (
           <div className="w-3 h-3 rounded-full bg-slate-400" />
        )}
        <p className="text-sm font-bold text-slate-600">
          Current: <span className={clsx(
            variationState === 'VARIASI1' ? "text-pink-400" : 
            variationState === 'VARIASI2' ? "text-emerald-400" : "text-slate-400"
          )}>
            {variationState === 'STOP' ? 'Idle' : `${variationState} Active`}
          </span>
        </p>
      </div>
    </div>
  );
}
