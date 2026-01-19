import { EncodingType, OutputFormat, HexCase, LineBreakHandling } from '../types';

export function encodeToBase64(
  input: string,
  encodingType: EncodingType = 'standard',
  customCharset?: string,
  lineBreakHandling: LineBreakHandling = 'preserve',
  includePadding: boolean = true
): string {
  try {
    let processedInput = input;

    switch (lineBreakHandling) {
      case 'remove':
        processedInput = input.replace(/[\r\n]/g, '');
        break;
      case 'unix':
        processedInput = input.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        break;
      case 'windows':
        processedInput = input.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, '\r\n');
        break;
      case 'preserve':
      default:
        processedInput = input;
    }

    let encoded = btoa(unescape(encodeURIComponent(processedInput)));

    if (encodingType === 'url-safe') {
      encoded = encoded
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

      if (!includePadding) {
        encoded = encoded.replace(/=+$/, '');
      }
    } else if (encodingType === 'custom' && customCharset) {
      if (customCharset.length >= 64) {
        const standardChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        encoded = encoded.split('').map(char => {
          const index = standardChars.indexOf(char);
          return index >= 0 ? customCharset[index] : char;
        }).join('');
      }
    } else if (!includePadding) {
      encoded = encoded.replace(/=+$/, '');
    }

    return encoded;
  } catch (error) {
    throw new Error('Failed to encode: Invalid input');
  }
}

export function decodeFromBase64(
  input: string,
  encodingType: EncodingType = 'standard',
  customCharset?: string
): string {
  try {
    let base64 = input;

    if (encodingType === 'custom' && customCharset && customCharset.length >= 64) {
      const standardChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
      base64 = base64.split('').map(char => {
        const index = customCharset.indexOf(char);
        return index >= 0 ? standardChars[index] : char;
      }).join('');
    }

    if (encodingType === 'url-safe') {
      base64 = base64
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    }

    const pad = base64.length % 4;
    if (pad) {
      base64 += '='.repeat(4 - pad);
    }

    return decodeURIComponent(escape(atob(base64)));
  } catch (error) {
    throw new Error('Failed to decode: Invalid base64 string');
  }
}

export function formatOutput(
  text: string,
  format: OutputFormat,
  hexCase: HexCase = 'lowercase',
  lineWrap: boolean = false,
  wrapLength: number = 76
): string {
  let result: string;

  switch (format) {
    case 'hex':
      result = Array.from(text)
        .map(char => {
          const hex = char.charCodeAt(0).toString(16).padStart(2, '0');
          return hexCase === 'uppercase' ? hex.toUpperCase() : hex;
        })
        .join(' ');
      break;

    case 'binary':
      result = Array.from(text)
        .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
        .join(' ');
      break;

    case 'text':
    default:
      result = text;
  }

  if (lineWrap && wrapLength > 0) {
    const chunks: string[] = [];
    for (let i = 0; i < result.length; i += wrapLength) {
      chunks.push(result.substring(i, i + wrapLength));
    }
    result = chunks.join('\n');
  }

  return result;
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to read file as text'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export function getByteCount(text: string): number {
  return new Blob([text]).size;
}
