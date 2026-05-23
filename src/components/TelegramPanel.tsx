import React, { useState } from 'react';
import { Send, Copy, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TELEGRAM_COMMANDS = [
  { cmd: '/lampu1_on', desc: 'Nyalakan Lampu 1' },
  { cmd: '/lampu1_off', desc: 'Matikan Lampu 1' },
  { cmd: '/lampu2_on', desc: 'Nyalakan Lampu 2' },
  { cmd: '/lampu2_off', desc: 'Matikan Lampu 2' },
  { cmd: '/lampu3_on', desc: 'Nyalakan Lampu 3' },
  { cmd: '/lampu3_off', desc: 'Matikan Lampu 3' },
  { cmd: '/lampu4_on', desc: 'Nyalakan Lampu 4' },
  { cmd: '/lampu4_off', desc: 'Matikan Lampu 4' },
  { cmd: '/all_on', desc: 'Semua Lampu ON' },
  { cmd: '/all_off', desc: 'Semua Lampu OFF' },
  { cmd: '/variasi1', desc: 'Aktifkan Variasi 1' },
  { cmd: '/variasi2', desc: 'Aktifkan Variasi 2' },
  { cmd: '/stop_variasi', desc: 'Stop Semua Variasi' },
  { cmd: '/sensor', desc: 'Baca Suhu & Kelembaban' },
  { cmd: '/status', desc: 'Status Semua Lampu' },
];

export function TelegramPanel() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedId(cmd);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white/40 border border-white backdrop-blur-md rounded-[2.5rem] p-6 flex-grow flex flex-col relative overflow-hidden h-[300px] lg:h-auto lg:min-h-[400px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500">Telegram Commands</h3>
        <Send className="h-4 w-4 text-indigo-400" />
      </div>
      <div className="overflow-y-auto space-y-2 pr-2 custom-scrollbar flex-grow min-h-[0] mb-4">
        {TELEGRAM_COMMANDS.map((item) => (
          <div
            key={item.cmd}
            onClick={() => handleCopy(item.cmd)}
            className="group flex items-center justify-between p-2 rounded-xl hover:bg-indigo-50 cursor-pointer transition-colors"
          >
            <code className="text-xs font-bold text-slate-600">{item.cmd}</code>
            {copiedId === item.cmd ? (
              <CheckCircle2 size={12} className="text-emerald-500" />
            ) : (
              <Copy size={12} className="opacity-0 group-hover:opacity-100 text-indigo-400 transition-opacity" />
            )}
          </div>
        ))}
      </div>
      <div className="mt-auto p-4 bg-indigo-100/50 rounded-2xl border border-indigo-200 flex-shrink-0">
        <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-tighter">Note: Bot is controlled by ESP32 logic.</p>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {copiedId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: "-50%", y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute bottom-24 left-1/2 bg-slate-800 text-white px-4 py-2 rounded-full font-bold text-sm shadow-xl flex items-center gap-2 z-50 pointer-events-none whitespace-nowrap"
          >
            <CheckCircle2 size={16} className="text-emerald-400" /> Copied
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
