import React, { useState } from 'react';
import { useMqtt } from '../mqttContext';
import { Mic, MicOff, Send } from 'lucide-react';

export function TelegramPanel() {
  const { toggleRelay, setVariation, toggleAllRelays } = useMqtt();
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState('');

  const processCommand = (text: string) => {
    const t = text.toLowerCase();
    setTranscript(text);

    // Stop variasi
    if (t.includes('variasi') && (t.includes('stop') || t.includes('mati') || t.includes('henti'))) {
      setVariation('STOP');
      setResult('⏹ Variasi dihentikan');
      return;
    }
    // Variasi 1
    if (t.includes('variasi') && (t.includes('1') || t.includes('satu'))) {
      setVariation('VARIASI1');
      setResult('🎉 Variasi 1 aktif');
      return;
    }
    // Variasi 2
    if (t.includes('variasi') && (t.includes('2') || t.includes('dua'))) {
      setVariation('VARIASI2');
      setResult('🎉 Variasi 2 aktif');
      return;
    }
    // Semua ON
    if ((t.includes('nyala') || t.includes('hidup') || t.includes('on')) &&
        (t.includes('semua') || t.includes('all')) && !t.match(/lampu\s*[1-4]/)) {
      toggleAllRelays(true);
      setResult('⚡ Semua lampu ON');
      return;
    }
    // Semua OFF
    if ((t.includes('mati') || t.includes('off') || t.includes('padam')) &&
        (t.includes('semua') || t.includes('all')) && !t.match(/lampu\s*[1-4]/)) {
      toggleAllRelays(false);
      setResult('🔴 Semua lampu OFF');
      return;
    }
    // Per lampu
    const lampuMap: Record<string, 'lampu1'|'lampu2'|'lampu3'|'lampu4'> = {
      '1': 'lampu1', 'satu': 'lampu1',
      '2': 'lampu2', 'dua':  'lampu2',
      '3': 'lampu3', 'tiga': 'lampu3',
      '4': 'lampu4', 'empat':'lampu4',
    };
    for (const [key, relay] of Object.entries(lampuMap)) {
      if (t.includes(key)) {
        const isOn = t.includes('nyala') || t.includes('hidup') || t.includes('on');
        const isOff = t.includes('mati') || t.includes('off') || t.includes('padam');
        if (isOn)  { toggleRelay(relay, true);  setResult(`💡 ${relay} ON`);  return; }
        if (isOff) { toggleRelay(relay, false); setResult(`🔌 ${relay} OFF`); return; }
      }
    }
    setResult('❓ Perintah tidak dikenali');
  };

  const startVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setResult('Browser tidak mendukung voice. Gunakan Chrome.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setListening(true);
    setResult('🎤 Mendengarkan...');
    recognition.start();

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      processCommand(text);
      setListening(false);
    };

    recognition.onerror = () => {
      setResult('❌ Gagal mendengar, coba lagi');
      setListening(false);
    };

    recognition.onend = () => setListening(false);
  };

  const [manualText, setManualText] = useState('');

  return (
    <div className="bg-white/40 border border-white backdrop-blur-md rounded-[2.5rem] p-8">
      <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 text-slate-400">
        Voice & Text Command
      </h3>

      {/* Voice Button */}
      <button
        onClick={startVoice}
        className={`w-full py-5 rounded-[2rem] font-black text-sm transition-all mb-4 flex items-center justify-center gap-2 ${
          listening
            ? 'bg-pink-400 text-white animate-pulse'
            : 'bg-slate-800 text-white hover:bg-slate-700'
        }`}
      >
        {listening ? <MicOff size={18} /> : <Mic size={18} />}
        {listening ? 'Mendengarkan...' : 'Tekan & Bicara'}
      </button>

      {/* Manual text */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={manualText}
          onChange={e => setManualText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { processCommand(manualText); setManualText(''); }}}
          placeholder="Atau ketik perintah..."
          className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 bg-white/60 text-sm outline-none"
        />
        <button
          onClick={() => { processCommand(manualText); setManualText(''); }}
          className="px-4 py-3 bg-emerald-400 text-white rounded-2xl font-bold"
        >
          <Send size={16} />
        </button>
      </div>

      {/* Transcript */}
      {transcript && (
        <div className="p-4 bg-white/60 rounded-2xl border border-slate-100 mb-3">
          <p className="text-xs text-slate-400 mb-1">Terdeteksi:</p>
          <p className="text-sm font-bold text-slate-700">"{transcript}"</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
          <p className="text-sm font-bold text-emerald-700">{result}</p>
        </div>
      )}

      {/* Hint */}
      <div className="mt-4 p-4 bg-white/40 rounded-2xl">
        <p className="text-xs text-slate-400 font-bold mb-2">Contoh perintah suara:</p>
        <div className="grid grid-cols-2 gap-1">
          {['Nyalakan lampu 1','Matikan semua lampu','Berapa temperatur','Nyalakan variasi 1','Nyalakan variasi 2','Stop variasi'].map(c => (
            <button key={c} onClick={() => processCommand(c)}
              className="text-left text-xs text-slate-500 hover:text-pink-400 py-1 px-2 rounded-lg hover:bg-pink-50 transition-colors">
              "{c}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
