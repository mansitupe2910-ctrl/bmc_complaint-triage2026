import React, { useState, useRef } from 'react';
import { Complaint, FieldEngineerUser, Language } from '../../types';
import { getComplaintTitle } from '../../utils/translations';
import { CivicPhotoDisplay } from '../CivicPhotoDisplay';
import confetti from 'canvas-confetti';
import {
  HardHat,
  Search,
  Camera,
  Upload,
  CheckCircle2,
  Clock,
  MapPin,
  AlertCircle,
  RefreshCw,
  Compass,
  X,
  Check,
  ArrowRight
} from 'lucide-react';

interface FieldEngineerPortalProps {
  complaints: Complaint[];
  setComplaints: React.Dispatch<React.SetStateAction<Complaint[]>>;
  engineerUser: FieldEngineerUser;
  language: Language;
  onLogout?: () => void;
}

const PRESET_WORK_PHOTOS = [
  {
    id: 'repair-asphalt-compaction',
    titleEn: 'Asphalt Compaction (रस्ता डांबरीकरण)',
    titleMr: 'रस्ता डांबरीकरण पूर्ण',
  },
  {
    id: 'scen-pothole',
    titleEn: 'Base Tack Coat (खड्डा स्वच्छता व प्रायमर)',
    titleMr: 'खड्डा भरणी पूर्ण',
  },
  {
    id: 'scen-waterlogging',
    titleEn: 'Drain Desilted (नाले सफाई पूर्ण)',
    titleMr: 'गटार सफाई व पाणी निचरा पूर्ण',
  },
  {
    id: 'scen-garbage',
    titleEn: 'Garbage Cleared (कचरा निर्मूलन)',
    titleMr: 'कचरा उचलून परिसर स्वच्छ',
  },
];

