import React from 'react';
import { useMqtt } from '../mqttContext';
import { Thermometer, Droplets } from 'lucide-react';
import { motion } from 'motion/react';

export function SensorCard() {
  const { sensorData } = useMqtt();

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Temperature */}
      <div className="bg-white/40 border border-white backdrop-blur-md rounded-[2.5rem] p-6 sm:p-8 flex flex-col items-center shadow-sm">
        <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-pink-400 mb-2">Temperature</span>
        <div className="flex items-baseline">
          <span className="text-5xl sm:text-7xl font-black tracking-tighter">
            {sensorData.suhu !== null ? sensorData.suhu.toFixed(1) : '--'}
          </span>
          <span className="text-xl sm:text-2xl font-black text-pink-400 ml-1">°C</span>
        </div>
      </div>

      {/* Humidity */}
      <div className="bg-white/40 border border-white backdrop-blur-md rounded-[2.5rem] p-6 sm:p-8 flex flex-col items-center shadow-sm">
        <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-emerald-400 mb-2">Humidity</span>
        <div className="flex items-baseline">
          <span className="text-5xl sm:text-7xl font-black tracking-tighter">
            {sensorData.kelembaban !== null ? Math.round(sensorData.kelembaban) : '--'}
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-400 ml-1">%</span>
        </div>
      </div>
    </div>
  );
}
