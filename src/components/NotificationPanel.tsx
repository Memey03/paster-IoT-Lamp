import React from 'react';
import { useMqtt } from '../mqttContext';
import { Terminal, Globe, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';

export function NotificationPanel() {
  const { activityLogs } = useMqtt();

  const getSourceBadge = (source: string) => {
    switch(source) {
      case 'WEB':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-pink-100 text-pink-600 font-bold tracking-wider" style={{fontSize: '0.65rem'}}>
            <Globe size={10} /> WEB
          </span>
        );
      case 'TELEGRAM':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-600 font-bold tracking-wider" style={{fontSize: '0.65rem'}}>
            <Bot size={10} /> TELEGRAM
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-200 text-slate-600 font-bold tracking-wider" style={{fontSize: '0.65rem'}}>
            <Terminal size={10} /> SYS
          </span>
        );
    }
  };

  return (
    <div className="bg-white/40 border border-white backdrop-blur-md rounded-[2.5rem] p-6 flex-grow flex flex-col h-[400px]">
      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex justify-between">
        Activity Log
        <span className="lowercase text-[9px] opacity-60">Last 50</span>
      </h3>
      <div className="space-y-3 pt-2 text-[11px] overflow-y-auto custom-scrollbar flex-grow">
        <AnimatePresence initial={false}>
          {activityLogs.length === 0 ? (
            <p className="text-slate-400 text-sm italic text-center mt-10">No recent activity</p>
          ) : (
            activityLogs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="flex items-center justify-between border-b border-white pb-2"
              >
                <div className="flex flex-col">
                  <span className="font-black text-slate-700">{log.message}</span>
                  <span className="opacity-50 font-mono text-[10px] mt-0.5">
                    {log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                {log.source === 'WEB' ? (
                  <span className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-black text-[9px]">WEB</span>
                ) : log.source === 'TELEGRAM' ? (
                  <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-black text-[9px]">TELEGRAM</span>
                ) : (
                  <span className="bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full font-black text-[9px]">SYS</span>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
