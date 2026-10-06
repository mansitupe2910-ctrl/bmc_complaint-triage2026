import React, { useState, useRef, useCallback } from 'react';
import { CivicPhotoDisplay } from '../CivicPhotoDisplay';
import { Language } from '../../types';
import { SlidersHorizontal, Sparkles } from 'lucide-react';

interface BeforeAfterSplitSliderProps {
  beforePhotoUrl: string;
  afterPhotoUrl: string;
  beforeTimestamp?: string;
  afterTimestamp?: string;
  engineerId?: string;
  language: Language;
}

export const BeforeAfterSplitSlider: React.FC<BeforeAfterSplitSliderProps> = ({
  beforePhotoUrl,
  afterPhotoUrl,
  beforeTimestamp,
  afterTimestamp,
  engineerId = 'E101',
  language,
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clamped = Math.max(0, Math.min(rect.width, x));
    const percentage = (clamped / rect.width) * 100;
    setSliderPos(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <div className="space-y-2 select-none">
      {/* Slider Banner Info */}
      <div className="flex items-center justify-between text-xs px-1">
        <div className="flex items-center gap-1.5 font-bold text-rose-700">
          <span className="w-2.5 h-2.5 bg-rose-600 rounded-none inline-block"></span>
          <span>{language === 'mr' ? '१. आधी (BEFORE - Citizen)' : 'BEFORE (Citizen Report)'}</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono font-semibold">
          <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
          <span>{language === 'mr' ? 'हँडल डावीकडे-उजवीकडे सरकवा (Drag)' : 'Drag handle to compare'}</span>
        </div>

        <div className="flex items-center gap-1.5 font-bold text-emerald-800">
          <span className="w-2.5 h-2.5 bg-emerald-600 rounded-none inline-block"></span>
          <span>{language === 'mr' ? `२. नंतर (AFTER - Engineer ${engineerId})` : `AFTER (Engineer ${engineerId})`}</span>
        </div>
      </div>

      {/* Split Slider Interactive Box */}
      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full aspect-16/10 border-2 border-slate-800 bg-slate-900 overflow-hidden cursor-ew-resize rounded-none shadow-md"
      >
        {/* Layer 1: After Photo (Full Width Base Layer) */}
        <div className="absolute inset-0 w-full h-full">
          <CivicPhotoDisplay
            type={afterPhotoUrl}
            isProofOfWorkRepair={true}
            className="w-full h-full object-cover"
          />
          {/* Label Badge Top-Right */}
          <div className="absolute top-2 right-2 bg-emerald-800/90 text-white text-[10px] font-bold px-2 py-0.5 border border-emerald-400 font-mono">
            AFTER: {engineerId} {afterTimestamp ? `· ${afterTimestamp}` : ''}
          </div>
        </div>

        {/* Layer 2: Before Photo (Clipped by slider position) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-white shadow-2xl"
          style={{ width: `${sliderPos}%` }}
        >
          <div
            className="absolute inset-0 h-full"
            style={{
              width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
              minWidth: '100%',
            }}
          >
            <CivicPhotoDisplay
              type={beforePhotoUrl}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Label Badge Top-Left */}
          <div className="absolute top-2 left-2 bg-rose-800/90 text-white text-[10px] font-bold px-2 py-0.5 border border-rose-400 font-mono">
            BEFORE {beforeTimestamp ? `· ${beforeTimestamp}` : ''}
          </div>
        </div>

        {/* Central Drag Handle Line */}
        <div
          className="absolute inset-y-0 w-0.5 bg-white shadow-lg pointer-events-none flex items-center justify-center"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="w-8 h-8 bg-slate-900 border-2 border-white text-white rounded-none flex items-center justify-center font-bold text-xs shadow-xl transform -translate-x-1/2">
            ↔
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono px-1">
        <span>{sliderPos.toFixed(0)}% {language === 'mr' ? 'आधीचे दृश्य' : 'Before view'}</span>
        <span>{(100 - sliderPos).toFixed(0)}% {language === 'mr' ? 'दुरुस्ती दृश्य' : 'Repaired view'}</span>
      </div>
    </div>
  );
};
