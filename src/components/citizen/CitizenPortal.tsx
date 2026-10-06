import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Complaint, Language, WardInfo, DepartmentId, CitizenUser } from '../../types';
import { getTranslation, getComplaintTitle } from '../../utils/translations';
import { mumbaiWards, bmcDepartments, sampleVoiceClips, initialComplaints, MUMBAI_LOCALITIES } from '../../data/mockData';
import { CivicPhotoDisplay } from '../CivicPhotoDisplay';
import { ComplaintProgressBar } from '../ComplaintProgressBar';
import { CitizenContactView } from './CitizenContactView';
import { LocationMapPickerModal } from './LocationMapPickerModal';
import { ComplaintMapViewModal } from '../ComplaintMapViewModal';
import confetti from 'canvas-confetti';

export type CitizenNavSection = 'submit' | 'see' | 'track' | 'contact';
import { playComplaintConfirmationAudio, stopComplaintAudio } from '../../utils/speechHelper';
import { 
  Mic, 
  Camera, 
  MapPin, 
  CheckCircle2, 
  ThumbsUp, 
  CloudRain, 
  Upload, 
  ImagePlus, 
  Navigation, 
  Search, 
  Building,
  Phone,
  UserCheck,
  PlusCircle,
  Activity,
  Filter,
  FileText,
  PhoneCall,
  Clock,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Volume2,
  VolumeX,
  Map as MapIcon
} from 'lucide-react';

interface CitizenPortalProps {
  complaints: Complaint[];
  setComplaints: React.Dispatch<React.SetStateAction<Complaint[]>>;
  language: Language;
  seniorMode: boolean;
  highContrast?: boolean;
  citizenUser?: CitizenUser | null;
  onOpenCitizenAuth?: () => void;
}

