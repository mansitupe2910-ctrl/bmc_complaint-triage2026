/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language, Complaint, CitizenUser, OfficerUser } from './types';
import { Navbar } from './components/Navbar';
import { CitizenPortal } from './components/citizen/CitizenPortal';
import { OfficerCommandCenter } from './components/officer/OfficerCommandCenter';
import { CitizenAuthView } from './components/auth/CitizenAuthView';
import { OfficerLoginView } from './components/auth/OfficerLoginView';
import { AppGatewayView } from './components/auth/AppGatewayView';
import { GeminiChatbotModal } from './components/gemini/GeminiChatbotModal';
import { GeminiFloatingLauncher } from './components/gemini/GeminiFloatingLauncher';
import { FieldEngineerPortal } from './components/engineer/FieldEngineerPortal';
import { getTranslation, normalizeComplaint } from './utils/translations';
import { ShieldCheck, LogOut, ArrowLeftRight } from 'lucide-react';
import { FieldEngineerUser } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'citizen' | 'officer' | 'engineer'>('citizen');
  // Default to Marathi (मराठी) as requested by user, with English & Hindi 1-click away
  const [language, setLanguage] = useState<Language>('mr');
  const [seniorMode, setSeniorMode] = useState<boolean>(true);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [showGeminiChat, setShowGeminiChat] = useState<boolean>(false);
  
  // Auth state
  const [citizenUser, setCitizenUser] = useState<CitizenUser | null>(() => {
    try {
      const saved = localStorage.getItem('bmc_citizen_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [officerUser, setOfficerUser] = useState<OfficerUser | null>(() => {
    try {
      const saved = localStorage.getItem('bmc_officer_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [engineerUser, setEngineerUser] = useState<FieldEngineerUser | null>(() => {
    try {
      const saved = localStorage.getItem('bmc_engineer_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [showCitizenAuthModal, setShowCitizenAuthModal] = useState<boolean>(false);

  const handleCitizenLogout = () => {
    localStorage.removeItem('bmc_citizen_user');
    setCitizenUser(null);
  };

  const handleOfficerLogout = () => {
    localStorage.removeItem('bmc_officer_user');
    setOfficerUser(null);
  };

  const handleEngineerLogout = () => {
    localStorage.removeItem('bmc_engineer_user');
    setEngineerUser(null);
  };

  const handleSwitchToGateway = () => {
    localStorage.removeItem('bmc_citizen_user');
    localStorage.removeItem('bmc_officer_user');
    localStorage.removeItem('bmc_engineer_user');
    setCitizenUser(null);
    setOfficerUser(null);
    setEngineerUser(null);
  };

  // Complaints state: Load from localStorage first so refreshing the page NEVER loses data
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try {
      const saved = localStorage.getItem('bmc_saved_complaints');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map(normalizeComplaint).filter(Boolean);
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  // Auto-persist complaints to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('bmc_saved_complaints', JSON.stringify(complaints));
    } catch (e) {
      console.error('Failed to save complaints to localStorage:', e);
    }
  }, [complaints]);

  // Sync with backend API on mount
  useEffect(() => {
    fetch('/api/complaints')
      .then((res) => res.json())
      .then((data) => {
        if (data.complaints && Array.isArray(data.complaints) && data.complaints.length > 0) {
          const normalized = data.complaints.map(normalizeComplaint).filter(Boolean);
          setComplaints(normalized);
          localStorage.setItem('bmc_saved_complaints', JSON.stringify(normalized));
        } else {
          // If server database is currently empty, push whatever is in localStorage to backend
          const savedLocal = localStorage.getItem('bmc_saved_complaints');
          if (savedLocal) {
            const parsed = JSON.parse(savedLocal);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const normalized = parsed.map(normalizeComplaint).filter(Boolean);
              fetch('/api/complaints', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(normalized),
              }).catch(() => {});
            }
          }
        }
      })
      .catch(() => {
        // Fallback gracefully to localStorage
      });
  }, []);

  // USER REQUIREMENT:
  // "the most first page must launch as log in or register for user and for officer it must look different and include the id and ward"
  if (!citizenUser && !officerUser && !engineerUser) {
    return (
      <>
        <AppGatewayView
          language={language}
          setLanguage={setLanguage}
          seniorMode={seniorMode}
          setSeniorMode={setSeniorMode}
          onCitizenLogin={(user) => {
            setCitizenUser(user);
            setCurrentTab('citizen');
          }}
          onOfficerLogin={(officer) => {
            setOfficerUser(officer);
            setCurrentTab('officer');
          }}
          onEngineerLogin={(engineer) => {
            setEngineerUser(engineer);
            setCurrentTab('engineer');
          }}
        />
        {/* Floating Gemini Chatbot Launcher & Modal on Gateway */}
        <GeminiFloatingLauncher
          onClick={() => setShowGeminiChat(true)}
          language={language}
          isOpen={showGeminiChat}
        />
        <GeminiChatbotModal
          isOpen={showGeminiChat}
          onClose={() => setShowGeminiChat(false)}
          language={language}
          seniorMode={seniorMode}
          highContrast={highContrast}
        />
      </>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col w-full max-w-full overflow-x-hidden transition-colors ${
      highContrast ? 'bg-slate-950 text-white high-contrast' : 'bg-[#f8fafc] text-slate-800'
    }`}>
      {/* 3-Zone Top Navigation Bar (Strictly Role-Isolated & Sharp Ended) */}
      <Navbar
        currentTab={officerUser ? 'officer' : engineerUser ? 'engineer' : 'citizen'}
        language={language}
        setLanguage={setLanguage}
        seniorMode={seniorMode}
        setSeniorMode={setSeniorMode}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        citizenUser={citizenUser}
        officerUser={officerUser}
        engineerUser={engineerUser}
        onCitizenLogout={handleCitizenLogout}
        onOfficerLogout={handleOfficerLogout}
        onEngineerLogout={handleEngineerLogout}
        onOpenCitizenAuth={() => setShowCitizenAuthModal(true)}
        onSwitchToGateway={handleSwitchToGateway}
        onOpenGeminiChat={() => setShowGeminiChat(true)}
      />

      {/* Main View Area: Strict Isolation (Citizen sees ONLY Citizen, Officer sees ONLY Officer, Field Engineer sees Field Work) */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {citizenUser ? (
          /* ONLY Citizen Portal & Dashboard visible to logged-in Citizen */
          <CitizenPortal
            complaints={complaints}
            setComplaints={setComplaints}
            language={language}
            seniorMode={seniorMode}
            highContrast={highContrast}
            citizenUser={citizenUser}
            onOpenCitizenAuth={() => setShowCitizenAuthModal(true)}
          />
        ) : officerUser ? (
          /* ONLY Officer Command Center visible to logged-in Officer */
          <OfficerCommandCenter
            complaints={complaints}
            setComplaints={setComplaints}
            language={language}
            highContrast={highContrast}
          />
        ) : engineerUser ? (
          /* ONLY Field Engineer Landing Page & Work Upload Desk */
          <FieldEngineerPortal
            complaints={complaints}
            setComplaints={setComplaints}
            engineerUser={engineerUser}
            language={language}
            onLogout={handleEngineerLogout}
          />
        ) : null}
      </main>

      {/* Citizen Authentication Modal / Drawer */}
      {showCitizenAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-none">
            <CitizenAuthView
              language={language}
              onLoginSuccess={(user) => {
                setCitizenUser(user);
                setShowCitizenAuthModal(false);
              }}
              onCancel={() => setShowCitizenAuthModal(false)}
            />
          </div>
        </div>
      )}

      {/* Municipal Civic Footer with Professional Theme and Sharp Corners */}
      <footer className={`border-t py-5 px-3 sm:px-6 w-full max-w-full overflow-x-hidden transition-colors rounded-none ${
        highContrast ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="font-bold text-slate-900">
              {language === 'mr' ? 'बृहन्मुंबई महानगरपालिका' : 'Brihanmumbai Municipal Corporation'}
            </span>
            <span>·</span>
            <span className="text-slate-500 font-medium">
              {language === 'mr' ? 'नागरी तक्रार निवारण व वॉर्ड प्रशासन' : 'Civic Complaint Triage & Ward Governance'}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-600">
            <span>
              {language === 'mr' ? '२४x७ नागरिक हेल्पलाइन:' : '24x7 Citizen Helpline:'} <strong className="text-[#0284c7]">1916</strong>
            </span>
            <span>·</span>
            <span>
              {language === 'mr' ? 'आपत्ती व्यवस्थापन:' : 'Disaster Management:'} <strong className="text-[#0284c7]">022-22694725</strong>
            </span>
            <span>·</span>
            <span className="font-semibold">{language === 'mr' ? '२४ प्रशासकीय वॉर्ड' : '24 Administrative Wards'}</span>
          </div>
        </div>
      </footer>

      {/* Floating Gemini Chatbot Launcher & Multi-Turn Chatbot Modal */}
      <GeminiFloatingLauncher
        onClick={() => setShowGeminiChat(true)}
        language={language}
        isOpen={showGeminiChat}
      />
      <GeminiChatbotModal
        isOpen={showGeminiChat}
        onClose={() => setShowGeminiChat(false)}
        language={language}
        seniorMode={seniorMode}
        highContrast={highContrast}
      />
    </div>
  );
}

