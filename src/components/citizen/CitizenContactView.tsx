import React, { useState } from 'react';
import { Language, WardInfo } from '../../types';
import { mumbaiWards } from '../../data/mockData';
import { 
  PhoneCall, 
  MapPin, 
  Search, 
  Send, 
  CheckCircle2, 
  Building2, 
  User, 
  Clock, 
  MessageSquare
} from 'lucide-react';

interface CitizenContactViewProps {
  language: Language;
  onSelectWardForComplaint?: (ward: WardInfo) => void;
}

export const CitizenContactView: React.FC<CitizenContactViewProps> = ({
  language,
  onSelectWardForComplaint,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    phone: '',
    wardId: 'K/W',
    message: ''
  });

  const zones = ['all', 'South Mumbai', 'Western Suburbs', 'Eastern Suburbs'];

  const filteredWards = mumbaiWards.filter((w) => {
    const matchesZone = selectedZone === 'all' || w.zone === selectedZone;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesZone;

    const matchesQuery = 
      w.id.toLowerCase().includes(q) ||
      w.keyAreas.toLowerCase().includes(q) ||
      w.wardOfficer.toLowerCase().includes(q) ||
      (language === 'mr' ? w.name.mr : w.name.en).toLowerCase().includes(q);

    return matchesZone && matchesQuery;
  });

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackForm.message.trim()) return;

    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setFeedbackForm({ name: '', phone: '', wardId: 'K/W', message: '' });
    }, 4000);
  };

  return (
    <div className="space-y-5">
      {/* 1. Header Banner with Sharp Edges */}
      <div className="bg-white border-2 border-slate-300 rounded-none p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                {language === 'mr' 
                  ? 'मनपा २४x७ नियंत्रण कक्ष व संपर्क सूची' 
                  : 'BMC 24x7 Control Rooms & Ward Directory'}
              </h2>
              <p className="text-xs text-slate-600 font-semibold mt-0.5">
                {language === 'mr'
                  ? '२४ प्रशासकीय वॉर्ड, आपत्ती व्यवस्थापन कक्ष व आपत्कालीन अधिकाऱ्यांची अधिकृत संपर्क सूची'
                  : 'Official telephone directory of 24 Ward Control Rooms and Emergency Response teams'}
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-900 bg-slate-50 px-3 py-1.5 rounded-none border border-slate-200 font-black self-start sm:self-auto flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-700" />
            <span>{language === 'mr' ? '२४x७ २४ तास अविरत कार्यरत' : 'Active 24x7 Continuous'}</span>
          </div>
        </div>

        {/* 2. Key Emergency Toll-Free Hotlines with Sharp Corners */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          
          <div className="p-3.5 rounded-none bg-slate-50 border border-slate-300 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900">
                {language === 'mr' ? 'मनपा मध्यवर्ती हेल्पलाईन' : 'BMC Central Helpline'}
              </span>
              <span className="text-[10px] bg-emerald-600 text-white font-black px-1.5 py-0.5 rounded-none">
                Toll Free
              </span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-black text-slate-900">1916</div>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                {language === 'mr' ? 'नागरी समस्या व तक्रार निवारण' : 'Civic grievance & triage'}
              </p>
            </div>
            <a
              href="tel:1916"
              className="mt-2.5 w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-none text-xs font-black text-center block transition-colors shadow-2xs"
            >
              📞 {language === 'mr' ? 'कॉल करा (1916)' : 'Call 1916'}
            </a>
          </div>

          <div className="p-3.5 rounded-none bg-slate-50 border border-slate-300 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900">
                {language === 'mr' ? 'आपत्ती व्यवस्थापन कक्ष' : 'Disaster Management'}
              </span>
              <span className="text-[10px] bg-[#334155] text-white font-black px-1.5 py-0.5 rounded-none">
                Emergency
              </span>
            </div>
            <div className="mt-2">
              <div className="text-base sm:text-lg font-black text-slate-900">022-22694725</div>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                {language === 'mr' ? 'पूर, झाड पडणे, इमारतीचा धोका' : 'Flooding, tree fall, danger'}
              </p>
            </div>
            <a
              href="tel:02222694725"
              className="mt-2.5 w-full py-1.5 bg-[#334155] hover:bg-[#0f172a] text-white rounded-none text-xs font-black text-center block transition-colors shadow-2xs"
            >
              📞 {language === 'mr' ? 'कॉल करा' : 'Call Now'}
            </a>
          </div>

          <div className="p-3.5 rounded-none bg-slate-50 border border-slate-300 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900">
                {language === 'mr' ? 'व्हॉट्सॲप चॅटबॉट' : 'WhatsApp Grievance Bot'}
              </span>
              <span className="text-[10px] bg-emerald-600 text-white font-black px-1.5 py-0.5 rounded-none">
                WhatsApp
              </span>
            </div>
            <div className="mt-2">
              <div className="text-sm sm:text-base font-black text-slate-900">+91 93245 00111</div>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                {language === 'mr' ? 'व्हॉट्सॲपवर त्वरित संदेश पाठवा' : 'Instant WhatsApp chatbot filing'}
              </p>
            </div>
            <a
              href="https://wa.me/919324500111?text=Hi%20BMC"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-none text-xs font-black text-center block transition-colors shadow-2xs"
            >
              💬 WhatsApp
            </a>
          </div>

          <div className="p-3.5 rounded-none bg-white border border-slate-300 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900">
                {language === 'mr' ? 'इतर तातडीच्या सेवा' : 'Other Emergency'}
              </span>
              <span className="text-[10px] bg-[#475569] text-white font-black px-1.5 py-0.5 rounded-none">
                Govt
              </span>
            </div>
            <div className="mt-2 space-y-1 text-xs">
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-semibold">{language === 'mr' ? 'पोलीस नियंत्रण कक्ष:' : 'Police:'}</span>
                <a href="tel:100" className="font-bold text-emerald-700 hover:underline">100</a>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-semibold">{language === 'mr' ? 'अग्निशामक दल:' : 'Fire Brigade:'}</span>
                <a href="tel:101" className="font-bold text-emerald-700 hover:underline">101</a>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-semibold">{language === 'mr' ? 'ॲम्ब्युलन्स:' : 'Ambulance:'}</span>
                <a href="tel:108" className="font-bold text-emerald-700 hover:underline">108</a>
              </div>
            </div>
            <div className="text-[10px] text-slate-500 mt-2 text-center font-bold">
              {language === 'mr' ? '२४x७ आपत्कालीन मदत' : '24x7 Emergency Aid'}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Searchable 24 Ward Office Directory with Sharp Styling */}
      <div className="bg-white border-2 border-slate-300 rounded-none p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b-2 border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900">
              {language === 'mr' ? '२४ प्रशासकीय वॉर्ड कार्यालय संपर्क सूची' : '24 Administrative Wards Office Directory'}
            </h3>
            <p className="text-xs text-slate-600 font-semibold">
              {language === 'mr' 
                ? 'आपल्या वॉर्डचे सहाय्यक आयुक्त व नियंत्रण कक्षाशी संपर्क साधा' 
                : 'Direct contacts of Assistant Commissioners & Ward Control Rooms'}
            </p>
          </div>

          {/* Zone Selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            {zones.map((zone) => (
              <button
                key={zone}
                onClick={() => setSelectedZone(zone)}
                className={`px-3 py-1 rounded-none text-xs font-black transition-all cursor-pointer ${
                  selectedZone === zone
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-900 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {zone === 'all' 
                  ? (language === 'mr' ? 'सर्व वॉर्ड (२४)' : 'All Wards (24)') 
                  : zone}
              </button>
            ))}
          </div>
        </div>

        {/* Search input for Wards */}
        <div className="relative">
          <div className="flex items-center gap-2 border border-slate-300 rounded-none px-3 py-2 bg-white focus-within:border-emerald-600 transition-all">
            <Search className="w-4 h-4 text-emerald-700 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'mr' ? 'वॉर्ड (उदा. A, K/W, दादर, अंधेरी, वांद्रे, बोरिवली) शोधा...' : 'Search by Ward letter or locality (e.g. Dadar, Andheri, Bandra, Colaba)...'}
              className="w-full bg-transparent text-xs sm:text-sm text-slate-900 focus:outline-hidden font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold px-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Grid of Wards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          {filteredWards.map((ward) => (
            <div
              key={ward.id}
              className="p-4 rounded-none border border-slate-300 bg-white hover:border-emerald-600 transition-all shadow-2xs flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-none bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                      {ward.id}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      {ward.zone}
                    </span>
                  </div>
                </div>

                <h4 className="font-bold text-slate-900 text-sm leading-snug">
                  {language === 'mr' ? ward.name.mr : ward.name.en}
                </h4>

                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                  <span className="font-semibold text-slate-700">{language === 'mr' ? 'प्रमुख परिसर:' : 'Areas:'}</span> {ward.keyAreas}
                </p>

                <div className="mt-2 text-xs text-slate-600 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span className="font-medium text-slate-800 truncate">{ward.wardOfficer}</span>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                <a
                  href={`tel:${ward.controlRoomPhone}`}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200 rounded-none text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <PhoneCall className="w-3 h-3 text-emerald-700" />
                  <span>{ward.controlRoomPhone}</span>
                </a>

                {onSelectWardForComplaint && (
                  <button
                    onClick={() => onSelectWardForComplaint(ward)}
                    className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-emerald-700 border border-slate-200 rounded-none text-xs font-bold cursor-pointer transition-colors"
                  >
                    {language === 'mr' ? 'तक्रार करा ➔' : 'Report ➔'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Quick Citizen Inquiry Form with Sharp Styling */}
      <div className="bg-white border-2 border-slate-300 rounded-none p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 border-b-2 border-slate-100 pb-3 mb-4">
          <div className="w-8 h-8 rounded-none bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">
              {language === 'mr' ? 'वॉर्ड अधिकाऱ्यांना थेट संदेश / संपर्क विनंती' : 'Direct Message or Callback Request to Ward Officer'}
            </h3>
            <p className="text-xs text-slate-600 font-semibold">
              {language === 'mr'
                ? 'तातडीच्या चौकशीसाठी किंवा मदतीसाठी वॉर्ड नियंत्रण कक्षाला संदेश पाठवा'
                : 'Send an inquiry or request a call back from your local Ward Control Desk'}
            </p>
          </div>
        </div>

        {feedbackSent ? (
          <div className="p-4 rounded-none bg-pink-50 border-2 border-pink-400 text-slate-900 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0" />
            <div>
              <h4 className="font-black text-sm">
                {language === 'mr' ? 'संदेश यशस्वीरीत्या पाठवला!' : 'Message Sent Successfully!'}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {language === 'mr'
                  ? 'आपला संदेश वॉर्ड नियंत्रण कक्षाला प्राप्त झाला आहे. अधिकारी लवकरच आपल्याशी संपर्क करतील.'
                  : 'Your message has been logged with the Ward Control Room. An officer will respond shortly.'}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendFeedback} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-black text-slate-900 mb-1">
                  {language === 'mr' ? 'आपले नाव' : 'Your Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === 'mr' ? 'उदा. अमित सावंत' : 'e.g. Rajesh Kumar'}
                  value={feedbackForm.name}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-none border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-emerald-600 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-900 mb-1">
                  {language === 'mr' ? 'मोबाईल नंबर' : 'Mobile Number'}
                </label>
                <input
                  type="tel"
                  required
                  placeholder="98XXXXXXXX"
                  value={feedbackForm.phone}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-none border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-emerald-600 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-900 mb-1">
                  {language === 'mr' ? 'संबंधित वॉर्ड' : 'Relevant Ward'}
                </label>
                <select
                  value={feedbackForm.wardId}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, wardId: e.target.value })}
                  className="w-full px-3 py-2 rounded-none border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-emerald-600 bg-white font-bold"
                >
                  {mumbaiWards.map((w) => (
                    <option key={w.id} value={w.id}>
                      {language === 'mr' ? `वॉर्ड ${w.id} - ${w.name.mr}` : `Ward ${w.id} (${w.keyAreas.split(',')[0]})`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 mb-1">
                {language === 'mr' ? 'आपला संदेश किंवा चौकशी' : 'Your Message or Inquiry'}
              </label>
              <textarea
                required
                rows={3}
                placeholder={language === 'mr' ? 'आपली समस्या, माहिती किंवा तक्रारीबाबतचा तपशील येथे लिहा...' : 'Describe your query or assistance request...'}
                value={feedbackForm.message}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                className="w-full px-3 py-2 rounded-none border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-emerald-600 bg-white"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-none text-xs sm:text-sm font-black flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>{language === 'mr' ? 'संदेश पाठवा' : 'Send Message'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
