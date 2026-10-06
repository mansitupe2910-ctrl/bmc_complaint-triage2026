import React from 'react';
import { Language, CitizenUser, OfficerUser, FieldEngineerUser } from '../types';
import { getTranslation } from '../utils/translations';
import { UserCheck, Shield, LogOut, Sparkles, HardHat } from 'lucide-react';

interface NavbarProps {
  currentTab: 'citizen' | 'officer' | 'engineer';
  setCurrentTab?: (tab: 'citizen' | 'officer' | 'engineer') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  seniorMode: boolean;
  setSeniorMode: (enabled: boolean) => void;
  highContrast?: boolean;
  setHighContrast?: (enabled: boolean) => void;
  citizenUser?: CitizenUser | null;
  officerUser?: OfficerUser | null;
  engineerUser?: FieldEngineerUser | null;
  onCitizenLogout?: () => void;
  onOfficerLogout?: () => void;
  onEngineerLogout?: () => void;
  onOpenCitizenAuth?: () => void;
  onSwitchToGateway?: () => void;
  onOpenGeminiChat?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  language,
  setLanguage,
  seniorMode,
  setSeniorMode,
  citizenUser,
  officerUser,
  engineerUser,
  onCitizenLogout,
  onOfficerLogout,
  onEngineerLogout,
  onOpenGeminiChat,
}) => {
  return (
    <header className="w-full max-w-full overflow-x-hidden bg-white text-slate-900 border-b border-emerald-200/80 shadow-xs select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        
        {/* Top Row: Brand & Domain-Specific Status */}
        <div className="h-16 flex items-center justify-between gap-3">
          
          {/* Zone 1: Municipal Crest & Role-Specific Domain Title */}
          <div className="flex items-center gap-3 text-left shrink min-w-0">
            <div className="w-10 h-10 bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0 rounded-none border border-emerald-700">
              BMC
            </div>
            <div className="truncate">
              <span className="block font-black tracking-tight text-slate-900 text-sm sm:text-base leading-tight truncate">
                {language === 'mr' ? 'बृहन्मुंबई महानगरपालिका' : 'Brihanmumbai Municipal Corporation'}
              </span>
              <span className="block text-[11px] sm:text-xs text-emerald-700 font-bold tracking-wide truncate">
                {currentTab === 'citizen'
                  ? (language === 'mr' ? 'नागरिक सेवा व मदत कक्ष (Helpdesk)' : 'Citizen Civic Helpdesk & Grievance Portal')
                  : currentTab === 'engineer'
                  ? (language === 'mr' ? 'क्षेत्रीय अभियंता कार्यस्थळ व काम पूर्ण पुरावा कक्ष' : 'Field Engineer Site Execution & Work Proof Desk')
                  : (language === 'mr' ? 'वॉर्ड अधिकारी आपत्कालीन नियंत्रण कक्ष' : 'Ward Officer Command & Triage Center')}
              </span>
            </div>
          </div>

          {/* Zone 2: Strictly Isolated Role Domain Info & Logout (NO cross-switching) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Citizen Domain Badge & Logout */}
            {currentTab === 'citizen' && citizenUser && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 text-xs rounded-none shadow-2xs">
                <UserCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <div className="hidden sm:block text-left leading-tight">
                  <span className="font-bold text-slate-900 block truncate max-w-[140px]">
                    {citizenUser.fullName}
                  </span>
                  <span className="text-[10px] text-emerald-800 font-semibold block">
                    {language === 'mr' ? `वॉर्ड: ${citizenUser.wardId}` : `Ward: ${citizenUser.wardId}`}
                  </span>
                </div>
                <button
                  onClick={onCitizenLogout}
                  title={language === 'mr' ? 'बाहेर पडा (लॉगआउट)' : 'Log Out'}
                  className="ml-1 px-2 py-1 bg-white hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1 rounded-none border border-emerald-300 cursor-pointer transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">{language === 'mr' ? 'बाहेर पडा' : 'Logout'}</span>
                </button>
              </div>
            )}

            {/* Officer Domain Badge & Logout */}
            {currentTab === 'officer' && officerUser && (
              <div className="flex items-center gap-2 bg-slate-100 border border-slate-300 px-2.5 py-1.5 text-xs rounded-none shadow-2xs">
                <Shield className="w-4 h-4 text-slate-700 shrink-0" />
                <div className="hidden sm:block text-left leading-tight">
                  <span className="font-bold text-slate-900 block truncate max-w-[140px]">
                    {officerUser.name || officerUser.officerId}
                  </span>
                  <span className="text-[10px] text-slate-600 font-semibold block">
                    {language === 'mr' ? `अधिकार क्षेत्र: वॉर्ड ${officerUser.assignedWard}` : `Ward: ${officerUser.assignedWard}`}
                  </span>
                </div>
                <button
                  onClick={onOfficerLogout}
                  title={language === 'mr' ? 'अधिकारी लॉगआउट' : 'Officer Log Out'}
                  className="ml-1 px-2 py-1 bg-white hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1 rounded-none border border-slate-300 cursor-pointer transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">{language === 'mr' ? 'लॉगआउट' : 'Logout'}</span>
                </button>
              </div>
            )}

            {/* Field Engineer Domain Badge & Logout */}
            {currentTab === 'engineer' && engineerUser && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 px-2.5 py-1.5 text-xs rounded-none shadow-2xs">
                <HardHat className="w-4 h-4 text-amber-700 shrink-0" />
                <div className="hidden sm:block text-left leading-tight">
                  <span className="font-bold text-slate-900 block truncate max-w-[140px]">
                    {engineerUser.name}
                  </span>
                  <span className="text-[10px] text-amber-900 font-semibold block">
                    {language === 'mr' ? `अभियंता: ${engineerUser.engineerId} (वॉर्ड ${engineerUser.assignedWard})` : `ID: ${engineerUser.engineerId} (Ward ${engineerUser.assignedWard})`}
                  </span>
                </div>
                <button
                  onClick={onEngineerLogout}
                  title={language === 'mr' ? 'अभियंता लॉगआउट' : 'Engineer Log Out'}
                  className="ml-1 px-2 py-1 bg-white hover:bg-amber-100 text-amber-900 font-bold text-xs flex items-center gap-1 rounded-none border border-amber-300 cursor-pointer transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">{language === 'mr' ? 'लॉगआउट' : 'Logout'}</span>
                </button>
              </div>
            )}

            {/* Gemini AI Chatbot Launcher Button */}
            {onOpenGeminiChat && (
              <button
                onClick={onOpenGeminiChat}
                className="px-2.5 py-1 text-xs font-bold rounded-none border border-emerald-500 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                title={language === 'mr' ? 'BMC जेमिनी AI सहाय्यक (Chatbot)' : 'BMC Gemini AI Assistant (Chatbot)'}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span className="font-extrabold">{language === 'mr' ? 'जेमिनी AI' : 'Gemini AI'}</span>
              </button>
            )}

            {/* Language Switcher: ONLY Marathi and English with Sharp Rectangles */}
            <div className="flex items-center bg-slate-50 border border-slate-200 p-0.5 rounded-none text-xs font-bold shadow-2xs">
              <button
                onClick={() => setLanguage('mr')}
                className={`px-2.5 py-1 rounded-none cursor-pointer transition-all ${
                  language === 'mr'
                    ? 'bg-emerald-600 text-white font-black shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                मराठी
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-none cursor-pointer transition-all ${
                  language === 'en'
                    ? 'bg-emerald-600 text-white font-black shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                English
              </button>
            </div>

            {/* Senior Mode Accessibility Toggle with Sharp Rectangles */}
            <button
              onClick={() => setSeniorMode(!seniorMode)}
              className={`px-2.5 py-1 text-xs font-bold rounded-none border cursor-pointer transition-colors ${
                seniorMode
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs font-black'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              title="Senior Citizen Accessibility (Large text & touch targets)"
            >
              Aa+
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
