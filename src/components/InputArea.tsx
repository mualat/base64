import { Upload, X } from 'lucide-react';
import { Mode, Settings } from '../types';
import { readFileAsText, getByteCount } from '../utils/base64';

interface InputAreaProps {
  mode: Mode;
  value: string;
  onChange: (value: string) => void;
  settings: Settings;
}

export default function InputArea({ mode, value, onChange, settings }: InputAreaProps) {
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await readFileAsText(file);
      onChange(text);
    } catch (error) {
      alert('Failed to read file');
    }

    e.target.value = '';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">
          {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
        </label>

        <label className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md cursor-pointer transition-colors text-sm">
          <Upload className="w-4 h-4" />
          Upload File
          <input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept=".txt,.json,.xml,.html,.css,.js"
          />
        </label>
      </div>

      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter base64 string to decode...'}
          className="w-full h-48 p-4 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none font-mono text-sm"
        />

        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1.5 bg-slate-200 hover:bg-slate-300 rounded-md transition-colors"
            title="Clear input"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {value && (settings.showCharCount || settings.showByteCount) && (
          <div className="absolute bottom-2 right-2 text-xs text-slate-500 bg-white px-2 py-1 rounded shadow-sm">
            {settings.showCharCount && <span>{value.length} chars</span>}
            {settings.showCharCount && settings.showByteCount && <span className="mx-1">|</span>}
            {settings.showByteCount && <span>{getByteCount(value)} bytes</span>}
          </div>
        )}
      </div>
    </div>
  );
}
