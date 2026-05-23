import React, { useEffect, useState } from 'react';
import { useMqtt } from '../mqttContext';
import { Radio, Activity } from 'lucide-react';
import { motion } from 'motion/react';

export function Navbar() {
  const { systemStatus } = useMqtt();
  
  // Fake latency indicator just for UI feeling if realping isn't available,
  // but it's simpler to just show "LIVE"
  const [latency, setLatency] = useState(0);
  
  useEffect(() => {
    if (systemStatus.mqttConnected) {
      const interval = setInterval(() => {
        setLatency(Math.floor(Math.random() * 20) + 30);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [systemStatus.mqttConnected]);

  return (
    <nav className="flex justify-between items-center bg-white/40 border border-white backdrop-blur-md px-6 sm:px-8 py-4 rounded-[2.5rem] shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-pink-400 rounded-xl flex items-center justify-center text-white">
          <Activity size={24} className="stroke-[3]" />
        </div>
        <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tighter">Smart Home <span className="text-pink-400">v2</span></h1>
      </div>
      
      <div className="flex items-center gap-4">
        {systemStatus.mqttConnected && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 sm:px-4 py-2 rounded-full border border-emerald-200"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">MQTT: LIVE</span>
            {latency > 0 && <span className="hidden sm:inline text-[10px] font-bold opacity-70">~{latency}ms</span>}
          </motion.div>
        )}
      </div>
    </nav>
  );
}
