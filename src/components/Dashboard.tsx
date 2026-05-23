import React from 'react';
import { Navbar } from './Navbar';
import { StatusCard } from './StatusCard';
import { SensorCard } from './SensorCard';
import { RelayCard } from './RelayCard';
import { GlobalRelayControl } from './GlobalRelayControl';
import { VariationControl } from './VariationControl';
import { NotificationPanel } from './NotificationPanel';
import { TelegramPanel } from './TelegramPanel';

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-emerald-50 text-slate-800 font-sans flex flex-col p-4 sm:p-6 gap-6">
      <Navbar />
      
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow max-w-[1400px] w-full mx-auto">
        {/* LEFT: Hardware & Telegram Commands */}
        <section className="lg:col-span-3 flex flex-col gap-6">
          <StatusCard />
          <TelegramPanel />
        </section>

        {/* MIDDLE: Sensors & Variation */}
        <section className="lg:col-span-6 flex flex-col gap-6">
          <SensorCard />
          <VariationControl />
        </section>

        {/* RIGHT: Relays & Activity Log */}
        <section className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-white/40 border border-white backdrop-blur-md rounded-[2.5rem] p-6 flex flex-col gap-3">
            <RelayCard id="lampu1" title="Lampu 1" />
            <RelayCard id="lampu2" title="Lampu 2" />
            <RelayCard id="lampu3" title="Lampu 3" />
            <RelayCard id="lampu4" title="Lampu 4" />
            <div className="mt-2">
              <GlobalRelayControl />
            </div>
          </div>
          <NotificationPanel />
        </section>
      </main>
    </div>
  );
}
