import React from 'react';
import { Sparkles, MessageSquare, Bot } from 'lucide-react';
import { Language } from '../../types';

interface GeminiFloatingLauncherProps {
  onClick: () => void;
  language: Language;
  isOpen: boolean;
}

export const GeminiFloatingLauncher: React.FC<GeminiFloatingLauncherProps> = ({
  onClick,
  language,
  isOpen,
}) => {
  if (isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 select-none group">
      {/* Speech bubble / Tooltip prompt */}
      <div className="hidden sm:flex items-center bg-slate-900 text-white text-xs px-3 py-1.5 shadow-lg border border-slate-700 rounded-none pointer-events-none transition-all group-hover:scale-105">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 mr-1.5 animate-pulse" />
        <span className="font-semibold">
          {language === 'mr' ? 'जेमिनी मनपा AI सहाय्यक' : 'BMC Gemini Civic AI'}
        </span>
      </div>

      {/* Main floating button */}
      <button
        onClick={onClick}
        className="relative bg-emerald-700 hover:bg-emerald-800 text-white p-3.5 shadow-xl border-2 border-emerald-500 rounded-none flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
        title={language === 'mr' ? 'जेमिनी नागरी सहाय्यक सुरू करा' : 'Open BMC Gemini AI Assistant'}
      >
        {/* Pulsing ring indicator */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border border-white"></span>
        </span>

        <Bot className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};
