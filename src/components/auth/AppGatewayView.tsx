import React, { useState } from 'react';
import { Language, CitizenUser, OfficerUser, FieldEngineerUser } from '../../types';
import { CitizenAuthView } from './CitizenAuthView';
import { OfficerLoginView } from './OfficerLoginView';
import { FieldEngineerAuthView } from './FieldEngineerAuthView';
import { Building2, Users, ShieldCheck, PhoneCall, HardHat } from 'lucide-react';

interface AppGatewayViewProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  seniorMode: boolean;
  setSeniorMode: (enabled: boolean) => void;
  onCitizenLogin: (user: CitizenUser) => void;
  onOfficerLogin: (officer: OfficerUser) => void;
  onEngineerLogin?: (engineer: FieldEngineerUser) => void;
}

export const AppGatewayView: React.FC<AppGatewayViewProps> = ({
  language,
  setLanguage,
  seniorMode,
  setSeniorMode,
  onCitizenLogin,
  onOfficerLogin,
  onEngineerLogin,
}) => {
  // Support Citizen, Officer, and Field Engineer access
  const [selectedRole, setSelectedRole] = useState<'citizen' | 'officer' | 'engineer'>('citizen');

  return (
    <div className="min-h-screen bg-[#f0fdf4]/50 text-slate-800 flex flex-col justify-between selection:bg-emerald-200">
      
      {/* 1. Official Gateway Top Bar (Crisp White with Emerald Accent) */}
      <header className="w-full bg-white text-slate-900 border-b border-emerald-200 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
          
          {/* Municipal Crest Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0 rounded-none border border-emerald-700">
              BMC
            </div>
            <div>
              <span className="block font-bold text-sm sm:text-base leading-tight text-slate-900">
                {language === 'mr' ? 'बृहन्मुंबई महानगरपालिका' : 'Brihanmumbai Municipal Corporation'}
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold block">
                {language === 'mr' ? 'नागरिक सेवा व मदत कक्ष (Civic Helpdesk)' : 'Citizen Civic Services & Grievance Helpdesk'}
              </span>
            </div>
          </div>

          {/* Language & Accessibility Controls: ONLY 2 Languages (Marathi & English) with Sharp Rectangles */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center bg-slate-50 p-0.5 border border-slate-200 text-xs font-bold rounded-none shadow-2xs">
              <button
                onClick={() => setLanguage('mr')}
                className={`px-3 py-1 rounded-none cursor-pointer transition-colors ${
                  language === 'mr' ? 'bg-emerald-600 text-white font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                मराठी
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-none cursor-pointer transition-colors ${
                  language === 'en' ? 'bg-emerald-600 text-white font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
            </div>

            <button
              onClick={() => setSeniorMode(!seniorMode)}
              className={`px-2.5 py-1 text-xs font-bold rounded-none border cursor-pointer transition-colors ${
                seniorMode
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              title="Senior Accessibility Mode"
            >
              Aa+
            </button>
          </div>

        </div>
      </header>

      {/* 2. Main Center Gateway Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-3 sm:px-6 py-8 sm:py-12 flex flex-col items-center justify-center space-y-6 sm:space-y-8">
        
        {/* Gateway Heading */}
        <div className="text-center space-y-2.5 max-w-xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-none text-xs font-semibold border border-emerald-200 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === 'mr' ? 'नागरिक सहकार्य व मदत कक्ष' : 'Citizen Assistance & Civic Desk'}</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {language === 'mr'
              ? 'आपले स्वागत आहे! कृपया पर्याय निवडा'
              : 'Welcome to BMC Citizen Helpdesk'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            {language === 'mr'
              ? 'मुंबईकरांसाठी सुलभ तक्रार नोंदणी व मदत कक्ष, तसेच वॉर्ड अधिकाऱ्यांसाठी प्रशासकीय कक्ष.'
              : 'Easy issue reporting and grievance tracking for citizens, plus administrative desk for ward officers.'}
          </p>
        </div>

        {/* Tri-Role Switcher Tabs with Sharp-ended Rectangles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 p-1.5 bg-white border border-slate-200 rounded-none shadow-xs w-full max-w-2xl">
          {/* Option A: Citizen */}
          <button
            type="button"
            onClick={() => setSelectedRole('citizen')}
            className={`py-3 px-3 rounded-none font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
              selectedRole === 'citizen'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{language === 'mr' ? '१. मुंबईकर नागरिक कक्ष' : '1. Citizen Helpdesk'}</span>
          </button>

          {/* Option B: Ward Officer */}
          <button
            type="button"
            onClick={() => setSelectedRole('officer')}
            className={`py-3 px-3 rounded-none font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
              selectedRole === 'officer'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>{language === 'mr' ? '२. वॉर्ड अधिकारी डेस्क' : '2. Ward Officer Desk'}</span>
          </button>

          {/* Option C: Field Engineer */}
          <button
            type="button"
            onClick={() => setSelectedRole('engineer')}
            className={`py-3 px-3 rounded-none font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
              selectedRole === 'engineer'
                ? 'bg-amber-600 text-slate-950 font-black shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <HardHat className="w-4 h-4" />
            <span>{language === 'mr' ? '३. क्षेत्रीय अभियंता (E101)' : '3. Field Engineer (E101)'}</span>
          </button>
        </div>

        {/* Dynamic Launch View: Citizen vs Officer vs Field Engineer */}
        <div className="w-full flex justify-center">
          {selectedRole === 'citizen' ? (
            /* Friendly, bright, senior-friendly Citizen View */
            <div className="w-full max-w-md">
              <CitizenAuthView
                language={language}
                onLoginSuccess={onCitizenLogin}
              />
            </div>
          ) : selectedRole === 'officer' ? (
            /* Clean administrative Officer View with ID and WARD */
            <div className="w-full max-w-lg">
              <OfficerLoginView
                language={language}
                onLoginSuccess={onOfficerLogin}
              />
            </div>
          ) : (
            /* Streamlined Field Engineer Access View (Direct ID E101) */
            <div className="w-full max-w-lg">
              <FieldEngineerAuthView
                language={language}
                onLoginSuccess={(eng) => onEngineerLogin && onEngineerLogin(eng)}
              />
            </div>
          )}
        </div>

      </main>

      {/* 3. Official Municipal Footer with Clean, Friendly Palette and Sharp Edges */}
      <footer className="w-full bg-white text-slate-600 border-t border-slate-200 py-4 px-4 text-center text-xs">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-medium text-slate-700">
            {language === 'mr'
              ? 'बृहन्मुंबई महानगरपालिका — २४ नागरी प्रशासकीय वॉर्ड'
              : 'Municipal Corporation of Greater Mumbai — 24 Administrative Wards'}
          </span>
          <div className="flex items-center gap-3 font-semibold text-[11px] text-emerald-800">
            <span>📞 {language === 'mr' ? 'हेल्पलाइन' : 'Helpline'}: 1916</span>
            <span>·</span>
            <span>🚨 {language === 'mr' ? 'आपत्ती नियंत्रण' : 'Disaster Cell'}: 022-22694725</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
