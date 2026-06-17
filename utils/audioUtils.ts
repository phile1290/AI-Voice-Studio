/**
 * Decodes base64 string to a byte array.
 */
function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Manual PCM Decoder for raw audio data from Gemini (16-bit, 24kHz, Mono).
 */
function decodePCM16(data: Uint8Array, ctx: AudioContext): AudioBuffer {
  const inputInt16 = new Int16Array(data.buffer);
  const numChannels = 1;
  const sampleRate = 24000; // Gemini 2.5 Flash TTS standard output
  const length = inputInt16.length;
  
  const audioBuffer = ctx.createBuffer(numChannels, length, sampleRate);
  const channelData = audioBuffer.getChannelData(0);
  
  for (let i = 0; i < length; i++) {
    // Normalize 16-bit integer (-32768 to 32767) to float (-1.0 to 1.0)
    channelData[i] = inputInt16[i] / 32768.0;
  }
  
  return audioBuffer;
}

/**
 * Robust Audio Decoder.
 * Tries native decode first (for WAV/MP3 containers). 
 * Falls back to raw PCM decoding if native fails.
 */
export async function decodeAudioData(
  base64Data: string,
  audioContext: AudioContext
): Promise<AudioBuffer> {
  const byteArray = decodeBase64(base64Data);
  
  try {
    // Copy buffer because decodeAudioData detaches it
    const bufferForNative = byteArray.buffer.slice(0);
    return await audioContext.decodeAudioData(bufferForNative);
  } catch (nativeError) {
    console.warn("Native decode failed, attempting manual PCM decode...", nativeError);
    // Fallback to Raw PCM decoding
    return decodePCM16(byteArray, audioContext);
  }
}

/**
 * Writes a WAV string to the buffer
 */
function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Encodes AudioBuffers into a WAV Blob.
 */
export function audioBuffersToWav(buffers: AudioBuffer[]): Blob {
  // 1. Calculate total length
  let totalLength = 0;
  for (const b of buffers) totalLength += b.length;

  // 2. Create result buffer (24kHz, 1 channel, 16-bit)
  // WAV Header is 44 bytes
  const buffer = new ArrayBuffer(44 + totalLength * 2);
  const view = new DataView(buffer);

  // 3. Write WAV Header
  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + totalLength * 2, true);
  writeString(view, 8, 'WAVE');
  
  // fmt sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 = PCM)
  view.setUint16(22, 1, true); // NumChannels (Mono)
  view.setUint32(24, 24000, true); // SampleRate
  view.setUint32(28, 24000 * 2, true); // ByteRate (SampleRate * NumChannels * BitsPerSample/8)
  view.setUint16(32, 2, true); // BlockAlign (NumChannels * BitsPerSample/8)
  view.setUint16(34, 16, true); // BitsPerSample

  // data sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, totalLength * 2, true);

  // 4. Write PCM Data
  let offset = 44;
  for (const b of buffers) {
    const data = b.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      // Float to Int16
      let s = Math.max(-1, Math.min(1, data[i]));
      s = s < 0 ? s * 0x8000 : s * 0x7FFF;
      view.setInt16(offset, s, true);
      offset += 2;
    }
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

/**
 * Triggers a browser download for a Blob.
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Splits long text into manageable chunks.
 */
export const splitTextIntoChunks = (text: string, maxLength: number): string[] => {
  if (text.length <= maxLength) return [text];
  const chunks: string[] = [];
  let currentChunk = '';
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxLength) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }
      if (sentence.length > maxLength) {
        let remaining = sentence;
        while (remaining.length > 0) {
           const slice = remaining.slice(0, maxLength);
           chunks.push(slice.trim());
           remaining = remaining.slice(maxLength);
        }
      } else {
        currentChunk = sentence;
      }
    } else {
      currentChunk += sentence;
    }
  }
  if (currentChunk) chunks.push(currentChunk.trim());
  return chunks;
};
