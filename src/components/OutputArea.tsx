import { Copy, Download, Check } from 'lucide-react';
import { useState } from 'react';
import { Settings } from '../types';
import { getByteCount } from '../utils/base64';

interface OutputAreaProps {
  value: string;
  label: string;
  settings: Settings;
}

export default function OutputArea({ value, label, settings }: OutputAreaProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Failed to copy to clipboard');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `base64-output-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">{label}</label>

        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            disabled={!value}
            className="flex items-center gap-2 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-md transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            disabled={!value}
            className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-md transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      <div className="relative">
        <textarea
          value={value}
          readOnly
          placeholder="Output will appear here..."
          className="w-full h-48 p-4 border-2 border-slate-300 rounded-lg bg-slate-50 font-mono text-sm resize-none"
        />

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