export const CitizenPortal: React.FC<CitizenPortalProps> = ({
  complaints,
  setComplaints,
  language,
  seniorMode,
  citizenUser,
  onOpenCitizenAuth,
}) => {
  // User Navigation Section: 'submit' | 'see' | 'track' | 'contact'
  const [activeNavSection, setActiveNavSection] = useState<CitizenNavSection>('submit');

  // Default to photo mode so upload is sorted first and immediately visible
  const [mode, setMode] = useState<'voice' | 'photo'>('photo');
  
  // Location and workable area state (Streamlined compact bar)
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [detectedWard, setDetectedWard] = useState<WardInfo>(mumbaiWards.find(w => w.id === 'K/W') || mumbaiWards[0]);
  const [specificLandmark, setSpecificLandmark] = useState('एस. व्ही. रोड, अंधेरी सबवे जवळ');
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 19.1197, lng: 72.8464 });
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<string | null>(null);

  // Map Picker & Map Viewer Modal state
  const [showMapModal, setShowMapModal] = useState<boolean>(false);
  const [viewMapComplaint, setViewMapComplaint] = useState<Complaint | null>(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Complaint['category']>('pothole');

  // Photo state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [isScanningUpload, setIsScanningUpload] = useState<boolean>(false);
  const [useCustomPhoto, setUseCustomPhoto] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Notification message & last submitted ticket
  const [notice, setNotice] = useState<string | null>(null);
  const [lastTicketId, setLastTicketId] = useState<string | null>(null);
  const [lastWardId, setLastWardId] = useState<string>('K/W');
  const [isPlayingAudioReceipt, setIsPlayingAudioReceipt] = useState<boolean>(false);

  // Ticket Search and Tracker state
  const [ticketSearchQuery, setTicketSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'in_progress' | 'resolved'>('all');

  // "See Complaints" filters
  const [seeFilterWard, setSeeFilterWard] = useState<string>('all');
  const [seeSearchQuery, setSeeSearchQuery] = useState('');
  const [seeStatusFilter, setSeeStatusFilter] = useState<'all' | 'new' | 'in_progress' | 'resolved'>('all');
  const [seeCategoryFilter, setSeeCategoryFilter] = useState<string>('all');

  // Voice utterance
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      if (language === 'mr') u.lang = 'mr-IN';
      else u.lang = 'en-IN';
      window.speechSynthesis.speak(u);
    }
  };

  // Location suggestions filtered by search query
  const filteredLocalities = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return MUMBAI_LOCALITIES.filter(
      (loc) => loc.name.toLowerCase().includes(q) || loc.area.toLowerCase().includes(q) || loc.wardId.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchQuery]);

  // Handle selecting a location from search
  const handleSelectLocation = (loc: typeof MUMBAI_LOCALITIES[0]) => {
    const foundWard = mumbaiWards.find((w) => w.id === loc.wardId);
    if (foundWard) {
      setDetectedWard(foundWard);
    }
    setCoords({ lat: loc.lat, lng: loc.lng });
    setSpecificLandmark(loc.area);
    setSearchQuery(loc.name);
    setShowLocationDropdown(false);
    setGpsStatus(language === 'mr' ? `स्थान निवडले: वॉर्ड ${loc.wardId}` : `Selected: Ward ${loc.wardId}`);
  };

  // Browser Geolocation Detection
  const handleFetchGps = () => {
    if (!navigator.geolocation) {
      setGpsStatus(language === 'mr' ? 'ब्राउझर जीपीएस समर्थित नाही' : 'GPS not supported by browser');
      return;
    }

    setIsLocatingGps(true);
    setGpsStatus(language === 'mr' ? 'उपग्रह जीपीएस शोधत आहे...' : 'Detecting GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        setIsLocatingGps(false);

        // Find closest Mumbai Ward by Haversine formula
        let closest = mumbaiWards[0];
        let minD = Infinity;

        mumbaiWards.forEach((w) => {
          const dLat = (w.lat - latitude) * (Math.PI / 180);
          const dLng = (w.lng - longitude) * (Math.PI / 180);
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(latitude * (Math.PI / 180)) *
              Math.cos(w.lat * (Math.PI / 180)) *
              Math.sin(dLng / 2) *
              Math.sin(dLng / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const dist = 6371 * c;
          if (dist < minD) {
            minD = dist;
            closest = w;
          }
        });

        setDetectedWard(closest);
        setSpecificLandmark(`${closest.keyAreas.split(',')[0]} (GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
        setGpsStatus(
          language === 'mr'
            ? `📍 थेट जीपीएस स्थान मिळाले! वॉर्ड ${closest.id} (±${Math.round(accuracy)}m)`
            : `📍 GPS Lock Acquired! Ward ${closest.id} (±${Math.round(accuracy)}m)`
        );
        speak(language === 'mr' ? `जीपीएस स्थान मिळाले: वॉर्ड ${closest.id}` : `GPS detected: Ward ${closest.id}`);
      },
      (err) => {
        setIsLocatingGps(false);
        setGpsStatus(
          language === 'mr'
            ? 'जीपीएस परवानगी नाकारली. कृपया वरील शोध बारमधून परिसर निवडा.'
            : 'GPS permission denied. Please select area from search bar above.'
        );
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Timer for voice recording
  useEffect(() => {
    let t: any;
    if (isRecording) {
      t = setInterval(() => setVoiceSeconds((s) => s + 1), 1000);
    } else {
      setVoiceSeconds(0);
    }
    return () => clearInterval(t);
  }, [isRecording]);

  // Voice toggle
  const handleToggleVoice = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setTranscript('');
      setTimeout(() => {
        if (language === 'mr') {
          setTranscript('अहो साहेब, रस्त्यावर खूप मोठा खड्डा पडलाय, गाड्या घसरत आहेत. कृपया लगेच दुरुस्त करा!');
        } else {
          setTranscript('Dangerous deep pothole on the main road, vehicles are skidding. Please repair immediately.');
        }
      }, 1200);
    }
  };

  // Image Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsScanningUpload(true);
    setUseCustomPhoto(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setUploadedImage(dataUrl);
      setTimeout(() => {
        setIsScanningUpload(false);
        speak(language === 'mr' ? 'फोटो अपलोड झाला' : 'Photo uploaded successfully');
      }, 500);
    };
    reader.readAsDataURL(file);
  };

  // Cluster Deduplication (+1 Me Too)
  const handleMeToo = (id: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const wasUpvoted = c.userUpvoted;
          const newCount = wasUpvoted ? Math.max(1, c.upvotes - 1) : c.upvotes + 1;
          const updated = {
            ...c,
            upvotes: newCount,
            userUpvoted: !wasUpvoted
          };
          // Sync with server
          fetch('/api/complaints', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated)
          }).catch(() => {});
          return updated;
        }
        return c;
      })
    );
    speak(
      language === 'mr'
        ? 'आपली सहमती नोंदवली आहे (+१)'
        : 'Upvote registered (+1)'
    );
  };

  // Submit Complaint handler
  const handleSubmitComplaint = () => {
    // Check if citizen is registered & logged in
    if (!citizenUser) {
      if (onOpenCitizenAuth) onOpenCitizenAuth();
      setNotice(
        language === 'mr'
          ? '⚠️ तक्रार दाखल करण्यासाठी कृपया प्रथम मोबाईल नंबरने नागरिक म्हणून नोंदणी किंवा लॉगिन करा.'
          : '⚠️ Please register or log in as a citizen with your mobile number to submit a complaint.'
      );
      return;
    }

    const ticketNo = `BMC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setLastTicketId(ticketNo);

    // Readable Category map
    const readableCategoryNameMap: Record<Complaint['category'], string> = {
      pothole: language === 'mr' ? 'रस्त्यावरील खड्डा' : 'Road Pothole',
      waterlogging: language === 'mr' ? 'पाणी साचणे' : 'Waterlogging',
      manhole: language === 'mr' ? 'उघडे मॅनहोल' : 'Open Manhole',
      garbage: language === 'mr' ? 'कचरा ढीग' : 'Garbage Dump',
      tree: language === 'mr' ? 'झाड पडले' : 'Fallen Tree',
      pipeline: language === 'mr' ? 'पाईपलाईन गळती' : 'Pipeline Leak',
      wire: language === 'mr' ? 'विजेची तार / पथदिवा' : 'Live Wire / Streetlight'
    };

    const readableCategory = readableCategoryNameMap[selectedCategory] || 'Civic Issue';

    let department: DepartmentId = 'roads';
    if (selectedCategory === 'waterlogging') department = 'swd';
    if (selectedCategory === 'garbage') department = 'swm';
    if (selectedCategory === 'manhole') department = 'swd';
    if (selectedCategory === 'tree') department = 'tree';
    if (selectedCategory === 'wire') department = 'electrical';
    if (selectedCategory === 'pipeline') department = 'hydraulic';

    const deptObj = bmcDepartments.find((d) => d.id === department);

    const activePhoto = useCustomPhoto && uploadedImage ? uploadedImage : selectedCategory;

    const descText = transcript || `${readableCategory} reported by citizen ${citizenUser.fullName} at ${specificLandmark || detectedWard.keyAreas}. Immediate inspection requested.`;

    const newEntry: Complaint = {
      id: `c-${Date.now()}`,
      ticketNumber: ticketNo,
      category: selectedCategory,
      title: {
        en: `${readableCategory} at ${specificLandmark || detectedWard.keyAreas}`,
        mr: `${specificLandmark || detectedWard.keyAreas} जवळ ${readableCategory}`,
        hi: `${specificLandmark || detectedWard.keyAreas} के पास ${readableCategory}`
      },
      description: {
        en: descText,
        mr: descText,
        hi: descText
      },
      photoUrl: activePhoto,
      status: 'new',
      visualSeverity: selectedCategory === 'manhole' ? 95 : 80,
      priorityScore: selectedCategory === 'manhole' ? 96 : 82,
      upvotes: 1,
      userUpvoted: false,
      lat: coords.lat,
      lng: coords.lng,
      wardId: detectedWard.id,
      wardName: detectedWard.name[language] || detectedWard.name.en,
      locationAddress: `${specificLandmark || detectedWard.keyAreas}, Ward ${detectedWard.id}, Mumbai`,
      reportedAt: 'आत्ताच / Just now',
      citizenContactMasked: `+91 ${citizenUser.mobile.slice(0, 2)}****${citizenUser.mobile.slice(-4)}`,
      assignedDepartment: department,
      assignedAgency: deptObj ? (deptObj.name[language] || deptObj.name.en) : `Ward ${detectedWard.id} Emergency Team`,
      assignedOfficer: deptObj?.leadOfficer || 'BMC Junior Engineer',
      slaHoursRemaining: deptObj?.standardSlaHours || 24,
      aiInference: {
        detectedHazard: { en: readableCategory, mr: readableCategory, hi: readableCategory },
        confidence: 96,
        hazardLevel: (selectedCategory === 'manhole' || selectedCategory === 'waterlogging') ? 'Critical' : 'Moderate',
        metrics: 'Hazard Area: ~1.5m² | Severity: Standard',
        riskAssessment: {
          en: 'Civic hazard requires immediate repair.',
          mr: 'तात्काळ दुरुस्ती आवश्यक.',
          hi: 'तत्काल मरम्मत आवश्यक।'
        },
        suggestedDepartment: department
      },
      activityLog: [
        {
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          event: {
            en: `Complaint filed by ${citizenUser.fullName}`,
            mr: `${citizenUser.fullName} यांनी तक्रार नोंदवली`,
            hi: `${citizenUser.fullName} द्वारा शिकायत दर्ज`
          },
          actor: citizenUser.fullName
        }
      ]
    };

    const updatedList = [newEntry, ...complaints];
    setComplaints(updatedList);

    // Save immediately to localStorage so refresh never loses this complaint
    try {
      localStorage.setItem('bmc_saved_complaints', JSON.stringify(updatedList));
    } catch (e) {
      console.error(e);
    }

    // Sync with backend API
    try {
      fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry)
      }).catch(() => {});
    } catch (e) {}

    try {
      confetti({ particleCount: 40, spread: 60 });
    } catch (e) {}

    setLastTicketId(ticketNo);
    setLastWardId(detectedWard.id);

    const visualNoticeMsg = language === 'mr'
      ? `आपली तक्रार (#${ticketNo}) मनपाकडे स्वीकारण्यात आली आहे. वॉर्ड ${detectedWard.id} चे पथक त्वरित कार्यवाही करेल.`
      : `Your complaint (#${ticketNo}) has been accepted. Ward ${detectedWard.id} team will take action shortly.`;

    setNotice(visualNoticeMsg);

    // Polite, localized audio confirmation via Web Speech API reading back Complaint ID
    playComplaintConfirmationAudio(ticketNo, detectedWard.id, language, {
      onStart: () => setIsPlayingAudioReceipt(true),
      onEnd: () => setIsPlayingAudioReceipt(false),
      onError: () => setIsPlayingAudioReceipt(false),
    });

    setTranscript('');
    setUseCustomPhoto(false);
  };

  // Load sample demo complaints (helpful for testing)
  const handleLoadDemoData = () => {
    setComplaints(initialComplaints);
    try {
      fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(initialComplaints)
      }).catch(() => {});
    } catch (e) {}
    const msg = language === 'mr' ? 'प्रात्यक्षिक (डेमो) तक्रारी भरल्या गेल्या!' : 'Sample demo complaints loaded!';
    setNotice(msg);
  };

  // Clear all complaints back to zero
  const handleClearAll = () => {
    setComplaints([]);
    try {
      fetch('/api/complaints', { method: 'DELETE' }).catch(() => {});
    } catch (e) {}
    const msg = language === 'mr' ? 'सर्व तक्रारी साफ करण्यात आल्या (डेटाबेस शून्य केला).' : 'All complaints cleared (Database reset).';
    setNotice(msg);
  };

  // Nearby issues for current ward
  const nearby = complaints.filter(
    (c) => c.wardId === detectedWard.id || (c.distanceMeters && c.distanceMeters < 800)
  );

  // Filtered complaints for "See Complaints" tab
  const filteredSeeComplaints = useMemo(() => {
    return complaints.filter((c) => {
      // Ward filter
      if (seeFilterWard !== 'all' && c.wardId !== seeFilterWard) return false;

      // Status filter
      if (seeStatusFilter === 'new' && c.status !== 'new') return false;
      if (seeStatusFilter === 'in_progress' && (c.status !== 'in_progress' && c.status !== 'assigned' && c.status !== 'verification_pending')) return false;
      if (seeStatusFilter === 'resolved' && c.status !== 'resolved') return false;

      // Category filter
      if (seeCategoryFilter !== 'all' && c.category !== seeCategoryFilter) return false;

      // Search query
      if (seeSearchQuery.trim()) {
        const q = seeSearchQuery.toLowerCase();
        const matches =
          c.ticketNumber.toLowerCase().includes(q) ||
          c.locationAddress.toLowerCase().includes(q) ||
          (c.title[language] || c.title.en).toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [complaints, seeFilterWard, seeStatusFilter, seeCategoryFilter, seeSearchQuery, language]);

  return (
    <div className="w-full py-5 px-3 sm:px-6 bg-slate-50 min-h-screen max-w-full overflow-x-hidden text-slate-900">
      <div className="max-w-6xl mx-auto space-y-4">

        {/* ============================================================== */}
        {/* SINGLE PROMINENT CITIZEN NAVIGATION BAR (Sharp Rectangles)     */}
        {/* ============================================================== */}
        <div className="w-full bg-white border border-slate-300 rounded-none p-1.5 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          <button
            type="button"
            onClick={() => setActiveNavSection('submit')}
            className={`py-3 px-3 rounded-none text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeNavSection === 'submit'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-900 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>{language === 'mr' ? 'तक्रार नोंदवा' : 'Report Issue'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveNavSection('see')}
            className={`py-3 px-3 rounded-none text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeNavSection === 'see'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-900 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{language === 'mr' ? 'तक्रारी पहा' : 'View Complaints'} ({complaints.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveNavSection('track')}
            className={`py-3 px-3 rounded-none text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeNavSection === 'track'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-900 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>{language === 'mr' ? 'स्थिती ट्रॅक करा' : 'Track Status'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveNavSection('contact')}
            className={`py-3 px-3 rounded-none text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeNavSection === 'contact'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-900 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>{language === 'mr' ? 'आपत्कालीन संपर्क' : 'Helplines'}</span>
          </button>
        </div>

        {/* MAIN VIEW CONTENT AREA */}
        <div className="w-full space-y-4">

          {/* Toast Notification Banner with Localized Web Speech API Audio Receipt */}
          {notice && (
            <div className="p-4 rounded-none bg-slate-50 border border-slate-300 text-slate-900 flex flex-col gap-3 shadow-sm animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs sm:text-sm font-black leading-tight text-slate-900">{notice}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-bold">
                      {language === 'mr'
                        ? 'आपली तक्रार मनपा नियंत्रण कक्षात नोंदवली गेली आहे.'
                        : 'Complaint registered in Ward Control Desk.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {lastTicketId && (
                    <button
                      onClick={() => {
                        setActiveNavSection('track');
                        setTicketSearchQuery(lastTicketId);
                        setNotice(null);
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-none text-xs font-black transition-colors cursor-pointer shadow-2xs"
                    >
                      ⚡ {language === 'mr' ? 'स्थिती ट्रॅक करा' : 'Track Status'}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      stopComplaintAudio();
                      setIsPlayingAudioReceipt(false);
                      setNotice(null);
                    }}
                    className="px-2.5 py-1.5 text-xs text-slate-900 hover:text-emerald-700 cursor-pointer font-bold"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Web Speech API Localized Audio Confirmation Strip */}
              {lastTicketId && (
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-200 bg-white px-3 py-2 rounded-none">
                  <div className="flex items-center gap-2 text-xs">
                    {isPlayingAudioReceipt ? (
                      <span className="flex items-center gap-1.5 text-slate-900 font-black animate-pulse">
                        <Volume2 className="w-4 h-4 text-emerald-700 animate-bounce" />
                        <span>
                          {language === 'mr'
                            ? `🔊 मनपा ऑडिओ पावती वाचून दाखवत आहे: #${lastTicketId}`
                            : `🔊 Reading Audio Confirmation: #${lastTicketId}`}
                        </span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-slate-700 font-bold">
                        <Volume2 className="w-4 h-4 text-emerald-700" />
                        <span>
                          {language === 'mr'
                            ? `ऑडिओ पावती उपलब्ध: तक्रार #${lastTicketId}`
                            : `Audio confirmation ready: #${lastTicketId}`}
                        </span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isPlayingAudioReceipt ? (
                      <button
                        onClick={() => {
                          stopComplaintAudio();
                          setIsPlayingAudioReceipt(false);
                        }}
                        className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-900 rounded-none text-xs font-black flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <VolumeX className="w-3.5 h-3.5" />
                        <span>{language === 'mr' ? 'थांबवा' : 'Stop'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          playComplaintConfirmationAudio(lastTicketId, lastWardId, language, {
                            onStart: () => setIsPlayingAudioReceipt(true),
                            onEnd: () => setIsPlayingAudioReceipt(false),
                            onError: () => setIsPlayingAudioReceipt(false),
                          });
                        }}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-none text-xs font-black flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>
                          {language === 'mr' ? '🔊 ऑडिओ पुन्हा ऐका' : '🔊 Replay Audio'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* SECTION 1: SUBMIT COMPLAINT (तक्रार नोंदवा)                      */}
          {/* ============================================================== */}
          {activeNavSection === 'submit' && (
            <div className="space-y-4">
              
              {/* Citizen Authentication Status Card */}
              {citizenUser ? (
                <div className="bg-white border-2 border-slate-300 rounded-none p-3 sm:p-4 flex items-center justify-between gap-3 text-xs shadow-2xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-none bg-emerald-600 text-white flex items-center justify-center font-black text-sm shrink-0">
                      {citizenUser.fullName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <span className="font-black text-slate-900 text-xs sm:text-sm block truncate">
                        {language === 'mr' ? `स्वागत आहे, ${citizenUser.fullName}` : `Welcome, ${citizenUser.fullName}`}
                      </span>
                      <span className="text-[11px] text-slate-500 truncate block font-bold">
                        {language === 'mr'
                          ? `नोंदणीकृत मोबाईल: +91 ${citizenUser.mobile} · रहिवासी वॉर्ड: ${citizenUser.wardId}`
                          : `Registered Mobile: +91 ${citizenUser.mobile} · Ward: ${citizenUser.wardId}`}
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-slate-50 text-slate-900 border border-slate-200 rounded-none font-black text-[10px] sm:text-xs shrink-0 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{language === 'mr' ? 'प्रमाणित नागरिक' : 'Verified Citizen'}</span>
                  </span>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-300 rounded-none p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-none bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                      👤
                    </div>
                    <div className="min-w-0">
                      <span className="font-black text-slate-900 text-xs sm:text-sm block">
                        {language === 'mr' ? 'नागरिक नोंदणी व लॉगिन' : 'Citizen Registration & Login'}
                      </span>
                      <span className="text-[11px] text-slate-500 block font-semibold">
                        {language === 'mr'
                          ? 'तक्रार दाखल करण्यासाठी कृपया मोबाईल नंबरने लॉगिन किंवा नोंदणी करा.'
                          : 'Please log in with registered mobile or register to file grievances.'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={onOpenCitizenAuth}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-none text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto shrink-0 transition-transform"
                  >
                    <span>{language === 'mr' ? 'मोबाईलने लॉगिन / नोंदणी' : 'Log In / Register'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* 1.1 COMPACT SMART WORKABLE AREA BAR with Sharp Edges */}
              <div className="bg-white border-2 border-slate-300 rounded-none p-3 sm:p-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-none bg-slate-50 text-emerald-700 border border-slate-200 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-black text-xs sm:text-sm text-slate-900 truncate">
                          {language === 'mr' ? `वॉर्ड ${detectedWard.id} - ${detectedWard.name.mr}` : `Ward ${detectedWard.id} (${detectedWard.keyAreas.split(',')[0]})`}
                        </span>
                        <span className="text-[10px] bg-slate-50 text-slate-900 border border-slate-200 font-black px-1.5 py-0.5 rounded-none hidden sm:inline">
                          {language === 'mr' ? 'कार्यक्षेत्र' : 'Workable Area'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                        <p className="text-[11px] text-slate-600 truncate font-medium">
                          {specificLandmark || detectedWard.keyAreas}
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowMapModal(true)}
                          className="text-[10px] text-sky-700 hover:text-sky-900 font-mono font-bold underline cursor-pointer"
                          title={language === 'mr' ? 'नकाशावर पहा किंवा जागा बदला' : 'View on map or adjust pin'}
                        >
                          ({coords.lat.toFixed(4)}, {coords.lng.toFixed(4)} · {language === 'mr' ? 'मॅप' : 'Map'})
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 flex-wrap sm:flex-nowrap">
                    {/* Locate on Map Button - Main Feature Request */}
                    <button
                      type="button"
                      onClick={() => setShowMapModal(true)}
                      className="px-2.5 py-1.5 bg-[#002b49] hover:bg-[#001f35] text-white rounded-none text-xs font-black flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                      title={language === 'mr' ? 'नकाशावर तक्रारीची अचूक जागा निवडा' : 'Locate complaint spot on interactive map'}
                    >
                      <MapIcon className="w-3.5 h-3.5 text-sky-400" />
                      <span className="text-[11px]">{language === 'mr' ? 'मॅपवर निवडा' : 'Locate on Map'}</span>
                    </button>

                    {/* 1-Tap GPS Button */}
                    <button
                      type="button"
                      onClick={handleFetchGps}
                      disabled={isLocatingGps}
                      className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200 rounded-none text-xs font-black flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    >
                      <Navigation className={`w-3.5 h-3.5 text-emerald-700 ${isLocatingGps ? 'animate-spin' : ''}`} />
                      <span className="text-[11px]">{language === 'mr' ? 'जीपीएस' : 'GPS'}</span>
                    </button>

                    {/* Change Location Button */}
                    <button
                      type="button"
                      onClick={() => setShowLocationPicker(!showLocationPicker)}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-none text-xs font-black flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    >
                      <span>{language === 'mr' ? 'शोध / वॉर्ड' : 'Search / Ward'}</span>
                      <span className="text-[10px]">{showLocationPicker ? '▲' : '▼'}</span>
                    </button>
                  </div>
                </div>

                {/* GPS Status Message if any */}
                {gpsStatus && (
                  <div className="mt-2.5 p-2 rounded-none bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold flex items-center justify-between">
                    <span>{gpsStatus}</span>
                    <button onClick={() => setGpsStatus(null)} className="text-emerald-700 font-bold px-1">✕</button>
                  </div>
                )}

                {/* Collapsible Search and Ward Selector Panel */}
                {showLocationPicker && (
                  <div className="mt-3 pt-3 border-t border-slate-200 space-y-2.5 animate-in fade-in">
                    
                    {/* Quick Interactive Map Callout */}
                    <div className="p-2.5 bg-sky-50 border border-sky-200 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <MapIcon className="w-4 h-4 text-sky-700 shrink-0" />
                        <span className="text-xs text-sky-950 font-bold">
                          {language === 'mr'
                            ? 'नकाशावर अचूक खड्डा किंवा कामाची जागा पिन करायची आहे का?'
                            : 'Want to pinpoint the exact pothole or civic site on the map?'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setShowLocationPicker(false);
                          setShowMapModal(true);
                        }}
                        className="px-3 py-1 bg-[#002b49] hover:bg-[#001f35] text-white text-xs font-black rounded-none shrink-0 cursor-pointer shadow-xs"
                      >
                        {language === 'mr' ? 'मॅप उघडा 🗺️' : 'Open Map 🗺️'}
                      </button>
                    </div>

                    <div className="relative">
                      <div className="flex items-center gap-2 border border-slate-300 rounded-none px-3 py-2 bg-white focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0284c7] transition-all">
                        <Search className="w-4 h-4 text-emerald-700 shrink-0" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowLocationDropdown(true);
                          }}
                          onFocus={() => setShowLocationDropdown(true)}
                          placeholder={language === 'mr' ? 'परिसर किंवा स्टेशन शोधा (उदा. दादर, अंधेरी, वांद्रे, बोरिवली)...' : 'Search area or landmark (Dadar, Andheri, Bandra)...'}
                          className="w-full bg-transparent text-xs sm:text-sm text-slate-900 focus:outline-hidden"
                        />
                        {searchQuery && (
                          <button
                            onClick={() => {
                              setSearchQuery('');
                              setShowLocationDropdown(false);
                            }}
                            className="text-xs text-slate-400 hover:text-slate-600 font-bold px-1"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      {/* Autocomplete Dropdown */}
                      {showLocationDropdown && filteredLocalities.length > 0 && (
                        <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-white border border-slate-300 rounded-none shadow-lg max-h-48 overflow-y-auto divide-y divide-[#f8fafc]">
                          {filteredLocalities.map((loc, idx) => (
                            <div
                              key={idx}
                              onClick={() => {
                                handleSelectLocation(loc);
                                setShowLocationPicker(false);
                              }}
                              className="p-2.5 hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between text-xs"
                            >
                              <div>
                                <div className="font-black text-slate-900">{loc.name}</div>
                                <div className="text-[11px] text-slate-500">{loc.area}</div>
                              </div>
                              <span className="font-mono text-[10px] bg-slate-50 text-slate-900 border border-slate-200 px-2 py-0.5 rounded-none font-black">
                                {language === 'mr' ? `वॉर्ड ${loc.wardId}` : `Ward ${loc.wardId}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Quick Popular Area Chips with Sharp Corners */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-black text-slate-900">
                        {language === 'mr' ? 'द्रुत परिसर:' : 'Quick:'}
                      </span>
                      {MUMBAI_LOCALITIES.slice(0, 5).map((loc, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            handleSelectLocation(loc);
                            setShowLocationPicker(false);
                          }}
                          className="px-2 py-0.5 bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200 rounded-none text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          {loc.name.split('/')[0].trim()}
                        </button>
                      ))}
                    </div>

                    {/* Ward Selector and Done button */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <select
                        value={detectedWard.id}
                        onChange={(e) => {
                          const found = mumbaiWards.find((w) => w.id === e.target.value);
                          if (found) {
                            setDetectedWard(found);
                            setSpecificLandmark(language === 'mr' ? (found.name.mr.split('(')[1]?.replace(')', '') || found.name.mr) : found.keyAreas.split(',')[0]);
                            setCoords({ lat: found.lat, lng: found.lng });
                          }
                        }}
                        className="text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-none px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-[#0284c7] cursor-pointer flex-1"
                      >
                        {mumbaiWards.map((w) => (
                          <option key={w.id} value={w.id}>
                            {language === 'mr' ? `वॉर्ड ${w.id} - ${w.name.mr}` : `Ward ${w.id} (${w.keyAreas.split(',')[0]})`}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => setShowLocationPicker(false)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-none text-xs font-black transition-colors cursor-pointer shadow-2xs"
                      >
                        {language === 'mr' ? 'पूर्ण झाले ✓' : 'Done ✓'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 1.2 MULTI-MODAL COMPLAINT INTAKE: PHOTO / CAMERA & VOICE (SORTED FIRST) */}
              <div className="bg-white border-2 border-slate-300 rounded-none p-4 sm:p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between gap-2 border-b-2 border-slate-100 pb-2.5">
                  <div>
                    <h3 className="font-black text-slate-900 text-sm sm:text-base leading-tight">
                      {language === 'mr' ? 'समस्येचा पुरावा द्या (फोटो / आवाज)' : 'Upload Issue Evidence (Photo / Voice)'}
                    </h3>
                    <p className="text-[11px] text-slate-600 font-semibold">
                      {language === 'mr' ? 'थेट कॅमेऱ्याने फोटो काढा किंवा आपल्या भाषेत बोला' : 'Capture photo directly or speak in your language'}
                    </p>
                  </div>

                  {/* Toggle between Photo and Voice with Sharp Corners */}
                  <div className="flex items-center bg-slate-50 p-1 rounded-none border border-slate-200 text-xs font-bold shrink-0">
                    <button
                      onClick={() => setMode('photo')}
                      className={`px-3 py-1.5 rounded-none flex items-center gap-1.5 transition-all cursor-pointer font-black ${
                        mode === 'photo' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{language === 'mr' ? 'फोटो' : 'Photo'}</span>
                    </button>
                    <button
                      onClick={() => setMode('voice')}
                      className={`px-3 py-1.5 rounded-none flex items-center gap-1.5 transition-all cursor-pointer font-black ${
                        mode === 'voice' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>{language === 'mr' ? 'आवाज' : 'Voice'}</span>
                    </button>
                  </div>
                </div>

                {/* PHOTO / CAMERA MODE */}
                {mode === 'photo' && (
                  <div className="space-y-3.5">
                    {/* Hidden Native File Inputs: 1 for direct camera, 1 for gallery */}
                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    {/* If a custom photo is uploaded, show preview card */}
                    {useCustomPhoto && uploadedImage ? (
                      <div className="p-3.5 bg-slate-50 rounded-none border border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 rounded-none overflow-hidden border border-slate-200 shrink-0">
                            <img src={uploadedImage} alt="Uploaded evidence" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 text-slate-900 font-black text-xs sm:text-sm">
                              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                              <span>{language === 'mr' ? 'फोटो यशस्वीरीत्या जोडला!' : 'Photo Attached Successfully!'}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-xs font-semibold">
                              {uploadedFileName || 'camera_photo.jpg'}
                            </p>
                            <span className="text-[10px] bg-white text-slate-900 border border-slate-200 font-black px-1.5 py-0.5 rounded-none mt-1 inline-block">
                              {language === 'mr' ? 'एआय: ९६% अचूकता · दोष आढळला' : 'AI: 96% Match · Hazard Verified'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <button
                            onClick={() => cameraInputRef.current?.click()}
                            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 rounded-none text-xs font-black cursor-pointer transition-colors"
                          >
                            📸 {language === 'mr' ? 'पुन्हा काढा' : 'Retake'}
                          </button>
                          <button
                            onClick={() => {
                              setUploadedImage(null);
                              setUseCustomPhoto(false);
                            }}
                            className="px-2.5 py-1.5 text-xs text-rose-600 hover:text-rose-800 font-bold cursor-pointer"
                          >
                            ✕ {language === 'mr' ? 'काढून टाका' : 'Remove'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Big, friendly 1-tap Upload Actions with Sharp Corners */
                      <div className="p-4 sm:p-5 bg-white rounded-none border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 text-center">
                        <div className="w-12 h-12 rounded-none bg-slate-50 text-emerald-700 border border-slate-200 flex items-center justify-center">
                          <ImagePlus className="w-6 h-6" />
                        </div>

                        <div>
                          <h4 className="font-black text-slate-900 text-sm sm:text-base">
                            {language === 'mr' ? 'घटनास्थळाचा फोटो जोडा' : 'Add Incident Photo Evidence'}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5 font-medium">
                            {language === 'mr'
                              ? 'थेट कॅमेऱ्यातून फोटो काढा किंवा फोनच्या गॅलरीतून निवडा'
                              : 'Snap photo directly with mobile camera or choose from gallery'}
                          </p>
                        </div>

                        {/* 2 Big Action Buttons: Camera and Gallery */}
                        <div className="flex items-center gap-2.5 flex-wrap justify-center w-full max-w-sm pt-1">
                          <button
                            onClick={() => cameraInputRef.current?.click()}
                            className="flex-1 min-w-[130px] py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-none text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
                          >
                            <Camera className="w-4 h-4" />
                            <span>{language === 'mr' ? 'कॅमेरा उघडा' : 'Take Photo'}</span>
                          </button>

                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-1 min-w-[130px] py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 rounded-none text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
                          >
                            <Upload className="w-4 h-4 text-emerald-700" />
                            <span>{language === 'mr' ? 'गॅलरी / फाईल' : 'Upload File'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* VOICE MODE */}
                {mode === 'voice' && (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-none border-2 border-dashed border-slate-200 gap-3 text-center">
                      <button
                        onClick={handleToggleVoice}
                        className={`w-20 h-20 rounded-none flex items-center justify-center transition-all cursor-pointer shadow-md ${
                          isRecording
                            ? 'bg-rose-600 text-white ring-4 ring-rose-200 animate-pulse'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-[#cbd5e1] hover:scale-105'
                        }`}
                      >
                        <Mic className="w-8 h-8" />
                      </button>

                      <div>
                        <div className="font-black text-slate-900 text-sm sm:text-base">
                          {isRecording
                            ? (language === 'mr' ? `ऐकत आहे... (${voiceSeconds} सेकंद)` : `Listening... (${voiceSeconds}s)`)
                            : (language === 'mr' ? 'तक्रार सांगण्यासाठी मायक्रोफोनवर दाबा' : 'Tap Microphone to Speak Issue')}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">
                          {language === 'mr' ? 'मराठी किंवा इंग्रजीत स्पष्टपणे बोला' : 'Speak clearly in Marathi or English'}
                        </p>
                      </div>

                      {/* Transcribed text box */}
                      <div className="w-full mt-2">
                        <textarea
                          rows={2}
                          value={transcript}
                          onChange={(e) => setTranscript(e.target.value)}
                          placeholder={language === 'mr' ? 'आपला संदेश येथे दिसेल, किंवा थेट टाइप करू शकता...' : 'Transcribed voice will appear here, or type manually...'}
                          className="w-full p-3 rounded-none border border-slate-300 text-xs sm:text-sm text-slate-900 bg-white focus:outline-hidden focus:border-emerald-600"
                        />
                      </div>

                      {/* Sample voice clips for quick test */}
                      <div className="w-full text-left pt-2 border-t border-slate-200">
                        <span className="text-[11px] font-black text-slate-900 mb-1.5 block">
                          {language === 'mr' ? 'नमुना ज्येष्ठ नागरिक आवाज (क्लिक करा):' : 'Sample Prompts (1-Click Test):'}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {sampleVoiceClips.map((clip) => (
                            <button
                              key={clip.id}
                              onClick={() => {
                                setTranscript(clip.transcript);
                                speak(clip.transcript);
                              }}
                              className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 rounded-none text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              🗣️ {clip.speaker}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 1.3 CATEGORY SELECTION with Sharp Corners */}
                <div className="pt-2 border-t-2 border-slate-100">
                  <label className="block text-xs font-black text-slate-900 mb-2">
                    {language === 'mr' ? 'समस्येचा प्रकार (Category)' : 'Issue Category'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {[
                      { id: 'pothole' as Complaint['category'], label: language === 'mr' ? 'खड्डा' : 'Pothole', icon: '🕳️' },
                      { id: 'waterlogging' as Complaint['category'], label: language === 'mr' ? 'पाणी साचणे' : 'Flooding', icon: '🌊' },
                      { id: 'manhole' as Complaint['category'], label: language === 'mr' ? 'मॅनहोल' : 'Manhole', icon: '⚠️' },
                      { id: 'garbage' as Complaint['category'], label: language === 'mr' ? 'कचरा ढीग' : 'Garbage', icon: '🗑️' },
                      { id: 'tree' as Complaint['category'], label: language === 'mr' ? 'झाड पडले' : 'Fallen Tree', icon: '🌳' },
                      { id: 'wire' as Complaint['category'], label: language === 'mr' ? 'विजेची तार / पथदिवा' : 'Wire / Light', icon: '💡' }
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`p-2.5 rounded-none border-2 text-xs font-black flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          selectedCategory === cat.id
                            ? 'bg-emerald-600 text-white border-[#0369a1] shadow-xs'
                            : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-base">{cat.icon}</span>
                        <span>{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 1.4 PRIMARY SUBMIT BUTTON with Sharp Corners */}
                <div className="pt-3">
                  <button
                    onClick={handleSubmitComplaint}
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-[#475569] text-white rounded-none text-sm sm:text-base font-black flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md hover:shadow-lg border border-[#0369a1]"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{language === 'mr' ? 'तक्रार मनपाकडे दाखल करा (Submit Complaint)' : 'Submit Complaint to BMC'}</span>
                  </button>
                </div>
              </div>

              {/* 1.5 NEARBY ISSUES DEDUPLICATION WARNING (If complaints exist in current ward) */}
              {nearby.length > 0 && (
                <div className="bg-white border-2 border-slate-300 rounded-none p-4 sm:p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b-2 border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-none bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-xs sm:text-sm">
                          {language === 'mr' ? 'वॉर्ड ' + detectedWard.id + ' मधील आधीपासून प्रलंबित तक्रारी' : 'Already Reported in Ward ' + detectedWard.id}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {language === 'mr' ? 'डुप्लिकेट तक्रार न करता "+१ मलाही दिसतंय" वर क्लिक करा' : 'Tap "+1 Me Too" to escalate without creating duplicate ticket'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveNavSection('see')}
                      className="text-xs font-black text-emerald-700 hover:underline cursor-pointer"
                    >
                      {language === 'mr' ? 'सर्व पहा ➔' : 'View All ➔'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {nearby.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-none border border-slate-300 bg-white hover:border-slate-300 flex flex-col justify-between gap-2"
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="w-12 h-12 rounded-none overflow-hidden border border-slate-200 shrink-0">
                            <CivicPhotoDisplay type={item.photoUrl} className="w-full h-full" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[10px] text-slate-500 font-black">#{item.ticketNumber}</div>
                            <div className="text-xs font-black text-slate-900 truncate">
                              {getComplaintTitle(item, language)}
                            </div>
                            <div className="text-[10px] text-slate-500 truncate font-medium">{item.locationAddress}</div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                          <span className="text-[10px] font-black text-slate-900">
                            {item.upvotes} {language === 'mr' ? 'नागरिकांची नोंद' : 'Citizens reported'}
                          </span>

                          <button
                            onClick={() => handleMeToo(item.id)}
                            className={`px-2.5 py-1 text-xs rounded-none font-black flex items-center gap-1 cursor-pointer transition-colors shadow-2xs ${
                              item.userUpvoted
                                ? 'bg-[#0f172a] text-white'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>{item.userUpvoted ? (language === 'mr' ? '✓ नोंदवले' : '✓ Escalated') : (language === 'mr' ? '+१ मलाही' : '+1 Me Too')}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* SECTION 2: SEE COMPLAINTS (तक्रारी पहा / सर्व तक्रारी)           */}
          {/* ============================================================== */}
          {activeNavSection === 'see' && (
            <div className="bg-white border-2 border-slate-300 rounded-none p-4 sm:p-6 shadow-xs space-y-4">
              
              {/* Header with Title and Submit CTA */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-none bg-slate-50 text-emerald-700 border border-slate-200 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      {language === 'mr' ? 'सर्व नागरी तक्रारी व परिसरातील समस्या' : 'All Civic Complaints & Community Issues'}
                    </h3>
                    <p className="text-xs text-slate-600 font-semibold">
                      {language === 'mr'
                        ? 'परिसरातील समस्या पहा, "+१ मलाही दिसतंय" सहमती नोंदवा व थेट प्रगती तपासा'
                        : 'Browse public issues, vote with "+1 Me Too" and track live remediation progress'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveNavSection('submit')}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-none text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs self-start sm:self-auto"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{language === 'mr' ? 'नवीन तक्रार नोंदवा' : 'Report New Issue'}</span>
                </button>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="space-y-2.5">
                <div className="relative">
                  <div className="flex items-center gap-2 border border-slate-300 rounded-none px-3 py-2 bg-white focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0284c7] transition-all">
                    <Search className="w-4 h-4 text-emerald-700 shrink-0" />
                    <input
                      type="text"
                      value={seeSearchQuery}
                      onChange={(e) => setSeeSearchQuery(e.target.value)}
                      placeholder={language === 'mr' ? 'तक्रार क्रमांक (उदा. BMC-2026), रस्ता, किंवा समस्या शोधा...' : 'Search by Ticket No (e.g. BMC-2026), street, or issue keyword...'}
                      className="w-full bg-transparent text-xs sm:text-sm text-slate-900 focus:outline-hidden"
                    />
                    {seeSearchQuery && (
                      <button onClick={() => setSeeSearchQuery('')} className="text-xs text-slate-400 hover:text-slate-600 font-bold px-1">
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Filter Controls with Sharp Corners */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  {/* Status Filter */}
                  <div className="flex items-center bg-slate-50 p-1 rounded-none border border-slate-200 font-black gap-1">
                    <button
                      onClick={() => setSeeStatusFilter('all')}
                      className={`px-2.5 py-1 rounded-none transition-all cursor-pointer ${
                        seeStatusFilter === 'all' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-900 hover:bg-white'
                      }`}
                    >
                      {language === 'mr' ? 'सर्व' : 'All'}
                    </button>
                    <button
                      onClick={() => setSeeStatusFilter('new')}
                      className={`px-2.5 py-1 rounded-none transition-all cursor-pointer ${
                        seeStatusFilter === 'new' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-900 hover:bg-white'
                      }`}
                    >
                      {getTranslation('statusPending', language)}
                    </button>
                    <button
                      onClick={() => setSeeStatusFilter('in_progress')}
                      className={`px-2.5 py-1 rounded-none transition-all cursor-pointer ${
                        seeStatusFilter === 'in_progress' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-900 hover:bg-white'
                      }`}
                    >
                      {getTranslation('statusInProgress', language)}
                    </button>
                    <button
                      onClick={() => setSeeStatusFilter('resolved')}
                      className={`px-2.5 py-1 rounded-none transition-all cursor-pointer ${
                        seeStatusFilter === 'resolved' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-900 hover:bg-white'
                      }`}
                    >
                      {getTranslation('statusResolved', language)}
                    </button>
                  </div>

                  {/* Ward Dropdown */}
                  <div className="flex items-center gap-2">
                    <select
                      value={seeFilterWard}
                      onChange={(e) => setSeeFilterWard(e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-none text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#0284c7]"
                    >
                      <option value="all">{language === 'mr' ? 'सर्व वॉर्ड (२४)' : 'All 24 Wards'}</option>
                      {mumbaiWards.map((w) => (
                        <option key={w.id} value={w.id}>
                          {language === 'mr' ? `वॉर्ड ${w.id} - ${w.name.mr}` : `Ward ${w.id} (${w.keyAreas.split(',')[0]})`}
                        </option>
                      ))}
                    </select>

                    {/* Category Dropdown */}
                    <select
                      value={seeCategoryFilter}
                      onChange={(e) => setSeeCategoryFilter(e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-none text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#0284c7]"
                    >
                      <option value="all">{language === 'mr' ? 'सर्व समस्या प्रकार' : 'All Categories'}</option>
                      <option value="pothole">{language === 'mr' ? 'खड्डे' : 'Potholes'}</option>
                      <option value="waterlogging">{language === 'mr' ? 'पाणी साचणे' : 'Waterlogging'}</option>
                      <option value="manhole">{language === 'mr' ? 'मॅनहोल' : 'Manholes'}</option>
                      <option value="garbage">{language === 'mr' ? 'कचरा' : 'Garbage'}</option>
                      <option value="tree">{language === 'mr' ? 'झाडे' : 'Trees'}</option>
                      <option value="wire">{language === 'mr' ? 'विजेची तार' : 'Electrical / Light'}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Complaints List Cards */}
              <div className="space-y-4 pt-1">
                {filteredSeeComplaints.length === 0 ? (
                  <div className="py-12 px-4 text-center bg-white rounded-none border-2 border-dashed border-slate-200 space-y-3">
                    <div className="w-12 h-12 rounded-none bg-slate-50 text-emerald-700 border border-slate-200 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-sm sm:text-base">
                        {complaints.length === 0 
                          ? getTranslation('noComplaintsTitle', language)
                          : (language === 'mr' ? 'निवडलेल्या फिल्टरनुसार कोणतीही तक्रार आढळली नाही' : 'No complaints match the selected filters')}
                      </h4>
                      <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                        {complaints.length === 0 
                          ? getTranslation('noComplaintsDesc', language)
                          : (language === 'mr' ? 'कृपया शोध शब्द बदला किंवा सर्व वॉर्ड निवडा.' : 'Try changing search query or select All Wards.')}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                      <button
                        onClick={() => setActiveNavSection('submit')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-none text-xs font-black cursor-pointer transition-colors shadow-2xs"
                      >
                        + {language === 'mr' ? 'पहिली तक्रार नोंदवा' : 'Report First Complaint'}
                      </button>
                      <button
                        onClick={handleLoadDemoData}
                        className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 rounded-none text-xs font-black cursor-pointer transition-colors"
                      >
                        ⚡ {getTranslation('loadDemoDataBtn', language)}
                      </button>
                    </div>
                  </div>
                ) : (
                  filteredSeeComplaints.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-none border-2 transition-all shadow-xs space-y-3 ${
                        item.userUpvoted
                          ? 'border-slate-300 bg-slate-50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {/* Top Row: Photo, Title, Ward, Upvote Button */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-none overflow-hidden border border-slate-200">
                            <CivicPhotoDisplay type={item.photoUrl} className="w-full h-full" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap font-bold">
                              <span className="font-mono font-black text-slate-900">#{item.ticketNumber}</span>
                              <span>·</span>
                              <span className="font-bold text-slate-900">{language === 'mr' ? `वॉर्ड ${item.wardId}` : `Ward ${item.wardId}`}</span>
                              <span>·</span>
                              <span>{item.reportedAt}</span>
                            </div>

                            <h4 className="font-black text-slate-900 text-sm sm:text-base mt-0.5 leading-snug">
                              {getComplaintTitle(item, language)}
                            </h4>

                            <p className="text-xs text-slate-600 truncate mt-0.5">
                              {item.locationAddress}
                            </p>
                          </div>
                        </div>

                        {/* Action buttons on card */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => setViewMapComplaint(item)}
                            title={language === 'mr' ? 'नकाशावर तक्रार पहा' : 'View complaint location on map'}
                            className="px-2.5 py-1.5 bg-slate-50 hover:bg-sky-50 text-slate-900 hover:text-sky-900 border border-slate-300 rounded-none text-xs font-black flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <MapIcon className="w-3.5 h-3.5 text-sky-600" />
                            <span>{language === 'mr' ? 'मॅप' : 'Map'}</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveNavSection('track');
                              setTicketSearchQuery(item.ticketNumber);
                            }}
                            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-300 rounded-none text-xs font-black transition-colors cursor-pointer"
                          >
                            ⚡ {language === 'mr' ? 'ट्रॅक' : 'Track'}
                          </button>

                          <button
                            onClick={() => handleMeToo(item.id)}
                            className={`px-3.5 py-1.5 rounded-none text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs ${
                              item.userUpvoted
                                ? 'bg-[#0f172a] text-white'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            }`}
                          >
                            <ThumbsUp className={`w-3.5 h-3.5 ${item.userUpvoted ? 'fill-current' : ''}`} />
                            <span>
                              {item.userUpvoted
                                ? (language === 'mr' ? 'सहमती ✓' : 'Escalated ✓')
                                : getTranslation('meTooButton', language)}
                            </span>
                            <span className="ml-1 bg-black/20 px-1.5 py-0.2 rounded-none text-[10px]">
                              {item.upvotes}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Step Progress Bar on Card */}
                      <div className="pt-2 border-t border-slate-200">
                        <ComplaintProgressBar complaint={item} language={language} compact={false} />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Data controls footer */}
              {complaints.length > 0 && (
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-900">
                  <span className="font-bold">{filteredSeeComplaints.length} {language === 'mr' ? 'तक्रारी दाखवत आहे' : 'complaints showing'}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleLoadDemoData}
                      className="text-emerald-700 hover:underline font-black cursor-pointer"
                    >
                      + {getTranslation('loadDemoDataBtn', language)}
                    </button>
                    <span>·</span>
                    <button
                      onClick={handleClearAll}
                      className="text-rose-600 hover:underline font-bold cursor-pointer"
                    >
                      {getTranslation('clearAllDataBtn', language)}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* SECTION 3: TRACK COMPLAINT (तक्रार ट्रॅक करा)                   */}
          {/* ============================================================== */}
          {activeNavSection === 'track' && (
            <div className="bg-white border-2 border-slate-300 rounded-none p-4 sm:p-6 shadow-xs space-y-4">
              
              {/* Header with Sharp Corners */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-none bg-slate-50 text-emerald-700 border border-slate-200 flex items-center justify-center shrink-0">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      {getTranslation('trackerTitle', language)}
                    </h3>
                    <p className="text-xs text-slate-600 font-semibold">
                      {language === 'mr'
                        ? 'आपल्या तक्रारीची प्रगती पायरी-दर-पायरी (Pending, In-Progress, Resolved) थेट ट्रॅक करा'
                        : 'Track your complaints with real-time step progress (Pending, In-Progress, Resolved)'}
                    </p>
                  </div>
                </div>

                {/* Status Filter buttons with Sharp Corners */}
                <div className="flex items-center bg-slate-50 p-1 rounded-none text-xs font-black gap-1 border border-slate-200 self-start sm:self-auto">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-2.5 py-1 rounded-none cursor-pointer transition-all ${
                      statusFilter === 'all' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-900 hover:bg-white'
                    }`}
                  >
                    {getTranslation('allTicketsTab', language)}
                  </button>
                  <button
                    onClick={() => setStatusFilter('new')}
                    className={`px-2.5 py-1 rounded-none cursor-pointer transition-all ${
                      statusFilter === 'new' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-900 hover:bg-white'
                    }`}
                  >
                    {getTranslation('statusPending', language)}
                  </button>
                  <button
                    onClick={() => setStatusFilter('in_progress')}
                    className={`px-2.5 py-1 rounded-none cursor-pointer transition-all ${
                      statusFilter === 'in_progress' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-900 hover:bg-white'
                    }`}
                  >
                    {getTranslation('statusInProgress', language)}
                  </button>
                  <button
                    onClick={() => setStatusFilter('resolved')}
                    className={`px-2.5 py-1 rounded-none cursor-pointer transition-all ${
                      statusFilter === 'resolved' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-900 hover:bg-white'
                    }`}
                  >
                    {getTranslation('statusResolved', language)}
                  </button>
                </div>
              </div>

              {/* Ticket Search Bar with Sharp Corners */}
              <div className="relative">
                <div className="flex items-center gap-2 border border-slate-300 rounded-none px-3 py-2 bg-white focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0284c7] transition-all">
                  <Search className="w-4 h-4 text-emerald-700 shrink-0" />
                  <input
                    type="text"
                    value={ticketSearchQuery}
                    onChange={(e) => setTicketSearchQuery(e.target.value)}
                    placeholder={getTranslation('searchTicketPlaceholder', language)}
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-900 focus:outline-hidden"
                  />
                  {ticketSearchQuery && (
                    <button
                      onClick={() => setTicketSearchQuery('')}
                      className="text-xs text-slate-400 hover:text-slate-600 font-bold px-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* List of Tracked Complaints with Step-Progress Bar */}
              <div className="space-y-4">
                {complaints.length === 0 ? (
                  <div className="py-12 px-4 text-center bg-white rounded-none border-2 border-dashed border-slate-200 space-y-3">
                    <div className="w-12 h-12 rounded-none bg-slate-50 text-emerald-700 border border-slate-200 flex items-center justify-center mx-auto">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-sm sm:text-base">
                        {language === 'mr' ? 'सध्या कोणतीही तक्रार ट्रॅकिंगमध्ये नाही' : 'No Active Tickets to Track'}
                      </h4>
                      <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                        {language === 'mr' ? 'तक्रार नोंदवल्यानंतर आपण येथे तिची थेट स्थिती तपासू शकता.' : 'Once a complaint is submitted, you can track its progress step-by-step here.'}
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveNavSection('submit')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-none text-xs font-black cursor-pointer transition-colors shadow-2xs inline-flex items-center gap-1.5"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>{language === 'mr' ? 'नवीन तक्रार नोंदवा' : 'Submit a Complaint'}</span>
                    </button>
                  </div>
                ) : (
                  complaints
                    .filter((c) => {
                      const matchQuery = !ticketSearchQuery.trim() || 
                        c.ticketNumber.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
                        c.locationAddress.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
                        getComplaintTitle(c, language).toLowerCase().includes(ticketSearchQuery.toLowerCase());

                      if (!matchQuery) return false;
                      if (statusFilter === 'all') return true;
                      if (statusFilter === 'new') return c.status === 'new';
                      if (statusFilter === 'in_progress') return c.status === 'in_progress' || c.status === 'assigned' || c.status === 'verification_pending';
                      if (statusFilter === 'resolved') return c.status === 'resolved';
                      return true;
                    })
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-none border border-slate-300 bg-white hover:border-slate-300 transition-all shadow-xs space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-none overflow-hidden border border-slate-200 shrink-0">
                              <CivicPhotoDisplay type={item.photoUrl} className="w-full h-full" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                                <span className="font-bold text-slate-900">{language === 'mr' ? `वॉर्ड ${item.wardId}` : `Ward ${item.wardId}`}</span>
                                <span>·</span>
                                <span className="font-semibold text-slate-700">{item.assignedAgency}</span>
                                <span>·</span>
                                <span>{item.reportedAt}</span>
                              </div>
                              <h4 className="font-black text-slate-900 text-sm mt-0.5">
                                {getComplaintTitle(item, language)}
                              </h4>
                              <p className="text-xs text-slate-600">{item.locationAddress}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <button
                              type="button"
                              onClick={() => setViewMapComplaint(item)}
                              title={language === 'mr' ? 'नकाशावर तक्रार पहा' : 'View complaint location on map'}
                              className="px-2.5 py-1 rounded-none bg-slate-50 hover:bg-sky-50 text-slate-900 hover:text-sky-900 border border-slate-300 text-xs font-black flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                            >
                              <MapIcon className="w-3.5 h-3.5 text-sky-600" />
                              <span>{language === 'mr' ? 'मॅप' : 'Map'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                playComplaintConfirmationAudio(item.ticketNumber, item.wardId, language);
                              }}
                              title={language === 'mr' ? 'तक्रार पावती ऑडिओ ऐका' : 'Listen to Ticket Audio Confirmation'}
                              className="px-2.5 py-1 rounded-none bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-300 text-xs font-black flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                            >
                              <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                              <span>{language === 'mr' ? 'ऑडिओ ऐका' : 'Listen'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Multi-step progress bar */}
                        <div className="pt-2 border-t border-slate-200">
                          <ComplaintProgressBar complaint={item} language={language} compact={false} />
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* SECTION 4: CONTACT & HELPLINES (संपर्क व हेल्पलाईन)            */}
          {/* ============================================================== */}
          {activeNavSection === 'contact' && (
            <CitizenContactView
              language={language}
              onSelectWardForComplaint={(ward) => {
                setDetectedWard(ward);
                setSpecificLandmark(language === 'mr' ? (ward.name.mr.split('(')[1]?.replace(')', '') || ward.name.mr) : ward.keyAreas.split(',')[0]);
                setCoords({ lat: ward.lat, lng: ward.lng });
                setActiveNavSection('submit');
              }}
            />
          )}

        </div>
      </div>

      {/* Interactive Location Map Picker Modal */}
      <LocationMapPickerModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        initialCoords={coords}
        initialWardId={detectedWard.id}
        initialLandmark={specificLandmark}
        language={language}
        onConfirmLocation={(data) => {
          setCoords({ lat: data.lat, lng: data.lng });
          setDetectedWard(data.ward);
          setSpecificLandmark(data.landmark);
          setGpsStatus(
            language === 'mr'
              ? `📍 मॅपवर निवडलेले अचूक स्थान: वॉर्ड ${data.ward.id}`
              : `📍 Pinpoint Map Location Set: Ward ${data.ward.id}`
          );
        }}
      />

      {/* Ticket Map Location Viewer Modal */}
      <ComplaintMapViewModal
        complaint={viewMapComplaint}
        isOpen={!!viewMapComplaint}
        onClose={() => setViewMapComplaint(null)}
        language={language}
      />
    </div>
  );
};
