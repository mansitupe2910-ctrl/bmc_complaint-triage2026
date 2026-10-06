import React, { useState } from 'react';
import { Complaint, Language, DepartmentId, ProofPhotoItem } from '../../types';
import { getTranslation, getComplaintTitle } from '../../utils/translations';
import { mumbaiWards, bmcDepartments, initialComplaints } from '../../data/mockData';
import { CivicPhotoDisplay } from '../CivicPhotoDisplay';
import { ComplaintProgressBar } from '../ComplaintProgressBar';
import { ComplaintMapViewModal } from '../ComplaintMapViewModal';
import { OfficerAnalyticsCharts } from './OfficerAnalyticsCharts';
import { BeforeAfterSplitSlider } from './BeforeAfterSplitSlider';
import { ResolutionCertificateModal } from './ResolutionCertificateModal';
import { MumbaiGisCommandMap } from './MumbaiGisCommandMap';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Clock,
  Building2,
  FileCheck,
  Check,
  X,
  Filter,
  ArrowRight,
  RotateCcw,
  Camera,
  Upload,
  User,
  HardHat,
  Eye,
  CheckSquare,
  MessageSquare,
  ShieldCheck,
  Trash2,
  Plus,
  Map as MapIcon
} from 'lucide-react';

interface OfficerCommandCenterProps {
  complaints: Complaint[];
  setComplaints: React.Dispatch<React.SetStateAction<Complaint[]>>;
  language: Language;
  highContrast: boolean;
}

