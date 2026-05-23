import React from 'react';
import { useMqtt } from '../mqttContext';
import { Power } from 'lucide-react';
import { motion } from 'motion/react';

export function GlobalRelayControl() {
  const { toggleAllRelays } = useMqtt();

  return (
    <div className="flex gap-2">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => toggleAllRelays(true)}
        className="flex-1 bg-emerald-100 text-emerald-700 rounded-3xl py-3 font-bold flex items-center justify-center gap-1.5 shadow-sm text-xs border border-emerald-200"
      >
        <Power size={14} /> ALL ON
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => toggleAllRelays(false)}
        className="flex-1 bg-pink-100 text-pink-700 rounded-3xl py-3 font-bold flex items-center justify-center gap-1.5 shadow-sm text-xs border border-pink-200"
      >
        <Power size={14} /> ALL OFF
      </motion.button>
    </div>
  );
}
