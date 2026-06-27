
import React, { useState, useEffect, useRef } from 'react';
import { Bot, Play, Square, Loader2, Sparkles, FileText, Info, CheckCircle2, Download, RotateCcw, Music, AlertCircle, MapPin, User, Baby, Armchair } from 'lucide-react';
import { VoiceProfile, AudioChunk, ProcessingState, RegionalAccent, AgeGroup, Language } from './types';
import { VOICE_PROFILES, MAX_CHUNK_LENGTH, ACCENT_PROMPTS } from './constants';
import { splitTextIntoChunks, decodeAudioData, audioBuffersToWav, downloadBlob } from './utils/audioUtils';
import { generateSpeechFromText } from './services/geminiService';
import VoiceCard from './components/VoiceCard';
import AudioVisualizer from './components/AudioVisualizer';

const App: React.FC = () => {
  // --- State ---
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const [inputText, setInputText] = useState<string>('Xin chào! Đây là kiến trúc Generative AI chuyển đổi văn bản thành giọng nói. Tôi có thể đọc các đoạn văn dài một cách trôi chảy.');
  
  // Tab State
  const [activeTab, setActiveTab] = useState<AgeGroup>(AgeGroup.CHILD);
  const [activeLanguage, setActiveLanguage] = useState<Language>(Language.VI);
  const [playbackSpeed, setPlaybackSpeed] = useState<string>("Normal speed");

  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setRecordedAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setErrorMessage("Không thể truy cập micro. Vui lòng cấp quyền.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };
  
  const [selectedProfile, setSelectedProfile] = useState<VoiceProfile>(VOICE_PROFILES[0]); 
  const [selectedAccent, setSelectedAccent] = useState<RegionalAccent>(RegionalAccent.NORTH); // Default North
  const [audioQueue, setAudioQueue] = useState<AudioChunk[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [waitMessage, setWaitMessage] = useState<string | null>(null);
        
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isGenerating: false,
    isPlaying: false,
    currentChunkIndex: -1,
    totalChunks: 0,
    processedChunks: 0,
    isComplete: false,
  });

  // --- Refs ---
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioQueueRef = useRef<AudioChunk[]>([]);

  // --- Initialization ---
  useEffect(() => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioContextRef.current = new AudioContextClass();
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  useEffect(() => {
    audioQueueRef.current = audioQueue;
  }, [audioQueue]);

  // Filter Profiles based on Tab and Language
  const filteredProfiles = VOICE_PROFILES.filter(p => p.ageGroup === activeTab && (p.language === activeLanguage || (activeLanguage === Language.VI && p.language === undefined)));

  // If selectedProfile is not in filteredProfiles, update it
  useEffect(() => {
    if (!filteredProfiles.some(p => p.id === selectedProfile.id) && filteredProfiles.length > 0) {
      setSelectedProfile(filteredProfiles[0]);
    }
  }, [activeLanguage, activeTab, filteredProfiles, selectedProfile]);

  // --- Core Logic: Playback Engine ---
  const playSequence = async (startIndex: number) => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    if (startIndex >= audioQueueRef.current.length) {
      setProcessingState(prev => ({ ...prev, isPlaying: false, currentChunkIndex: -1 }));
      return;
    }

    const chunk = audioQueueRef.current[startIndex];

    if (!chunk.buffer) {
      console.warn(`Chunk ${startIndex} missing buffer, stopping.`);
      setProcessingState(prev => ({ ...prev, isPlaying: false }));
      return;
    }

    setProcessingState(prev => ({ ...prev, isPlaying: true, currentChunkIndex: startIndex }));

    const source = ctx.createBufferSource();
    source.buffer = chunk.buffer;

    // Evaluate base persona speed multiplier
    let rateMult = 1.0;
    const edgeRateStr = selectedProfile.edgeRate || "+0%";
    const parsedRate = parseInt(edgeRateStr.replace('%', ''));
    if (!isNaN(parsedRate)) {
        rateMult = 1.0 + (parsedRate / 100);
    }

    // Apply selected playback speed to the Web Audio Node
    if (playbackSpeed.includes('Chậm') || playbackSpeed.includes('Slow')) {
       rateMult *= 0.85;
    } else if (playbackSpeed.includes('Nhanh') || playbackSpeed.includes('Fast')) {
       rateMult *= 1.25;
    }
    
    source.playbackRate.value = Math.max(0.5, Math.min(2.0, rateMult));

    source.connect(ctx.destination);

    source.onended = () => {
      playSequence(startIndex + 1);
    };

    currentSourceRef.current = source;
    source.start(0);
  };

  const stopPlayback = () => {
    if (currentSourceRef.current) {
      try {
        currentSourceRef.current.stop();
        currentSourceRef.current.disconnect();
      } catch (e) { }
      currentSourceRef.current = null;
    }
    setProcessingState(prev => ({ ...prev, isPlaying: false, currentChunkIndex: -1 }));
  };

  const handlePreview = async () => {
    stopPlayback();
    if (audioContextRef.current?.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    playSequence(0);
  };

  const handleDownload = () => {
    const validBuffers = audioQueue
      .filter(c => c.buffer !== null)
      .map(c => c.buffer!);

    if (validBuffers.length === 0) {
        setErrorMessage("Không có dữ liệu âm thanh để tải xuống.");
        return;
    }
    
    try {
      const blob = audioBuffersToWav(validBuffers);
      
      // Logic tạo tên file: 2 từ đầu văn bản + Tên nhân vật
      const words = inputText.trim().split(/\s+/);
      const shortText = words.slice(0, 2).join('_');
      // Xử lý tên nhân vật (thay khoảng trắng bằng gạch dưới cho an toàn)
      const charName = selectedProfile.displayName.replace(/\s+/g, '_');
      
      const fileName = `${shortText}_${charName}.wav`;

      downloadBlob(blob, fileName);
    } catch (error) {
      console.error("WAV Encoding failed", error);
      setErrorMessage("Lỗi khi tạo file tải xuống.");
    }
  };

  // --- Core Logic: Generation Engine ---
  const handleGenerate = async () => {
    if (!inputText.trim()) return;

    if (audioContextRef.current?.state === 'suspended') {
      try {
        await audioContextRef.current.resume();
      } catch (e) {
        console.error("Resume context failed", e);
      }
    }

    setErrorMessage(null);
    stopPlayback();

    try {
        const textChunks = splitTextIntoChunks(inputText, MAX_CHUNK_LENGTH);
        
        const initialQueue: AudioChunk[] = textChunks.map((text, idx) => ({
            id: `chunk-${Date.now()}-${idx}`,
            text,
            buffer: null,
            rawBase64: null,
            status: 'pending'
        }));

        setAudioQueue(initialQueue);
        setProcessingState({
            isGenerating: true,
            isPlaying: false,
            currentChunkIndex: -1,
            totalChunks: initialQueue.length,
            processedChunks: 0,
            isComplete: false
        });

        for (let i = 0; i < initialQueue.length; i++) {
            try {
                setAudioQueue(prev => {
                    const newQ = [...prev];
                    newQ[i] = { ...newQ[i], status: 'generating' };
                    return newQ;
                });

                let base64Audio = "";
                base64Audio = await generateSpeechFromText(
                    initialQueue[i].text, 
                    selectedProfile.edgeVoice,
                    selectedProfile.edgePitch, 
                    selectedProfile.edgeRate,
                    playbackSpeed,
                    4,
                    setWaitMessage
                );
                
                if (audioContextRef.current) {
                    const audioBuffer = await decodeAudioData(base64Audio, audioContextRef.current);
                    
                    setAudioQueue(prev => {
                        const newQ = [...prev];
                        newQ[i] = { 
                            ...newQ[i], 
                            status: 'ready', 
                            buffer: audioBuffer, 
                            rawBase64: base64Audio 
                        };
                        return newQ;
                    });
                }

                setProcessingState(prev => ({ ...prev, processedChunks: prev.processedChunks + 1 }));

            } catch (err: any) {
                setAudioQueue(prev => {
                    const newQ = [...prev];
                    newQ[i] = { ...newQ[i], status: 'error' };
                    return newQ;
                });
                
                throw new Error(err.message || `Lỗi không xác định tại đoạn ${i + 1}`);
            }
        }

        setProcessingState(prev => ({ ...prev, isGenerating: false, isComplete: true }));
        setWaitMessage(null);

    } catch (error: any) {
        let msg = error.message || "Đã có lỗi xảy ra. Hãy thử lại.";
        
        if (msg.includes("Lỗi hệ thống:")) {
             // already have prefix
        } else if (!msg.includes("Vui lòng") && !msg.includes("giới hạn")) {
             msg = "Lỗi hệ thống: " + msg;
        }
        setErrorMessage(msg);
        setWaitMessage(null);
        setProcessingState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  // --- RENDER: Main App ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-40 relative font-sans">
      
      {/* Onboarding */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/90 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95">
            <div className="bg-indigo-600 p-6 flex items-center gap-3">
              <Info className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">Hướng Dẫn Sử Dụng</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4 text-sm text-slate-300">
                <p>1. Nhập văn bản (hệ thống tự chia đoạn).</p>
                <p>2. Chọn Vùng Miền (Bắc/Trung/Nam).</p>
                <p>3. Chọn Tab độ tuổi (Trẻ em/Người lớn/Cao tuổi) và chọn Nhân vật.</p>
                <p>4. Bấm Tạo Giọng và đợi xử lý xong để nghe/tải về.</p>
              </div>
              <button onClick={() => setShowOnboarding(false)} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Đã Hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-slate-900/50 border-b border-slate-800 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 pr-2">
            <div className="p-1.5 sm:p-2 bg-indigo-600 rounded-lg flex-shrink-0">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-bold text-white truncate">GenAI Voice</h1>
              <p className="text-[10px] sm:text-xs text-slate-400 truncate">Ứng dụng được phát triển bởi thầy giáo Lê Văn Phi</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
             <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
                <button 
                  onClick={() => setActiveLanguage(Language.VI)} 
                  className={`px-3 py-1 text-xs font-bold rounded ${activeLanguage === Language.VI ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >VI</button>
                <button 
                  onClick={() => setActiveLanguage(Language.EN)} 
                  className={`px-3 py-1 text-xs font-bold rounded ${activeLanguage === Language.EN ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >EN</button>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`max-w-5xl mx-auto px-6 py-8 space-y-8 transition-opacity duration-500 ${showOnboarding ? 'opacity-30 pointer-events-none blur-sm' : 'opacity-100'}`}>
        
        {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl flex gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">{errorMessage}</p>
                <button onClick={() => setErrorMessage(null)} className="text-xs underline">Đóng</button>
            </div>
        )}

        <section className="space-y-4">
          <div className="flex items-center justify-between">
             <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" /> Văn Bản Nguồn
             </h2>
             <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                {inputText.length} ký tự / {Math.ceil(inputText.length / MAX_CHUNK_LENGTH)} đoạn
             </span>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-40 bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none resize-y font-medium"
            placeholder="Nhập văn bản..."
          />
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-end flex-wrap gap-4">
              <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                {[
                  { id: AgeGroup.CHILD, label: activeLanguage === Language.VI ? 'Trẻ Em' : 'Child', icon: <Baby className="w-4 h-4" /> },
                  { id: AgeGroup.ADULT, label: activeLanguage === Language.VI ? 'Người Lớn' : 'Adult', icon: <User className="w-4 h-4" /> },
                  { id: AgeGroup.SENIOR, label: activeLanguage === Language.VI ? 'Cao Tuổi' : 'Senior', icon: <Armchair className="w-4 h-4" /> },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeTab === tab.id 
                        ? 'bg-slate-700 text-white shadow' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>
          </div>
          
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {filteredProfiles.map((profile) => (
                <VoiceCard
                  key={profile.id}
                  profile={profile}
                  isSelected={selectedProfile.id === profile.id}
                  onSelect={setSelectedProfile}
                />
              ))}
            </div>
        </section>

        <section className="fixed bottom-0 left-0 right-0 z-20 p-2 sm:p-4 pointer-events-none">
          <div className="max-w-4xl mx-auto bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl p-4 sm:p-6 shadow-2xl pointer-events-auto space-y-3 sm:space-y-3">
             {!processingState.isGenerating && !processingState.isComplete && (
               <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium uppercase tracking-wider">
                    <MapPin className="w-3 h-3" /> {activeLanguage === Language.VI ? 'Chọn Vùng Miền' : 'Select Accent'}
                  </div>
                  <div className="flex p-1 bg-slate-800 rounded-lg border border-slate-700 w-full sm:w-auto">
                    {[
                      { id: RegionalAccent.NORTH, label: activeLanguage === Language.VI ? 'Giọng Bắc' : 'US English' },
                      { id: RegionalAccent.CENTRAL, label: activeLanguage === Language.VI ? 'Giọng Trung' : 'UK English' },
                      { id: RegionalAccent.SOUTH, label: activeLanguage === Language.VI ? 'Giọng Nam' : 'Australian' }
                    ].map((accent) => (
                      <button
                        key={accent.id}
                        onClick={() => setSelectedAccent(accent.id)}
                        className={`flex-1 sm:flex-none px-3 sm:px-3 py-1.5 sm:py-1.5 rounded-md text-xs sm:text-xs font-bold transition-all whitespace-nowrap ${
                          selectedAccent === accent.id
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                        }`}
                      >
                        {accent.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium uppercase tracking-wider">
                    Tốc độ đọc
                  </div>
                  <div className="flex p-1 bg-slate-800 rounded-lg border border-slate-700 w-full sm:w-auto">
                     {[
                       { id: 'Slow speed', label: 'Chậm' },
                       { id: 'Normal speed', label: 'Bình thường' },
                       { id: 'Fast speed', label: 'Nhanh' }
                     ].map(speed => (
                       <button
                         key={speed.id}
                         onClick={() => setPlaybackSpeed(speed.id)}
                         className={`flex-1 sm:flex-none px-3 sm:px-3 py-1.5 sm:py-1.5 rounded-md text-xs sm:text-xs font-bold transition-all whitespace-nowrap ${
                           playbackSpeed === speed.id
                             ? 'bg-indigo-600 text-white'
                             : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                         }`}
                       >
                         {speed.label}
                       </button>
                     ))}
                  </div>
                </div>
              </div>
             )}

            {(processingState.isGenerating || processingState.processedChunks > 0) && !processingState.isComplete && (
                <div className="mb-5">
                    <div className="flex justify-between text-xs mb-2 text-indigo-300 font-medium">
                        <span>Đang xử lý... ({processingState.processedChunks} / {processingState.totalChunks})</span>
                        <span className="animate-pulse">Giữ nguyên màn hình</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                        <div className="bg-indigo-500 h-full transition-all duration-500 ease-out rounded-full" style={{ width: `${processingState.totalChunks > 0 ? (processingState.processedChunks / processingState.totalChunks) * 100 : 0}%` }}></div>
                    </div>
                    {waitMessage && (
                        <div className="mt-2 text-xs text-amber-400 animate-pulse text-center font-medium">
                            {waitMessage}
                        </div>
                    )}
                </div>
            )}

            <div className="flex flex-col md:flex-row items-center gap-3 sm:gap-6">
              {!processingState.isComplete && !processingState.isGenerating && (
                  <button onClick={handleGenerate} className="w-full md:w-auto bg-indigo-600 text-white px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-indigo-500 transition-all hover:scale-105 shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 text-sm sm:text-base">
                    <Sparkles className="w-5 h-5" /> Bắt Đầu Tạo Giọng
                  </button>
              )}

              {processingState.isGenerating && (
                  <button disabled className="w-full md:w-auto bg-slate-700 text-slate-300 px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 cursor-wait">
                    <Loader2 className="w-5 h-5 animate-spin" /> Đang Xử Lý...
                  </button>
              )}

              {processingState.isComplete && (
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button onClick={processingState.isPlaying ? stopPlayback : handlePreview} className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 min-w-[140px] ${processingState.isPlaying ? 'bg-red-500/10 text-red-500 border border-red-500/50' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}>
                        {processingState.isPlaying ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                        {processingState.isPlaying ? 'Dừng' : 'Nghe Thử'}
                    </button>
                    <button onClick={handleDownload} className="flex-1 md:flex-none px-6 py-3 bg-slate-800 text-indigo-400 rounded-xl font-bold hover:bg-slate-700 transition-all flex items-center justify-center gap-2 border border-slate-600">
                        <Download className="w-5 h-5" /> Tải WAV
                    </button>
                    <button onClick={() => { stopPlayback(); setProcessingState(prev => ({ ...prev, isComplete: false, processedChunks: 0 })); setAudioQueue([]); }} className="p-3 bg-slate-800 text-slate-400 rounded-xl hover:bg-slate-700 border border-slate-700">
                        <RotateCcw className="w-5 h-5" />
                    </button>
                </div>
              )}

              <div className="flex-1 w-full flex items-center justify-center md:justify-end gap-4 min-h-[40px]">
                  {processingState.isPlaying ? (
                      <div className="flex items-center gap-4 w-full justify-end">
                          <AudioVisualizer isPlaying={true} />
                      </div>
                  ) : (
                      <div className="hidden md:flex items-center text-slate-500 gap-2 text-sm">
                          {processingState.isComplete ? (
                              <span className="text-emerald-500/80 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Xử lý hoàn tất.</span>
                          ) : ( !processingState.isGenerating && <span className="flex items-center gap-2"><Music className="w-4 h-4" /> Sẵn sàng.</span> )}
                      </div>
                  )}
              </div>
            </div>
          </div>
        </section>
      </main>

          </div>
  );
};

export default App;
