import React, { useState } from 'react';
import { Complaint, Language } from '../types';
import { getTranslation } from '../utils/translations';
import { downloadSqlFile, downloadJsonFile } from '../utils/databaseExport';
import { 
  X, 
  Database, 
  Terminal, 
  Download, 
  Copy, 
  Check, 
  Server,
  Layers
} from 'lucide-react';

interface DatabaseExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaints: Complaint[];
  language: Language;
}

export const DatabaseExportModal: React.FC<DatabaseExportModalProps> = ({
  isOpen,
  onClose,
  complaints,
  language
}) => {
  const [activeTab, setActiveTab] = useState<'xampp' | 'cmd' | 'json'>('xampp');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const curlJsonCmd = `curl -s http://localhost:3000/api/complaints`;
  const curlSqlCmd = `curl -s http://localhost:3000/api/export/sql -o bmc_database.sql`;
  const mysqlImportCmd = `mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS bmc_complaints_db;" && mysql -u root -p bmc_complaints_db < bmc_database.sql`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-none max-w-2xl w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-300 animate-in fade-in zoom-in-95 my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-none bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-900 leading-tight">
                {getTranslation('dbModalTitle', language)}
              </h3>
              <p className="text-xs text-slate-600 font-semibold mt-0.5">
                {complaints.length} {language === 'mr' ? 'तक्रारी डेटाबेसमध्ये नोंद आहेत' : 'Complaints currently in database'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-none text-slate-400 hover:text-emerald-700 hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-50 p-1 rounded-none text-xs font-bold gap-1 border border-slate-200">
          <button
            onClick={() => setActiveTab('xampp')}
            className={`flex-1 py-2 px-3 rounded-none flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
              activeTab === 'xampp'
                ? 'bg-emerald-600 text-white shadow-xs font-black'
                : 'text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>XAMPP (phpMyAdmin)</span>
          </button>

          <button
            onClick={() => setActiveTab('cmd')}
            className={`flex-1 py-2 px-3 rounded-none flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
              activeTab === 'cmd'
                ? 'bg-emerald-600 text-white shadow-xs font-black'
                : 'text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>CMD / Terminal</span>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`flex-1 py-2 px-3 rounded-none flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
              activeTab === 'json'
                ? 'bg-emerald-600 text-white shadow-xs font-black'
                : 'text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>JSON Export</span>
          </button>
        </div>

        {/* Tab 1: XAMPP phpMyAdmin */}
        {activeTab === 'xampp' && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 border border-slate-300 rounded-none p-3.5 text-slate-900 space-y-1">
              <div className="font-black flex items-center gap-1.5 text-slate-900">
                <span>⚡ {language === 'mr' ? 'XAMPP phpMyAdmin मध्ये आयात (Import) कशी करावी:' : 'How to import into XAMPP phpMyAdmin:'}</span>
              </div>
              <ol className="list-decimal pl-5 space-y-1 text-slate-700">
                <li>{language === 'mr' ? 'खालील बटणावर क्लिक करून .SQL डंप फाईल डाउनलोड करा.' : 'Click the button below to download the MySQL .SQL dump file.'}</li>
                <li>{language === 'mr' ? 'XAMPP Control Panel उघडून Apache व MySQL सुरू करा.' : 'Open XAMPP Control Panel and Start Apache & MySQL.'}</li>
                <li>{language === 'mr' ? 'ब्राउझरमध्ये http://localhost/phpmyadmin उघडा.' : 'Go to http://localhost/phpmyadmin in your browser.'}</li>
                <li>{language === 'mr' ? '"Import" टॅबवर जा, डाउनलोड केलेली .sql फाईल निवडा आणि "Go / Import" दाबा.' : 'Click "Import", select the downloaded .sql file and click "Import/Go".'}</li>
              </ol>
            </div>

            <button
              onClick={() => downloadSqlFile(complaints)}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-none font-black flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
            >
              <Download className="w-4 h-4 text-white" />
              <span>{getTranslation('downloadSqlBtn', language)}</span>
            </button>
          </div>
        )}

        {/* Tab 2: CMD / Terminal */}
        {activeTab === 'cmd' && (
          <div className="space-y-3 text-xs">
            <p className="text-slate-600 font-medium">
              {language === 'mr' 
                ? 'आपण कोणत्याही Command Prompt (CMD), PowerShell किंवा Linux Terminal वरून खालील कमांड्स रन करून थेट डेटा फेच करू शकता:'
                : 'Run these commands in Windows CMD or Terminal to fetch the live database directly:'}
            </p>

            {/* CMD 1: Fetch live JSON */}
            <div className="bg-slate-900 rounded-none p-3 text-slate-100 font-mono text-[11px] space-y-1.5 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-sans font-bold">
                <span>1. Fetch Complaints JSON via CMD:</span>
                <button
                  onClick={() => handleCopy(curlJsonCmd, 'cmd1')}
                  className="flex items-center gap-1 text-pink-400 hover:text-pink-300 cursor-pointer font-bold"
                >
                  {copiedKey === 'cmd1' ? <Check className="w-3 h-3 text-pink-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'cmd1' ? getTranslation('copied', language) : getTranslation('copyCmd', language)}</span>
                </button>
              </div>
              <div className="break-all select-all text-pink-300">{curlJsonCmd}</div>
            </div>

            {/* CMD 2: Fetch SQL Dump */}
            <div className="bg-slate-900 rounded-none p-3 text-slate-100 font-mono text-[11px] space-y-1.5 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-sans font-bold">
                <span>2. Download SQL Dump to file via CMD:</span>
                <button
                  onClick={() => handleCopy(curlSqlCmd, 'cmd2')}
                  className="flex items-center gap-1 text-pink-400 hover:text-pink-300 cursor-pointer font-bold"
                >
                  {copiedKey === 'cmd2' ? <Check className="w-3 h-3 text-pink-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'cmd2' ? getTranslation('copied', language) : getTranslation('copyCmd', language)}</span>
                </button>
              </div>
              <div className="break-all select-all text-pink-300">{curlSqlCmd}</div>
            </div>

            {/* CMD 3: Pipe directly to MySQL in XAMPP via CMD */}
            <div className="bg-slate-900 rounded-none p-3 text-slate-100 font-mono text-[11px] space-y-1.5 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-sans font-bold">
                <span>3. Import directly into MySQL (XAMPP CMD):</span>
                <button
                  onClick={() => handleCopy(mysqlImportCmd, 'cmd3')}
                  className="flex items-center gap-1 text-pink-400 hover:text-pink-300 cursor-pointer font-bold"
                >
                  {copiedKey === 'cmd3' ? <Check className="w-3 h-3 text-pink-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'cmd3' ? getTranslation('copied', language) : getTranslation('copyCmd', language)}</span>
                </button>
              </div>
              <div className="break-all select-all text-pink-300">{mysqlImportCmd}</div>
            </div>
          </div>
        )}

        {/* Tab 3: JSON File */}
        {activeTab === 'json' && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 font-medium">
              {language === 'mr'
                ? 'नागरिकांनी नोंदवलेल्या सर्व तक्रारी, वॉर्ड तपशील व प्राधान्य गुणांसह संपूर्ण JSON फाईल डाउनलोड करा.'
                : 'Download raw JSON file containing all active tickets, GPS coordinates, priority scores, and timestamps.'}
            </p>

            <button
              onClick={() => downloadJsonFile(complaints)}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-none font-black flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
            >
              <Download className="w-4 h-4 text-white" />
              <span>{getTranslation('downloadJsonBtn', language)}</span>
            </button>
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-3 border-t-2 border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="text-slate-900 font-bold">BMC Civic Data Engine · UTF-8 / Marathi Support</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200 font-black rounded-none cursor-pointer"
          >
            {language === 'mr' ? 'बंद करा' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
