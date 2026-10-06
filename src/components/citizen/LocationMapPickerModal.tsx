import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { WardInfo, Language } from '../../types';
import { mumbaiWards, MUMBAI_LOCALITIES, MumbaiLocalityItem } from '../../data/mockData';
import {
  MapPin,
  Navigation,
  Search,
  Check,
  X,
  Compass,
  Layers,
  Map as MapIcon,
  Maximize2,
  AlertCircle
} from 'lucide-react';

interface LocationMapPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCoords: { lat: number; lng: number };
  initialWardId?: string;
  initialLandmark?: string;
  language: Language;
  onConfirmLocation: (data: {
    lat: number;
    lng: number;
    ward: WardInfo;
    landmark: string;
  }) => void;
}

// Haversine formula helper
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const LocationMapPickerModal: React.FC<LocationMapPickerModalProps> = ({
  isOpen,
  onClose,
  initialCoords,
  initialWardId,
  initialLandmark = '',
  language,
  onConfirmLocation,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const wardMarkersLayerRef = useRef<L.LayerGroup | null>(null);

  const [coords, setCoords] = useState<{ lat: number; lng: number }>(initialCoords);
  const [landmarkText, setLandmarkText] = useState<string>(initialLandmark);
  const [detectedWard, setDetectedWard] = useState<WardInfo>(() => {
    return (
      mumbaiWards.find((w) => w.id === initialWardId) ||
      mumbaiWards.find((w) => w.id === 'K/W') ||
      mumbaiWards[0]
    );
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [showWardMarkers, setShowWardMarkers] = useState(false);

  // Sync initial state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCoords(initialCoords);
      setLandmarkText(initialLandmark);
      const foundWard =
        mumbaiWards.find((w) => w.id === initialWardId) ||
        findClosestWard(initialCoords.lat, initialCoords.lng);
      setDetectedWard(foundWard);
    }
  }, [isOpen, initialCoords.lat, initialCoords.lng, initialWardId, initialLandmark]);

  // Closest ward finder
  const findClosestWard = (lat: number, lng: number): WardInfo => {
    let closest = mumbaiWards[0];
    let minDistance = Infinity;

    for (const ward of mumbaiWards) {
      const d = getDistanceKm(lat, lng, ward.lat, ward.lng);
      if (d < minDistance) {
        minDistance = d;
        closest = ward;
      }
    }
    return closest;
  };

  // Closest locality finder
  const findClosestLocality = (lat: number, lng: number): MumbaiLocalityItem | null => {
    let closest: MumbaiLocalityItem | null = null;
    let minDistance = Infinity;

    for (const loc of MUMBAI_LOCALITIES) {
      const d = getDistanceKm(lat, lng, loc.lat, loc.lng);
      if (d < minDistance) {
        minDistance = d;
        closest = loc;
      }
    }
    return closest;
  };

  // Autocomplete suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return MUMBAI_LOCALITIES.filter(
      (loc) =>
        loc.name.toLowerCase().includes(q) ||
        loc.area.toLowerCase().includes(q) ||
        loc.wardId.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchQuery]);

  // Create SVG DivIcon for the interactive draggable pin
  const createPinIcon = () => {
    return L.divIcon({
      className: 'bmc-map-pin-icon',
      html: `
        <div style="position: relative; width: 44px; height: 50px; transform: translate(-22px, -46px); pointer-events: none;">
          <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 14px; height: 6px; background: rgba(15, 23, 42, 0.35); border-radius: 50%; filter: blur(2px);"></div>
          <svg width="44" height="46" viewBox="0 0 24 24" fill="#0284c7" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 6px 8px rgba(0, 43, 73, 0.45));">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="2.8" fill="#ffffff" stroke="#002b49" stroke-width="1.5"/>
          </svg>
          <div style="position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: #002b49; color: #ffffff; font-family: sans-serif; font-size: 10px; font-weight: 800; padding: 2px 6px; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.3); border: 1px solid #38bdf8;">
            ${language === 'mr' ? 'तक्रार जागा' : 'Incident Spot'}
          </div>
        </div>
      `,
      iconSize: [44, 46],
      iconAnchor: [22, 46],
    });
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    // Destroy existing instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const defaultLat = coords.lat || 19.1197;
    const defaultLng = coords.lng || 72.8464;

    const map = L.map(mapContainerRef.current, {
      center: [defaultLat, defaultLng],
      zoom: 14,
      zoomControl: true,
    });

    mapInstanceRef.current = map;

    // Add Tile Layer (CartoDB Positron / OSM tiles for clear civic readability)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors | BMC Disaster Response',
    }).addTo(map);

    // Add Draggable Marker
    const marker = L.marker([defaultLat, defaultLng], {
      draggable: true,
      icon: createPinIcon(),
      title: language === 'mr' ? 'तक्रार जागा ड्रॅग करा' : 'Drag to adjust complaint spot',
    }).addTo(map);

    markerRef.current = marker;

    // Handle Marker Drag End
    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      updateSelectedPosition(pos.lat, pos.lng);
    });

    // Handle Map Click to Reposition Marker
    map.on('click', (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      updateSelectedPosition(e.latlng.lat, e.latlng.lng);
    });

    // Invalidate map size after animation frame
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
  }, [isOpen]);

  // Update Ward markers layer when toggled
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (showWardMarkers) {
      if (!wardMarkersLayerRef.current) {
        wardMarkersLayerRef.current = L.layerGroup();
        mumbaiWards.forEach((ward) => {
          const wardIcon = L.divIcon({
            className: 'ward-center-badge',
            html: `
              <div style="background: #0f172a; color: #ffffff; font-size: 9px; font-weight: 800; padding: 2px 5px; border: 1px solid #38bdf8; white-space: nowrap; transform: translate(-50%, -50%); opacity: 0.9;">
                Ward ${ward.id}
              </div>
            `,
            iconSize: [40, 16],
          });
          const m = L.marker([ward.lat, ward.lng], { icon: wardIcon });
          m.bindPopup(`
            <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4;">
              <strong>${ward.name.en}</strong><br/>
              <em>Zone: ${ward.zone}</em><br/>
              Officer: ${ward.wardOfficer}<br/>
              Phone: ${ward.controlRoomPhone}
            </div>
          `);
          wardMarkersLayerRef.current?.addLayer(m);
        });
      }
      wardMarkersLayerRef.current.addTo(mapInstanceRef.current);
    } else {
      if (wardMarkersLayerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(wardMarkersLayerRef.current);
      }
    }
  }, [showWardMarkers]);

  // Helper to update coords and reverse-detect closest ward & landmark
  const updateSelectedPosition = (lat: number, lng: number) => {
    setCoords({ lat, lng });
    const ward = findClosestWard(lat, lng);
    setDetectedWard(ward);

    const locality = findClosestLocality(lat, lng);
    if (locality) {
      const areaName = language === 'mr' ? locality.name.split('/')[0].trim() : (locality.name.split('/')[1] || locality.name).trim();
      setLandmarkText(`${areaName}, ${locality.area}`);
    } else {
      setLandmarkText(`${ward.keyAreas.split(',')[0]} (Near Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)})`);
    }
  };

  // Fly map to specific coordinates
  const flyToLocation = (lat: number, lng: number, zoom = 15) => {
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], zoom, { duration: 1 });
      markerRef.current.setLatLng([lat, lng]);
      updateSelectedPosition(lat, lng);
    }
  };

  // Locate current GPS
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setGpsError(language === 'mr' ? 'जीपीएस समर्थित नाही' : 'Geolocation is not supported');
      return;
    }

    setIsGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsGpsLoading(false);
        const { latitude, longitude } = pos.coords;
        flyToLocation(latitude, longitude, 16);
      },
      (err) => {
        setIsGpsLoading(false);
        setGpsError(
          language === 'mr'
            ? 'जीपीएस स्थान मिळवता आले नाही. कृपया नकाशावर मॅन्युअली क्लिक करा.'
            : 'Could not access GPS. Please click directly on the map to pin location.'
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Handle autocomplete select
  const handleSelectLocality = (item: MumbaiLocalityItem) => {
    setSearchQuery(item.name);
    setShowSearchResults(false);
    flyToLocation(item.lat, item.lng, 15);
  };

  // Quick Region shortcuts
  const quickRegions = [
    { labelEn: 'Dadar', labelMr: 'दादर', lat: 19.0220, lng: 72.8430 },
    { labelEn: 'Bandra W', labelMr: 'वांद्रे पश्चिम', lat: 19.0596, lng: 72.8295 },
    { labelEn: 'Andheri W', labelMr: 'अंधेरी पश्चिम', lat: 19.1197, lng: 72.8464 },
    { labelEn: 'Borivali', labelMr: 'बोरिवली', lat: 19.2300, lng: 72.8560 },
    { labelEn: 'Kurla / BKC', labelMr: 'कुर्ला / बीकेसी', lat: 19.0680, lng: 72.8790 },
    { labelEn: 'Colaba / CST', labelMr: 'कुलाबा / सीएसटी', lat: 18.9220, lng: 72.8347 },
    { labelEn: 'Powai', labelMr: 'पवई', lat: 19.1480, lng: 72.9370 },
    { labelEn: 'Ghatkopar', labelMr: 'घाटकोपर', lat: 19.0860, lng: 72.9080 },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-4xl max-h-[95vh] bg-white border-2 border-slate-300 rounded-none shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-[#002b49] text-white px-4 py-3 flex items-center justify-between border-b border-[#001f35] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-none bg-sky-600/30 border border-sky-400/40 flex items-center justify-center">
              <MapIcon className="w-4 h-4 text-sky-300" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base leading-tight">
                {language === 'mr' ? 'तक्रारीचे अचूक स्थान मॅपवर निवडा' : 'Locate Complaint Spot on Map'}
              </h3>
              <p className="text-[11px] text-sky-200">
                {language === 'mr'
                  ? 'नकाशावर कुठेही क्लिक करा किंवा पिन ड्रॅग करून निश्चित करा'
                  : 'Click anywhere on the map or drag the pin to pinpoint the exact site'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-300 hover:text-white hover:bg-white/10 rounded-none transition-colors cursor-pointer"
            aria-label="Close Map Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Control Bar: Search & Quick Filters */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-2 shrink-0">
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="flex items-center gap-2 border border-slate-300 rounded-none px-3 py-1.5 bg-white focus-within:ring-2 focus-within:ring-sky-600 focus-within:border-sky-600">
                <Search className="w-4 h-4 text-slate-500 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(true);
                  }}
                  onFocus={() => setShowSearchResults(true)}
                  placeholder={
                    language === 'mr'
                      ? 'परिसर, रस्ता किंवा स्टेशन शोधा (उदा. अंधेरी, दादर, वांद्रे)...'
                      : 'Search area, road, or station (e.g. Andheri, Dadar, Bandra)...'
                  }
                  className="w-full text-xs sm:text-sm text-slate-900 bg-transparent focus:outline-hidden"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setShowSearchResults(false);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-700 font-bold px-1"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {showSearchResults && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-40 mt-1 bg-white border border-slate-300 rounded-none shadow-xl max-h-48 overflow-y-auto divide-y divide-slate-100">
                  {searchSuggestions.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectLocality(item)}
                      className="p-2.5 hover:bg-sky-50 cursor-pointer transition-colors flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-black text-slate-900">{item.name}</div>
                        <div className="text-[11px] text-slate-500">{item.area}</div>
                      </div>
                      <span className="font-mono text-[10px] bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded-none font-black">
                        Ward {item.wardId}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons: Locate Me & Ward Toggle */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleLocateMe}
                disabled={isGpsLoading}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded-none text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                title={language === 'mr' ? 'माझे थेट जीपीएस स्थान' : 'Locate my current position'}
              >
                <Navigation className={`w-3.5 h-3.5 text-sky-600 ${isGpsLoading ? 'animate-spin' : ''}`} />
                <span>{language === 'mr' ? 'माझे स्थान (GPS)' : 'My Location (GPS)'}</span>
              </button>

              <button
                onClick={() => setShowWardMarkers(!showWardMarkers)}
                className={`px-3 py-1.5 border rounded-none text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors ${
                  showWardMarkers
                    ? 'bg-[#002b49] text-white border-[#001f35]'
                    : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                }`}
                title={language === 'mr' ? 'वॉर्ड कार्यालये दाखवा / लपवा' : 'Show/Hide Ward Offices'}
              >
                <Layers className="w-3.5 h-3.5 text-sky-500" />
                <span className="hidden sm:inline">{language === 'mr' ? 'वॉर्ड कार्यालये' : 'Ward Centers'}</span>
              </button>
            </div>
          </div>

          {/* Quick Area Jump Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs scrollbar-thin">
            <span className="text-[11px] font-bold text-slate-500 shrink-0">
              {language === 'mr' ? 'द्रुत परिसर:' : 'Quick Areas:'}
            </span>
            {quickRegions.map((region, idx) => (
              <button
                key={idx}
                onClick={() => flyToLocation(region.lat, region.lng, 15)}
                className="px-2 py-0.5 bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-900 border border-slate-200 rounded-none text-[11px] font-bold shrink-0 transition-colors cursor-pointer"
              >
                {language === 'mr' ? region.labelMr : region.labelEn}
              </button>
            ))}
          </div>

          {/* GPS Error Message if any */}
          {gpsError && (
            <div className="p-2 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {gpsError}
              </span>
              <button onClick={() => setGpsError(null)} className="font-bold px-1 text-rose-600 hover:text-rose-900">
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Map Container Canvas */}
        <div className="relative flex-1 min-h-[340px] sm:min-h-[420px] w-full bg-slate-100">
          <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-10" />

          {/* Interactive Map Pin Helper Badge */}
          <div className="absolute top-3 left-3 z-20 pointer-events-none bg-slate-900/90 text-white text-[11px] px-2.5 py-1.5 border border-slate-700 shadow-md flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0 animate-pulse" />
            <span>
              {language === 'mr'
                ? 'नकाशावर क्लिक करा किंवा पिन ड्रॅग करा'
                : 'Click map or drag the pin to position'}
            </span>
          </div>

          {/* Live Coordinates Readout */}
          <div className="absolute bottom-3 right-3 z-20 pointer-events-none bg-white/95 text-slate-900 text-[10px] sm:text-xs font-mono px-2 py-1 border border-slate-300 shadow-xs">
            Lat: {coords.lat.toFixed(5)}, Lng: {coords.lng.toFixed(5)}
          </div>
        </div>

        {/* Bottom Confirmation Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 space-y-3 shrink-0">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            
            {/* Ward & Zone Details */}
            <div className="sm:col-span-4 flex items-center gap-2.5 bg-slate-50 p-2.5 border border-slate-200">
              <div className="w-9 h-9 bg-[#002b49] text-white flex items-center justify-center font-black text-xs shrink-0">
                {detectedWard.id}
              </div>
              <div className="min-w-0">
                <div className="font-black text-xs text-slate-900 truncate">
                  {language === 'mr' ? detectedWard.name.mr : detectedWard.name.en}
                </div>
                <div className="text-[10px] text-slate-600 truncate">
                  Zone: {detectedWard.zone} | {detectedWard.wardOfficer}
                </div>
              </div>
            </div>

            {/* Editable Precise Landmark / Street Address */}
            <div className="sm:col-span-8">
              <label className="block text-[11px] font-black text-slate-700 mb-1">
                {language === 'mr' ? 'तपशीलवार परिसर / लँडमार्क (स्थानिक संदर्भ):' : 'Precise Landmark / Street Reference:'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={landmarkText}
                  onChange={(e) => setLandmarkText(e.target.value)}
                  placeholder={
                    language === 'mr'
                      ? 'उदा. मेट्रो पिलर क्र. ४५ जवळ, सिग्नल शेजारी...'
                      : 'e.g. Near Metro Pillar 45, opposite bus stop, near signal...'
                  }
                  className="flex-1 text-xs sm:text-sm px-3 py-1.5 bg-white border border-slate-300 rounded-none text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons: Confirm & Cancel */}
          <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-none text-xs transition-colors cursor-pointer"
            >
              {language === 'mr' ? 'रद्द करा' : 'Cancel'}
            </button>

            <button
              onClick={() => {
                onConfirmLocation({
                  lat: coords.lat,
                  lng: coords.lng,
                  ward: detectedWard,
                  landmark: landmarkText.trim() || `${detectedWard.keyAreas.split(',')[0]} (Lat: ${coords.lat.toFixed(4)}, Lng: ${coords.lng.toFixed(4)})`,
                });
                onClose();
              }}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-none text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{language === 'mr' ? 'हे स्थान निश्चित करा ✓' : 'Confirm Map Location ✓'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
