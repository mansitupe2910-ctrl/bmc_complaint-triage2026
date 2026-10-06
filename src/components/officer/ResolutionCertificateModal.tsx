import React, { useRef } from 'react';
import { Complaint, Language } from '../../types';
import { getComplaintTitle } from '../../utils/translations';
import { CivicPhotoDisplay } from '../CivicPhotoDisplay';
import {
  FileCheck2,
  Printer,
  Download,
  X,
  ShieldCheck,
  Building2,
  CheckCircle2,
  MapPin,
  Clock,
  UserCheck,
  QrCode
} from 'lucide-react';

interface ResolutionCertificateModalProps {
  complaint: Complaint | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const ResolutionCertificateModal: React.FC<ResolutionCertificateModalProps> = ({
  complaint,
  isOpen,
  onClose,
  language,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !complaint) return null;

  const proof = complaint.proofOfWork;
  const certificateNumber = `BMC-CERT-2026-${complaint.id.replace(/\D/g, '').slice(-4) || '9101'}`;
  const verifiedDate = proof?.verifiedAt || 'Today, 2026';
  const engineerId = proof?.engineerId || 'E101';
  const engineerName = proof?.engineerName || 'Er. Sachin Shinde (JE)';
  const officerName = proof?.verifiedBy || 'Ward Officer (Assistant Commissioner)';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-none max-w-2xl w-full p-4 sm:p-6 shadow-2xl border-2 border-slate-700 flex flex-col space-y-4 max-h-[95vh] overflow-y-auto text-slate-800 text-left">
        
        {/* Modal Top Actions */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-700" />
            <span className="font-black text-sm text-slate-900 uppercase tracking-wide">
              {language === 'mr' ? 'अधिकृत मनपा निवारण प्रमाणपत्र' : 'Official BMC Resolution Certificate'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'mr' ? 'प्रिंट / PDF' : 'Print / Save PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-800 cursor-pointer font-bold"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE CERTIFICATE DOCUMENT */}
        <div
          ref={certificateRef}
          className="p-5 sm:p-6 bg-[#fffdfa] border-4 border-[#002b49] shadow-inner space-y-4 text-slate-900 font-serif"
        >
          {/* Official Emblem & Municipal Header */}
          <div className="text-center border-b-2 border-[#002b49] pb-3 space-y-1">
            <div className="flex items-center justify-center gap-2">
              <Building2 className="w-8 h-8 text-[#002b49]" />
            </div>
            <h1 className="text-lg sm:text-xl font-black text-[#002b49] uppercase tracking-wider font-sans">
              बृहन्मुंबई महानगरपालिका (MCGM)
            </h1>
            <p className="text-xs font-sans text-slate-600 font-bold uppercase tracking-widest">
              Municipal Corporation of Greater Mumbai · 24 Administrative Wards
            </p>
            <div className="inline-block bg-[#002b49] text-white text-[11px] font-sans font-bold px-3 py-0.5 tracking-wider uppercase mt-1">
              नागरी तक्रार निवारण व कार्यपूर्ती प्रमाणपत्र (Official Civic Resolution Certificate)
            </div>
          </div>

          {/* Certificate Number & Date Bar */}
          <div className="flex items-center justify-between text-xs font-mono border-b border-slate-300 pb-2 text-slate-700">
            <div>
              <span>प्रमाणपत्र क्र. / Cert No: </span>
              <strong className="text-slate-900">{certificateNumber}</strong>
            </div>
            <div>
              <span>तक्रार क्र. / Ticket: </span>
              <strong className="text-slate-900">#{complaint.ticketNumber}</strong>
            </div>
          </div>

          {/* Body Content */}
          <div className="space-y-3 text-xs font-sans leading-relaxed">
            <p className="text-justify">
              प्रमाणित करण्यात येते की, बृहन्मुंबई महानगरपालिकेच्या <strong>वॉर्ड {complaint.wardId}</strong> हद्दीतील खालील नमूद नागरी तक्रारीचे क्षेत्रीय अभियंता व मनपा कर्मचाऱ्यांमार्फत प्रत्यक्ष जागेवर जाऊन गुणवत्ता मानकांनुसार निवारण करण्यात आले असून वॉर्ड अधिकाऱ्यांनी त्याची पडताळणी केली आहे.
            </p>

            {/* Key Information Table */}
            <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 border border-slate-300 text-xs font-sans">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">विषय / Complaint Title:</span>
                <strong className="text-slate-900">{getComplaintTitle(complaint, language)}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">विभाग / Department:</span>
                <strong className="text-slate-900">{complaint.category.toUpperCase()}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">स्थान / Site Location:</span>
                <span className="text-slate-800">{complaint.locationAddress}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">नागरिक / Complainant:</span>
                <span className="text-slate-800">{complaint.citizenContactMasked || 'Verified Mumbai Citizen'}</span>
              </div>
            </div>

            {/* Side-by-Side Photographic Proof in Certificate */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="border border-slate-300 p-2 text-center bg-white">
                <span className="text-[10px] font-bold text-rose-700 block mb-1">
                  १. तक्रारीच्या वेळचा फोटो (BEFORE)
                </span>
                <CivicPhotoDisplay
                  type={complaint.photoUrl}
                  className="aspect-16/10 w-full object-cover border border-slate-200"
                />
                <span className="text-[9px] text-slate-500 block mt-1 font-mono">{complaint.reportedAt}</span>
              </div>

              <div className="border border-slate-300 p-2 text-center bg-white">
                <span className="text-[10px] font-bold text-emerald-800 block mb-1">
                  २. पूर्ण कामाचा फोटो (AFTER REPAIR)
                </span>
                <CivicPhotoDisplay
                  type={proof?.repairPhotoUrl || 'repair-asphalt-compaction'}
                  isProofOfWorkRepair={true}
                  className="aspect-16/10 w-full object-cover border border-slate-200"
                />
                <span className="text-[9px] text-slate-500 block mt-1 font-mono">
                  {proof?.timestamp || 'Work Completed'} · {engineerId}
                </span>
              </div>
            </div>

            {/* Tamper-proof Geotag and Timestamp Audit */}
            <div className="p-2.5 bg-emerald-50/70 border border-emerald-300 text-[11px] font-mono text-emerald-950 flex items-center justify-between">
              <div>
                <span className="block font-bold">📍 GPS GEOTAG: {proof?.locationTag || complaint.locationAddress}</span>
                <span className="text-[10px] text-emerald-800">TIMESTAMP: {proof?.timestamp || new Date().toLocaleString()}</span>
              </div>
              <div className="bg-emerald-700 text-white px-2 py-1 text-center font-bold text-[10px]">
                ✓ VERIFIED PROOF
              </div>
            </div>
          </div>

          {/* Official Signatures & Digital Seal */}
          <div className="pt-4 border-t-2 border-[#002b49] grid grid-cols-3 gap-2 items-end text-center font-sans">
            {/* Engineer Signature */}
            <div className="space-y-1">
              <div className="h-9 flex items-center justify-center font-serif italic text-emerald-900 font-bold text-sm">
                Er. {engineerName.split(' ')[1] || 'S. Shinde'}
              </div>
              <div className="border-t border-slate-400 pt-1 text-[10px]">
                <strong className="block text-slate-900">क्षेत्रीय अभियंता (Field Engineer)</strong>
                <span className="text-slate-600 font-mono font-bold">आयडी: {engineerId}</span>
              </div>
            </div>

            {/* Municipal QR Code & Official Stamp */}
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="w-14 h-14 border-2 border-[#002b49] p-1 bg-white flex items-center justify-center shadow-xs">
                <QrCode className="w-12 h-12 text-[#002b49]" />
              </div>
              <span className="text-[9px] text-slate-500 font-mono font-bold">MCGM DIGITAL AUDIT</span>
            </div>

            {/* Officer Signature */}
            <div className="space-y-1">
              <div className="h-9 flex items-center justify-center font-serif italic text-blue-950 font-bold text-sm">
                P. Chauhan, Asst. Comm.
              </div>
              <div className="border-t border-slate-400 pt-1 text-[10px]">
                <strong className="block text-slate-900">वॉर्ड अधिकारी (Ward Officer)</strong>
                <span className="text-slate-600">वॉर्ड {complaint.wardId} (MCGM)</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
