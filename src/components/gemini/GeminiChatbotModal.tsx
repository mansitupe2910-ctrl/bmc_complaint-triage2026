import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Copy,
  Check,
  RotateCcw,
  Maximize2,
  Minimize2,
  Layers,
  ChevronDown,
  Building2,
  FileEdit,
  Wrench,
  HeartHandshake,
} from 'lucide-react';
import { ChatMessage, ChatRoleType, ChatModelId, CHAT_ROLES, CHAT_MODELS } from '../../types/gemini';
import { Language } from '../../types';

interface GeminiChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  seniorMode?: boolean;
  highContrast?: boolean;
}

const ROLE_ICONS: Record<ChatRoleType, React.ElementType> = {
  civic_assistant: Building2,
  grievance_triage: FileEdit,
  engineering_advisor: Wrench,
  senior_guide: HeartHandshake,
};

export const GeminiChatbotModal: React.FC<GeminiChatbotModalProps> = ({
  isOpen,
  onClose,
  language,
  seniorMode = false,
  highContrast = false,
}) => {
  const [selectedRole, setSelectedRole] = useState<ChatRoleType>('civic_assistant');
  const [selectedModel, setSelectedModel] = useState<ChatModelId>('gemini-2.5-flash');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModelMenu, setShowModelMenu] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Load chat history from localStorage or set initial message
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('bmc_gemini_multiturn_chat');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return [
      {
        id: 'msg-initial',
        role: 'model',
        content:
          language === 'mr'
            ? 'नमस्कार! मी बृहन्मुंबई महानगरपालिकेचा (BMC) अधिकृत जेमिनी नागरी सहाय्यक आहे. मी आपणास वॉर्ड माहिती, तक्रार नोंदणी, पाणी व कर सेवा, आणि रस्ते नियमावलीत कशी मदत करू शकतो?'
            : 'Hello! I am the official BMC Gemini Civic AI Assistant. How can I assist you today with municipal ward navigation, complaint filing, water/tax queries, or engineering standards?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'gemini-2.5-flash',
        roleType: 'civic_assistant',
      },
    ];
  });

  // Save messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bmc_gemini_multiturn_chat', JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Setup Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'mr' ? 'mr-IN' : 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      speechRecognitionRef.current = recognition;
    }

    return () => {
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      window.speechSynthesis?.cancel();
    };
  }, [language]);

  const toggleListening = () => {
    if (!speechRecognitionRef.current) {
      alert(
        language === 'mr'
          ? 'तुमच्या ब्राऊझरमध्ये व्हॉइस इनपुट समर्थित नाही.'
          : 'Voice input is not supported in this browser.'
      );
      return;
    }

    if (isListening) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        speechRecognitionRef.current.lang = language === 'mr' ? 'mr-IN' : 'en-IN';
        speechRecognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown formatting for cleaner speech
    const cleanText = text.replace(/[*#>`_-]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'mr' ? 'mr-IN' : 'en-IN';
    utterance.rate = seniorMode ? 0.85 : 1.0;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    const confirmText =
      language === 'mr'
        ? 'तुम्हाला संपूर्ण संभाषण इतिहास हटवायचा आहे का?'
        : 'Do you want to clear your entire chat history?';
    if (window.confirm(confirmText)) {
      window.speechSynthesis?.cancel();
      setSpeakingId(null);
      const initial: ChatMessage[] = [
        {
          id: `msg-${Date.now()}`,
          role: 'model',
          content:
            language === 'mr'
              ? 'संभाषण इतिहास साफ केला आहे. मी आपणास कशी मदत करू शकतो?'
              : 'Chat history cleared. How can I assist you with BMC civic services?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: selectedModel,
          roleType: selectedRole,
        },
      ];
      setMessages(initial);
      localStorage.setItem('bmc_gemini_multiturn_chat', JSON.stringify(initial));
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend || inputText).trim();
    if (!content || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);

    try {
      // Prepare conversation payload for server API
      const payloadMessages = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages,
          role: selectedRole,
          model: selectedModel,
          language,
        }),
      });

      const data = await res.json();

      if (data.reply) {
        const assistantMessage: ChatMessage = {
          id: `model-${Date.now()}`,
          role: 'model',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: data.modelUsed || selectedModel,
          roleType: data.roleUsed || selectedRole,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Failed to generate response');
      }
    } catch (err: any) {
      console.error('Chat request error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content:
          language === 'mr'
            ? '⚠️ क्षमस्व, प्रतिसाद मिळवताना अडचण आली. कृपया पुन्हा प्रयत्न करा किंवा २४x७ हेल्पलाइन **१९१६** वर संपर्क साधा.'
            : '⚠️ Apologies, an issue occurred while fetching response. Please try again or reach the 24x7 BMC Helpline at **1916**.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
        roleType: selectedRole,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const currentRoleConfig = CHAT_ROLES.find((r) => r.id === selectedRole) || CHAT_ROLES[0];
  const currentModelConfig = CHAT_MODELS.find((m) => m.id === selectedModel) || CHAT_MODELS[0];
  const RoleIcon = ROLE_ICONS[selectedRole];

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 ${
        isExpanded ? 'p-0' : ''
      }`}
    >
      <div
        className={`w-full flex flex-col bg-white border border-slate-300 shadow-2xl transition-all duration-200 overflow-hidden ${
          isExpanded
            ? 'h-full max-w-full rounded-none'
            : 'max-w-4xl h-[90vh] max-h-[820px] rounded-none'
        } ${highContrast ? 'bg-slate-950 text-white border-slate-700' : 'bg-white text-slate-800'}`}
      >
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white px-4 py-3 border-b border-emerald-700 flex items-center justify-between gap-3 shrink-0 shadow-xs">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 bg-emerald-500 text-white flex items-center justify-center font-black text-xs shrink-0 rounded-none shadow-xs border border-emerald-400">
              <Sparkles className="w-4 h-4 text-amber-200" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="font-black text-sm sm:text-base tracking-tight text-white truncate">
                  {language === 'mr' ? 'BMC जेमिनी नागरी AI सहाय्यक' : 'BMC Gemini Civic AI Assistant'}
                </span>
                <span className="bg-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold px-1.5 py-0.5 border border-emerald-400/40 rounded-none hidden sm:inline">
                  Multi-Turn Chat
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/90 truncate">
                {language === 'mr'
                  ? '२४ मनपा वॉर्ड, तक्रार निवारण मसुदा, आपत्कालीन संपर्क व अभियांत्रिकी नियम'
                  : '24 Wards, Grievance Drafting, Emergency Helplines & Municipal Regulations'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Clear Chat Button */}
            <button
              onClick={handleClearHistory}
              title={language === 'mr' ? 'संभाषण साफ करा' : 'Clear Chat'}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-none transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Expand / Minimize Toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? 'Minimize' : 'Maximize'}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-none transition-colors cursor-pointer hidden sm:block"
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              title="Close"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-red-600/80 rounded-none transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Role & Model Control Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-3 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs">
          {/* Persona / Role Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-full">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-slate-600" />
              {language === 'mr' ? 'भूमिका (Role):' : 'Role:'}
            </span>
            {CHAT_ROLES.map((role) => {
              const Icon = ROLE_ICONS[role.id];
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`px-2.5 py-1 font-bold text-[11px] flex items-center gap-1.5 border rounded-none cursor-pointer transition-colors whitespace-nowrap shadow-2xs ${
                    isSelected
                      ? 'bg-emerald-700 text-white border-emerald-800'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                  title={language === 'mr' ? role.descMr : role.descEn}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{language === 'mr' ? role.titleMr.split(' ')[0] : role.badge}</span>
                </button>
              );
            })}
          </div>

          {/* Model Selector Dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowModelMenu(!showModelMenu)}
              className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-800 font-bold border border-slate-300 rounded-none flex items-center gap-1.5 cursor-pointer text-[11px] shadow-2xs"
            >
              <Bot className="w-3.5 h-3.5 text-emerald-700" />
              <span className="font-mono">{currentModelConfig.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {showModelMenu && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-slate-300 shadow-xl rounded-none z-30 p-1 text-left animate-in fade-in duration-100">
                <div className="p-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Select Gemini Model
                </div>
                {CHAT_MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedModel(m.id);
                      setShowModelMenu(false);
                    }}
                    className={`w-full text-left p-2 rounded-none cursor-pointer transition-colors flex flex-col gap-0.5 ${
                      selectedModel === m.id
                        ? 'bg-emerald-50 text-emerald-900 border-l-2 border-emerald-600'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs font-mono">{m.name}</span>
                      <span className="text-[10px] bg-slate-100 px-1 py-0.2 text-slate-600 font-medium">
                        {m.tag}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 leading-tight">{m.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Active Role Description Banner */}
        <div className="bg-emerald-50/70 border-b border-emerald-100 px-4 py-2 flex items-center justify-between text-xs text-emerald-900 shrink-0">
          <div className="flex items-center gap-2">
            <RoleIcon className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="font-bold">
              {language === 'mr' ? currentRoleConfig.titleMr : currentRoleConfig.titleEn}:
            </span>
            <span className="text-emerald-800 text-[11px]">
              {language === 'mr' ? currentRoleConfig.descMr : currentRoleConfig.descEn}
            </span>
          </div>
          <span className="font-mono text-[10px] text-emerald-700 bg-white px-1.5 py-0.5 border border-emerald-200 shrink-0">
            {currentModelConfig.name}
          </span>
        </div>

        {/* Multi-Turn Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-sm bg-slate-50/50">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const MsgRoleIcon = msg.roleType ? ROLE_ICONS[msg.roleType] : Bot;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[88%] sm:max-w-[80%] ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-8 h-8 rounded-none flex items-center justify-center shrink-0 shadow-xs border ${
                    isUser
                      ? 'bg-emerald-700 text-white border-emerald-800'
                      : 'bg-white text-emerald-700 border-slate-300'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <MsgRoleIcon className="w-4 h-4" />}
                </div>

                {/* Message Body */}
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 px-1">
                    <span className="font-bold">
                      {isUser
                        ? language === 'mr'
                          ? 'तुम्ही (Citizen)'
                          : 'You'
                        : language === 'mr'
                        ? 'BMC जेमिनी सहाय्यक'
                        : 'BMC Gemini Assistant'}
                    </span>
                    {!isUser && msg.modelUsed && (
                      <span className="bg-slate-200/80 text-slate-700 px-1.5 py-0.2 font-mono text-[9px]">
                        {msg.modelUsed}
                      </span>
                    )}
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-3.5 sm:p-4 rounded-none border shadow-xs text-left leading-relaxed ${
                      isUser
                        ? 'bg-emerald-700 text-white border-emerald-800'
                        : highContrast
                        ? 'bg-slate-900 text-white border-slate-700'
                        : 'bg-white text-slate-800 border-slate-200'
                    } ${seniorMode ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'}`}
                  >
                    {/* Render message with line breaks and markdown styling */}
                    <div className="whitespace-pre-wrap break-words font-sans space-y-1">
                      {msg.content}
                    </div>

                    {/* Assistant Message Action Toolbar */}
                    {!isUser && (
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-[11px] text-slate-500">
                        <div className="flex items-center gap-1.5">
                          {/* Text to Speech */}
                          <button
                            onClick={() => handleSpeak(msg.id, msg.content)}
                            title={speakingId === msg.id ? 'Stop voice' : 'Listen voice'}
                            className={`p-1 rounded-none hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer ${
                              speakingId === msg.id ? 'text-emerald-700 font-bold' : ''
                            }`}
                          >
                            {speakingId === msg.id ? (
                              <VolumeX className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5" />
                            )}
                            <span className="hidden xs:inline">
                              {speakingId === msg.id
                                ? language === 'mr'
                                  ? 'थांबवा'
                                  : 'Stop'
                                : language === 'mr'
                                ? 'ऐका'
                                : 'Speak'}
                            </span>
                          </button>

                          {/* Copy to clipboard */}
                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            title="Copy reply"
                            className="p-1 rounded-none hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span className="hidden xs:inline">
                              {copiedId === msg.id
                                ? language === 'mr'
                                  ? 'प्रत केली'
                                  : 'Copied'
                                : language === 'mr'
                                ? 'कॉपी'
                                : 'Copy'}
                            </span>
                          </button>
                        </div>

                        {/* BMC Official Jurisdiction Tag */}
                        <span className="text-[10px] text-slate-400 font-medium">
                          बृहन्मुंबई महानगरपालिका
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading Thinking Indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-[80%] mr-auto items-start">
              <div className="w-8 h-8 rounded-none bg-white text-emerald-700 border border-slate-300 flex items-center justify-center shrink-0 shadow-xs animate-pulse">
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="p-3.5 bg-white border border-slate-200 shadow-xs flex items-center gap-2.5 text-xs text-slate-600">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"></span>
                </div>
                <span className="font-medium">
                  {language === 'mr'
                    ? `जेमिनी ${selectedModel} प्रतिसाद तयार करत आहे...`
                    : `Gemini ${selectedModel} is formulating response...`}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Starter Prompts */}
        <div className="bg-slate-50 border-t border-slate-200 px-3 py-2 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
            <span className="text-slate-500 font-bold shrink-0">
              {language === 'mr' ? 'उदा. प्रश्न:' : 'Quick:'}
            </span>
            {(language === 'mr'
              ? currentRoleConfig.suggestedPromptsMr
              : currentRoleConfig.suggestedPromptsEn
            ).map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-300 hover:border-emerald-400 rounded-none whitespace-nowrap cursor-pointer transition-colors shadow-2xs font-medium text-left truncate max-w-[280px]"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input & Voice Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
          <div className="flex items-end gap-2">
            {/* Voice Input Microphone Button */}
            <button
              onClick={toggleListening}
              type="button"
              className={`p-2.5 border rounded-none cursor-pointer transition-all shadow-2xs shrink-0 flex items-center justify-center ${
                isListening
                  ? 'bg-red-600 text-white border-red-700 animate-pulse'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
              }`}
              title={
                isListening
                  ? language === 'mr'
                    ? 'व्हॉइस रेकॉर्डिंग सुरू आहे, थांबवण्यासाठी क्लिक करा'
                    : 'Listening... Click to stop'
                  : language === 'mr'
                  ? 'माईकद्वारे बोला (Voice Input)'
                  : 'Voice Input via Microphone'
              }
            >
              {isListening ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Multiline Input Text Area */}
            <div className="flex-1 relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isListening
                    ? language === 'mr'
                      ? 'आता बोला...'
                      : 'Listening now... speak clearly'
                    : language === 'mr'
                    ? 'आपला प्रश्न, तक्रार किंवा वॉर्ड माहिती विचारा... (Enter दाबा)'
                    : 'Ask about BMC wards, draft a complaint, check helplines... (Press Enter)'
                }
                rows={1}
                className={`w-full p-2.5 bg-slate-50 border border-slate-300 rounded-none text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-emerald-600 resize-none transition-colors ${
                  seniorMode ? 'text-base' : ''
                }`}
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
            </div>

            {/* Send Button */}
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isLoading}
              className={`px-4 py-2.5 rounded-none font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0 ${
                inputText.trim() && !isLoading
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white border border-emerald-800'
                  : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'mr' ? 'पाठवा' : 'Send'}</span>
            </button>
          </div>

          {/* Quick Notice footer */}
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>
              {language === 'mr'
                ? 'अधिकृत मनपा आपत्कालीन हेल्पलाइन: १९१६ | आपत्ती कक्ष: ०२२-२२६९४७२५'
                : 'Official BMC Emergency Helpline: 1916 | Disaster Room: 022-22694725'}
            </span>
            <span className="font-mono text-[10px]">
              Powered by @google/genai
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
