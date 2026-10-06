import { Language } from '../types';

export const translations = {
  // Brand & Header
  brandTitle: {
    en: 'Brihanmumbai Municipal Corporation',
    mr: 'बृहन्मुंबई महानगरपालिका',
    hi: 'बृहन्मुंबई नगर निगम'
  },
  corporationFull: {
    en: 'Citizen Grievance Triage Portal',
    mr: 'नागरिक तक्रार निवारण कक्ष',
    hi: 'नागरिक शिकायत निवारण कक्ष'
  },
  tagline: {
    en: 'AI Citizen Portal & Ward Officer Command Center',
    mr: 'एआय नागरिक मंच आणि वॉर्ड अधिकारी नियंत्रण कक्ष',
    hi: 'एआई नागरिक मंच एवं वार्ड अधिकारी नियंत्रण कक्ष'
  },
  
  // Navigation tabs
  citizenTab: {
    en: 'Citizen Portal',
    mr: 'नागरिक मंच',
    hi: 'नागरिक पोर्टल'
  },
  commandTab: {
    en: 'Ward Officer Command',
    mr: 'वॉर्ड अधिकारी कमांड',
    hi: 'वॉर्ड अधिकारी कमांड'
  },
  
  // Accessibility & Senior Mode
  seniorMode: {
    en: 'Senior Citizen Mode',
    mr: 'ज्येष्ठ नागरिक मोड',
    hi: 'वरिष्ठ नागरिक मोड'
  },
  highContrast: {
    en: 'High Contrast',
    mr: 'उच्च कॉन्ट्रास्ट',
    hi: 'उच्च कंट्रास्ट'
  },
  textSize: {
    en: 'Text Size',
    mr: 'अक्षर आकार',
    hi: 'फॉन्ट साइज'
  },
  speechAssistant: {
    en: 'Voice Help',
    mr: 'आवाज मार्गदर्शन',
    hi: 'ध्वनि सहायता'
  },

  // Citizen Portal Actions
  portalHeadline: {
    en: 'Report Civic Issue in 1 Tap',
    mr: 'एका क्लिकवर नागरी समस्या नोंदवा',
    hi: 'एक क्लिक में नागरिक समस्या दर्ज करें'
  },
  portalSubheadline: {
    en: 'Speak in your language, upload a photo, or tap "+1 Me Too" on nearby issues without duplicate tickets.',
    mr: 'आपल्या भाषेत बोला, फोटो निवडा किंवा डुप्लिकेट तक्रार न करता शेजारच्या समस्येवर "+१ मलाही दिसतंय" दाबा.',
    hi: 'अपनी भाषा में बोलें, फोटो चुनें या बिना दोबारा शिकायत किए "+१ मुझे भी दिख रहा है" दबाएं।'
  },
  
  // Primary Quick Actions
  actionVoice: {
    en: 'Speak Issue (Voice)',
    mr: 'बोलून सांगा (आवाज)',
    hi: 'बोलकर बताएं (ध्वनि)'
  },
  actionPhoto: {
    en: 'AI Photo Scanner',
    mr: 'एआय फोटो स्कॅनर',
    hi: 'एआई फोटो स्कैनर'
  },
  actionNearby: {
    en: 'Nearby Issues (+1 Me Too)',
    mr: 'परिसरातील तक्रारी (+१ मलाही)',
    hi: 'पास की शिकायतें (+१ मुझे भी)'
  },
  actionTrack: {
    en: 'Track My Ticket',
    mr: 'तक्रार स्थिती पाहा',
    hi: 'शिकायत स्थिति देखें'
  },

  // User Left Navigation Bar items
  navSeeComplaints: {
    en: 'See Complaints',
    mr: 'तक्रारी पहा',
    hi: 'शिकायतें देखें'
  },
  navSubmitComplaint: {
    en: 'Submit Complaint',
    mr: 'तक्रार नोंदवा',
    hi: 'शिकायत दर्ज करें'
  },
  navTrackComplaint: {
    en: 'Track Complaint',
    mr: 'तक्रार ट्रॅक करा',
    hi: 'शिकायत ट्रैक करें'
  },
  navContact: {
    en: 'Contact & Helplines',
    mr: 'संपर्क व हेल्पलाईन',
    hi: 'संपर्क एवं हेल्पलाइन'
  },
  contactTitle: {
    en: 'BMC 24x7 Control Rooms & Ward Directory',
    mr: 'मनपा २४x७ नियंत्रण कक्ष व वॉर्ड संपर्क सूची',
    hi: 'मनपा २४x७ नियंत्रण कक्ष एवं वार्ड संपर्क सूची'
  },
  contactSubtitle: {
    en: 'Official telephone directory of 24 Ward Control Rooms, Disaster Management, and emergency officers',
    mr: '२४ प्रशासकीय वॉर्ड नियंत्रण कक्ष, आपत्ती व्यवस्थापन व जबाबदार अधिकाऱ्यांची अधिकृत संपर्क सूची',
    hi: '२४ प्रशासनिक वार्ड नियंत्रण कक्ष, आपदा प्रबंधन एवं जिम्मेदार अधिकारियों की आधिकारिक संपर्क सूची'
  },

  // Voice recording
  voiceRecordingTitle: {
    en: 'Multilingual Voice Complaint',
    mr: 'बहुभाषिक आवाज तक्रार नोंदणी',
    hi: 'बहुभाषी ध्वनि शिकायत दर्ज करें'
  },
  tapToSpeak: {
    en: 'Tap to Start Speaking',
    mr: 'बोलण्यासाठी इथे दाबा',
    hi: 'बोलने के लिए यहाँ दबाएं'
  },
  listening: {
    en: 'Listening in your language...',
    mr: 'आपला आवाज ऐकत आहे...',
    hi: 'आपकी आवाज सुनी जा रही है...'
  },
  stopRecording: {
    en: 'Done Speaking / Analyze',
    mr: 'बोलून झाले / विश्लेषण करा',
    hi: 'बोलना समाप्त / विश्लेषण करें'
  },
  quickVoiceSamples: {
    en: 'Try Sample Senior Voice Prompts:',
    mr: 'ज्येष्ठ नागरिकांचे नमुना आवाज ऐका / निवडा:',
    hi: 'वरिष्ठ नागरिकों के नमूना आवाज चुनें:'
  },
  transcriptLabel: {
    en: 'Transcribed Speech',
    mr: 'ऐकलेला मजकूर',
    hi: 'रिकॉर्ड किया गया संदेश'
  },
  aiExtracting: {
    en: 'AI is extracting Ward, Department, and Hazard Level...',
    mr: 'एआय वॉर्ड, विभाग आणि धोका पातळी तपासत आहे...',
    hi: 'एआई वार्ड, विभाग और खतरे के स्तर का विश्लेषण कर रहा है...'
  },

  // Photo & AI inference
  photoScannerTitle: {
    en: 'Civic Hazard Photo AI Inference',
    mr: 'नागरी समस्या फोटो एआय विश्लेषण',
    hi: 'नागरिक समस्या फोटो एआई विश्लेषण'
  },
  uploadOrSelectPhoto: {
    en: 'Take Photo or Select Incident Scenario',
    mr: 'फोटो काढा किंवा परिसरातील नमुना निवडा',
    hi: 'फोटो लें या घटना का नमूना चुनें'
  },
  aiAnalyzing: {
    en: 'Running Deep Defect Inference...',
    mr: 'एआय द्वारे खोलवर दोष तपासणी चालू आहे...',
    hi: 'एआई द्वारा दोष का गहन विश्लेषण जारी है...'
  },
  detectedHazard: {
    en: 'Detected Hazard',
    mr: 'शोधलेला धोका',
    hi: 'पहचाना गया खतरा'
  },
  aiConfidence: {
    en: 'AI Confidence',
    mr: 'एआय अचूकता',
    hi: 'एआई सटीकता'
  },
  severityLevel: {
    en: 'Hazard Severity',
    mr: 'तीव्रता पातळी',
    hi: 'तीव्रता स्तर'
  },
  estimatedMetrics: {
    en: 'Defect Dimensions',
    mr: 'खड्ड्याची खोली / आकार',
    hi: 'दोष का आकार / गहराई'
  },
  routedDepartment: {
    en: 'Auto-Routed BMC Department',
    mr: 'नियुक्त मनपा विभाग',
    hi: 'निर्धारित नगर निगम विभाग'
  },

  // GPS Ward Detection
  gpsTitle: {
    en: 'GPS Ward Detection',
    mr: 'जीपीएस वॉर्ड शोध',
    hi: 'जीपीएस वार्ड पहचान'
  },
  detectGps: {
    en: 'Auto-Detect My Ward via GPS',
    mr: 'माझा वॉर्ड आपोआप ओळखा',
    hi: 'मेरा वार्ड जीपीएस से खोजें'
  },
  detectedWard: {
    en: 'Your Municipal Ward',
    mr: 'आपला महापालिका वॉर्ड',
    hi: 'आपका नगर निगम वार्ड'
  },
  wardOfficerInCharge: {
    en: 'Ward Officer in Charge',
    mr: 'प्रभारी वॉर्ड अधिकारी',
    hi: 'प्रभारी वार्ड अधिकारी'
  },
  wardHelpline: {
    en: 'Ward 24x7 Helpline',
    mr: '२४x७ वॉर्ड नियंत्रण कक्ष फोन',
    hi: '२४x७ वार्ड हेल्पलाइन'
  },

  // Cluster Deduplication (+1 Me Too)
  clusterDeduplicationTitle: {
    en: 'Nearby Reported Issues (Cluster Deduplication)',
    mr: 'परिसरातील आधीच नोंदवलेल्या तक्रारी (डुप्लिकेट रोखा)',
    hi: 'आसपास की दर्ज शिकायतें (डुप्लिकेट रोकें)'
  },
  clusterExplanation: {
    en: 'Citizens near you have already reported these issues. Tap "+1 Me Too!" to escalate priority without filing duplicate tickets!',
    mr: 'आपल्या परिसरातील नागरिकांनी ही समस्या आधीच नोंदवली आहे. नवीन तक्रार न करता "+१ मलाही दिसतंय" दाबून प्राधान्य वाढवा!',
    hi: 'आपके क्षेत्र के नागरिकों ने यह पहले ही दर्ज किया है। दोबारा शिकायत करने के बजाय "+१ मुझे भी दिख रहा है" दबाकर प्राथमिकता बढ़ाएं!'
  },
  meTooButton: {
    en: '+1 Me Too! (I See This)',
    mr: '+१ हे मलाही दिसतंय!',
    hi: '+१ मुझे भी यह दिख रहा है!'
  },
  meTooVoted: {
    en: 'You +1\'d this issue! SMS alerts enabled.',
    mr: 'आपण सहमती दर्शवली! आपणास अपडेट्स मिळतील.',
    hi: 'आपने समर्थन दिया! आपको अपडेट्स मिलेंगे।'
  },
  fileFreshInstead: {
    en: 'My issue is different (File New Ticket)',
    mr: 'माझी समस्या वेगळी आहे (नवीन तक्रार नोंदवा)',
    hi: 'मेरी समस्या अलग है (नई शिकायत दर्ज करें)'
  },
  citizensAffected: {
    en: 'Citizens verified & escalated this',
    mr: 'नागरिकांनी दुजोरा दिला',
    hi: 'नागरिकों ने पुष्टि की'
  },

  // Command Center
  officerDashboard: {
    en: 'BMC Ward Officer Command Center',
    mr: 'बृहन्मुंबई मनपा वॉर्ड अधिकारी नियंत्रण कक्ष',
    hi: 'बृहन्मुंबई मनपा वार्ड अधिकारी नियंत्रण कक्ष'
  },
  monsoonAlert: {
    en: 'Live Monsoon & High Tide Warning',
    mr: 'थेट पावसाळा व भरतीचा इशारा',
    hi: 'लाइव मानसून व उच्च ज्वार चेतावनी'
  },
  priorityScoreFormula: {
    en: 'Dynamic Priority Score = (Visual Hazard × 40%) + (Me Too Upvotes × 35%) + (Rainfall Multiplier × 25%)',
    mr: 'प्राधान्य गुण = (दृश्यमान तीव्रता × ४०%) + (नागरिक मते × ३५%) + (पाऊस गुणांक × २५%)',
    hi: 'प्राथमिकता अंक = (दृश्यमान खतरा × ४०%) + (नागरिक समर्थन × ३५%) + (वर्षा गुणांक × २५%)'
  },
  wardGridMap: {
    en: 'Interactive Greater Mumbai Ward Grid',
    mr: 'मुंबई वॉर्ड नकाशा व तक्रार घनता',
    hi: 'मुंबई वार्ड नक्शा व शिकायत घनत्व'
  },
  triageQueue: {
    en: 'Triage & Department Dispatch Queue',
    mr: 'तक्रार निवारण व विभाग वाटप यादी',
    hi: 'शिकायत निवारण एवं विभाग प्रेषण सूची'
  },
  proofOfWorkModule: {
    en: 'Proof-of-Work AI Resolution Verification',
    mr: 'कामाचा पुरावा - एआय द्वारे दुरुस्ती पडताळणी',
    hi: 'कार्य का प्रमाण - एआई मरम्मत सत्यापन'
  },
  verifyRepair: {
    en: 'Inspect & Verify Repair',
    mr: 'दुरुस्ती तपासा व मंजुरी द्या',
    hi: 'मरम्मत जांचें एवं स्वीकृत करें'
  },
  approveClosure: {
    en: 'Approve & Close Ticket',
    mr: 'मान्य करा आणि तक्रार पूर्ण करा',
    hi: 'स्वीकार करें और शिकायत बंद करें'
  },
  rejectRework: {
    en: 'Reject (Demand Rework)',
    mr: 'नाकारा (पुन्हा काम करण्याचे आदेश)',
    hi: 'अस्वीकार करें (पुनः कार्य का आदेश)'
  },
  verifiedPassed: {
    en: 'AI Passed: Compaction & Debris Clearance 100% OK',
    mr: 'पडताळणी यशस्वी: डांबरीकरण व रस्ता पूर्ववत पूर्ण',
    hi: 'सत्यापन सफल: सड़क मरम्मत और मलबा पूर्ण साफ'
  },

  // Location search and workable area
  searchLocationPlaceholder: {
    en: 'Search area, station, road, or landmark (e.g. Dadar, Andheri Subway, SV Road, Kurla)...',
    mr: 'परिसर, स्टेशन, रस्ता किंवा खूण शोधा (उदा. दादर, अंधेरी सबवे, एस. व्ही. रोड, कुर्ला, वांद्रे)...',
    hi: 'क्षेत्र, स्टेशन, सड़क या लैंडमार्क खोजें (उदा. दादर, अंधेरी सबवे, एसवी रोड, कुर्ला)...'
  },
  detailedAddressLabel: {
    en: 'Exact Workable Spot / Landmark for BMC Crew',
    mr: 'मनपा पथकासाठी कामाचे अचूक ठिकाण व खूण (Workable Area)',
    hi: 'मनपा दल के लिए कार्य का सटीक स्थान एवं लैंडमार्क'
  },
  detailedAddressPlaceholder: {
    en: 'e.g. Opposite Hanuman Temple, Near Gala No. 4, Station Road West',
    mr: 'उदा. हनुमान मंदिरासमोर, गाळा क्र. ४ जवळ, स्टेशन रोड पश्चिम',
    hi: 'उदा. हनुमान मंदिर के सामने, गाला नं ४ के पास, स्टेशन रोड पश्चिम'
  },
  fetchGpsBtn: {
    en: 'Auto-Detect My GPS Location',
    mr: 'माझे चालू जीपीएस स्थान मिळवा',
    hi: 'मेरा वर्तमान जीपीएस स्थान प्राप्त करें'
  },
  locatingGps: {
    en: 'Finding satellite GPS...',
    mr: 'जीपीएस स्थान शोधत आहे...',
    hi: 'जीपीएस स्थान खोजा जा रहा है...'
  },
  workableZoneBadge: {
    en: 'BMC Workable Zone',
    mr: 'मनपा कार्यक्षेत्र व संपर्क',
    hi: 'मनपा कार्यक्षेत्र एवं संपर्क'
  },

  // Empty state translations
  noComplaintsTitle: {
    en: 'No Civic Complaints in Queue',
    mr: 'सध्या कोणतीही प्रलंबित तक्रार नाही',
    hi: 'वर्तमान में कोई शिकायत लंबित नहीं है'
  },
  noComplaintsDesc: {
    en: 'The queue is completely clear. Citizens can easily file complaints using voice or photo above.',
    mr: 'परिसरात सर्व काही सुरळीत आहे. आपण वरून आवाज किंवा फोटोद्वारे स्वतः नवीन तक्रार नोंदवू शकता.',
    hi: 'कतार पूरी तरह खाली है। नागरिक ऊपर ध्वनि या फोटो से नई शिकायत दर्ज कर सकते हैं।'
  },
  loadDemoDataBtn: {
    en: 'Load Sample Demo Data (Hackathon)',
    mr: 'प्रात्यक्षिक (डेमो) तक्रारी भरा',
    hi: 'नमूना (डेमो) डेटा लोड करें'
  },
  clearAllDataBtn: {
    en: 'Clear All Complaints (Reset to 0)',
    mr: 'सर्व तक्रारी साफ करा (शून्य करा)',
    hi: 'सभी शिकायतें हटाएं (रीसेट करें)'
  },

  // Database fetch & XAMPP / CMD
  dbExportBtn: {
    en: 'Export Database (XAMPP / CMD)',
    mr: 'डेटाबेस फेच करा (XAMPP / CMD)',
    hi: 'डेटाबेस प्राप्त करें (XAMPP / CMD)'
  },
  dbModalTitle: {
    en: 'BMC Complaint Database Export (XAMPP & CMD)',
    mr: 'मनपा तक्रार प्रणाली डेटाबेस फेच व एक्सपोर्ट',
    hi: 'मनपा शिकायत प्रणाली डेटाबेस एक्सपोर्ट'
  },
  dbModalDesc: {
    en: 'Fetch or export the entire application database directly into MySQL/XAMPP phpMyAdmin or via Command Line (CMD).',
    mr: 'संपूर्ण प्रणालीचा डेटाबेस XAMPP MySQL, phpMyAdmin किंवा कमांड प्रॉमप्ट (CMD) द्वारे फेच करा.',
    hi: 'संपूर्ण प्रणाली का डेटाबेस XAMPP MySQL, phpMyAdmin या कमांड प्रॉम्प्ट (CMD) से प्राप्त करें।'
  },
  downloadSqlBtn: {
    en: 'Download MySQL .SQL Dump (for XAMPP phpMyAdmin)',
    mr: 'MySQL .SQL फाईल डाउनलोड करा (XAMPP phpMyAdmin साठी)',
    hi: 'MySQL .SQL फाइल डाउनलोड करें (XAMPP phpMyAdmin के लिए)'
  },
  downloadJsonBtn: {
    en: 'Download JSON Database File',
    mr: 'JSON डेटाबेस फाईल डाउनलोड करा',
    hi: 'JSON डेटाबेस फाइल डाउनलोड करें'
  },
  cmdGuideTitle: {
    en: 'Fetch Database using Command Prompt (CMD)',
    mr: 'कमांड प्रॉमप्ट (CMD) द्वारे डेटा कसा फेच करावा',
    hi: 'कमांड प्रॉम्प्ट (CMD) द्वारा डेटा कैसे प्राप्त करें'
  },
  copyCmd: {
    en: 'Copy Command',
    mr: 'कमांड कॉपी करा',
    hi: 'कमांड कॉपी करें'
  },
  copied: {
    en: 'Copied!',
    mr: 'कॉपी झाले!',
    hi: 'कॉपी हो गया!'
  },

  // Complaint Status & Step Progress Bar
  statusPending: {
    en: 'Pending',
    mr: 'प्रलंबित',
    hi: 'लंबित'
  },
  statusInProgress: {
    en: 'In-Progress',
    mr: 'प्रगतीत',
    hi: 'प्रगति पर'
  },
  statusResolved: {
    en: 'Resolved',
    mr: 'निकाली',
    hi: 'समाधान'
  },
  step1Title: {
    en: 'Complaint Registered',
    mr: 'तक्रार नोंदवली',
    hi: 'शिकायत दर्ज'
  },
  step1Desc: {
    en: 'Received by Ward Control',
    mr: 'वॉर्ड नियंत्रण कक्षाकडे प्राप्त',
    hi: 'वार्ड नियंत्रण कक्ष को प्राप्त'
  },
  step2Title: {
    en: 'Crew Dispatched',
    mr: 'कार्य पथक रवाना',
    hi: 'कार्य दल रवाना'
  },
  step2Desc: {
    en: 'Field Repair In-Progress',
    mr: 'दुरुस्तीचे काम प्रगतीत',
    hi: 'मरम्मत कार्य जारी'
  },
  step3Title: {
    en: 'Work Resolved',
    mr: 'दुरुस्ती पूर्ण / निकाली',
    hi: 'कार्य पूर्ण / समाधान'
  },
  step3Desc: {
    en: 'Inspected & Approved',
    mr: 'तपासणी व मंजुरी पूर्ण',
    hi: 'जांच एवं स्वीकृत'
  },
  trackerTitle: {
    en: 'Live Complaint Tracker & Progress',
    mr: 'थेट तक्रार ट्रॅकर व प्रगती स्थिती',
    hi: 'लाइव शिकायत ट्रैकर एवं स्थिति'
  },
  searchTicketPlaceholder: {
    en: 'Search by Ticket Number (e.g. BMC-2026-)...',
    mr: 'तक्रार क्रमांकावरून शोधा (उदा. BMC-2026-)...',
    hi: 'शिकायत क्रमांक से खोजें (उदा. BMC-2026-)...'
  },
  allTicketsTab: {
    en: 'All Complaints',
    mr: 'सर्व तक्रारी',
    hi: 'सभी शिकायतें'
  }
};

