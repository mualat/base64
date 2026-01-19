import { X, Save, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Settings, EncodingType, OutputFormat, LineBreakHandling, HexCase } from '../types';
import { defaultSettings } from '../utils/storage';

interface SettingsPanelProps {
  settings: Settings;
  onClose: () => void;
  onSave: (settings: Settings) => void;
}

export default function SettingsPanel({ settings, onClose, onSave }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<'encoding' | 'display' | 'advanced'>('encoding');
  const [useCustom, setUseCustom] = useState(settings.useCustomCharset);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newSettings: Settings = {
      encodingType: formData.get('encodingType') as EncodingType,
      characterEncoding: formData.get('characterEncoding') as any,
      outputFormat: formData.get('outputFormat') as OutputFormat,
      autoSave: formData.get('autoSave') === 'on',
      maxHistoryItems: parseInt(formData.get('maxHistoryItems') as string),
      debounceDelay: parseInt(formData.get('debounceDelay') as string),
      lineWrap: formData.get('lineWrap') === 'on',
      wrapLength: parseInt(formData.get('wrapLength') as string),
      showCharCount: formData.get('showCharCount') === 'on',
      showByteCount: formData.get('showByteCount') === 'on',
      lineBreakHandling: formData.get('lineBreakHandling') as LineBreakHandling,
      includePadding: formData.get('includePadding') === 'on',
      hexCase: formData.get('hexCase') as HexCase,
      customCharset: formData.get('customCharset') as string,
      useCustomCharset: formData.get('useCustomCharset') === 'on',
    };

    onSave(newSettings);
    onClose();
  };

  const handleReset = () => {
    if (confirm('Reset all settings to default values?')) {
      onSave(defaultSettings);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('encoding')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'encoding'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Encoding
          </button>
          <button
            onClick={() => setActiveTab('display')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'display'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Display
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'advanced'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Advanced
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'encoding' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Encoding Type
                </label>
                <select
                  name="encodingType"
                  defaultValue={settings.encodingType}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="standard">Standard Base64</option>
                  <option value="url-safe">URL-Safe Base64</option>
                  <option value="custom">Custom Charset</option>
                </select>
                <p className="mt-1 text-xs text-slate-500">
                  URL-safe replaces +/= | Custom uses your character set
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Character Encoding
                </label>
                <select
                  name="characterEncoding"
                  defaultValue={settings.characterEncoding}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="utf-8">UTF-8 (Unicode)</option>
                  <option value="ascii">ASCII</option>
                  <option value="latin1">Latin-1 (ISO-8859-1)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Line Break Handling
                </label>
                <select
                  name="lineBreakHandling"
                  defaultValue={settings.lineBreakHandling}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="preserve">Preserve Original</option>
                  <option value="remove">Remove All</option>
                  <option value="unix">Unix (LF)</option>
                  <option value="windows">Windows (CRLF)</option>
                </select>
                <p className="mt-1 text-xs text-slate-500">
                  How to handle line breaks in input text
                </p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="includePadding"
                  id="includePadding"
                  defaultChecked={settings.includePadding}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="includePadding" className="ml-2 text-sm text-slate-700">
                  Include padding characters (=)
                </label>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    name="useCustomCharset"
                    id="useCustomCharset"
                    defaultChecked={settings.useCustomCharset}
                    onChange={(e) => setUseCustom(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="useCustomCharset" className="ml-2 text-sm font-medium text-slate-700">
                    Use Custom Character Set
                  </label>
                </div>

                <textarea
                  name="customCharset"
                  defaultValue={settings.customCharset}
                  disabled={!useCustom}
                  placeholder="Enter 64+ characters for custom base64 alphabet (e.g., ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none font-mono text-xs disabled:bg-slate-100 disabled:text-slate-500"
                  rows={3}
                />
                <p className="mt-1 text-xs text-slate-500">
                  Must be at least 64 unique characters
                </p>
              </div>
            </>
          )}

          {activeTab === 'display' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Output Format
                </label>
                <select
                  name="outputFormat"
                  defaultValue={settings.outputFormat}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="text">Text</option>
                  <option value="hex">Hexadecimal</option>
                  <option value="binary">Binary</option>
                </select>
                <p className="mt-1 text-xs text-slate-500">
                  How to display the output result
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Hexadecimal Case
                </label>
                <select
                  name="hexCase"
                  defaultValue={settings.hexCase}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="lowercase">Lowercase (a-f)</option>
                  <option value="uppercase">Uppercase (A-F)</option>
                </select>
                <p className="mt-1 text-xs text-slate-500">
                  Case style for hexadecimal output
                </p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="lineWrap"
                  id="lineWrap"
                  defaultChecked={settings.lineWrap}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="lineWrap" className="ml-2 text-sm text-slate-700">
                  Enable line wrapping
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Wrap Length (characters per line)
                </label>
                <input
                  type="number"
                  name="wrapLength"
                  defaultValue={settings.wrapLength}
                  min="20"
                  max="200"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Number of characters before line break (20-200)
                </p>
              </div>

              <div className="border-t border-slate-200 pt-4 space-y-3">
                <p className="text-sm font-medium text-slate-700">Display Options</p>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="showCharCount"
                    id="showCharCount"
                    defaultChecked={settings.showCharCount}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="showCharCount" className="ml-2 text-sm text-slate-700">
                    Show character count
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="showByteCount"
                    id="showByteCount"
                    defaultChecked={settings.showByteCount}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="showByteCount" className="ml-2 text-sm text-slate-700">
                    Show byte count
                  </label>
                </div>
              </div>
            </>
          )}

          {activeTab === 'advanced' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Typing Debounce Delay (ms)
                </label>
                <input
                  type="number"
                  name="debounceDelay"
                  defaultValue={settings.debounceDelay}
                  min="0"
                  max="2000"
                  step="100"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Wait time after typing before conversion (0-2000ms)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Max History Items
                </label>
                <input
                  type="number"
                  name="maxHistoryItems"
                  defaultValue={settings.maxHistoryItems}
                  min="10"
                  max="200"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Maximum number of items to keep in history (10-200)
                </p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="autoSave"
                  id="autoSave"
                  defaultChecked={settings.autoSave}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="autoSave" className="ml-2 text-sm text-slate-700">
                  Auto-save conversions to history
                </label>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset to Default Settings
                </button>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
