import React, { useState } from 'react';
import { OfficerUser, Language } from '../../types';
import { PREDEFINED_OFFICERS } from '../../data/officerCredentials';
import { mumbaiWards } from '../../data/mockData';
import { Shield, KeyRound, AlertTriangle, ArrowRight, Building2, Sparkles, MapPin, BadgeCheck, Lock } from 'lucide-react';

interface OfficerLoginViewProps {
  language: Language;
  onLoginSuccess: (officer: OfficerUser) => void;
  onCancel?: () => void;
}

export const OfficerLoginView: React.FC<OfficerLoginViewProps> = ({
  language,
  onLoginSuccess,
  onCancel,
}) => {
  const [officerCode, setOfficerCode] = useState('WARD-KW-101');
  const [selectedWard, setSelectedWard] = useState('K/W');
  const [passcode, setPasscode] = useState('kw@ward2026');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick fill helper for testing
  const handleQuickFill = (code: string, ward: string, pass: string) => {
    setOfficerCode(code);
    setSelectedWard(ward);
    setPasscode(pass);
    setError(null);
  };

  const handleOfficerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanCode = officerCode.trim();
    const cleanPass = passcode.trim();
    const cleanWard = selectedWard.trim();

    if (!cleanCode) {
      setError(
        language === 'mr'
          ? 'कृपया आपला अधिकृत अधिकारी कोड / आयडी प्रविष्ट करा.'
          : 'Please enter your official Officer Code / ID.'
      );
      return;
    }

    if (!cleanWard) {
      setError(
        language === 'mr'
          ? 'कृपया आपला अधिकार क्षेत्र / वॉर्ड निवडा.'
          : 'Please select your designated Ward.'
      );
      return;
    }

    if (!cleanPass) {
      setError(
        language === 'mr'
          ? 'कृपया आपला सुरक्षा पासवर्ड प्रविष्ट करा.'
          : 'Please enter your security passcode.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Authenticate with backend API
      const res = await fetch('/api/officer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ officerId: cleanCode, ward: cleanWard, passcode: cleanPass }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.officer) {
        localStorage.setItem('bmc_officer_user', JSON.stringify(data.officer));
        onLoginSuccess(data.officer);
        return;
      }

      // 2. Client-side fallback to PREDEFINED_OFFICERS
      const matched = PREDEFINED_OFFICERS.find(
        (o) => o.code.toUpperCase() === cleanCode.toUpperCase() && o.passcode === cleanPass
      );

      if (matched) {
        const customUser: OfficerUser = {
          ...matched.user,
          assignedWard: cleanWard && cleanWard !== 'ALL' ? cleanWard : matched.user.assignedWard,
        };
        localStorage.setItem('bmc_officer_user', JSON.stringify(customUser));
        onLoginSuccess(customUser);
        return;
      }

      setError(
        language === 'mr'
          ? 'अवैध अधिकारी आयडी, वॉर्ड किंवा पासवर्ड. कृपया अधिकृत क्रेडेंशियल तपासा.'
          : 'Invalid Officer ID, Ward, or Passcode. Please check authorized credentials.'
      );
    } catch {
      // Offline fallback
      const matched = PREDEFINED_OFFICERS.find(
        (o) => o.code.toUpperCase() === cleanCode.toUpperCase() && o.passcode === cleanPass
      );

      if (matched) {
        const customUser: OfficerUser = {
          ...matched.user,
          assignedWard: cleanWard && cleanWard !== 'ALL' ? cleanWard : matched.user.assignedWard,
        };
        localStorage.setItem('bmc_officer_user', JSON.stringify(customUser));
        onLoginSuccess(customUser);
      } else {
        setError(
          language === 'mr'
            ? 'अवैध अधिकारी ओळख किंवा पासवर्ड!'
            : 'Invalid Officer ID, Ward, or Passcode.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white text-slate-900 border border-slate-300 rounded-none shadow-md p-5 sm:p-7 space-y-6 relative overflow-hidden">
      
      {/* Official Municipal Authority Crest Header with Sharp Corners */}
      <div className="text-center space-y-3 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold tracking-wider uppercase rounded-none">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>
            {language === 'mr' ? 'बृहन्मुंबई महानगरपालिका अधिकारी पोर्टल' : 'BMC Ward Officer Administrative Portal'}
          </span>
        </div>

        <div className="w-14 h-14 mx-auto rounded-none bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-xs border border-emerald-700">
          <Building2 className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            {language === 'mr'
              ? 'वॉर्ड अधिकारी नियंत्रण कक्ष'
              : 'Ward Officer Command Desk'}
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            {language === 'mr'
              ? 'केवळ अधिकृत मनपा वॉर्ड अधिकारी, सहाय्यक आयुक्त व अभियंत्यांसाठी प्रवेश'
              : 'Restricted administrative desk for BMC Ward Officers & Engineers'}
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-none text-xs sm:text-sm text-rose-900 font-bold flex items-start gap-2.5 relative z-10">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <p className="leading-snug">{error}</p>
        </div>
      )}

      {/* Administrative Form with Sharp Corners */}
      <form onSubmit={handleOfficerLogin} className="space-y-4 relative z-10">
        
        {/* 1. Officer ID / Code */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
              {language === 'mr' ? 'अधिकारी आयडी / ओळख कोड (Officer ID)' : 'Official Officer ID / Code'}
            </span>
            <span className="text-[10px] text-slate-500 font-semibold">Official BMC ID</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Shield className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={officerCode}
              onChange={(e) => {
                setOfficerCode(e.target.value);
                if (error) setError(null);
              }}
              placeholder="उदा. WARD-KW-101 किंवा BMC-OFFICER-2026"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-none text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-emerald-600 uppercase transition-all tracking-wider"
              required
            />
          </div>
        </div>

        {/* 2. Designated Administrative Ward */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {language === 'mr' ? 'नियुक्त वॉर्ड (Designated Ward)' : 'Assigned Administrative Ward'}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">24 BMC Wards</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Building2 className="w-4 h-4" />
            </div>
            <select
              value={selectedWard}
              onChange={(e) => {
                setSelectedWard(e.target.value);
                if (error) setError(null);
              }}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-none text-xs sm:text-sm font-bold text-slate-900 focus:outline-hidden focus:border-emerald-600 cursor-pointer transition-all"
              required
            >
              <option value="ALL" className="bg-white text-slate-900 font-bold">
                {language === 'mr' ? 'सर्व २४ मुंबई वॉर्ड (Central HQ / सर्व वॉर्ड)' : 'All 24 Wards (Central Control)'}
              </option>
              {mumbaiWards.map((w) => (
                <option key={w.id} value={w.id} className="bg-white text-slate-900">
                  {language === 'mr' ? `वॉर्ड ${w.id} - ${w.name.mr}` : `Ward ${w.id} (${w.keyAreas.split(',')[0]})`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. Security Passcode / PIN */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
              {language === 'mr' ? 'सुरक्षा पासवर्ड / पिन (Passcode)' : 'Security Passcode / PIN'}
            </span>
            <span className="text-[10px] text-slate-500">Encrypted</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                if (error) setError(null);
              }}
              placeholder="••••••••"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-none text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-emerald-600 transition-all tracking-wider"
              required
            />
          </div>
        </div>

        {/* Submit Button with Sharp Rectangles */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-none flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all disabled:opacity-50 mt-2"
        >
          <Lock className="w-4 h-4" />
          <span>
            {isSubmitting
              ? (language === 'mr' ? 'प्रमाणीकरण चालू आहे...' : 'Authenticating...')
              : (language === 'mr' ? 'अधिकारी नियंत्रण कक्षात प्रवेश करा' : 'Authorize & Enter Desk')}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </form>

      {/* Pre-decided Credentials Reference with ID & Ward */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-none space-y-2 relative z-10 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            {language === 'mr'
              ? 'अधिकृत अधिकारी आयडी व वॉर्ड यादी (1-Click Test):'
              : 'Authorized Officer IDs & Assigned Wards:'}
          </span>
        </div>

        <div className="space-y-1.5">
          {PREDEFINED_OFFICERS.map((off) => (
            <div
              key={off.code}
              onClick={() => handleQuickFill(off.code, off.user.assignedWard, off.passcode)}
              className="p-2 bg-white hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 rounded-none cursor-pointer transition-all flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-emerald-800">{off.code}</span>
                <span className="text-slate-600 ml-1.5">({off.user.name.split('(')[0]})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-white font-bold bg-emerald-700 px-1.5 py-0.5 rounded-none">
                  {off.user.assignedWard === 'ALL' ? (language === 'mr' ? 'सर्व वॉर्ड' : 'All Wards') : (language === 'mr' ? `वॉर्ड ${off.user.assignedWard}` : `Ward ${off.user.assignedWard}`)}
                </span>
                <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-none border border-slate-200">
                  {off.passcode}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {onCancel && (
        <div className="text-center pt-1 border-t border-slate-200 relative z-10">
          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            {language === 'mr' ? '← मुख्य गेटवेवर परत जा' : '← Back to Main Gateway'}
          </button>
        </div>
      )}

    </div>
  );
};
