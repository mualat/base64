import { useState, useEffect } from 'react';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { Mode, HistoryItem, Settings as SettingsType } from './types';
import { encodeToBase64, decodeFromBase64, formatOutput } from './utils/base64';
import {
  getHistory,
  saveToHistory,
  clearHistory,
  deleteHistoryItem,
  getSettings,
  saveSettings,
} from './utils/storage';

import Header from './components/Header';
import ModeSelector from './components/ModeSelector';
import InputArea from './components/InputArea';
import OutputArea from './components/OutputArea';
import SettingsPanel from './components/SettingsPanel';
import HistoryPanel from './components/HistoryPanel';

function App() {
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [settings, setSettings] = useState<SettingsType>(getSettings());
  const [showSettings, setShowSettings] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>(getHistory());

  useEffect(() => {
    if (!input) {
      setOutput('');
      setError('');
      return;
    }

    const timeoutId = setTimeout(() => {
      try {
        let result: string;

        if (mode === 'encode') {
          const charset = settings.useCustomCharset ? settings.customCharset : undefined;
          result = encodeToBase64(
            input,
            settings.encodingType,
            charset,
            settings.lineBreakHandling,
            settings.includePadding
          );
        } else {
          const charset = settings.useCustomCharset ? settings.customCharset : undefined;
          result = decodeFromBase64(input, settings.encodingType, charset);
        }

        const formattedResult = formatOutput(
          result,
          settings.outputFormat,
          settings.hexCase,
          settings.lineWrap,
          settings.wrapLength
        );
        setOutput(formattedResult);
        setError('');

        if (settings.autoSave && result) {
          saveToHistory({
            mode,
            input,
            output: result,
            encodingType: settings.encodingType,
            characterEncoding: settings.characterEncoding,
          });
          setHistory(getHistory());
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setOutput('');
      }
    }, settings.debounceDelay);

    return () => clearTimeout(timeoutId);
  }, [input, mode, settings]);

  const handleSettingsSave = (newSettings: SettingsType) => {
    saveSettings(newSettings);
    setSettings(newSettings);
  };

  const handleHistoryRestore = (item: HistoryItem) => {
    setMode(item.mode);
    setInput(item.input);
    setSettings(prev => ({
      ...prev,
      encodingType: item.encodingType,
    }));
  };

  const handleHistoryDelete = (id: string) => {
    deleteHistoryItem(id);
    setHistory(getHistory());
  };

  const handleHistoryClear = () => {
    if (confirm('Are you sure you want to clear all history?')) {
      clearHistory();
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header onSettingsClick={() => setShowSettings(true)} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <ModeSelector mode={mode} onChange={setMode} />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="space-y-6">
                <InputArea
                  mode={mode}
                  value={input}
                  onChange={setInput}
                  settings={settings}
                />

                <div className="flex items-center justify-center">
                  <div className="bg-slate-200 p-3 rounded-full">
                    <ArrowRight className="w-6 h-6 text-slate-600" />
                  </div>
                </div>

                <OutputArea
                  value={output}
                  label={mode === 'encode' ? 'Encoded Base64' : 'Decoded Text'}
                  settings={settings}
                />

                {error && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-900">Error</p>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-900">Encoding:</span>
                  <span className="ml-2 text-blue-700">{settings.encodingType}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-900">Output Format:</span>
                  <span className="ml-2 text-blue-700">{settings.outputFormat}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-900">Auto-save:</span>
                  <span className="ml-2 text-blue-700">{settings.autoSave ? 'On' : 'Off'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <HistoryPanel
              history={history}
              onRestore={handleHistoryRestore}
              onDelete={handleHistoryDelete}
              onClear={handleHistoryClear}
            />
          </div>
        </div>
      </div>

      {showSettings && (
        <SettingsPanel
          settings={settings}
          onClose={() => setShowSettings(false)}
          onSave={handleSettingsSave}
        />
      )}
    </div>
  );
}

export default App;
