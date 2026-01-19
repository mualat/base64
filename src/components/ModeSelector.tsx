import { Lock, Unlock } from 'lucide-react';
import { Mode } from '../types';

interface ModeSelectorProps {
  mode: Mode;
  onChange: (mode: Mode) => void;
}

export default function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  return (
    <div className="flex gap-2 bg-slate-200 p-1 rounded-lg">
      <button
        onClick={() => onChange('encode')}
        className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-md font-medium transition-all ${
          mode === 'encode'
            ? 'bg-white text-slate-900 shadow-md'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        <Lock className="w-5 h-5" />
        Encode
      </button>

      <button
        onClick={() => onChange('decode')}
        className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-md font-medium transition-all ${
          mode === 'decode'
            ? 'bg-white text-slate-900 shadow-md'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        <Unlock className="w-5 h-5" />
        Decode
      </button>
    </div>
  );
}
