export type ChatRoleType = 'civic_assistant' | 'grievance_triage' | 'engineering_advisor' | 'senior_guide';

export type ChatModelId = 'gemini-2.5-flash' | 'gemini-2.5-flash-lite' | 'gemini-2.5-pro';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelUsed?: string;
  roleType?: ChatRoleType;
}

export interface RoleConfig {
  id: ChatRoleType;
  titleEn: string;
  titleMr: string;
  descEn: string;
  descMr: string;
  badge: string;
  icon: string;
  suggestedPromptsEn: string[];
  suggestedPromptsMr: string[];
}

export const CHAT_ROLES: RoleConfig[] = [
  {
    id: 'civic_assistant',
    titleEn: 'BMC Civic Assistant',
    titleMr: 'नागरी सहाय्यक (Civic Helper)',
    descEn: 'General municipal guidance, 24x7 helpline 1916, taxes, ward offices, certificates',
    descMr: 'सर्वसाधारण मनपा सेवा, हेल्पलाइन १९१६, कर भरणा, वॉर्ड कार्यालय माहिती',
    badge: 'Civic Help',
    icon: 'Building2',
    suggestedPromptsEn: [
      'What is the 24x7 BMC citizen helpline number?',
      'How to pay Mumbai municipal property tax online?',
      'How to obtain a birth certificate from BMC ward office?',
      'What are the water supply timings and complaint steps?',
    ],
    suggestedPromptsMr: [
      'BMC ची २४x७ नागरिक हेल्पलाइन कोणती आहे?',
      'माझा वॉर्ड कसा शोधायचा आणि संपर्क क्रमांक काय आहे?',
      'मुंबई महानगरपालिका मालमत्ता कर ऑनलाईन कसा भरायचा?',
      'पाणीपुरवठा खंडित झाल्यास कोणाकडे तक्रार करायची?',
    ],
  },
  {
    id: 'grievance_triage',
    titleEn: 'Grievance Triage & Complaint Drafter',
    titleMr: 'तक्रार निवारण व मसुदा तज्ज्ञ',
    descEn: 'Draft formal complaints, identify ward & department, estimate urgency & SLA',
    descMr: 'तक्रारीचा अचूक मसुदा, संबंधित विभाग व वॉर्ड निवड, प्राधान्यक्रम तपासणी',
    badge: 'Triage Pro',
    icon: 'FileEdit',
    suggestedPromptsEn: [
      'Draft a complaint for deep pothole on Linking Road, Bandra West',
      'How to report an open dangerous manhole near Dadar station?',
      'What is the standard SLA time for garbage pile clearance?',
      'Draft a complaint for illegal debris dumping in Andheri West',
    ],
    suggestedPromptsMr: [
      'वांद्रे पश्चिम लिंकिंग रोडवरील खड्ड्यासाठी तक्रार मसुदा तयार करा',
      'दादर स्टेशनजवळ उघड्या मॅनहोलची तातडीची तक्रार कशी करावी?',
      'कचरा न उचलल्यास मनपाचे निराकरण वेळापत्रक (SLA) काय आहे?',
      'अंधेरी पश्चिमेकडील रस्त्यावरील राडारोडा तक्रारीचा मसुदा द्या',
    ],
  },
  {
    id: 'engineering_advisor',
    titleEn: 'Municipal Engineering & Bye-Laws Advisor',
    titleMr: 'अभियंता व नियम सल्लागार',
    descEn: 'IRC asphalt specs, SWD desilting rules, tree trimming norms, Proof of Work standards',
    descMr: 'रस्ते बांधकाम नियम, पावसाळापूर्व नालेसफाई निकष, झाडे छाटणी नियमावली',
    badge: 'Engineering',
    icon: 'Wrench',
    suggestedPromptsEn: [
      'What are IRC:82 standards for pothole cold-mix vs hot mastic asphalt?',
      'What are BMC pre-monsoon storm water drain desilting guidelines?',
      'Explain rules for tree trimming permissions under Tree Act 1975',
      'What contractor proof of work photos are required for BMC bill clearance?',
    ],
    suggestedPromptsMr: [
      'खड्डे भरण्यासाठी IRC मानके व मॅस्टिक अस्फाल्ट नियम काय आहेत?',
      'पावसाळापूर्व नाले व गटार सफाईचे मनपा निकष सांगा',
      'धोकादायक झाडांच्या फांद्या छाटण्यासाठी मनपाचे नियम काय आहेत?',
      'ठेकेदाराच्या कामाची पडताळणी करण्यासाठी कोणते फोटो पुरावे लागतात?',
    ],
  },
  {
    id: 'senior_guide',
    titleEn: 'Senior Citizen Gentle Guide',
    titleMr: 'ज्येष्ठ नागरिक सुलभ मार्गदर्शक',
    descEn: 'Simple, large text, patient step-by-step guidance without complicated jargon',
    descMr: 'अत्यंत सोप्या भाषेत, मोठ्या अक्षरात पायरी-दर-पायरी मार्गदर्शन व मदत',
    badge: 'Senior Easy',
    icon: 'HeartHandshake',
    suggestedPromptsEn: [
      'I am an elderly citizen, how do I report broken pavement near my house?',
      'Where is my nearest BMC ward hospital and dispensary in Dadar?',
      'Can I request doorstep civic assistance or phone support from BMC?',
      'Explain how this complaint portal works in 3 easy steps',
    ],
    suggestedPromptsMr: [
      'मी ज्येष्ठ नागरिक आहे, घरासमोरील तुटलेल्या पदपथाची तक्रार कशी करू?',
      'माझ्या परिसरातील जवळचे मनपा दवाखाना व आरोग्य केंद्र कोठे आहे?',
      'फोनवरून तक्रार करण्यासाठी ज्येष्ठ नागरिकांसाठी विशेष सोय आहे का?',
      'या पोर्टलवर तक्रार नोंदवण्याची सोपी पद्धत ३ टप्प्यांत समजावून सांगा',
    ],
  },
];

export const CHAT_MODELS: { id: ChatModelId; name: string; tag: string; desc: string }[] = [
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    tag: 'Recommended (General Tasks)',
    desc: 'High-speed, multimodal, civic intelligence for day-to-day citizen inquiries',
  },
  {
    id: 'gemini-2.5-flash-lite',
    name: 'Gemini 2.5 Flash-Lite',
    tag: 'Ultra-Fast',
    desc: 'Lowest latency for instant quick answers and rapid status lookups',
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    tag: 'Deep Reasoning (Complex Tasks)',
    desc: 'Advanced reasoning for municipal engineering, bye-laws, and complex case analysis',
  },
];
