import React from 'react';
import { useMqtt } from '../mqttContext';
import { RelayState } from '../types';
import { clsx } from 'clsx';
import { motion } from 'motion/react';

interface RelayCardProps {
  id: keyof RelayState;
  title: string;
}

export function RelayCard({ id, title }: RelayCardProps) {
  const { relayState, toggleRelay } = useMqtt();
  const isOn = relayState[id];

  return (
    <div 
      className={clsx(
        "flex justify-between items-center bg-white p-4 rounded-3xl shadow-sm border border-slate-50 transition-all",
        !isOn && "opacity-60"
      )}
    >
      <span className="font-black text-sm uppercase">{title}</span>
      <button 
        onClick={() => toggleRelay(id, !isOn)}
        className={clsx(
          "w-12 h-6 rounded-full relative transition-colors duration-300 active:scale-95 cursor-pointer cursor-default",
          isOn ? "bg-pink-400" : "bg-slate-200"
        )}
      >
        <motion.div 
          initial={false}
          animate={{ x: isOn ? 24 : 0 }}
          className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  );
}
