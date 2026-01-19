import { HistoryItem, Settings } from '../types';

const HISTORY_KEY = 'base64-history';
const SETTINGS_KEY = 'base64-settings';

export const defaultSettings: Settings = {
  encodingType: 'standard',
  characterEncoding: 'utf-8',
  outputFormat: 'text',
  autoSave: true,
  maxHistoryItems: 50,
  debounceDelay: 500,
  lineWrap: false,
  wrapLength: 76,
  showCharCount: true,
  showByteCount: false,
  lineBreakHandling: 'preserve',
  includePadding: true,
  hexCase: 'lowercase',
  customCharset: '',
  useCustomCharset: false,
};

export function getHistory(): HistoryItem[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveToHistory(item: Omit<HistoryItem, 'id' | 'timestamp'>): void {
  const history = getHistory();
  const settings = getSettings();

  const newItem: HistoryItem = {
    ...item,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };

  const updatedHistory = [newItem, ...history].slice(0, settings.maxHistoryItems);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}

export function deleteHistoryItem(id: string): void {
  const history = getHistory();
  const filtered = history.filter(item => item.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
}

export function getSettings(): Settings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
