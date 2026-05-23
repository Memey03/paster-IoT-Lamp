import React from 'react';
import { useMqtt } from '../mqttContext';
import { Server, Cpu, Bot } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'motion/react';

export function StatusCard() {
  const { systemStatus } = useMqtt();

  return (
    <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white shadow-xl flex flex-col gap-4 relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[40px] rounded-full pointer-events-none" />
      
      <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-50 relative z-10">System Status</h3>
      <div className="space-y-4 relative z-10">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">MQTT Broker</span>
          <span className={clsx("text-[10px] px-2 py-1 rounded-md font-black", systemStatus.mqttConnected ? "bg-emerald-500 text-white" : "bg-red-500 text-white")}>
            {systemStatus.mqttConnected ? 'CONNECTED' : 'OFFLINE'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">ESP32 Hardware</span>
          <span className={clsx("text-[10px] px-2 py-1 rounded-md font-black", systemStatus.esp32Online ? "bg-emerald-500 text-white" : "bg-red-500 text-white")}>
            {systemStatus.esp32Online ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>
        <div className="flex justify-between items-center" title="Controlled by ESP32">
          <span className="text-sm font-medium">Telegram Bot</span>
          <span className="bg-indigo-500 text-white text-[10px] px-2 py-1 rounded-md font-black uppercase">
            VIA ESP32
          </span>
        </div>
      </div>
    </div>
  );
}
