import { Language } from '../types';

// Convert digits to clear spoken Marathi words
export function formatDigitsForMarathi(text: string): string {
  const digitMap: Record<string, string> = {
    '0': 'शून्य',
    '1': 'एक',
    '2': 'दोन',
    '3': 'तीन',
    '4': 'चार',
    '5': 'पाच',
    '6': 'सहा',
    '7': 'सात',
    '8': 'आठ',
    '9': 'नऊ',
    '-': ', ',
  };

  return text
    .split('')
    .map((ch) => digitMap[ch] || ch)
    .join(' ');
}

// Convert digits to clear spoken Hindi words
export function formatDigitsForHindi(text: string): string {
  const digitMap: Record<string, string> = {
    '0': 'शून्य',
    '1': 'एक',
    '2': 'दो',
    '3': 'तीन',
    '4': 'चार',
    '5': 'पाँच',
    '6': 'छह',
    '7': 'सात',
    '8': 'आठ',
    '9': 'नौ',
    '-': ', ',
  };

  return text
    .split('')
    .map((ch) => digitMap[ch] || ch)
    .join(' ');
}

// Format Complaint ID so TTS reads it back distinctly
export function getSpokenTicketId(ticketNo: string, language: Language): string {
  const cleanId = ticketNo.replace(/^BMC-?/i, '');
  
  if (language === 'mr') {
    const spokenDigits = formatDigitsForMarathi(cleanId);
    return `बी. एम. सी., ${spokenDigits}`;
  } else {
    const spaced = cleanId.split('').join(' ');
    return `B M C, ${spaced}`;
  }
}

// Generate the complete polite confirmation speech script
export function getPoliteAudioReceiptText(
  ticketNo: string,
  wardId: string,
  language: Language
): { speechText: string; spokenId: string } {
  const spokenId = getSpokenTicketId(ticketNo, language);

  if (language === 'mr') {
    return {
      speechText: `नमस्कार! आपली तक्रार बृहन्मुंबई महानगरपालिकेकडे यशस्वीरीत्या नोंदवली गेली आहे. आपला तक्रार क्रमांक आहे: ${spokenId}। वॉर्ड ${wardId} चे मनपा आपत्कालीन पथक यावर लवकरच कार्यवाही करेल. मुंबईच्या सुरक्षेत सहकार्य केल्याबद्दल धन्यवाद!`,
      spokenId,
    };
  } else {
    return {
      speechText: `Hello! Your complaint has been successfully registered with the Brihanmumbai Municipal Corporation. Your complaint ID is: ${spokenId}. The Ward ${wardId} municipal team will initiate action shortly. Thank you for helping keep Mumbai safe!`,
      spokenId,
    };
  }
}

// Audio player state and speaker
interface PlayAudioOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export function playComplaintConfirmationAudio(
  ticketNo: string,
  wardId: string,
  language: Language,
  options?: PlayAudioOptions
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Web Speech API is not supported in this environment.');
    return;
  }

  // Cancel any currently playing speech to avoid overlap
  window.speechSynthesis.cancel();

  const { speechText } = getPoliteAudioReceiptText(ticketNo, wardId, language);
  const utterance = new SpeechSynthesisUtterance(speechText);

  // Set language & voice matching
  if (language === 'mr') {
    utterance.lang = 'mr-IN';
  } else {
    utterance.lang = 'en-IN';
  }

  // Try to find the best available Indian voice
  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    if (language === 'mr') {
      const mrVoice = voices.find(
        (v) => v.lang.startsWith('mr') || v.name.toLowerCase().includes('marathi')
      );
      const hiVoice = voices.find(
        (v) => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi')
      );
      if (mrVoice) {
        utterance.voice = mrVoice;
      } else if (hiVoice) {
        utterance.voice = hiVoice;
      }
    } else {
      const inVoice = voices.find((v) => v.lang === 'en-IN' || v.lang.startsWith('en'));
      if (inVoice) utterance.voice = inVoice;
    }
  }

  // Polite, calm pacing suitable for civic confirmations
  utterance.rate = 0.88; // Slightly gentle pace for clear ticket ID readback
  utterance.pitch = 1.05; // Friendly, polite civic tone

  if (options?.onStart) {
    utterance.onstart = () => options.onStart!();
  }

  utterance.onend = () => {
    if (options?.onEnd) options.onEnd();
  };

  utterance.onerror = (e) => {
    console.error('SpeechSynthesis error:', e);
    if (options?.onError) options.onError(e);
    if (options?.onEnd) options.onEnd();
  };

  // Speak through Web Speech API
  window.speechSynthesis.speak(utterance);
}

export function stopComplaintAudio(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
