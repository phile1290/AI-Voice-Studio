
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateSpeechFromText = async (
  text: string, 
  edgeVoice: string, 
  edgePitch: string,
  edgeRate: string,
  speed: string = "Normal speed",
  maxRetries = 4,
  onWait?: (msg: string) => void
): Promise<string> => {
  let lastError;
  let currentRetries = maxRetries;

  for (let attempt = 1; attempt <= currentRetries; attempt++) {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };

      const response = await fetch('/api/gemini/tts', {
        method: 'POST',
        headers,
        body: JSON.stringify({ text, edgeVoice, edgePitch, edgeRate, speed })
      });

      if (!response.ok) {
         const errData = await response.json().catch(() => null);
         const errorMsg = errData?.error || response.statusText || "Server error";
         const customError: any = new Error(errorMsg);
         if (errData?.retryDelay && errData.retryDelay > 0) {
            customError.retryDelay = errData.retryDelay;
         }
         throw customError;
      }

      const data = await response.json();
      if (!data.audioBase64) {
        throw new Error("No audio returned from server");
      }

      return data.audioBase64;

    } catch (error: any) {
      console.warn(`TTS Attempt ${attempt} failed:`, error.message);
      lastError = error;
      
      if (attempt < currentRetries) {
        let waitTime = 1000 * attempt;
        if (error.retryDelay > 0) {
            // Wait the requested delay amount (e.g. 47 seconds) plus a 2s cushion.
            // Cap at 65 seconds so we do not hang indefinitely.
            waitTime = Math.min(error.retryDelay * 1000 + 2000, 65000);
            
            // Allow one extra retry if we hit a quota delay, up to a hard cap of 8 total attempts
            if (currentRetries < 8) currentRetries++;
        }
        const waitSeconds = Math.round(waitTime / 1000);
        console.log(`Waiting ${waitSeconds}s before next attempt...`);
        if (onWait) onWait(`Hệ thống đang bận. Đang đợi ${waitSeconds}s...`);
        await delay(waitTime);
        if (onWait) onWait(''); // Clear message after wait
      }
    }
  }

  const errorMessage = lastError?.message || "Unknown API Error";
  throw new Error(`API Error: ${errorMessage}`);
};