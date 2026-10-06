import React from 'react';

interface CivicPhotoDisplayProps {
  type: string;
  isScanning?: boolean;
  boundingBox?: { x: number; y: number; width: number; height: number; label: string };
  confidence?: number;
  className?: string;
  isProofOfWorkRepair?: boolean;
}

export const CivicPhotoDisplay: React.FC<CivicPhotoDisplayProps> = ({
  type,
  isScanning = false,
  boundingBox,
  className = '',
  isProofOfWorkRepair = false
}) => {
  const isCustomUpload = type.startsWith('data:') || type.startsWith('blob:') || type.startsWith('http');

  return (
    <div className={`relative overflow-hidden bg-slate-900 rounded-none select-none flex items-center justify-center ${className}`}>
      {isCustomUpload ? (
        <img
          src={type}
          alt="Civic hazard evidence"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      ) : (
        /* Authentic Civic Photo Graphic */
        <svg
          viewBox="0 0 400 260"
          className="w-full h-full object-cover"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="roadBase" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#374151" />
              <stop offset="100%" stopColor="#1f2937" />
            </linearGradient>
            <linearGradient id="waterFlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e40af" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="potholeDepth" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#111827" />
              <stop offset="100%" stopColor="#030712" />
            </linearGradient>
          </defs>

          {/* Scene: Repaired Road (Proof of Work) */}
          {isProofOfWorkRepair || type === 'repair-asphalt-compaction' ? (
            <g>
              <rect width="400" height="260" fill="#1f2937" />
              <rect x="0" y="0" width="400" height="32" fill="#4b5563" />
              <line x1="0" y1="32" x2="400" y2="32" stroke="#9ca3af" strokeWidth="2" />
              {/* Crisp white road lane marking */}
              <line x1="0" y1="130" x2="400" y2="130" stroke="#f9fafb" strokeWidth="5" strokeDasharray="30, 20" />
              {/* Freshly compacted bituminous asphalt patch */}
              <path
                d="M 100,60 Q 200,50 300,65 Q 320,130 290,200 Q 180,210 110,190 Q 80,120 100,60 Z"
                fill="#111827"
                stroke="#10b981"
                strokeWidth="2"
              />
              {/* Clean compaction texture */}
              <line x1="120" y1="90" x2="280" y2="90" stroke="#374151" strokeWidth="1.5" />
              <line x1="115" y1="125" x2="285" y2="125" stroke="#374151" strokeWidth="1.5" />
              <line x1="125" y1="160" x2="275" y2="160" stroke="#374151" strokeWidth="1.5" />
              <rect x="12" y="12" width="140" height="22" rx="4" fill="#065f46" />
              <text x="82" y="27" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                ✓ REPAIR COMPLETED
              </text>
            </g>
          ) : type.includes('waterlogging') || type === 'scen-waterlogging' ? (
            /* Scene: Milan Subway Waterlogging */
            <g>
              <rect width="400" height="260" fill="url(#roadBase)" />
              {/* Subway Arch Entrance */}
              <path d="M 40,20 L 360,20 L 360,180 L 40,180 Z" fill="#1e293b" />
              <path d="M 60,35 Q 200,10 340,35 L 340,170 L 60,170 Z" fill="#0f172a" />
              {/* Subway Beam caution stripes */}
              <rect x="40" y="20" width="320" height="12" fill="#eab308" />
              <line x1="70" y1="20" x2="60" y2="32" stroke="#000" strokeWidth="4" />
              <line x1="120" y1="20" x2="110" y2="32" stroke="#000" strokeWidth="4" />
              <line x1="170" y1="20" x2="160" y2="32" stroke="#000" strokeWidth="4" />
              <line x1="220" y1="20" x2="210" y2="32" stroke="#000" strokeWidth="4" />
              <line x1="270" y1="20" x2="260" y2="32" stroke="#000" strokeWidth="4" />
              {/* Water Inundation */}
              <path
                d="M 0,130 C 80,125 160,135 240,128 C 320,122 360,132 400,127 L 400,260 L 0,260 Z"
                fill="url(#waterFlow)"
              />
              <ellipse cx="160" cy="180" rx="60" ry="10" fill="none" stroke="#93c5fd" strokeWidth="1.5" opacity="0.6" />
              <ellipse cx="260" cy="210" rx="80" ry="12" fill="none" stroke="#bfdbfe" strokeWidth="1.5" opacity="0.7" />
              <rect x="12" y="12" width="130" height="22" rx="4" fill="#991b1b" />
              <text x="77" y="27" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                WATERLOGGED
              </text>
            </g>
          ) : type.includes('garbage') || type === 'scen-garbage' ? (
            /* Scene: Garbage Overflow */
            <g>
              <rect width="400" height="260" fill="url(#roadBase)" />
              <rect x="0" y="40" width="400" height="50" fill="#4b5563" />
              {/* BMC Dumpster */}
              <rect x="80" y="70" width="110" height="90" rx="6" fill="#15803d" stroke="#14532d" strokeWidth="2" />
              <text x="135" y="120" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">
                BMC - SWM
              </text>
              {/* Overflow Refuse */}
              <path
                d="M 60,140 Q 110,50 180,60 Q 220,110 260,120 Q 320,130 350,180 Q 250,225 110,210 Q 50,190 60,140 Z"
                fill="#6b7280"
                opacity="0.95"
              />
              <circle cx="160" cy="110" r="14" fill="#3b82f6" opacity="0.8" />
              <rect x="180" y="125" width="28" height="20" fill="#f59e0b" transform="rotate(15 180 125)" />
              <rect x="12" y="12" width="130" height="22" rx="4" fill="#b45309" />
              <text x="77" y="27" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                GARBAGE SPILL
              </text>
            </g>
          ) : type.includes('pipeline') || type === 'scen-pipe' ? (
            /* Scene: Burst Pipeline */
            <g>
              <rect width="400" height="260" fill="url(#roadBase)" />
              <path d="M 120,80 L 150,130 L 110,200 L 260,220 L 280,140 L 250,85 Z" fill="#111827" />
              <rect x="70" y="140" width="260" height="40" rx="6" fill="#475569" />
              {/* Water Plume */}
              <path d="M 180,140 C 170,80 140,20 185,15 C 215,15 200,80 195,140 Z" fill="#38bdf8" opacity="0.9" />
              <ellipse cx="200" cy="210" rx="130" ry="30" fill="url(#waterFlow)" />
              <rect x="12" y="12" width="130" height="22" rx="4" fill="#1d4ed8" />
              <text x="77" y="27" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                PIPE LEAKAGE
              </text>
            </g>
          ) : type.includes('wire') || type === 'scen-wire' ? (
            /* Scene: Dangling Wire & Branch */
            <g>
              <rect width="400" height="260" fill="#111827" />
              <rect x="40" y="10" width="16" height="230" fill="#64748b" />
              {/* Tree Branch */}
              <path d="M 380,40 Q 280,100 200,110 Q 150,115 100,170 L 105,185 Q 160,130 210,125 Q 290,115 390,60 Z" fill="#78350f" />
              {/* Wire */}
              <path d="M 50,30 Q 120,60 170,115 Q 190,140 180,195 Q 175,225 185,235" fill="none" stroke="#f59e0b" strokeWidth="4" />
              <polygon points="185,235 175,220 188,223 182,210 196,225 190,227 200,240" fill="#facc15" />
              <rect x="12" y="12" width="140" height="22" rx="4" fill="#dc2626" />
              <text x="82" y="27" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                ELECTRICAL RISK
              </text>
            </g>
          ) : (
            /* Default Scene: SV Road Pothole */
            <g>
              <rect width="400" height="260" fill="url(#roadBase)" />
              <line x1="0" y1="50" x2="400" y2="50" stroke="#f3f4f6" strokeWidth="4" strokeDasharray="30, 20" opacity="0.7" />
              {/* Pothole crater */}
              <path
                d="M 120,95 Q 210,80 295,100 Q 320,155 285,195 Q 190,215 110,185 Q 85,140 120,95 Z"
                fill="url(#potholeDepth)"
                stroke="#111827"
                strokeWidth="3"
              />
              <ellipse cx="205" cy="148" rx="55" ry="22" fill="#374151" opacity="0.8" />
              <rect x="12" y="12" width="130" height="22" rx="4" fill="#b91c1c" />
              <text x="77" y="27" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                ROAD CRATER
              </text>
            </g>
          )}

          {/* Clean, Non-Gimmicky Defect Target Tag */}
          {boundingBox && (
            <g>
              <rect
                x={`${boundingBox.x}%`}
                y={`${boundingBox.y}%`}
                width={`${boundingBox.width}%`}
                height={`${boundingBox.height}%`}
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2"
                rx="4"
              />
            </g>
          )}
        </svg>
      )}

      {/* Subtle, normal loading state (no sci-fi neon) */}
      {isScanning && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
          <div className="bg-white text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-none shadow-md flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-none border-2 border-slate-900 border-t-transparent animate-spin" />
            Analyzing photo...
          </div>
        </div>
      )}
    </div>
  );
};
