import { Binary, Settings } from 'lucide-react';

interface HeaderProps {
  onSettingsClick: () => void;
}

export default function Header({ onSettingsClick }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Binary className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Base64 Encoder/Decoder</h1>
              <p className="text-slate-300 text-sm">Advanced encoding with customization</p>
            </div>
          </div>

          <button
            onClick={onSettingsClick}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
}
