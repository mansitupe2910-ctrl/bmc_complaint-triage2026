import React, { useState } from 'react';
import { FieldEngineerUser, Language } from '../../types';
import { HardHat, Wrench, ArrowRight, ShieldCheck, CheckCircle2, UserCheck } from 'lucide-react';

interface FieldEngineerAuthViewProps {
  language: Language;
  onLoginSuccess: (engineer: FieldEngineerUser) => void;
}

const PRESET_ENGINEERS: Record<string, { name: string; ward: string; dept: string; designation: string }> = {
  'E101': {
    name: 'Er. Sachin Shinde',
    ward: 'K/W',
    dept: 'Roads & Traffic (रस्ते व वाहतूक)',
    designation: 'Junior Engineer (Roads & Infrastructure)',
  },
  'E102': {
    name: 'Er. Pramod Kadam',
    ward: 'H/W',
    dept: 'Storm Water Drains (मलनिःसारण / SWD)',
    designation: 'Sub-Engineer (SWD Rapid Dewatering)',
  },
  'E103': {
    name: 'Er. Rajesh Patil',
    ward: 'G/N',
    dept: 'Solid Waste Management (घनकचरा व्यवस्थापन)',
    designation: 'Site Field Supervisor & Quality Engineer',
  },
  'E104': {
    name: 'Er. Sandeep Sawant',
    ward: 'F/N',
    dept: 'Hydraulic Engineer (पाणीपुरवठा व जलवाहिनी)',
    designation: 'Assistant Engineer (Water Mains)',
  },
};

export const FieldEngineerAuthView: React.FC<FieldEngineerAuthViewProps> = ({
  language,
  onLoginSuccess,
}) => {
  const [engineerIdInput, setEngineerIdInput] = useState<string>('E101');
  const [engineerName, setEngineerName] = useState<string>('Er. Sachin Shinde');
  const [assignedWard, setAssignedWard] = useState<string>('K/W');
  const [department, setDepartment] = useState<string>('Roads & Traffic');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleIdChange = (id: string) => {
    const cleanId = id.toUpperCase().trim();
    setEngineerIdInput(cleanId);
    setErrorMsg('');

    if (PRESET_ENGINEERS[cleanId]) {
      const preset = PRESET_ENGINEERS[cleanId];
      setEngineerName(preset.name);
      setAssignedWard(preset.ward);
      setDepartment(preset.dept);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = engineerIdInput.trim().toUpperCase();

    if (!cleanId) {
      setErrorMsg(
        language === 'mr'
          ? 'कृपया आपला अभियंता आयडी प्रविष्ट करा (उदा. E101)'
          : 'Please enter your Engineer ID (e.g. E101)'
      );
      return;
    }

    const engineerData: FieldEngineerUser = {
      engineerId: cleanId,
      name: engineerName.trim() || `Field Engineer (${cleanId})`,
      designation: PRESET_ENGINEERS[cleanId]?.designation || 'Field Execution & Quality Engineer',
      assignedWard: assignedWard || 'K/W',
      department: department || 'Municipal Works',
      phone: '022-26239131',
    };

    localStorage.setItem('bmc_engineer_user', JSON.stringify(engineerData));
    onLoginSuccess(engineerData);
  };

  return (
    <div className="bg-white border-2 border-emerald-600 shadow-xl rounded-none p-5 sm:p-6 text-slate-800 text-left">
      {/* Top Banner */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-4">
        <div className="w-12 h-12 bg-amber-500 text-slate-900 flex items-center justify-center font-black rounded-none shadow-xs border border-amber-600 shrink-0">
          <HardHat className="w-6 h-6 text-slate-900" />
        </div>
        <div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-none uppercase">
            <Wrench className="w-3 h-3 text-amber-700" />
            {language === 'mr' ? 'साइट कार्य व पडताळणी कक्ष' : 'Site Execution & Proof Desk'}
          </span>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight">
            {language === 'mr'
              ? 'क्षेत्रीय अभियंता कार्यस्थळ प्रवेश (Field Engineer)'
              : 'Field Engineer Site Access (No Password)'}
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {language === 'mr'
              ? 'फक्त आपला अधिकृत अभियंता आयडी (उदा. E101) टाका व त्वरित काम केलेल्या जागेचा फोटो व पुरावा अपलोड करा.'
              : 'Direct ID authentication process: Enter your Engineer ID (e.g. E101) to update work done with timestamp & location tags.'}
          </p>
        </div>
      </div>

      {/* Quick ID Selection Chips */}
      <div className="mb-4">
        <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">
          {language === 'mr' ? '१. तुमचा अभियंता आयडी निवडा किंवा खाली टाईप करा:' : '1. Select Engineer ID or type below:'}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.entries(PRESET_ENGINEERS).map(([id, info]) => {
            const isSelected = engineerIdInput === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleIdChange(id)}
                className={`p-2.5 border rounded-none text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500 shadow-xs'
                    : 'border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-black text-slate-900">{id}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
                <div className="text-[11px] text-slate-600 truncate mt-0.5">{info.name}</div>
                <div className="text-[10px] font-bold text-emerald-800">वॉर्ड {info.ward}</div>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Engineer ID Input Box */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">
            {language === 'mr' ? '२. अभियंता आयडी (Engineer ID):' : '2. Engineer ID (e.g. E101):'}
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={engineerIdInput}
              onChange={(e) => handleIdChange(e.target.value)}
              placeholder="उदा. E101"
              className="w-full px-3.5 py-3 bg-white border-2 border-slate-300 rounded-none text-slate-900 font-mono text-lg font-black focus:border-emerald-600 focus:outline-hidden tracking-wider"
            />
            <div className="absolute right-3.5 top-3.5 text-xs font-bold text-slate-400">
              ID
            </div>
          </div>
        </div>

        {/* Selected Engineer Quick Card */}
        <div className="p-3 bg-emerald-50/70 border border-emerald-300 text-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase block">{language === 'mr' ? 'अभियंता नाव व वॉर्ड:' : 'Profile & Ward:'}</span>
            <strong className="text-slate-900 text-sm font-bold">{engineerName}</strong>
            <span className="text-slate-600 ml-2">({department} · वॉर्ड {assignedWard})</span>
          </div>
          <span className="bg-emerald-600 text-white font-mono font-bold text-xs px-2.5 py-1">
            {engineerIdInput || 'E101'}
          </span>
        </div>

        {errorMsg && (
          <div className="p-2.5 bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold">
            {errorMsg}
          </div>
        )}

        {/* Simple One-Click Enter Button */}
        <button
          type="submit"
          className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm rounded-none border border-emerald-800 flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
        >
          <span>
            {language === 'mr'
              ? `👉 आयडी ${engineerIdInput || 'E101'} ने थेट कार्यस्थळावर प्रवेश करा`
              : `👉 Enter Site Workspace with ID ${engineerIdInput || 'E101'}`}
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