export const getTranslation = (key: keyof typeof translations, lang: Language): string => {
  const item = translations[key];
  if (!item) return '';
  return item[lang] || item['en'];
};

// Safe localized title accessor preventing undefined object crash
export function getComplaintTitle(c: any, lang: Language = 'mr'): string {
  if (!c) return '';
  if (c.title) {
    if (typeof c.title === 'string') return c.title;
    if (typeof c.title === 'object') {
      if (lang === 'mr') return c.title.mr || c.title.en || 'नागरी समस्या';
      return c.title.en || c.title.mr || 'Civic Issue';
    }
  }
  if (lang === 'mr') {
    return c.titleMr || c.titleEn || (c.category ? `तक्रार: ${c.category}` : 'नागरी समस्या');
  }
  return c.titleEn || c.titleMr || (c.category ? `Issue: ${c.category}` : 'Civic Issue');
}

// Normalizer to guarantee all complaints conform to the Complaint type
export function normalizeComplaint(c: any): any {
  if (!c) return null;
  const titleObj = {
    en: (typeof c.title === 'object' && c.title?.en) || c.titleEn || (typeof c.title === 'string' ? c.title : 'Civic Grievance'),
    mr: (typeof c.title === 'object' && c.title?.mr) || c.titleMr || (typeof c.title === 'string' ? c.title : 'नागरी तक्रार'),
  };

  return {
    ...c,
    id: c.id || `comp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    ticketNumber: c.ticketNumber || `BMC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    title: titleObj,
    category: c.category || 'pothole',
    wardId: c.wardId || 'K/W',
    wardName: c.wardName || 'Ward K/West',
    locationAddress: c.locationAddress || 'Mumbai, Maharashtra',
    lat: c.lat || 19.1197,
    lng: c.lng || 72.8464,
    distanceMeters: c.distanceMeters || 100,
    reportedAt: c.reportedAt || 'Just now',
    status: c.status || 'new',
    visualSeverity: c.visualSeverity || 50,
    upvotes: c.upvotes || 1,
    priorityScore: c.priorityScore || 50,
    assignedDepartment: c.assignedDepartment || 'roads',
    assignedOfficer: c.assignedOfficer || 'BMC Ward Officer',
    slaHoursRemaining: c.slaHoursRemaining || 24,
    photoUrl: c.photoUrl || 'pothole',
    timeline: Array.isArray(c.timeline) ? c.timeline : []
  };
}