export const OfficerCommandCenter: React.FC<OfficerCommandCenterProps> = ({
  complaints,
  setComplaints,
  language,
}) => {
  const [selectedWard, setSelectedWard] = useState<string>('all');
  const [activeVerification, setActiveVerification] = useState<Complaint | null>(null);
  const [reassignTarget, setReassignTarget] = useState<Complaint | null>(null);
  const [viewMapComplaint, setViewMapComplaint] = useState<Complaint | null>(null);
  const [inspectionViewMode, setInspectionViewMode] = useState<'side-by-side' | 'slider'>('side-by-side');
  const [certificateComplaint, setCertificateComplaint] = useState<Complaint | null>(null);
  const [officerViewMode, setOfficerViewMode] = useState<'queue' | 'map'>('queue');

  // Selected proof photo for inspector deep-dive view
  const [selectedProofPhotoIndex, setSelectedProofPhotoIndex] = useState<number>(0);
  const [officerReviewNotes, setOfficerReviewNotes] = useState<string>('');
  const [showAddPhotoForm, setShowAddPhotoForm] = useState<boolean>(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState<string>('');
  const [newPhotoCaption, setNewPhotoCaption] = useState<string>('');
  const [newPhotoUploader, setNewPhotoUploader] = useState<string>('Er. Sachin Shinde (JE)');
  const [newPhotoRole, setNewPhotoRole] = useState<'Worker' | 'Junior Engineer' | 'Site Supervisor' | 'Contractor'>('Junior Engineer');
  const [newPhotoStage, setNewPhotoStage] = useState<'during_work' | 'after_repair' | 'site_supervision' | 'material_check'>('after_repair');

  // Proof-of-Work Approve with officer configured remarks
  const handleApprove = (id: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: 'resolved',
            proofOfWork: c.proofOfWork
              ? {
                  ...c.proofOfWork,
                  verifiedAt: language === 'mr' ? 'आत्ताच' : 'Just now',
                  verifiedBy: language === 'mr' ? 'वॉर्ड अधिकारी (मंजूर)' : 'Ward Officer (Approved)',
                  officerRemarks: officerReviewNotes || c.proofOfWork.officerRemarks
                }
              : undefined
          };
        }
        return c;
      })
    );
    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch(e) {}
    setActiveVerification((prev) => (prev ? { ...prev, status: 'resolved' } : null));
    setOfficerReviewNotes('');
  };

  // Proof-of-Work Reject with demand for site supervisor / worker rework
  const handleReject = (id: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: 'in_progress',
            proofOfWork: c.proofOfWork
              ? {
                  ...c.proofOfWork,
                  officerRemarks: officerReviewNotes || 'Rejected by Officer - Site rework required.'
                }
              : undefined
          };
        }
        return c;
      })
    );
    setActiveVerification((prev) => (prev ? { ...prev, status: 'in_progress' } : null));
  };

  // Officer configuration: Add a new site inspection or worker photograph to the ticket proof
  const handleAddProofPhoto = () => {
    if (!activeVerification) return;
    const photoToAdd: ProofPhotoItem = {
      id: `photo-${Date.now()}`,
      url: newPhotoUrl.trim() || 'repair-asphalt-compaction',
      caption: newPhotoCaption.trim() || (language === 'mr' ? 'साइट कामाचा छायाचित्र पुरावा' : 'Site inspection photo proof'),
      stage: newPhotoStage,
      uploadedBy: newPhotoUploader.trim() || 'Field Team',
      role: newPhotoRole,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === activeVerification.id) {
          const currentPow = c.proofOfWork || {
            repairPhotoUrl: photoToAdd.url,
            submittedAt: 'Just now',
            engineerName: newPhotoUploader,
            structuralIntegrityScore: 95,
            debrisClearanceScore: 95,
            surfaceSmoothnessScore: 92,
            overallMatchScore: 95,
            passed: true,
            notes: { en: 'Photo verified on site.', mr: 'साइटवर फोटो पडताळणी झाली.', hi: 'साइट पर फोटो सत्यापित।' }
          };
          const existingPhotos = currentPow.repairPhotos || [
            {
              id: 'p-default',
              url: currentPow.repairPhotoUrl || 'repair-asphalt-compaction',
              caption: 'Primary Repair Proof',
              stage: 'after_repair' as const,
              uploadedBy: currentPow.engineerName || 'Site Engineer',
              role: 'Junior Engineer' as const,
              timestamp: '11:40 AM'
            }
          ];
          const updatedPow = {
            ...currentPow,
            repairPhotos: [...existingPhotos, photoToAdd]
          };
          return { ...c, proofOfWork: updatedPow };
        }
        return c;
      })
    );

    setActiveVerification((prev) => {
      if (!prev) return null;
      const currentPow = prev.proofOfWork || {
        repairPhotoUrl: photoToAdd.url,
        submittedAt: 'Just now',
        engineerName: newPhotoUploader,
        structuralIntegrityScore: 95,
        debrisClearanceScore: 95,
        surfaceSmoothnessScore: 92,
        overallMatchScore: 95,
        passed: true,
        notes: { en: 'Photo verified on site.', mr: 'साइटवर फोटो पडताळणी झाली.', hi: 'साइट पर फोटो सत्यापित।' }
      };
      const existingPhotos = currentPow.repairPhotos || [
        {
          id: 'p-default',
          url: currentPow.repairPhotoUrl || 'repair-asphalt-compaction',
          caption: 'Primary Repair Proof',
          stage: 'after_repair' as const,
          uploadedBy: currentPow.engineerName || 'Site Engineer',
          role: 'Junior Engineer' as const,
          timestamp: '11:40 AM'
        }
      ];
      return {
        ...prev,
        proofOfWork: {
          ...currentPow,
          repairPhotos: [...existingPhotos, photoToAdd]
        }
      };
    });

    setNewPhotoUrl('');
    setNewPhotoCaption('');
    setShowAddPhotoForm(false);
  };

  // Officer configuration: Delete an invalid or rejected photograph from the audit trail
  const handleDeleteProofPhoto = (photoId: string) => {
    if (!activeVerification || !activeVerification.proofOfWork) return;

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === activeVerification.id && c.proofOfWork && c.proofOfWork.repairPhotos) {
          const updatedPhotos = c.proofOfWork.repairPhotos.filter((p) => p.id !== photoId);
          return {
            ...c,
            proofOfWork: {
              ...c.proofOfWork,
              repairPhotos: updatedPhotos
            }
          };
        }
        return c;
      })
    );

    setActiveVerification((prev) => {
      if (!prev || !prev.proofOfWork || !prev.proofOfWork.repairPhotos) return prev;
      const updatedPhotos = prev.proofOfWork.repairPhotos.filter((p) => p.id !== photoId);
      return {
        ...prev,
        proofOfWork: {
          ...prev.proofOfWork,
          repairPhotos: updatedPhotos
        }
      };
    });

    setSelectedProofPhotoIndex(0);
  };

  // Reassign Department
  const handleReassign = (complaintId: string, deptId: DepartmentId) => {
    const dept = bmcDepartments.find((d) => d.id === deptId);
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          return {
            ...c,
            assignedDepartment: deptId,
            assignedOfficer: dept ? dept.leadOfficer : c.assignedOfficer
          };
        }
        return c;
      })
    );
    setReassignTarget(null);
  };

  // Quick Status Updater for Officer Desk
  const handleStatusChange = (id: string, newStatus: Complaint['status']) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  // Load demo data
  const handleLoadDemo = () => {
    setComplaints(initialComplaints);
    try {
      fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(initialComplaints)
      }).catch(() => {});
    } catch (e) {}
  };

  // Sort complaints by real-time Priority Score
  const filtered = complaints
    .filter((c) => selectedWard === 'all' || c.wardId === selectedWard)
    .sort((a, b) => b.priorityScore - a.priorityScore);

  return (
    <div className="w-full py-5 px-3 sm:px-6 bg-slate-50 min-h-screen max-w-full overflow-x-hidden text-slate-900">
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-5">

        {/* 1. Command Center Header with Sharp Corners */}
        <div className="bg-white border-2 border-slate-300 rounded-none p-4 sm:p-5 shadow-xs space-y-4 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-none bg-emerald-600 animate-pulse shrink-0" />
                <h1 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                  {language === 'mr' ? 'वॉर्ड तक्रार निवारण व सनियंत्रण कक्ष' : 'Ward Complaint Resolution Desk'}
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold">
                {language === 'mr'
                  ? 'नागरिकांच्या तक्रारींचे त्वरित निवारण व प्रगती अहवाल'
                  : 'Track, dispatch, and resolve citizen grievances with photo verification'}
              </p>
            </div>
          </div>

          {/* Quick Stats Summary & Simple Ward Filter with Sharp Corners */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 w-full min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-none text-xs flex items-center gap-1.5 font-bold">
                <span className="text-slate-500 font-medium">{language === 'mr' ? 'एकूण तक्रारी:' : 'Total:'}</span>
                <span className="font-black text-slate-900">{complaints.length}</span>
              </div>
              <div className="px-3 py-1.5 bg-amber-50 border border-amber-300 rounded-none text-xs flex items-center gap-1.5 font-bold">
                <span className="text-amber-800 font-medium">{language === 'mr' ? 'प्रलंबित:' : 'Pending:'}</span>
                <span className="font-black text-amber-950">{complaints.filter(c => c.status !== 'resolved').length}</span>
              </div>
              <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-300 rounded-none text-xs flex items-center gap-1.5 font-bold">
                <span className="text-emerald-800 font-medium">{language === 'mr' ? 'निकाली:' : 'Resolved:'}</span>
                <span className="font-black text-emerald-950">{complaints.filter(c => c.status === 'resolved').length}</span>
              </div>
            </div>

            {/* Clear Ward Filter Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto min-w-0">
              <label htmlFor="officer-ward-select" className="text-xs sm:text-sm font-black text-slate-900 shrink-0">
                {language === 'mr' ? 'वॉर्ड निवडा:' : 'Select Ward:'}
              </label>
              <select
                id="officer-ward-select"
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="w-full sm:w-auto min-w-0 flex-1 sm:max-w-xs px-3 py-2 border border-slate-300 rounded-none font-bold bg-white text-slate-900 text-xs sm:text-sm cursor-pointer focus:outline-hidden focus:border-emerald-600 transition-all shadow-2xs truncate"
              >
                <option value="all">
                  {language === 'mr' ? 'सर्व मुंबई वॉर्ड (२४ वॉर्ड)' : 'All 24 Mumbai Wards'}
                </option>
                {mumbaiWards.map((w) => (
                  <option key={w.id} value={w.id}>
                    {language === 'mr' ? `वॉर्ड ${w.id} - ${w.name.mr}` : `Ward ${w.id} (${w.keyAreas.split(',')[0]})`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 2. Recharts Data Visualizations: Ward Bar Chart & Status Distribution Pie Chart */}
        <OfficerAnalyticsCharts
          complaints={complaints}
          language={language}
          selectedWard={selectedWard}
          onSelectWard={(wardId) => setSelectedWard(wardId)}
        />

        {/* 3. Real-Time Prioritized Complaints Queue & Live GIS Map Switcher */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-900 px-1 font-bold">
            <span className="font-black uppercase tracking-wide text-slate-900">
              {language === 'mr' 
                ? `सक्रिय तक्रारी (${filtered.length} तक्रारी)`
                : `Live Triage Queue (${filtered.length} active tickets)`}
            </span>

            {/* View Mode Switcher: Queue vs Map */}
            <div className="flex items-center gap-1 bg-slate-200 p-0.5 border border-slate-300">
              <button
                type="button"
                onClick={() => setOfficerViewMode('queue')}
                className={`px-3 py-1 text-xs font-bold cursor-pointer transition-colors ${
                  officerViewMode === 'queue' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {language === 'mr' ? '📋 तक्रार यादी (Queue)' : '📋 Queue'}
              </button>
              <button
                type="button"
                onClick={() => setOfficerViewMode('map')}
                className={`px-3 py-1 text-xs font-bold cursor-pointer transition-colors ${
                  officerViewMode === 'map' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {language === 'mr' ? '🗺️ मुंबई GIS नकाशा (Live Map)' : '🗺️ Mumbai GIS Map'}
              </button>
            </div>
          </div>

          {/* If Map Mode Selected, Render Interactive GIS Command Map */}
          {officerViewMode === 'map' ? (
            <MumbaiGisCommandMap
              complaints={filtered}
              language={language}
              onSelectComplaint={(c) => setViewMapComplaint(c)}
              onValidateProof={(c) => setActiveVerification(c)}
            />
          ) : (
            filtered.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-none p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-none bg-slate-50 text-emerald-700 border border-slate-200 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-black text-slate-900 text-base">
                {getTranslation('noComplaintsTitle', language)}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
                {language === 'mr'
                  ? 'नागरिकांनी तक्रार दाखल केल्यास ती त्वरित येथे प्राधान्यक्रमाने दिसेल.'
                  : 'No complaints in this ward. Complaints submitted by citizens will appear here.'}
              </p>
              <div className="pt-2">
                <button
                  onClick={handleLoadDemo}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-none text-xs cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                >
                  <span>⚡ {getTranslation('loadDemoDataBtn', language)}</span>
                </button>
              </div>
            </div>
          ) : (
            filtered.map((item) => {
              const dept = bmcDepartments.find((d) => d.id === item.assignedDepartment);

              const statusBadgeMap: Record<string, { mr: string; en: string; color: string }> = {
                new: { mr: 'नवीन', en: 'New', color: 'bg-rose-100 text-rose-800 border-rose-200' },
                assigned: { mr: 'पथक नियुक्त', en: 'Assigned', color: 'bg-blue-100 text-blue-800 border-blue-200' },
                in_progress: { mr: 'प्रगतीत', en: 'In Progress', color: 'bg-amber-100 text-amber-800 border-amber-200' },
                verification_pending: { mr: 'पडताळणी प्रलंबित', en: 'Verification Pending', color: 'bg-purple-100 text-purple-800 border-purple-200' },
                resolved: { mr: 'निकाली', en: 'Resolved', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' }
              };
              const statusBadge = statusBadgeMap[item.status] || statusBadgeMap.new;

              return (
                <div
                  key={item.id}
                  className="bg-white border border-slate-300 rounded-none p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs hover:border-slate-300 transition-colors"
                >
                  {/* Left: Thumbnail & Issue Details */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-16 h-14 shrink-0 rounded-none overflow-hidden border border-slate-200">
                      <CivicPhotoDisplay type={item.photoUrl} className="w-full h-full" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap font-bold">
                        <span className="font-mono font-black text-slate-900">#{item.ticketNumber}</span>
                        <span>·</span>
                        <span className="font-black text-slate-900 uppercase">{language === 'mr' ? `वॉर्ड ${item.wardId}` : `Ward ${item.wardId}`}</span>
                        <span>·</span>
                        <span className="text-slate-900 font-semibold">{dept?.name ? (dept.name[language] || dept.name.en) : (item.assignedDepartment || 'BMC')}</span>
                        <span>·</span>
                        <span className={`px-1.5 py-0.5 rounded-none text-[10px] font-black border ${statusBadge.color}`}>
                          {language === 'mr' ? statusBadge.mr : statusBadge.en}
                        </span>
                      </div>

                      <h3 className="font-black text-slate-900 text-sm sm:text-base mt-0.5">
                        {getComplaintTitle(item, language)}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-1">{item.locationAddress}</p>
                    </div>
                  </div>

                  {/* Right: Priority Score & Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
                    <div className="text-left md:text-right">
                      <div className="flex items-center gap-1.5 md:justify-end">
                        <span className="text-xs text-slate-500 font-bold">
                          {language === 'mr' ? 'गुण:' : 'Score:'}
                        </span>
                        <span className={`font-mono font-black text-lg ${
                          item.priorityScore >= 85 ? 'text-rose-600' : 'text-emerald-700'
                        }`}>
                          {item.priorityScore}/100
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-900 block font-bold">
                        👍 {item.upvotes} {language === 'mr' ? 'नागरिक (+१ मलाही)' : 'Citizens (+1)'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      {/* Officer Quick Status Dropdown */}
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value as Complaint['status'])}
                        className="px-2 py-1 text-xs font-black rounded-none border border-slate-300 bg-slate-50 text-slate-900 cursor-pointer focus:outline-hidden"
                      >
                        <option value="new">{getTranslation('statusPending', language)}</option>
                        <option value="in_progress">{getTranslation('statusInProgress', language)}</option>
                        <option value="resolved">{getTranslation('statusResolved', language)}</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => setViewMapComplaint(item)}
                        className="px-2.5 py-1.5 text-xs font-black rounded-none border border-slate-300 bg-white hover:bg-sky-50 text-slate-900 hover:text-sky-900 cursor-pointer flex items-center gap-1 shadow-2xs"
                        title={language === 'mr' ? 'नकाशावर जागा पहा' : 'View incident spot on map'}
                      >
                        <MapIcon className="w-3.5 h-3.5 text-sky-600" />
                        <span>{language === 'mr' ? 'मॅप' : 'Map'}</span>
                      </button>

                      <button
                        onClick={() => setActiveVerification(item)}
                        className={`px-3 py-1.5 text-xs font-black rounded-none border flex items-center gap-1 shadow-2xs cursor-pointer transition-all ${
                          item.status === 'verification_pending'
                            ? 'border-purple-600 bg-purple-50 hover:bg-purple-100 text-purple-950 ring-1 ring-purple-500 font-extrabold animate-pulse'
                            : item.proofOfWork
                            ? 'border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-emerald-950'
                            : 'border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100'
                        }`}
                        title={language === 'mr' ? 'अधिकाऱ्याची समोरासमोर पडताळणी (Validate Proof)' : 'Adhikari Simultaneous Proof Validation'}
                      >
                        <FileCheck className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{language === 'mr' ? 'कामाची पडताळणी' : 'Validate Proof'}</span>
                        {item.status === 'verification_pending' && (
                          <span className="w-2 h-2 rounded-full bg-purple-600 inline-block ml-0.5"></span>
                        )}
                      </button>

                      <button
                        onClick={() => setReassignTarget(item)}
                        className="px-2.5 py-1.5 text-xs font-bold rounded-none border border-slate-200 text-slate-900 bg-white hover:bg-slate-50 cursor-pointer"
                      >
                        {language === 'mr' ? 'विभाग बदला' : 'Reassign'}
                      </button>

                      {item.status === 'resolved' && (
                        <button
                          onClick={() => setCertificateComplaint(item)}
                          className="px-2.5 py-1.5 text-xs font-bold rounded-none border border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 cursor-pointer flex items-center gap-1 shadow-2xs"
                          title="View Official Certificate"
                        >
                          <FileCheck className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{language === 'mr' ? 'प्रमाणपत्र' : 'Certificate'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Multi-step progress bar on officer card */}
                  <div className="pt-2 border-t border-slate-200">
                    <ComplaintProgressBar complaint={item} language={language} compact={false} />
                  </div>
                </div>
              );
            })
          ))}
        </div>

        {/* 3. PROOF-OF-WORK VERIFICATION MODAL with Full Officer Photograph Configuration */}
        {activeVerification && (() => {
          // Collect all photographs associated with this proof of work
          const proof = activeVerification.proofOfWork;
          const photoList: ProofPhotoItem[] = (proof?.repairPhotos && proof.repairPhotos.length > 0)
            ? proof.repairPhotos
            : [
                {
                  id: 'p-1',
                  url: proof?.repairPhotoUrl || 'repair-asphalt-compaction',
                  caption: language === 'mr' ? 'अंतिम डांबरीकरण व सपाटीकरण पूर्ण पुरावा' : 'Final asphalt surface compaction proof',
                  stage: 'after_repair',
                  uploadedBy: proof?.engineerName || 'Er. Sachin Shinde (JE)',
                  role: 'Junior Engineer',
                  timestamp: proof?.submittedAt || '11:40 AM'
                },
                {
                  id: 'p-2',
                  url: 'repair-asphalt-compaction',
                  caption: language === 'mr' ? 'कामगारांद्वारे खड्ड्यात कोल्ड-मिक्स भरण्याचे काम' : 'Field worker spreading cold-mix polymer VG-30',
                  stage: 'during_work',
                  uploadedBy: proof?.workerTeam || 'Babu Kadam (Field Worker)',
                  role: 'Worker',
                  timestamp: '10:45 AM'
                },
                {
                  id: 'p-3',
                  url: 'repair-asphalt-compaction',
                  caption: language === 'mr' ? 'साइट सुपरवायझरद्वारे पायाभूत खोली व ओलावा तपासणी' : 'Site supervisor base excavation & moisture inspection',
                  stage: 'site_supervision',
                  uploadedBy: proof?.supervisorName || 'Shri Ramesh Parab (Supervisor)',
                  role: 'Site Supervisor',
                  timestamp: '09:50 AM'
                }
              ];

          const currentPhotoIndex = Math.min(selectedProofPhotoIndex, photoList.length - 1);
          const activePhoto = photoList[currentPhotoIndex] || photoList[0];

          return (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
              <div className="bg-white rounded-none max-w-4xl w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-300 animate-in fade-in my-6 max-h-[92vh] overflow-y-auto">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-none uppercase">
                        {language === 'mr' ? 'साइट काम व छायाचित्र पडताळणी कक्ष' : 'Site Work & Photo Verification Desk'}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold font-mono">
                        #{activeVerification.ticketNumber}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900 mt-1">
                      {getComplaintTitle(activeVerification, language)}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setViewMapComplaint(activeVerification)}
                      className="px-2.5 py-1 text-xs font-black rounded-none border border-slate-300 bg-white hover:bg-sky-50 text-slate-800 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      title={language === 'mr' ? 'कामाचे ठिकाण नकाशावर पहा' : 'View work site on map'}
                    >
                      <MapIcon className="w-3.5 h-3.5 text-sky-600" />
                      <span>{language === 'mr' ? 'साइट मॅप' : 'Site Map'}</span>
                    </button>
                    <button
                      onClick={() => setActiveVerification(null)}
                      className="p-1.5 rounded-none text-slate-400 hover:text-slate-700 cursor-pointer font-bold"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Supervisor & Crew Metadata Strip with Engineer ID */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 p-3 bg-emerald-50/70 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2">
                    <HardHat className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-bold">{language === 'mr' ? 'अभियंता आयडी:' : 'Engineer ID:'}</span>
                      <strong className="text-emerald-950 font-mono font-black text-sm bg-amber-200 px-1.5 py-0.2 border border-amber-300">
                        {proof?.engineerId || 'E101'}
                      </strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-bold">{language === 'mr' ? 'साइट अभियंता नाव:' : 'Engineer Name:'}</span>
                      <strong className="text-slate-800 truncate block max-w-[150px]">{proof?.engineerName || 'Er. Sachin Shinde (JE)'}</strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-bold">{language === 'mr' ? 'काम पूर्ण वेळ (Timestamp):' : 'Work Timestamp:'}</span>
                      <strong className="text-slate-800 text-[11px] font-mono">{proof?.timestamp || activePhoto.timestamp || 'Recorded on Site'}</strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapIcon className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-bold">{language === 'mr' ? 'घटनास्थळ GPS टॅग:' : 'Site GPS Tag:'}</span>
                      <strong className="text-slate-800 text-[10px] truncate block max-w-[150px]">{proof?.locationTag || activeVerification.locationAddress}</strong>
                    </div>
                  </div>
                </div>

                {/* Simultaneous Inspection Indicator Bar with Interactive Mode Toggle */}
                <div className="bg-slate-900 text-white p-3 border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping"></span>
                    <span className="font-black text-amber-300 uppercase tracking-wide">
                      {language === 'mr'
                        ? '📷 पडताळणी दृश्य (INSPECTION VIEW: BEFORE vs AFTER)'
                        : '📷 Dual-Inspection View (Before vs After)'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View Switcher: Side-by-Side vs Split Slider */}
                    <div className="flex items-center bg-slate-800 p-0.5 border border-slate-600 text-xs">
                      <button
                        type="button"
                        onClick={() => setInspectionViewMode('side-by-side')}
                        className={`px-2.5 py-1 font-bold cursor-pointer transition-colors ${
                          inspectionViewMode === 'side-by-side'
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        {language === 'mr' ? 'समोरासमोर (Dual)' : 'Side-by-Side'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setInspectionViewMode('slider')}
                        className={`px-2.5 py-1 font-bold cursor-pointer transition-colors ${
                          inspectionViewMode === 'slider'
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        {language === 'mr' ? '↔️ स्प्लिट स्लाइडर (Slider)' : '↔️ Split Slider'}
                      </button>
                    </div>

                    <span className="bg-slate-800 px-2 py-1 border border-slate-600 font-mono text-emerald-400 font-bold text-[11px]">
                      ID: {proof?.engineerId || 'E101'}
                    </span>
                  </div>
                </div>

                {/* Conditional Inspection View: Interactive Split Slider vs Side-by-Side Panes */}
                {inspectionViewMode === 'slider' ? (
                  <BeforeAfterSplitSlider
                    beforePhotoUrl={activeVerification.photoUrl}
                    afterPhotoUrl={activePhoto.url}
                    beforeTimestamp={activeVerification.reportedAt}
                    afterTimestamp={proof?.timestamp || activePhoto.timestamp}
                    engineerId={proof?.engineerId || 'E101'}
                    language={language}
                  />
                ) : (
                  /* Side-by-side Inspection: Before vs Worker / Supervisor Active Photo */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Column 1: Citizen Original Report */}
                    <div className="space-y-1.5 border-2 border-rose-200 p-2.5 bg-rose-50/20">
                      <div className="flex items-center justify-between text-xs font-bold text-rose-700">
                        <span>{language === 'mr' ? '१. पूर्वीचा फोटो (नागरिकांची तक्रार)' : '1. BEFORE (Citizen Report)'}</span>
                        <span className="text-[10px] text-slate-500">{activeVerification.reportedAt}</span>
                      </div>
                      <CivicPhotoDisplay
                        type={activeVerification.photoUrl}
                        className="aspect-16/10 w-full rounded-none border border-rose-200"
                      />
                      <p className="text-[11px] text-slate-600">
                        <strong>{language === 'mr' ? 'स्थान:' : 'Location:'}</strong> {activeVerification.locationAddress}
                      </p>
                    </div>

                    {/* Column 2: Selected Worker / Supervisor Field Photo */}
                    <div className="space-y-1.5 border-2 border-emerald-300 p-2.5 bg-emerald-50/20">
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                        <span className="flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{language === 'mr' ? `२. पूर्ण कामाचा फोटो (अभियंता: ${proof?.engineerId || 'E101'})` : `2. AFTER: Work Done by Engineer ${proof?.engineerId || 'E101'}`}</span>
                        </span>
                        <span className="px-1.5 py-0.5 bg-emerald-200 text-emerald-950 text-[10px] rounded-none font-bold uppercase font-mono">
                          ID: {proof?.engineerId || 'E101'}
                        </span>
                      </div>
                      <CivicPhotoDisplay
                        type={activePhoto.url}
                        isProofOfWorkRepair={true}
                        className="aspect-16/10 w-full rounded-none border border-emerald-400"
                      />
                      <div className="p-2 bg-slate-50 border border-slate-200 text-xs">
                        <p className="font-semibold text-slate-800">"{activePhoto.caption}"</p>
                        <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                          {language === 'mr' ? 'वेळ:' : 'Timestamp:'} {proof?.timestamp || activePhoto.timestamp} · {language === 'mr' ? 'अभियंता:' : 'Engineer:'} {proof?.engineerId || 'E101'}
                        </span>
                        {proof?.locationTag && (
                          <span className="text-[10px] text-slate-600 block mt-0.5 truncate font-mono">
                            GPS: {proof.locationTag}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* OFFICER PHOTO CONFIGURATION & GALLERY BAR */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-emerald-700" />
                      <span className="text-xs font-bold text-slate-900">
                        {language === 'mr' ? 'साइटवरून आलेली सर्व छायाचित्रे (Officer Photo Gallery & Config):' : 'Configured Site Photographs Gallery:'}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2">
                        {photoList.length}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAddPhotoForm(!showAddPhotoForm)}
                      className="px-2.5 py-1 text-xs font-bold bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-none cursor-pointer flex items-center gap-1 shadow-2xs self-start sm:self-auto"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{language === 'mr' ? '+ नवीन फोटो जोडा / कॉन्फिगर करा' : '+ Add / Upload Site Photo'}</span>
                    </button>
                  </div>

                  {/* Add New Photograph Drawer for Officer */}
                  {showAddPhotoForm && (
                    <div className="p-3 bg-white border border-emerald-300 rounded-none space-y-2.5 animate-in fade-in text-xs">
                      <div className="font-bold text-slate-900 flex items-center justify-between">
                        <span>{language === 'mr' ? 'कामगार / अभियंता यांचा नवीन फोटो अपलोड व कॉन्फिगर करा:' : 'Configure & Add Field Photo from Engineer/Worker:'}</span>
                        <button onClick={() => setShowAddPhotoForm(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                            {language === 'mr' ? 'छायाचित्र प्रकार / स्रोत (Image SVG Type or URL):' : 'Photo Type or URL:'}
                          </label>
                          <input
                            type="text"
                            value={newPhotoUrl}
                            onChange={(e) => setNewPhotoUrl(e.target.value)}
                            placeholder="repair-asphalt-compaction किंवा data:image..."
                            className="w-full px-2.5 py-1.5 border border-slate-300 bg-slate-50 text-slate-900 rounded-none focus:bg-white focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                            {language === 'mr' ? 'छायाचित्र वर्णन / शीर्षक (Caption):' : 'Photo Caption:'}
                          </label>
                          <input
                            type="text"
                            value={newPhotoCaption}
                            onChange={(e) => setNewPhotoCaption(e.target.value)}
                            placeholder={language === 'mr' ? 'उदा. रोलरद्वारे फिनिशिंग काम' : 'e.g. Surface roller leveling check'}
                            className="w-full px-2.5 py-1.5 border border-slate-300 bg-slate-50 text-slate-900 rounded-none focus:bg-white focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                            {language === 'mr' ? 'अपलोड करणारा (Worker / Supervisor Name):' : 'Captured / Uploaded By:'}
                          </label>
                          <input
                            type="text"
                            value={newPhotoUploader}
                            onChange={(e) => setNewPhotoUploader(e.target.value)}
                            placeholder="उदा. Babu Kadam (Worker) / Er. Sachin Shinde"
                            className="w-full px-2.5 py-1.5 border border-slate-300 bg-slate-50 text-slate-900 rounded-none focus:bg-white focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                            {language === 'mr' ? 'भूमिका (Role):' : 'Role in Work:'}
                          </label>
                          <select
                            value={newPhotoRole}
                            onChange={(e) => setNewPhotoRole(e.target.value as any)}
                            className="w-full px-2.5 py-1.5 border border-slate-300 bg-slate-50 text-slate-900 rounded-none cursor-pointer"
                          >
                            <option value="Worker">Worker (कामगार)</option>
                            <option value="Junior Engineer">Junior Engineer (कनिष्ठ अभियंता)</option>
                            <option value="Site Supervisor">Site Supervisor (साइट सुपरवायझर)</option>
                            <option value="Contractor">Contractor (कंत्राटदार प्रतिनिधी)</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowAddPhotoForm(false)}
                          className="px-3 py-1 border border-slate-300 bg-slate-100 text-slate-700 rounded-none cursor-pointer"
                        >
                          {language === 'mr' ? 'रद्द' : 'Cancel'}
                        </button>
                        <button
                          type="button"
                          onClick={handleAddProofPhoto}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-none font-bold cursor-pointer shadow-xs"
                        >
                          {language === 'mr' ? '✓ फोटो पुरावा जोडा' : '✓ Add Photo to Audit'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Thumbnail Selector Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {photoList.map((photo, idx) => {
                      const isSelected = idx === currentPhotoIndex;
                      return (
                        <div
                          key={photo.id || idx}
                          onClick={() => setSelectedProofPhotoIndex(idx)}
                          className={`p-2 border rounded-none cursor-pointer transition-all flex flex-col justify-between text-left ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-500'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-slate-800 truncate">
                              #{idx + 1} {photo.role}
                            </span>
                            {photoList.length > 1 && (
                              <button
                                type="button"
                                title={language === 'mr' ? 'हा फोटो काढा' : 'Remove photo'}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteProofPhoto(photo.id);
                                }}
                                className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          <div className="h-14 w-full bg-slate-900 overflow-hidden mb-1">
                            <CivicPhotoDisplay type={photo.url} isProofOfWorkRepair={true} className="w-full h-full" />
                          </div>

                          <span className="text-[10px] text-slate-600 line-clamp-1">
                            {photo.caption || photo.uploadedBy}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3-Point Checklist */}
                <div className="bg-slate-50 p-3.5 rounded-none border border-slate-200 text-xs space-y-1.5">
                  <div className="font-bold text-slate-900">
                    {language === 'mr' ? 'दुरुस्ती तपासणी निकष (Site Inspection Checklist):' : 'Site Inspection Verification Checklist:'}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>{language === 'mr' ? 'डांबरीकरण: ९६% मजबूत' : 'Compaction: 96% Solid'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>{language === 'mr' ? 'कचरा साफ: १००% स्वच्छ' : 'Debris Cleared: 100%'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>{language === 'mr' ? 'रस्ता सपाट व सुरळीत' : 'Surface: Smooth & Leveled'}</span>
                    </div>
                  </div>
                </div>

                {/* Officer Supervision & Remarks Input */}
                <div className="space-y-1 text-xs">
                  <label className="block font-bold text-slate-800">
                    {language === 'mr' ? 'अधिकाऱ्याचे पडताळणी शेरे (Officer Inspection Remarks):' : 'Officer Verification Remarks:'}
                  </label>
                  <input
                    type="text"
                    value={officerReviewNotes}
                    onChange={(e) => setOfficerReviewNotes(e.target.value)}
                    placeholder={
                      language === 'mr'
                        ? 'उदा. कामगार व कनिष्ठ अभियंत्याने सादर केलेले फोटो तपासले; रस्ता वाहतुकीसाठी सुरक्षित.'
                        : 'e.g. Inspected photographs submitted by worker crew and JE. Surface verified safe for vehicles.'
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-none text-xs bg-slate-50 focus:bg-white text-slate-900 focus:outline-hidden focus:border-emerald-600"
                  />
                  {proof?.officerRemarks && (
                    <p className="text-[11px] text-emerald-800 font-medium">
                      ✓ <strong>{language === 'mr' ? 'मागील नोंदवलेले शेरे:' : 'Recorded Remarks:'}</strong> {proof.officerRemarks}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200">
                  <span className="text-xs text-slate-600 font-medium">
                    {activeVerification.status === 'resolved' ? (
                      <strong className="text-emerald-700">
                        {language === 'mr' ? '✓ तक्रार अधिकृतपणे निकाली काढली गेली' : '✓ Ticket Officially Resolved & Closed'}
                      </strong>
                    ) : (
                      language === 'mr' ? 'कामगार व अभियंत्यांचे फोटो तपासून तक्रार निकाली काढा.' : 'Verify supervisor/worker photos to close ticket.'
                    )}
                  </span>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {activeVerification.status === 'resolved' && (
                      <button
                        type="button"
                        onClick={() => setCertificateComplaint(activeVerification)}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-slate-700 shadow-2xs"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{language === 'mr' ? '📄 मनपा प्रमाणपत्र पहा' : '📄 View Certificate'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleReject(activeVerification.id)}
                      className="flex-1 sm:flex-none px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-none font-bold text-xs cursor-pointer"
                    >
                      {language === 'mr' ? 'पुन्हा काम करण्याचे आदेश (Rework)' : 'Reject (Demand Rework)'}
                    </button>

                    <button
                      onClick={() => handleApprove(activeVerification.id)}
                      className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-none font-bold text-xs cursor-pointer shadow-xs"
                    >
                      {language === 'mr' ? 'दुरुस्ती मंजूर व तक्रार निकाली' : 'Approve & Close Ticket'}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })()}

        {/* 4. REASSIGN MODAL with Sharp Corners */}
        {reassignTarget && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-none max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-300">
              <div className="flex items-center justify-between pb-2 border-b-2 border-slate-100">
                <h3 className="font-black text-sm text-slate-900">
                  {language === 'mr' ? 'विभाग पुनर्वाटप करा' : 'Reassign BMC Department'}
                </h3>
                <button
                  onClick={() => setReassignTarget(null)}
                  className="p-1 rounded-none text-slate-400 hover:text-slate-700 cursor-pointer font-bold"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {bmcDepartments.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => handleReassign(reassignTarget.id, d.id)}
                    className="w-full p-2.5 rounded-none border border-slate-200 text-left hover:border-slate-300 hover:bg-slate-50 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-900">{d.name[language] || d.name.en}</div>
                      <div className="text-[10px] text-slate-500 font-medium">{d.leadOfficer}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Incident Spot Map View Modal */}
        <ComplaintMapViewModal
          complaint={viewMapComplaint}
          isOpen={!!viewMapComplaint}
          onClose={() => setViewMapComplaint(null)}
          language={language}
        />

        {/* Official BMC Resolution Certificate Modal */}
        <ResolutionCertificateModal
          complaint={certificateComplaint}
          isOpen={!!certificateComplaint}
          onClose={() => setCertificateComplaint(null)}
          language={language}
        />

      </div>
    </div>
  );
};
