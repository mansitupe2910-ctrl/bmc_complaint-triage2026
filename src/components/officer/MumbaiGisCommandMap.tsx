import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Complaint, Language } from '../../types';
import { getComplaintTitle } from '../../utils/translations';
import { CivicPhotoDisplay } from '../CivicPhotoDisplay';
import { MapPin, CheckCircle2, Clock, AlertTriangle, Layers } from 'lucide-react';

interface MumbaiGisCommandMapProps {
  complaints: Complaint[];
  language: Language;
  onSelectComplaint: (complaint: Complaint) => void;
  onValidateProof: (complaint: Complaint) => void;
}

export const MumbaiGisCommandMap: React.FC<MumbaiGisCommandMapProps> = ({
  complaints,
  language,
  onSelectComplaint,
  onValidateProof,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Center on Mumbai coordinates
    const map = L.map(mapContainerRef.current, {
      center: [19.0760, 72.8777],
      zoom: 11,
      zoomControl: true,
    });
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Add markers for all complaints
    complaints.forEach((c) => {
      const lat = c.lat || 19.1197;
      const lng = c.lng || 72.8464;

      const isResolved = c.status === 'resolved';
      const isVerificationPending = c.status === 'verification_pending';
      const color = isResolved ? '#10b981' : isVerificationPending ? '#a855f7' : '#ef4444';

      const icon = L.divIcon({
        className: 'bmc-gis-marker',
        html: `
          <div style="position: relative; width: 32px; height: 38px; transform: translate(-16px, -38px); cursor: pointer;">
            <svg width="32" height="38" viewBox="0 0 24 24" fill="${color}" stroke="#ffffff" stroke-width="1.8">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.8" fill="#ffffff" stroke="#1e293b" stroke-width="1.2"/>
            </svg>
          </div>
        `,
        iconSize: [32, 38],
        iconAnchor: [16, 38],
      });

      const marker = L.marker([lat, lng], { icon }).addTo(map);

      const statusText = isResolved
        ? '✓ Resolved'
        : isVerificationPending
        ? '⏳ Verification Pending'
        : 'Pending Work';

      const popupHtml = `
        <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4; min-width: 180px;">
          <div style="font-weight: 800; color: #0f172a; margin-bottom: 2px;">#${c.ticketNumber} · Ward ${c.wardId}</div>
          <div style="color: #475569; font-size: 11px; margin-bottom: 4px;">${c.locationAddress}</div>
          <div style="display: inline-block; padding: 2px 6px; font-weight: 700; font-size: 10px; background: ${color}20; color: ${color}; border: 1px solid ${color}40; margin-bottom: 6px;">
            ${statusText}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
    });

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [complaints]);

  return (
    <div className="w-full bg-white border-2 border-slate-300 shadow-sm overflow-hidden text-left space-y-2 p-3">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-900">
          <MapPin className="w-4 h-4 text-emerald-700" />
          <span>{language === 'mr' ? 'मुंबई मनपा थेट GIS नकाशा (Live City Map)' : 'BMC Live City GIS Command Map'}</span>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-rose-500 inline-block"></span>
            <span>{language === 'mr' ? 'बाकी' : 'Pending'}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-purple-500 inline-block"></span>
            <span>{language === 'mr' ? 'पडताळणी' : 'Verification'}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-emerald-500 inline-block"></span>
            <span>{language === 'mr' ? 'निकाली' : 'Resolved'}</span>
          </span>
        </div>
      </div>

      <div ref={mapContainerRef} className="w-full h-80 sm:h-96 border border-slate-300 bg-slate-100 z-10" />
    </div>
  );
};