export const FieldEngineerPortal: React.FC<FieldEngineerPortalProps> = ({
  complaints,
  setComplaints,
  engineerUser,
  language,
  onLogout,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'submitted' | 'resolved'>('all');
  const [ticketSearchInput, setTicketSearchInput] = useState<string>('');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [searchError, setSearchError] = useState<string>('');
  const [successToast, setSuccessToast] = useState<string>('');

  // Work Done Form State
  const [workPhotoUrl, setWorkPhotoUrl] = useState<string>('repair-asphalt-compaction');
  const [customUploadedImage, setCustomUploadedImage] = useState<string | null>(null);
  const [workTimestamp, setWorkTimestamp] = useState<string>(() => {
    const now = new Date();
    return now.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }) + ' IST';
  });
  const [workLocationTag, setWorkLocationTag] = useState<string>('');
  const [workNotes, setWorkNotes] = useState<string>('Field repair completed as per municipal standard specifications.');
  const [isCapturingGps, setIsCapturingGps] = useState<boolean>(false);

  const workDeskRef = useRef<HTMLDivElement>(null);

  // Filter complaints cleanly
  const filteredComplaints = complaints.filter((c) => {
    if (filterTab === 'pending') {
      return c.status === 'in_progress' || c.status === 'new';
    }
    if (filterTab === 'submitted') {
      return c.status === 'verification_pending';
    }
    if (filterTab === 'resolved') {
      return c.status === 'resolved';
    }
    return true;
  });

  // Select complaint to work on
  const handleSelectComplaint = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setSearchError('');
    setSuccessToast('');

    // Prepopulate GPS tag from complaint address & coordinates
    setWorkLocationTag(
      complaint.locationAddress
        ? `${complaint.lat?.toFixed(4) || '19.1197'}° N, ${complaint.lng?.toFixed(4) || '72.8464'}° E (${complaint.locationAddress})`
        : `${complaint.lat?.toFixed(4) || '19.1197'}° N, ${complaint.lng?.toFixed(4) || '72.8464'}° E`
    );

    handleRefreshTimestamp();

    setTimeout(() => {
      workDeskRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Search by ticket number
  const handleSearchComplaint = () => {
    const query = ticketSearchInput.trim().toLowerCase();
    setSearchError('');
    setSuccessToast('');

    if (!query) {
      setSearchError(language === 'mr' ? 'तक्रार क्रमांक टाका (उदा. 9101)' : 'Enter ticket number (e.g. 9101)');
      return;
    }

    const matched = complaints.find((c) => {
      const t = (c.ticketNumber || '').toLowerCase();
      const id = (c.id || '').toLowerCase();
      return (
        t === query ||
        id === query ||
        t.endsWith(query) ||
        t.replace(/\D/g, '').endsWith(query.replace(/\D/g, ''))
      );
    });

    if (matched) {
      handleSelectComplaint(matched);
    } else {
      setSearchError(
        language === 'mr'
          ? `तक्रार #${query} आढळली नाही. कृपया खालील यादीतून निवडा.`
          : `Ticket #${query} not found. Please choose from the list below.`
      );
    }
  };

  // Refresh Timestamp
  const handleRefreshTimestamp = () => {
    const now = new Date();
    setWorkTimestamp(
      now.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }) + ' IST'
    );
  };

  // Live GPS
  const handleGetLiveLocation = () => {
    if (!navigator.geolocation) return;
    setIsCapturingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsCapturingGps(false);
        const { latitude, longitude } = pos.coords;
        const addr = selectedComplaint?.locationAddress || 'Site Location';
        setWorkLocationTag(`${latitude.toFixed(5)}° N, ${longitude.toFixed(5)}° E (${addr})`);
      },
      () => {
        setIsCapturingGps(false);
        if (selectedComplaint) {
          setWorkLocationTag(`${selectedComplaint.lat}° N, ${selectedComplaint.lng}° E (${selectedComplaint.locationAddress})`);
        }
      },
      { timeout: 6000 }
    );
  };

  // Image Upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCustomUploadedImage(result);
        setWorkPhotoUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Work Done
  const handleSubmitWorkDone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    const finalPhoto = customUploadedImage || workPhotoUrl || 'repair-asphalt-compaction';
    const finalTimestamp = workTimestamp || new Date().toLocaleString() + ' IST';
    const finalLocationTag =
      workLocationTag ||
      `${selectedComplaint.lat || 19.1197}° N, ${selectedComplaint.lng || 72.8464}° E (${selectedComplaint.locationAddress})`;

    const updatedProof = {
      repairPhotoUrl: finalPhoto,
      submittedAt: finalTimestamp,
      engineerName: engineerUser.name,
      engineerId: engineerUser.engineerId,
      locationTag: finalLocationTag,
      timestamp: finalTimestamp,
      supervisorName: 'Ward Field Supervisor',
      workerTeam: 'Ward Maintenance Squad',
      structuralIntegrityScore: 95,
      debrisClearanceScore: 98,
      surfaceSmoothnessScore: 94,
      overallMatchScore: 96,
      passed: true,
      notes: {
        en: workNotes,
        mr: workNotes,
        hi: workNotes,
      },
      repairPhotos: [
        {
          id: `proof-${Date.now()}`,
          url: finalPhoto,
          caption: 'Work Completed by Field Engineer',
          stage: 'after_repair' as const,
          uploadedBy: `${engineerUser.name} (ID: ${engineerUser.engineerId})`,
          role: 'Junior Engineer' as const,
          timestamp: finalTimestamp,
        },
      ],
    };

    const newActivity = {
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event: {
        en: `Engineer ${engineerUser.engineerId} submitted completed work photo with GPS & timestamp`,
        mr: `अभियंता ${engineerUser.engineerId} यांनी काम पूर्ण झाल्याचा फोटो, GPS व वेळेसह सादर केला`,
        hi: `इंजीनियर ${engineerUser.engineerId} ने कार्य पूर्ण फोटो GPS व समय सहित दर्ज किया`,
      },
      actor: `Er. ${engineerUser.name} (${engineerUser.engineerId})`,
    };

    const updatedComplaints = complaints.map((c) => {
      if (c.id === selectedComplaint.id) {
        return {
          ...c,
          status: 'verification_pending' as const,
          proofOfWork: updatedProof,
          activityLog: [newActivity, ...(c.activityLog || [])],
        };
      }
      return c;
    });

    setComplaints(updatedComplaints);

    try {
      localStorage.setItem('bmc_saved_complaints', JSON.stringify(updatedComplaints));
      fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedComplaints),
      }).catch(() => {});
      confetti({ particleCount: 50, spread: 70 });
    } catch {}

    setSuccessToast(
      language === 'mr'
        ? `तक्रार #${selectedComplaint.ticketNumber} चे काम यशस्वीरीत्या जमा झाले! वॉर्ड अधिकारी पडताळणी करतील.`
        : `Work for Ticket #${selectedComplaint.ticketNumber} submitted! Sent to Officer for cross-verification.`
    );

    const refreshed = updatedComplaints.find((c) => c.id === selectedComplaint.id) || null;
    setSelectedComplaint(refreshed);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-5 space-y-5 text-slate-800 text-left">
      
      {/* 1. Ultra-Clean Top Bar */}
      <div className="bg-slate-900 text-white px-4 py-3 rounded-none flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <HardHat className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm sm:text-base">{engineerUser.name}</span>
              <span className="bg-amber-400 text-slate-950 font-mono font-black text-xs px-2 py-0.5">
                ID: {engineerUser.engineerId}
              </span>
            </div>
            <span className="text-xs text-slate-300">
              {language === 'mr' ? `वॉर्ड ${engineerUser.assignedWard}` : `Ward: ${engineerUser.assignedWard}`} · {engineerUser.department}
            </span>
          </div>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
          >
            {language === 'mr' ? 'बाहेर पडा' : 'Log Out'}
          </button>
        )}
      </div>

      {/* 2. Success Alert */}
      {successToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-500 text-emerald-950 text-xs sm:text-sm font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast('')} className="text-emerald-700 font-bold px-1">✕</button>
        </div>
      )}

      {/* 3. Simple Search Box */}
      <div className="bg-white border border-slate-300 p-3 sm:p-4 shadow-2xs flex flex-col sm:flex-row gap-2 items-center">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={ticketSearchInput}
            onChange={(e) => setTicketSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchComplaint()}
            placeholder={
              language === 'mr'
                ? 'तक्रार / तिकीट क्रमांक टाका (उदा. 9101 किंवा BMC-2026-9101)...'
                : 'Enter Ticket Number (e.g. 9101 or BMC-2026-9101)...'
            }
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 font-mono text-sm font-bold focus:bg-white focus:border-amber-600 focus:outline-hidden"
          />
        </div>
        <button
          onClick={handleSearchComplaint}
          type="button"
          className="w-full sm:w-auto px-5 py-2 bg-amber-600 hover:bg-amber-700 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Search className="w-4 h-4" />
          <span>{language === 'mr' ? 'तक्रार उघडा' : 'Open Ticket'}</span>
        </button>
      </div>

      {searchError && (
        <div className="p-2.5 bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{searchError}</span>
        </div>
      )}

      {/* 4. FOCUSED WORK DESK (When a Complaint is selected) */}
      {selectedComplaint && (
        <div ref={workDeskRef} className="bg-white border-2 border-emerald-600 shadow-md p-4 sm:p-5 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-slate-900 text-white font-mono text-xs font-bold px-2 py-0.5">
                  #{selectedComplaint.ticketNumber}
                </span>
                <span className="text-xs font-bold text-slate-600">
                  वॉर्ड {selectedComplaint.wardId}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 uppercase ${
                  selectedComplaint.status === 'verification_pending'
                    ? 'bg-purple-100 text-purple-900'
                    : selectedComplaint.status === 'resolved'
                    ? 'bg-emerald-100 text-emerald-900'
                    : 'bg-amber-100 text-amber-900'
                }`}>
                  {selectedComplaint.status === 'verification_pending'
                    ? (language === 'mr' ? 'पडताळणी प्रलंबित' : 'Verification Pending')
                    : selectedComplaint.status === 'resolved'
                    ? (language === 'mr' ? 'निकाली' : 'Resolved')
                    : (language === 'mr' ? 'काम चालू' : 'In Progress')}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                {getComplaintTitle(selectedComplaint, language)}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedComplaint.locationAddress}</span>
              </p>
            </div>

            <button
              onClick={() => setSelectedComplaint(null)}
              className="p-1 text-slate-400 hover:text-slate-700"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Simple Side-by-Side: Before vs After Photo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Problem (Before) */}
            <div className="border border-rose-200 bg-rose-50/20 p-3 space-y-2">
              <span className="text-xs font-bold text-rose-800 block">
                {language === 'mr' ? '१. मूळ समस्या (नागरिकाचा फोटो):' : '1. Original Problem (Citizen Photo):'}
              </span>
              <CivicPhotoDisplay
                type={selectedComplaint.photoUrl}
                className="aspect-16/10 w-full border border-rose-200"
              />
              <p className="text-xs text-slate-600 line-clamp-2">
                {selectedComplaint.description[language] || selectedComplaint.description.en}
              </p>
            </div>

            {/* 2. Completed Work (After) */}
            <div className="border border-emerald-300 bg-emerald-50/30 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900">
                  {language === 'mr' ? '२. पूर्ण कामाचा फोटो (Work Done):' : '2. Completed Work Photo:'}
                </span>
                <span className="font-mono text-xs bg-emerald-700 text-white px-2 py-0.2 font-bold">
                  ID: {engineerUser.engineerId}
                </span>
              </div>

              <CivicPhotoDisplay
                type={customUploadedImage || workPhotoUrl}
                isProofOfWorkRepair={true}
                className="aspect-16/10 w-full border border-emerald-500"
              />

              {/* Photo Upload / Selection Buttons */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-2">
                  <label className="flex-1 py-1.5 px-3 bg-white border border-emerald-600 hover:bg-emerald-50 text-xs font-bold text-emerald-900 cursor-pointer flex items-center justify-center gap-1.5 transition-colors">
                    <Camera className="w-4 h-4 text-emerald-700" />
                    <span>{language === 'mr' ? 'कॅमेरा / फोटो अपलोड करा' : 'Upload From Device / Camera'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                  {customUploadedImage && (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomUploadedImage(null);
                        setWorkPhotoUrl('repair-asphalt-compaction');
                      }}
                      className="text-xs text-rose-600 font-bold px-2"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* Clean Sample Photo Selector Chips */}
                <div className="flex flex-wrap gap-1">
                  {PRESET_WORK_PHOTOS.map((p) => {
                    const isSelected = workPhotoUrl === p.id && !customUploadedImage;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setCustomUploadedImage(null);
                          setWorkPhotoUrl(p.id);
                        }}
                        className={`text-[11px] px-2 py-1 border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-700 text-white border-emerald-800 font-bold'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {language === 'mr' ? p.titleMr : p.titleEn}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Simple Form: Tags and Submit */}
          <form onSubmit={handleSubmitWorkDone} className="bg-slate-50 border border-slate-200 p-3 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Timestamp */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{language === 'mr' ? 'काम पूर्ण वेळ (Timestamp):' : 'Work Timestamp:'}</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleRefreshTimestamp}
                    className="text-[10px] text-emerald-700 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    <span>Sync</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={workTimestamp}
                  onChange={(e) => setWorkTimestamp(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 font-mono text-xs text-slate-900"
                />
              </div>

              {/* Location Tag */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{language === 'mr' ? 'GPS स्थान टॅग (Location Tag):' : 'GPS Location Tag:'}</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGetLiveLocation}
                    disabled={isCapturingGps}
                    className="text-[10px] text-emerald-700 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <Compass className="w-2.5 h-2.5" />
                    <span>{isCapturingGps ? '...' : 'GPS'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={workLocationTag}
                  onChange={(e) => setWorkLocationTag(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 font-mono text-xs text-slate-900 truncate"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>
                  {language === 'mr'
                    ? 'कामाचा पुरावा सादर करा (Submit Work Done)'
                    : `Submit Work Done (ID ${engineerUser.engineerId})`}
                </span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 5. Clean Complaints Feed */}
      <div className="bg-white border border-slate-300 p-3 sm:p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
          <h2 className="text-sm sm:text-base font-bold text-slate-900">
            {language === 'mr' ? 'तक्रारींची यादी (तक्रार निवडा):' : 'Complaints Feed (Select to Work):'}
          </h2>

          {/* Clean Filter Tabs */}
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-2.5 py-1 font-bold border transition-colors ${
                filterTab === 'all'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {language === 'mr' ? 'सर्व' : 'All'} ({complaints.length})
            </button>
            <button
              onClick={() => setFilterTab('pending')}
              className={`px-2.5 py-1 font-bold border transition-colors ${
                filterTab === 'pending'
                  ? 'bg-amber-600 text-slate-950 border-amber-700'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {language === 'mr' ? 'काम बाकी' : 'Pending'}
            </button>
            <button
              onClick={() => setFilterTab('submitted')}
              className={`px-2.5 py-1 font-bold border transition-colors ${
                filterTab === 'submitted'
                  ? 'bg-purple-700 text-white border-purple-800'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {language === 'mr' ? 'सादर केले' : 'Submitted'}
            </button>
            <button
              onClick={() => setFilterTab('resolved')}
              className={`px-2.5 py-1 font-bold border transition-colors ${
                filterTab === 'resolved'
                  ? 'bg-emerald-600 text-white border-emerald-700'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {language === 'mr' ? 'मंजूर' : 'Approved'}
            </button>
          </div>
        </div>

        {/* Complaints Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredComplaints.length === 0 ? (
            <div className="col-span-full py-8 text-center text-slate-500 text-xs">
              {language === 'mr' ? 'या वर्गात तक्रारी नाहीत.' : 'No complaints under this filter.'}
            </div>
          ) : (
            filteredComplaints.map((item) => {
              const isSelected = selectedComplaint?.id === item.id;
              const isPendingVerification = item.status === 'verification_pending';
              const isResolved = item.status === 'resolved';

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectComplaint(item)}
                  className={`p-3 border rounded-none cursor-pointer transition-all flex flex-col justify-between text-left ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500 shadow-xs'
                      : 'border-slate-300 bg-white hover:border-amber-500 hover:shadow-xs'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-slate-900">
                        #{item.ticketNumber}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.2 font-bold uppercase ${
                        isResolved
                          ? 'bg-emerald-100 text-emerald-800'
                          : isPendingVerification
                          ? 'bg-purple-100 text-purple-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        {isResolved
                          ? '✓ मंजूर'
                          : isPendingVerification
                          ? '⏳ पडताळणी'
                          : 'काम बाकी'}
                      </span>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-14 h-12 shrink-0 border border-slate-200 overflow-hidden bg-slate-100">
                        <CivicPhotoDisplay type={item.photoUrl} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-slate-900 line-clamp-1">
                          {getComplaintTitle(item, language)}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {item.locationAddress}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-emerald-800 font-bold">
                    <span>{language === 'mr' ? 'काम करा' : 'Work on this'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
};
