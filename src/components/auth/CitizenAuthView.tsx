import React, { useState } from 'react';
import { CitizenUser, Language } from '../../types';
import { mumbaiWards } from '../../data/mockData';
import { ShieldCheck, UserCheck, AlertCircle, Phone, ArrowRight, UserPlus, LogIn, CheckCircle2 } from 'lucide-react';

interface CitizenAuthViewProps {
  language: Language;
  onLoginSuccess: (user: CitizenUser) => void;
  onCancel?: () => void;
}

export const CitizenAuthView: React.FC<CitizenAuthViewProps> = ({
  language,
  onLoginSuccess,
  onCancel,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Login State
  const [loginMobile, setLoginMobile] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Register State
  const [regName, setRegName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regWard, setRegWard] = useState('K/W');
  const [regAddress, setRegAddress] = useState('');
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccessMessage, setRegSuccessMessage] = useState<string | null>(null);

  // Helper to get local stored citizens
  const getStoredCitizens = (): CitizenUser[] => {
    try {
      const saved = localStorage.getItem('bmc_registered_citizens');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  // Helper to save local stored citizens
  const saveStoredCitizen = (newCitizen: CitizenUser) => {
    try {
      const list = getStoredCitizens();
      const filtered = list.filter((c) => c.mobile !== newCitizen.mobile);
      filtered.unshift(newCitizen);
      localStorage.setItem('bmc_registered_citizens', JSON.stringify(filtered));
    } catch (e) {
      console.error(e);
    }
  };

  // ==========================================
  // CITIZEN LOGIN HANDLER
  // ==========================================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const cleanMobile = loginMobile.trim().replace(/\D/g, '').slice(-10);

    if (!cleanMobile || cleanMobile.length !== 10) {
      setLoginError(
        language === 'mr'
          ? 'कृपया वैध १० अंकी मोबाईल नंबर प्रविष्ट करा.'
          : 'Please enter a valid 10-digit mobile number.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Check with Backend API
      const res = await fetch('/api/citizens/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: cleanMobile }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.citizen) {
        saveStoredCitizen(data.citizen);
        localStorage.setItem('bmc_citizen_user', JSON.stringify(data.citizen));
        onLoginSuccess(data.citizen);
        return;
      }

      // If backend returned 404 NOT_REGISTERED or failed, verify localStorage fallback
      const localList = getStoredCitizens();
      const localMatched = localList.find((c) => c.mobile === cleanMobile);

      if (localMatched) {
        localStorage.setItem('bmc_citizen_user', JSON.stringify(localMatched));
        onLoginSuccess(localMatched);
        return;
      }

      // If citizen is truly not registered
      setLoginError(
        language === 'mr'
          ? 'हा मोबाईल नंबर प्रणालीमध्ये नोंदणीकृत नाही. कृपया आधी नागरिक नोंदणी करा.'
          : 'This mobile number is not registered. Please register as a citizen first.'
      );
    } catch {
      // Offline fallback: check localStorage
      const localList = getStoredCitizens();
      const localMatched = localList.find((c) => c.mobile === cleanMobile);

      if (localMatched) {
        localStorage.setItem('bmc_citizen_user', JSON.stringify(localMatched));
        onLoginSuccess(localMatched);
      } else {
        setLoginError(
          language === 'mr'
            ? 'हा मोबाईल नंबर नोंदणीकृत नाही. कृपया खाली "नागरिक नोंदणी करा" वर क्लिक करा.'
            : 'Number not registered. Please register below.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // CITIZEN REGISTRATION HANDLER
  // ==========================================
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccessMessage(null);

    const cleanMobile = regMobile.trim().replace(/\D/g, '').slice(-10);

    if (!regName.trim()) {
      setRegError(
        language === 'mr'
          ? 'कृपया आपले पूर्ण नाव प्रविष्ट करा.'
          : 'Please enter your full name.'
      );
      return;
    }

    if (!cleanMobile || cleanMobile.length !== 10) {
      setRegError(
        language === 'mr'
          ? 'कृपया वैध १० अंकी मोबाईल नंबर प्रविष्ट करा.'
          : 'Please enter a valid 10-digit mobile number.'
      );
      return;
    }

    setIsSubmitting(true);

    const citizenPayload: CitizenUser = {
      id: `CIT-${Date.now().toString().slice(-6)}`,
      fullName: regName.trim(),
      mobile: cleanMobile,
      wardId: regWard,
      address: regAddress.trim(),
      registeredAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/citizens/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(citizenPayload),
      });

      const data = await res.json();
      const savedUser = data.citizen || citizenPayload;

      saveStoredCitizen(savedUser);
      localStorage.setItem('bmc_citizen_user', JSON.stringify(savedUser));

      setRegSuccessMessage(
        language === 'mr'
          ? 'नागरीक नोंदणी यशस्वी! थेट प्रवेश केला जात आहे...'
          : 'Citizen registered successfully! Logging you in...'
      );

      setTimeout(() => {
        onLoginSuccess(savedUser);
      }, 700);
    } catch {
      // Fallback local persistence
      saveStoredCitizen(citizenPayload);
      localStorage.setItem('bmc_citizen_user', JSON.stringify(citizenPayload));
      setRegSuccessMessage(
        language === 'mr'
          ? 'नागरीक नोंदणी यशस्वी! थेट प्रवेश केला जात आहे...'
          : 'Citizen registered successfully! Logging you in...'
      );
      setTimeout(() => {
        onLoginSuccess(citizenPayload);
      }, 700);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 sm:p-6 bg-white border border-slate-300 rounded-none shadow-md space-y-5">
      
      {/* Top Header Badge with Sharp Corners */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-none">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>
            {language === 'mr' ? 'बृहन्मुंबई महानगरपालिका नागरिक सेवा' : 'BMC Citizen Grievance Portal'}
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          {authMode === 'login'
            ? (language === 'mr' ? 'नागरिक पोर्टल लॉगिन' : 'Citizen Portal Log In')
            : (language === 'mr' ? 'नवीन नागरिक नोंदणी' : 'Register as Citizen')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
          {authMode === 'login'
            ? (language === 'mr'
                ? 'आपल्या नोंदणीकृत मोबाईल नंबरद्वारे लॉगिन करा आणि तक्रारी नोंदवा.'
                : 'Enter your registered 10-digit mobile number to access civic services.')
            : (language === 'mr'
                ? 'मुंबई नागरी सेवेसाठी आपले नाव व मोबाईल नंबर नोंदवून त्वरित खाते सुरू करा.'
                : 'Register your details once to file, track, and upvote civic complaints.')}
        </p>
      </div>

      {/* Mode Switch Tabs with Sharp Rectangles */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 border border-slate-200 rounded-none text-xs sm:text-sm font-bold">
        <button
          type="button"
          onClick={() => {
            setAuthMode('login');
            setLoginError(null);
          }}
          className={`py-2 rounded-none transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            authMode === 'login'
              ? 'bg-emerald-600 text-white font-black shadow-xs'
              : 'text-slate-700 hover:bg-white'
          }`}
        >
          <LogIn className="w-4 h-4" />
          <span>{language === 'mr' ? 'नागरिक लॉगिन' : 'Citizen Log In'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setAuthMode('register');
            setRegError(null);
            if (loginMobile && !regMobile) setRegMobile(loginMobile);
          }}
          className={`py-2 rounded-none transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            authMode === 'register'
              ? 'bg-emerald-600 text-white font-black shadow-xs'
              : 'text-slate-700 hover:bg-white'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>{language === 'mr' ? 'नवीन नागरिक नोंदणी' : 'Register Citizen'}</span>
        </button>
      </div>

      {/* 1. CITIZEN LOGIN FORM */}
      {authMode === 'login' && (
        <form onSubmit={handleLogin} className="space-y-4">
          
          {loginError && (
            <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-none text-xs sm:text-sm text-rose-950 font-bold space-y-2.5">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <p className="leading-snug">{loginError}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setRegMobile(loginMobile);
                  setLoginError(null);
                }}
                className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-none text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <UserCheck className="w-4 h-4" />
                <span>
                  {language === 'mr'
                    ? '👉 आत्ताच नागरिक म्हणून नोंदणी करा'
                    : '👉 Register as Citizen Now'}
                </span>
              </button>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              {language === 'mr' ? 'नोंदणीकृत मोबाईल नंबर' : 'Registered Mobile Number'}
              <span className="text-rose-500 font-bold ml-1">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-bold text-xs">
                🇮🇳 +91
              </div>
              <input
                type="tel"
                maxLength={10}
                value={loginMobile}
                onChange={(e) => {
                  setLoginMobile(e.target.value.replace(/\D/g, ''));
                  if (loginError) setLoginError(null);
                }}
                placeholder="उदा. 9820123456"
                className="w-full pl-16 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-none text-sm font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-600 transition-all tracking-wider"
                required
                autoFocus
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {language === 'mr'
                ? 'पोर्टलवर आधी नोंदणी केलेला १० अंकी मोबाईल नंबर प्रविष्ट करा.'
                : 'Enter your 10-digit number registered with BMC portal.'}
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-none font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>
              {isSubmitting
                ? (language === 'mr' ? 'पडताळणी होत आहे...' : 'Verifying...')
                : (language === 'mr' ? 'लॉगिन करा' : 'Log In as Citizen')}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 text-center">
            <span className="text-xs text-slate-600">
              {language === 'mr' ? 'खाते नाही आहे का?' : 'New to this portal?'}
            </span>{' '}
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setLoginError(null);
              }}
              className="text-xs font-black text-emerald-700 hover:underline cursor-pointer"
            >
              {language === 'mr' ? 'येथे नागरिक नोंदणी करा' : 'Register Here'}
            </button>
          </div>

        </form>
      )}

      {/* 2. CITIZEN REGISTRATION FORM */}
      {authMode === 'register' && (
        <form onSubmit={handleRegister} className="space-y-3.5">
          
          {regError && (
            <div className="p-3 bg-rose-50 border border-rose-300 rounded-none text-xs text-rose-900 font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{regError}</span>
            </div>
          )}

          {regSuccessMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-none text-xs text-emerald-900 font-bold flex items-center gap-2 animate-pulse">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{regSuccessMessage}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              {language === 'mr' ? 'पूर्ण नाव' : 'Full Name'}
              <span className="text-rose-500 font-bold ml-1">*</span>
            </label>
            <input
              type="text"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              placeholder={language === 'mr' ? 'उदा. आनंद जोशी' : 'e.g. Anand Joshi'}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-none text-sm font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-600 transition-all"
              required
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              {language === 'mr' ? 'मोबाईल नंबर' : 'Mobile Number'}
              <span className="text-rose-500 font-bold ml-1">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-bold text-xs">
                🇮🇳 +91
              </div>
              <input
                type="tel"
                maxLength={10}
                value={regMobile}
                onChange={(e) => setRegMobile(e.target.value.replace(/\D/g, ''))}
                placeholder="उदा. 9820123456"
                className="w-full pl-16 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-none text-sm font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-600 transition-all tracking-wider"
                required
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {language === 'mr'
                ? 'हा मोबाईल नंबर भविष्यातील लॉगिन आणि तक्रार अपडेटसाठी वापरला जाईल.'
                : 'This number will be used for all logins and grievance SMS updates.'}
            </p>
          </div>

          {/* Resident Ward */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              {language === 'mr' ? 'आपला रहिवासी वॉर्ड (परिसर)' : 'Resident Ward / Area'}
              <span className="text-rose-500 font-bold ml-1">*</span>
            </label>
            <select
              value={regWard}
              onChange={(e) => setRegWard(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-none text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-600 transition-all cursor-pointer"
            >
              {mumbaiWards.map((w) => (
                <option key={w.id} value={w.id}>
                  {language === 'mr' ? `वॉर्ड ${w.id} - ${w.name.mr}` : `Ward ${w.id} (${w.keyAreas.split(',')[0]})`}
                </option>
              ))}
            </select>
          </div>

          {/* Optional Locality / Address */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              {language === 'mr' ? 'पत्ता / परिसर (ऐच्छिक)' : 'Address / Landmark (Optional)'}
            </label>
            <input
              type="text"
              value={regAddress}
              onChange={(e) => setRegAddress(e.target.value)}
              placeholder={language === 'mr' ? 'उदा. एस. व्ही. रोड, अंधेरी पश्चिम' : 'e.g. S.V. Road, Andheri West'}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-none text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-600 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-none font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all disabled:opacity-50 mt-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>
              {isSubmitting
                ? (language === 'mr' ? 'नोंदणी होत आहे...' : 'Registering...')
                : (language === 'mr' ? 'नोंदणी पूर्ण करा व लॉगिन करा' : 'Complete Registration & Log In')}
            </span>
          </button>

          <div className="pt-2 text-center">
            <span className="text-xs text-slate-600">
              {language === 'mr' ? 'आधीच नोंदणी केली आहे?' : 'Already registered?'}
            </span>{' '}
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setRegError(null);
              }}
              className="text-xs font-black text-emerald-700 hover:underline cursor-pointer"
            >
              {language === 'mr' ? 'थेट लॉगिन करा' : 'Log In directly'}
            </button>
          </div>

        </form>
      )}

      {onCancel && (
        <div className="text-center pt-1 border-t border-slate-200">
          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-bold text-slate-700 hover:underline cursor-pointer"
          >
            {language === 'mr' ? '← मागे जा' : '← Go back'}
          </button>
        </div>
      )}

    </div>
  );
};
