
export enum Language {
  VI = 'VI',
  EN = 'EN',
}

export enum VoiceGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum AgeGroup {
  CHILD = 'CHILD',
  ADULT = 'ADULT',
  SENIOR = 'SENIOR',
}

export enum RegionalAccent {
  NORTH = 'NORTH',   // Giọng Bắc / US
  CENTRAL = 'CENTRAL', // Giọng Trung / UK
  SOUTH = 'SOUTH',   // Giọng Nam / AUS
}

export interface VoiceProfile {
  id: string;
  name: string; // Keeps backward compatibility, can hold edge voice name
  edgeVoice: string;
  edgePitch: string;
  edgeRate: string;
  displayName: string;
  gender: VoiceGender;
  ageGroup: AgeGroup;
  language: Language;
  description: string;
  tone: string;
}

export interface AudioChunk {
  id: string;
  text: string;
  buffer: AudioBuffer | null;
  rawBase64: string | null; // Store raw data for file download
  status: 'pending' | 'generating' | 'ready' | 'error';
}

export interface ProcessingState {
  isGenerating: boolean;
  isPlaying: boolean;
  currentChunkIndex: number;
  totalChunks: number;
  processedChunks: number;
  isComplete: boolean; // New flag to indicate full process is done
}
