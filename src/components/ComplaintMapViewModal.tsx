import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Complaint, Language } from '../types';
import { getComplaintTitle } from '../utils/translations';
import { CivicPhotoDisplay } from './CivicPhotoDisplay';
import { MapPin, X, ExternalLink, Calendar, Building2 } from 'lucide-react';

interface ComplaintMapViewModalProps {
  complaint: Complaint | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const ComplaintMapViewModal: React.FC<ComplaintMapViewModalProps> = ({
  complaint,
  isOpen,
  onClose,
  language,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!isOpen || !complaint || !mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const lat = complaint.lat || 19.1197;
    const lng = complaint.lng || 72.8464;

    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 16,
      zoomControl: true,
    });
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const pinIcon = L.divIcon({
      className: 'complaint-view-pin',
      html: `
        <div style="position: relative; width: 40px; height: 46px; transform: translate(-20px, -46px); pointer-events: none;">
          <svg width="40" height="46" viewBox="0 0 24 24" fill="#0284c7" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 6px 8px rgba(0,0,0,0.4));">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="2.8" fill="#ffffff" stroke="#002b49" stroke-width="1.5"/>
          </svg>
        </div>
      `,
      iconSize: [40, 46],
      iconAnchor: [20, 46],
    });

    const marker = L.marker([lat, lng], { icon: pinIcon }).addTo(map);
    marker.bindPopup(`
      <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4;">
        <strong>#${complaint.ticketNumber}</strong><br/>
        Ward: ${complaint.wardId}<br/>
        ${complaint.locationAddress}
      </div>
    `).openPopup();

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, complaint]);

  if (!isOpen || !complaint) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-2xl bg-white border-2 border-slate-300 rounded-none shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#002b49] text-white px-4 py-3 flex items-center justify-between border-b border-[#001f35]">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-400" />
            <h3 className="font-black text-sm sm:text-base">
              {language === 'mr' ? 'तक्रार नकाशा स्थान' : 'Complaint Map Location'} (#{complaint.ticketNumber})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-300 hover:text-white hover:bg-white/10 rounded-none transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map */}
        <div className="relative w-full h-64 sm:h-80 bg-slate-100">
          <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-10" />
        </div>

        {/* Details Card */}
        <div className="p-4 bg-white space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 shrink-0 rounded-none overflow-hidden border border-slate-200">
              <CivicPhotoDisplay type={complaint.photoUrl} className="w-full h-full" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <span className="text-slate-900 font-black">Ward {complaint.wardId}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {complaint.reportedAt}
                </span>
              </div>
              <h4 className="font-black text-slate-900 text-sm mt-0.5">
                {getComplaintTitle(complaint, language)}
              </h4>
              <p className="text-xs text-slate-600 truncate mt-0.5 font-medium">
                {complaint.locationAddress}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500 font-mono">
            <span>Lat: {complaint.lat.toFixed(5)}, Lng: {complaint.lng.toFixed(5)}</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#002b49] hover:bg-[#001f35] text-white font-black rounded-none cursor-pointer"
            >
              {language === 'mr' ? 'बंद करा' : 'Close'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
