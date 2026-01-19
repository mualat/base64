export type Mode = 'encode' | 'decode';
export type EncodingType = 'standard' | 'url-safe' | 'custom';
export type CharacterEncoding = 'utf-8' | 'ascii' | 'latin1';
export type OutputFormat = 'text' | 'hex' | 'binary';
export type LineBreakHandling = 'preserve' | 'remove' | 'unix' | 'windows';
export type HexCase = 'lowercase' | 'uppercase';

export interface HistoryItem {
  id: string;
  timestamp: number;
  mode: Mode;
  input: string;
  output: string;
  encodingType: EncodingType;
  characterEncoding: CharacterEncoding;
}

export interface Settings {
  encodingType: EncodingType;
  characterEncoding: CharacterEncoding;
  outputFormat: OutputFormat;
  autoSave: boolean;
  maxHistoryItems: number;
  debounceDelay: number;
  lineWrap: boolean;
  wrapLength: number;
  showCharCount: boolean;
  showByteCount: boolean;
  lineBreakHandling: LineBreakHandling;
  includePadding: boolean;
  hexCase: HexCase;
  customCharset: string;
  useCustomCharset: boolean;
}
