import { DepartmentInfo, WardInfo, Complaint, MonsoonAlert } from '../types';

export const bmcDepartments: DepartmentInfo[] = [
  {
    id: 'roads',
    code: 'BMC-RDT',
    name: {
      en: 'Roads & Traffic Department',
      mr: 'रस्ते व वाहतूक विभाग',
      hi: 'सड़क एवं यातायात विभाग'
    },
    leadOfficer: 'Er. Rajesh V. Salunke (Chief Engineer)',
    phone: '022-22691122',
    standardSlaHours: 24,
    color: 'amber'
  },
  {
    id: 'swd',
    code: 'BMC-SWD',
    name: {
      en: 'Storm Water Drains (SWD)',
      mr: 'पर्जन्य जलवाहिन्या विभाग',
      hi: 'वर्षा जल निकासी विभाग'
    },
    leadOfficer: 'Er. Pramod M. Kadam (Dy. Chief Engineer)',
    phone: '022-24956789',
    standardSlaHours: 4,
    color: 'sky'
  },
  {
    id: 'swm',
    code: 'BMC-SWM',
    name: {
      en: 'Solid Waste Management (SWM)',
      mr: 'घनकचरा व्यवस्थापन विभाग',
      hi: 'ठोस अपशिष्ट प्रबंधन विभाग'
    },
    leadOfficer: 'Shri Sudhir S. Parab (Head SWM)',
    phone: '022-22620251',
    standardSlaHours: 12,
    color: 'emerald'
  },
  {
    id: 'hydraulic',
    code: 'BMC-HYD',
    name: {
      en: 'Hydraulic Engineering (Water Supply)',
      mr: 'जल अभियंता विभाग',
      hi: 'जल आपूर्ति एवं हाइड्रोलिक विभाग'
    },
    leadOfficer: 'Er. Sandeep B. Sawant (Hydraulic Engineer)',
    phone: '022-25785501',
    standardSlaHours: 8,
    color: 'blue'
  },
  {
    id: 'electrical',
    code: 'BMC-ELE',
    name: {
      en: 'Electrical & BEST Maintenance',
      mr: 'विद्युत व बेस्ट देखभाल विभाग',
      hi: 'विद्युत एवं बेस्ट रखरखाव विभाग'
    },
    leadOfficer: 'Er. M. K. Kulkarni (Chief Electrician)',
    phone: '022-22856261',
    standardSlaHours: 6,
    color: 'orange'
  },
  {
    id: 'disaster',
    code: 'BMC-DMC',
    name: {
      en: 'Disaster Management Cell',
      mr: 'आपत्ती व्यवस्थापन कक्ष (१९१६)',
      hi: 'आपदा प्रबंधन सेल'
    },
    leadOfficer: 'Dr. Mahesh Narvekar (Director DMC)',
    phone: '1916 / 022-22694725',
    standardSlaHours: 2,
    color: 'rose'
  },
  {
    id: 'tree',
    code: 'BMC-TREE',
    name: {
      en: 'Garden & Tree Authority',
      mr: 'उद्यान व वृक्ष प्राधिकरण',
      hi: 'उद्यान एवं वृक्ष प्राधिकरण'
    },
    leadOfficer: 'Smt. Smita D. Gaikwad (Superintendent)',
    phone: '022-23759850',
    standardSlaHours: 12,
    color: 'teal'
  }
];

export const mumbaiWards: WardInfo[] = [
  {
    id: 'A',
    code: 'A-01',
    name: {
      en: 'Ward A (Colaba, Fort, Churchgate, Navy Nagar)',
      mr: 'ए वॉर्ड (कुलाबा, फोर्ट, चर्चगेट, नेव्ही नगर)',
      hi: 'ए वार्ड (कुलाबा, फोर्ट, चर्चगेट, नेवी नगर)'
    },
    zone: 'South Mumbai',
    keyAreas: 'Colaba, Fort, Churchgate, Navy Nagar',
    wardOfficer: 'Shri Jai Singh (Asst. Commissioner)',
    controlRoomPhone: '022-22661231',
    lat: 18.9220,
    lng: 72.8347,
    monsoonVulnerability: 'Moderate'
  },
  {
    id: 'B',
    code: 'B-02',
    name: {
      en: 'Ward B (Masjid Bunder, Dongri)',
      mr: 'बी वॉर्ड (मशीद बंदर, डोंगरी)',
      hi: 'बी वार्ड (मस्जिद बंदर, डोंगरी)'
    },
    zone: 'South Mumbai',
    keyAreas: 'Masjid Bunder, Dongri',
    wardOfficer: 'Shri Udaykumar Shiroorkar (Asst. Commissioner)',
    controlRoomPhone: '022-23736622',
    lat: 18.9548,
    lng: 72.8385,
    monsoonVulnerability: 'High'
  },
  {
    id: 'C',
    code: 'C-03',
    name: {
      en: 'Ward C (Pydhonie, Bhuleshwar)',
      mr: 'सी वॉर्ड (पायधुनी, भुलेश्वर)',
      hi: 'सी वार्ड (पायधुनी, भुलेश्वर)'
    },
    zone: 'South Mumbai',
    keyAreas: 'Pydhonie, Bhuleshwar',
    wardOfficer: 'Shri Chakrapani Alle (Asst. Commissioner)',
    controlRoomPhone: '022-22014022',
    lat: 18.9510,
    lng: 72.8290,
    monsoonVulnerability: 'Moderate'
  },
  {
    id: 'D',
    code: 'D-04',
    name: {
      en: 'Ward D (Grant Road, Malabar Hill, Tardeo)',
      mr: 'डी वॉर्ड (ग्रँट रोड, मलबार हिल, ताडदेव)',
      hi: 'डी वार्ड (ग्रांट रोड, मालाबार हिल, ताड़देव)'
    },
    zone: 'South Mumbai',
    keyAreas: 'Grant Road, Malabar Hill, Tardeo',
    wardOfficer: 'Shri Prashant Gaikwad (Asst. Commissioner)',
    controlRoomPhone: '022-23861426',
    lat: 18.9660,
    lng: 72.8120,
    monsoonVulnerability: 'Moderate'
  },
  {
    id: 'E',
    code: 'E-05',
    name: {
      en: 'Ward E (Byculla, Nagpada, Mazgaon)',
      mr: 'ई वॉर्ड (भायखळा, नागपाडा, माझगाव)',
      hi: 'ई वार्ड (भायखला, नागपाड़ा, मझगांव)'
    },
    zone: 'South Mumbai',
    keyAreas: 'Byculla, Nagpada, Mazgaon',
    wardOfficer: 'Shri Ajay Yadav (Asst. Commissioner)',
    controlRoomPhone: '022-23081471',
    lat: 18.9750,
    lng: 72.8390,
    monsoonVulnerability: 'High'
  },
  {
    id: 'F/N',
    code: 'FN-06',
    name: {
      en: 'Ward F/North (Matunga, Sion, Wadala)',
      mr: 'एफ/उत्तर (माटुंगा, शीव, वडाळा)',
      hi: 'एफ/उत्तर (माटुंगा, सायन, वडाला)'
    },
    zone: 'Island City',
    keyAreas: 'Matunga, Sion, Wadala',
    wardOfficer: 'Shri Gajanan Bellale (Asst. Commissioner)',
    controlRoomPhone: '022-24024353',
    lat: 19.0330,
    lng: 72.8600,
    monsoonVulnerability: 'Critical'
  },
  {
    id: 'F/S',
    code: 'FS-07',
    name: {
      en: 'Ward F/South (Parel, Sewri)',
      mr: 'एफ/दक्षिण (परळ, शिवडी)',
      hi: 'एफ/दक्षिण (परेल, शिवड़ी)'
    },
    zone: 'Island City',
    keyAreas: 'Parel, Sewri',
    wardOfficer: 'Shri Mahesh Patil (Asst. Commissioner)',
    controlRoomPhone: '022-24134560',
    lat: 19.0068,
    lng: 72.8402,
    monsoonVulnerability: 'Critical'
  },
  {
    id: 'G/N',
    code: 'GN-08',
    name: {
      en: 'Ward G/North (Dadar, Dharavi, Mahim)',
      mr: 'जी/उत्तर (दादर, धारावी, माहीम)',
      hi: 'जी/उत्तर (दादर, धारावी, माहिम)'
    },
    zone: 'Island City',
    keyAreas: 'Dadar, Dharavi, Mahim',
    wardOfficer: 'Shri Prashant Sapkale (Asst. Commissioner)',
    controlRoomPhone: '022-24397800',
    lat: 19.0282,
    lng: 72.8433,
    monsoonVulnerability: 'Critical'
  },
  {
    id: 'G/S',
    code: 'GS-09',
    name: {
      en: 'Ward G/South (Worli, Prabhadevi, Lower Parel)',
      mr: 'जी/दक्षिण (वरळी, प्रभादेवी, लोअर परळ)',
      hi: 'जी/दक्षिण (वर्ली, प्रभादेवी, लोअर परेल)'
    },
    zone: 'Island City',
    keyAreas: 'Worli, Prabhadevi, Lower Parel',
    wardOfficer: 'Shri Sharad Ughade (Asst. Commissioner)',
    controlRoomPhone: '022-24305035',
    lat: 19.0010,
    lng: 72.8180,
    monsoonVulnerability: 'High'
  },
  {
    id: 'H/E',
    code: 'HE-10',
    name: {
      en: 'Ward H/East (Bandra East, Santacruz East, Khar East)',
      mr: 'एच/पूर्व (वांद्रे पू., सांताक्रूझ पू., खार पू.)',
      hi: 'एच/पूर्व (बांद्रा पू., सांताक्रूज़ पू., खार पू.)'
    },
    zone: 'Western Suburbs',
    keyAreas: 'Bandra (East), Santacruz (East), Khar (East)',
    wardOfficer: 'Shri Alka Sasane (Asst. Commissioner)',
    controlRoomPhone: '022-26182217',
    lat: 19.0680,
    lng: 72.8520,
    monsoonVulnerability: 'High'
  },
  {
    id: 'H/W',
    code: 'HW-11',
    name: {
      en: 'Ward H/West (Bandra West, Santacruz West, Khar West)',
      mr: 'एच/पश्चिम (वांद्रे प., सांताक्रूझ प., खार प.)',
      hi: 'एच/पश्चिम (बांद्रा प., सांताक्रूज़ प., खार प.)'
    },
    zone: 'Western Suburbs',
    keyAreas: 'Bandra (West), Santacruz (West), Khar (West)',
    wardOfficer: 'Shri Vinayak Vispute (Asst. Commissioner)',
    controlRoomPhone: '022-26422311',
    lat: 19.0596,
    lng: 72.8295,
    monsoonVulnerability: 'Critical'
  },
  {
    id: 'K/E',
    code: 'KE-12',
    name: {
      en: 'Ward K/East (Andheri East, Jogeshwari East, Vile Parle East)',
      mr: 'के/पूर्व (अंधेरी पू., जोगेश्वरी पू., विलेपार्ले पू.)',
      hi: 'के/पूर्व (अंधेरी पू., जोगेश्वरी पू., विले पार्ले पू.)'
    },
    zone: 'Western Suburbs',
    keyAreas: 'Andheri (East), Jogeshwari (East), Vile Parle (East)',
    wardOfficer: 'Shri Manish Valanju (Asst. Commissioner)',
    controlRoomPhone: '022-26840103',
    lat: 19.1136,
    lng: 72.8697,
    monsoonVulnerability: 'High'
  },
  {
    id: 'K/W',
    code: 'KW-13',
    name: {
      en: 'Ward K/West (Andheri West, Jogeshwari West, Vile Parle West)',
      mr: 'के/पश्चिम (अंधेरी प., जोगेश्वरी प., विलेपार्ले प.)',
      hi: 'के/पश्चिम (अंधेरी प., जोगेश्वरी प., विले पार्ले प.)'
    },
    zone: 'Western Suburbs',
    keyAreas: 'Andheri (West), Jogeshwari (West), Vile Parle (West)',
    wardOfficer: 'Dr. Prithviraj Chauhan (Asst. Commissioner)',
    controlRoomPhone: '022-26239131',
    lat: 19.1197,
    lng: 72.8464,
    monsoonVulnerability: 'Critical'
  },
  {
    id: 'L',
    code: 'L-14',
    name: {
      en: 'Ward L (Kurla, Sakinaka, Chandivali)',
      mr: 'एल वॉर्ड (कुर्ला, साकीनाका, चांदिवली)',
      hi: 'एल वार्ड (कुर्ला, साकीनाका, चांदीवली)'
    },
    zone: 'Eastern Suburbs',
    keyAreas: 'Kurla, Sakinaka, Chandivali',
    wardOfficer: 'Shri Dhanaji Herwade (Asst. Commissioner)',
    controlRoomPhone: '022-26505103',
    lat: 19.0726,
    lng: 72.8845,
    monsoonVulnerability: 'Critical'
  },
  {
    id: 'M/E',
    code: 'ME-15',
    name: {
      en: 'Ward M/East (Chembur East, Govandi, Mankhurd, Deonar)',
      mr: 'एम/पूर्व (चेंबूर पू., गोवंडी, मानखुर्द, देवनार)',
      hi: 'एम/पूर्व (चेंबूर पू., गोवंडी, मानखुर्द, देवनार)'
    },
    zone: 'Eastern Suburbs',
    keyAreas: 'Chembur (East), Govandi, Mankhurd, Deonar',
    wardOfficer: 'Shri Mahendra Ubale (Asst. Commissioner)',
    controlRoomPhone: '022-25558000',
    lat: 19.0500,
    lng: 72.9150,
    monsoonVulnerability: 'Critical'
  },
  {
    id: 'M/W',
    code: 'MW-16',
    name: {
      en: 'Ward M/West (Chembur West, Chembur Camp)',
      mr: 'एम/पश्चिम (चेंबूर प., चेंबूर कॅम्प)',
      hi: 'एम/पश्चिम (चेंबूर प., चेंबूर कैंप)'
    },
    zone: 'Eastern Suburbs',
    keyAreas: 'Chembur (West), Chembur Camp',
    wardOfficer: 'Shri Vishwas Mote (Asst. Commissioner)',
    controlRoomPhone: '022-25225000',
    lat: 19.0622,
    lng: 72.8997,
    monsoonVulnerability: 'Moderate'
  },
  {
    id: 'N',
    code: 'N-17',
    name: {
      en: 'Ward N (Ghatkopar, Vikhroli)',
      mr: 'एन वॉर्ड (घाटकोपर, विक्रोळी)',
      hi: 'एन वार्ड (घाटकोपर, विक्रोली)'
    },
    zone: 'Eastern Suburbs',
    keyAreas: 'Ghatkopar, Vikhroli',
    wardOfficer: 'Shri Sanjay Sonawane (Asst. Commissioner)',
    controlRoomPhone: '022-25010161',
    lat: 19.0860,
    lng: 72.9080,
    monsoonVulnerability: 'High'
  },
  {
    id: 'P/N',
    code: 'PN-18',
    name: {
      en: 'Ward P/North (Malad, Madh)',
      mr: 'पी/उत्तर (मालाड, मढ)',
      hi: 'पी/उत्तर (मलाड, मढ़)'
    },
    zone: 'Western Suburbs',
    keyAreas: 'Malad, Madh',
    wardOfficer: 'Shri Kiran Dighavkar (Asst. Commissioner)',
    controlRoomPhone: '022-28823266',
    lat: 19.1860,
    lng: 72.8485,
    monsoonVulnerability: 'High'
  },
  {
    id: 'P/S',
    code: 'PS-19',
    name: {
      en: 'Ward P/South (Goregaon)',
      mr: 'पी/दक्षिण (गोरेगाव)',
      hi: 'पी/दक्षिण (गोरेगांव)'
    },
    zone: 'Western Suburbs',
    keyAreas: 'Goregaon',
    wardOfficer: 'Shri Santoshkumar Dhonde (Asst. Commissioner)',
    controlRoomPhone: '022-28723271',
    lat: 19.1663,
    lng: 72.8480,
    monsoonVulnerability: 'Moderate'
  },
  {
    id: 'R/N',
    code: 'RN-20',
    name: {
      en: 'Ward R/North (Dahisar)',
      mr: 'आर/उत्तर (दहिसर)',
      hi: 'आर/उत्तर (दहिसर)'
    },
    zone: 'Western Suburbs',
    keyAreas: 'Dahisar',
    wardOfficer: 'Smt. Sandhya Nandedkar (Asst. Commissioner)',
    controlRoomPhone: '022-28936000',
    lat: 19.2500,
    lng: 72.8590,
    monsoonVulnerability: 'Moderate'
  },
  {
    id: 'R/C',
    code: 'RC-21',
    name: {
      en: 'Ward R/Central (Borivali)',
      mr: 'आर/मध्य (बोरिवली)',
      hi: 'आर/मध्य (बोरीवली)'
    },
    zone: 'Western Suburbs',
    keyAreas: 'Borivali',
    wardOfficer: 'Shri Bhagyashree Kapse (Asst. Commissioner)',
    controlRoomPhone: '022-28946000',
    lat: 19.2300,
    lng: 72.8560,
    monsoonVulnerability: 'Moderate'
  },
  {
    id: 'R/S',
    code: 'RS-22',
    name: {
      en: 'Ward R/South (Kandivali)',
      mr: 'आर/दक्षिण (कांदिवली)',
      hi: 'आर/दक्षिण (कांदिवली)'
    },
    zone: 'Western Suburbs',
    keyAreas: 'Kandivali',
    wardOfficer: 'Shri Lalit Talekar (Asst. Commissioner)',
    controlRoomPhone: '022-28056000',
    lat: 19.2060,
    lng: 72.8530,
    monsoonVulnerability: 'High'
  },
  {
    id: 'S',
    code: 'S-23',
    name: {
      en: 'Ward S (Bhandup, Powai, Kanjurmarg)',
      mr: 'एस वॉर्ड (भांडुप, पवई, कांजूरमार्ग)',
      hi: 'एस वार्ड (भांडुप, पवई, कांजूरमार्ग)'
    },
    zone: 'Eastern Suburbs',
    keyAreas: 'Bhandup, Powai, Kanjurmarg',
    wardOfficer: 'Shri Ajitkumar Ambi (Asst. Commissioner)',
    controlRoomPhone: '022-25947571',
    lat: 19.1440,
    lng: 72.9360,
    monsoonVulnerability: 'High'
  },
  {
    id: 'T',
    code: 'T-24',
    name: {
      en: 'Ward T (Mulund)',
      mr: 'टी वॉर्ड (मुलुंड)',
      hi: 'टी वार्ड (मुलुंड)'
    },
    zone: 'Eastern Suburbs',
    keyAreas: 'Mulund',
    wardOfficer: 'Shri Kishore Gandhi (Asst. Commissioner)',
    controlRoomPhone: '022-25645289',
    lat: 19.1726,
    lng: 72.9565,
    monsoonVulnerability: 'Moderate'
  }
];

export interface MumbaiLocalityItem {
  name: string;
  wardId: string;
  lat: number;
  lng: number;
  area: string;
}

export const MUMBAI_LOCALITIES: MumbaiLocalityItem[] = [
  { name: 'अंधेरी पश्चिम / Andheri West', wardId: 'K/W', lat: 19.1197, lng: 72.8464, area: 'एस. व्ही. रोड, लोखंडवाला, जुहू, वर्सोवा' },
  { name: 'अंधेरी सबवे / Andheri Subway', wardId: 'K/W', lat: 19.1190, lng: 72.8470, area: 'रेल्वे सबवे क्रॉसिंग, स्थानक परिसर' },
  { name: 'अंधेरी पूर्व / Andheri East', wardId: 'K/E', lat: 19.1170, lng: 72.8680, area: 'चाकाला, एमआयडीसी, जेबी नगर, मरोळ' },
  { name: 'वांद्रे पश्चिम / Bandra West', wardId: 'H/W', lat: 19.0596, lng: 72.8295, area: 'लिंकिंग रोड, हिल रोड, कार्टर रोड' },
  { name: 'वांद्रे पूर्व / Bandra East', wardId: 'H/E', lat: 19.0650, lng: 72.8490, area: 'बीकेसी (BKC), कलानगर, स्टेशन पूर्व' },
  { name: 'दादर / Dadar', wardId: 'G/N', lat: 19.0220, lng: 72.8430, area: 'दादर टीटी, शिवाजी पार्क, प्लाझा सिनेमा' },
  { name: 'धारावी / Dharavi', wardId: 'G/N', lat: 19.0400, lng: 72.8550, area: '९० फूट रोड, माटुंगा लेबर कॅम्प' },
  { name: 'कुर्ला / Kurla', wardId: 'L', lat: 19.0680, lng: 72.8790, area: 'कुर्ला पश्चिम, कमानी, एलबीएस मार्ग' },
  { name: 'परळ / Parel (हिंदमाता)', wardId: 'F/S', lat: 19.0010, lng: 72.8420, area: 'डॉ. आंबेडकर रोड, हिंदमाता, लालबाग' },
  { name: 'शीव / Sion (माटुंगा)', wardId: 'F/N', lat: 19.0330, lng: 72.8630, area: 'शीव सर्कल, माटुंगा पूर्व, वडाळा' },
  { name: 'वरळी / Worli (लोअर परळ)', wardId: 'G/S', lat: 19.0140, lng: 72.8190, area: 'वरळी नाका, प्रभादेवी, लोअर परळ' },
  { name: 'कुलाबा व फोर्ट / Colaba & Fort', wardId: 'A', lat: 18.9220, lng: 72.8347, area: 'कुलाबा कॉजवे, चर्चगेट, सीएसटी' },
  { name: 'मशीद बंदर व डोंगरी / Masjid Bunder', wardId: 'B', lat: 18.9548, lng: 72.8385, area: 'मशीद स्टेशन, मोहम्मद अली रोड' },
  { name: 'ग्रँट रोड व मलबार हिल / Grant Road', wardId: 'D', lat: 18.9660, lng: 72.8120, area: 'नाना चौक, मलबार हिल, ताडदेव' },
  { name: 'भायखळा / Byculla', wardId: 'E', lat: 18.9740, lng: 72.8330, area: 'माझगाव, नागपाडा, भायखळा स्टेशन' },
  { name: 'चेंबूर / Chembur', wardId: 'M/W', lat: 19.0620, lng: 72.8980, area: 'डायमंड गार्डन, चेंबूर नाका, कॅम्प' },
  { name: 'गोवंडी व मानखुर्द / Govandi', wardId: 'M/E', lat: 19.0550, lng: 72.9150, area: 'स्टेशन रोड, देवनार, मानखुर्द' },
  { name: 'घाटकोपर / Ghatkopar', wardId: 'N', lat: 19.0860, lng: 72.9080, area: 'आर सिटी मॉल, एलबीएस मार्ग, पंत नगर' },
  { name: 'मालाड / Malad', wardId: 'P/N', lat: 19.1860, lng: 72.8485, area: 'लिंक रोड, इनॉर्बिट, मढ आयलंड' },
  { name: 'गोरेगाव / Goregaon', wardId: 'P/S', lat: 19.1663, lng: 72.8480, area: 'एस. व्ही. रोड, आरे कॉलनी, पश्चिम' },
  { name: 'कांदिवली / Kandivali', wardId: 'R/S', lat: 19.2060, lng: 72.8530, area: 'महावीर नगर, चारकोप, लिंक रोड' },
  { name: 'बोरिवली / Borivali', wardId: 'R/C', lat: 19.2300, lng: 72.8560, area: 'एलटी रोड, आयसी कॉलनी, गोराई' },
  { name: 'दहिसर / Dahisar', wardId: 'R/N', lat: 19.2500, lng: 72.8590, area: 'चेक नाका, स्टेशन पूर्व/पश्चिम' },
  { name: 'पवई व भांडुप / Powai & Bhandup', wardId: 'S', lat: 19.1480, lng: 72.9370, area: 'हिरानंदानी, तलाव परिसर, भांडुप' },
  { name: 'मुलुंड / Mulund', wardId: 'T', lat: 19.1726, lng: 72.9565, area: 'एलबीएस मार्ग, चेक नाका, पश्चिम' }
];

export const initialMonsoonAlert: MonsoonAlert = {
  alertLevel: 'Red Alert',
  rainfallMmPerHour: 78,
  highTideTime: '14:25 IST',
  highTideHeightMeters: 4.87,
  riskMultiplier: 1.6,
  advisory: {
    en: 'IMD Red Alert: Extremely heavy rainfall with high tide of 4.87m. SWD & Disaster Management on Code Red.',
    mr: 'हवामान खाते लाल इशारा (रेड अलर्ट): अतिवृष्टी व ४.८७ मीटर भरती. पर्जन्य व आपत्ती पथके सतर्क.',
    hi: 'मौसम विभाग रेड अलर्ट: भारी वर्षा और ४.८७ मीटर की ऊंची लहरें। आपदा प्रबंधन अलर्ट पर।'
  },
  affectedWards: ['K/W', 'H/W', 'F/S', 'L', 'G/N']
};

export const sampleVoiceClips = [
  {
    id: 'sample-mr-1',
    lang: 'mr' as const,
    speaker: 'आनंदराव जोशी (वय ७१, अंधेरी पश्चिम)',
    audioDuration: '14 sec',
    transcript: 'अहो साहेब, अंधेरी पश्चिमेला एस. व्ही. रोडवर मिल्टन जवळ खूप मोठा खड्डा पडलाय. पावसात दुचाकी घसरत आहेत, २ जण पडले. लगेच डांबरीकरण करा!',
    detectedData: {
      category: 'pothole' as const,
      wardId: 'K/W',
      location: 'SV Road, near Milton Tower, Andheri West',
      urgency: 'Critical',
      suggestedDept: 'roads' as const,
      severity: 88
    }
  },
  {
    id: 'sample-hi-1',
    lang: 'hi' as const,
    speaker: 'रामसेवक वर्मा (आयु ६८, सांताक्रूझ)',
    audioDuration: '12 sec',
    transcript: 'नमस्ते, मिलन सबवे के नीचे कमर तक पानी भर गया है। नाले का कचरा जाम है और तीन कारें बंद पड़ गई हैं। पानी निकालने वाला पंप चालू करवाएं!',
    detectedData: {
      category: 'waterlogging' as const,
      wardId: 'H/W',
      location: 'Milan Subway, Santa Cruz West',
      urgency: 'Critical',
      suggestedDept: 'swd' as const,
      severity: 95
    }
  },
  {
    id: 'sample-en-1',
    lang: 'en' as const,
    speaker: 'Mrs. Dolly Pereira (Age 69, Bandra)',
    audioDuration: '15 sec',
    transcript: 'Calling from Turner Road, Bandra. A huge gulmohar tree branch broke and is hanging dangerously over live BEST electric wires. It is sparking in rain, very risky for school kids!',
    detectedData: {
      category: 'wire' as const,
      wardId: 'H/W',
      location: 'Turner Road, opposite Patwardhan Park, Bandra West',
      urgency: 'Critical',
      suggestedDept: 'electrical' as const,
      severity: 92
    }
  }
];

export const preLoadedCivicScenarios = [
  {
    id: 'scen-pothole',
    category: 'pothole',
    title: {
      en: 'Dangerous Deep Crater Pothole on SV Road',
      mr: 'एस. व्ही. रोडवर खोल व धोकादायक खड्डा',
      hi: 'एस. वी. रोड पर गहरा व खतरनाक गड्ढा'
    },
    location: 'SV Road, Near Andheri Subway Junction, Ward K/W',
    wardId: 'K/W',
    deptId: 'roads' as const,
    visualSeverity: 88,
    metrics: 'Depth: ~19cm | Diameter: ~1.2m | Cold-mix disintegration',
    confidence: 97.4,
    hazardLevel: 'Severe' as const,
    risk: {
      en: 'High two-wheeler skidding risk; submerged under monsoon pool.',
      mr: 'पावसात दुचाकी घसरण्याचा तीव्र धोका; खड्डा पाण्याखाली अदृश्य.',
      hi: 'बारिश में दोपहिया वाहन फिसलने का गंभीर खतरा।'
    },
    // High quality vector civic illustration representation
    imageSvgType: 'pothole'
  },
  {
    id: 'scen-waterlogging',
    category: 'waterlogging',
    title: {
      en: 'Severe Subway Waterlogging & Clogged Storm Drain',
      mr: 'मिलन सबवेमध्ये तीव्र पाणी साचले व ड्रेन चोक',
      hi: 'मिलन सबवे में गंभीर जलभराव एवं नाला जाम'
    },
    location: 'Milan Subway Underpass, Bandra/Santa Cruz border, Ward H/W',
    wardId: 'H/W',
    deptId: 'swd' as const,
    visualSeverity: 96,
    metrics: 'Water Depth: 2.8 ft | Flow Rate: Stagnant | Pump 02 Tripped',
    confidence: 99.1,
    hazardLevel: 'Critical' as const,
    risk: {
      en: 'Traffic submerged; high electric current leak hazard.',
      mr: 'वाहतूक ठप्प; सबवेमध्ये विजेचा धक्का बसण्याचा संभाव्य धोका.',
      hi: 'यातायात ठप्प; करंट फैलने का भारी खतरा।'
    },
    imageSvgType: 'waterlogging'
  },
  {
    id: 'scen-garbage',
    category: 'garbage',
    title: {
      en: 'Overflowing Municipal Garbage Dump & Biohazard',
      mr: 'कचराकुंडी ओसंडून वाहत आहे व दुर्गंधी',
      hi: 'कचरा पेटी से बाहर फैला कचरा एवं दुर्गंध'
    },
    location: 'Near Dadar Station West Flower Market, Ward G/N',
    wardId: 'G/N',
    deptId: 'swm' as const,
    visualSeverity: 78,
    metrics: 'Volume: ~4.5 Tons | Spill Radius: 18 meters | Leachate overflow',
    confidence: 95.8,
    hazardLevel: 'Severe' as const,
    risk: {
      en: 'Severe vector-borne disease outbreak risk (Dengue/Leptospirosis).',
      mr: 'डेंग्यू आणि लेप्टोस्पायरोसिस साथीचा धोका; पादचाऱ्यांना चालणे अशक्य.',
      hi: 'डेंगू और संक्रामक बीमारियों का खतरा।'
    },
    imageSvgType: 'garbage'
  },
  {
    id: 'scen-pipe',
    category: 'pipeline',
    title: {
      en: 'High-Pressure 24-inch Water Main Pipeline Burst',
      mr: '२४ इंच मुख्य पिण्याच्या पाण्याची पाईपलाईन फुटली',
      hi: '२४ इंच मुख्य पेयजल पाइपलाइन फटने से बर्बादी'
    },
    location: 'LBS Marg, Near Kurla Depot, Ward L',
    wardId: 'L',
    deptId: 'hydraulic' as const,
    visualSeverity: 84,
    metrics: 'Pressure: 3.8 bar | Potable Loss: ~60,000 L/hr | Road erosion',
    confidence: 96.2,
    hazardLevel: 'Severe' as const,
    risk: {
      en: 'Massive clean water wastage & subsoil subsidence on arterial road.',
      mr: 'लाखो लिटर पिण्याचे पाणी वाया; रस्ता खचण्याची भीती.',
      hi: 'भारी मात्रा में पीने का पानी बर्बाद, सड़क धंसने का खतरा।'
    },
    imageSvgType: 'pipeline'
  },
  {
    id: 'scen-wire',
    category: 'wire',
    title: {
      en: 'Dangling Live BEST Power Cable on Pedestrian Walkway',
      mr: 'पादचारी मार्गावर तुटलेली जिवंत विद्युत तार',
      hi: 'पैदल मार्ग पर झूलता हुआ खुला बिजली का तार'
    },
    location: 'Turner Road, Near Patwardhan Park, Bandra West, Ward H/W',
    wardId: 'H/W',
    deptId: 'electrical' as const,
    visualSeverity: 98,
    metrics: 'Voltage: 415V 3-Phase | Sparking: Intermittent | Water contact: YES',
    confidence: 98.9,
    hazardLevel: 'Critical' as const,
    risk: {
      en: 'FATAL ELECTROCUTION HAZARD in rain puddle.',
      mr: 'पावसाच्या साचलेल्या पाण्यात वीज प्रवाहामुळे जीवितास गंभीर धोका.',
      hi: 'पानी में करंट से जानलेवा हादसे का खतरा।'
    },
    imageSvgType: 'wire'
  }
];

export const initialComplaints: Complaint[] = [
  {
    id: 'comp-101',
    ticketNumber: 'BMC-2026-9101',
    title: {
      en: 'Huge Pothole Crater on SV Road causing traffic jam & falls',
      mr: 'एस. व्ही. रोडवर मोठा खड्डा, गाड्या अडकल्या व दुचाकी पडत आहेत',
      hi: 'एस. वी. रोड पर विशाल गड्ढा, यातायात जाम व दुर्घटना की आशंका'
    },
    description: {
      en: 'Water accumulated inside crater, at least 4 bike skids observed today. Needs rapid cold-mix patching.',
      mr: 'खड्ड्यात पाणी साचल्यामुळे रस्ता समजत नाही. आज २ दुचाकीस्वार पडले. तातडीने डांबरीकरण हवे.',
      hi: 'गड्ढे में पानी भरा होने से दिखाई नहीं दे रहा। आज दोपहिया वाहन गिर चुके हैं।'
    },
    category: 'pothole',
    wardId: 'K/W',
    wardName: 'K/West (Andheri West)',
    locationAddress: 'Opposite Shoppers Stop, SV Road, Andheri West',
    lat: 19.1185,
    lng: 72.8452,
    distanceMeters: 180,
    reportedAt: 'Today at 08:15 AM',
    status: 'in_progress',
    visualSeverity: 88,
    upvotes: 42,
    userUpvoted: false,
    priorityScore: 92,
    assignedDepartment: 'roads',
    assignedAgency: 'BMC Central Road Maintenance Wing',
    assignedOfficer: 'Er. Sachin Shinde (JE Roads)',
    slaHoursRemaining: 6,
    photoUrl: 'scen-pothole',
    citizenContactMasked: '+91 98****2109',
    aiInference: {
      detectedHazard: {
        en: 'High-Impact Road Crater & Void',
        mr: 'खोल डांबरी खड्डा व पोकळी',
        hi: 'गहरा सड़क गड्ढा व कटाव'
      },
      confidence: 98.4,
      hazardLevel: 'Severe',
      metrics: 'Depth: 21cm | Surface: 1.8m² | Sub-base washed out',
      riskAssessment: {
        en: 'Severe hazard to two-wheelers and ambulances during monsoon downpour.',
        mr: 'मुसळधार पावसात दुचाकी व रुग्णवाहिकांसाठी अत्यंत धोकादायक.',
        hi: 'भारी बारिश में दोपहिया और एम्बुलेंस के लिए खतरनाक।'
      },
      suggestedDepartment: 'roads',
      boundingBox: { x: 18, y: 22, width: 64, height: 56, label: 'CRATER DEFECT (98.4%)' }
    },
    proofOfWork: {
      repairPhotoUrl: 'repair-asphalt-compaction',
      submittedAt: 'Today at 11:40 AM',
      engineerName: 'Er. Sachin Shinde (Junior Engineer)',
      supervisorName: 'Shri Ramesh Parab (Site Supervisor)',
      workerTeam: 'Ward K/W Asphalt Quick-Repair Squad (Worker: Babu Kadam & 4 crew)',
      structuralIntegrityScore: 96,
      debrisClearanceScore: 98,
      surfaceSmoothnessScore: 94,
      overallMatchScore: 96,
      passed: true,
      repairPhotos: [
        {
          id: 'photo-1',
          url: 'repair-asphalt-compaction',
          caption: 'Final compacted asphalt surface after 2.5-ton vibrating roller pass',
          stage: 'after_repair',
          uploadedBy: 'Er. Sachin Shinde',
          role: 'Junior Engineer',
          timestamp: '11:40 AM'
        },
        {
          id: 'photo-2',
          url: 'repair-asphalt-compaction',
          caption: 'Worker Babu Kadam spreading and tamping VG-30 cold-mix polymer aggregate',
          stage: 'during_work',
          uploadedBy: 'Babu Kadam',
          role: 'Worker',
          timestamp: '10:45 AM'
        },
        {
          id: 'photo-3',
          url: 'repair-asphalt-compaction',
          caption: 'Site Supervisor inspection of base excavation and moisture check before laying mix',
          stage: 'site_supervision',
          uploadedBy: 'Shri Ramesh Parab',
          role: 'Site Supervisor',
          timestamp: '09:50 AM'
        }
      ],
      notes: {
        en: 'Cold-mix polymer VG-30 applied with 2.5-ton vibrating roller compaction. Zero residual debris on curb.',
        mr: 'पॉलिमर कोल्ड-मिक्स भरून रोलरने दाबले. रस्ता पूर्ण सपाट व स्वच्छ करण्यात आला.',
        hi: 'कोल्ड-मिक्स भरकर रोलर से समतल किया गया। मलबा पूर्ण रूप से हटाया गया।'
      }
    },
    activityLog: [
      { timestamp: '08:15 AM', event: { en: 'Reported by Citizen via Voice in Marathi', mr: 'नागरिकाने मराठीत आवाजाद्वारे तक्रार नोंदवली', hi: 'नागरिक ने मराठी में ध्वनि से दर्ज किया' }, actor: 'Anandrao J.' },
      { timestamp: '08:18 AM', event: { en: 'Auto-Triaged by AI to Roads Dept (Score: 92)', mr: 'एआय द्वारे रस्ते विभागाकडे वर्ग (गुण: ९२)', hi: 'एआई द्वारा सड़क विभाग को प्रेषित (अंक: ९२)' }, actor: 'BMC AI Engine' },
      { timestamp: '08:45 AM', event: { en: '42 Citizens tapped "+1 Me Too!" nearby', mr: '४२ नागरिकांनी "+१ मलाही दिसतंय" वर दुजोरा दिला', hi: '४२ नागरिकों ने "+१ मुझे भी दिख रहा है" से पुष्टि की' }, actor: 'Citizen Community' },
      { timestamp: '09:10 AM', event: { en: 'Quick Response Squad Dispatched', mr: 'तातडीचे दुरुस्ती पथक रवाना', hi: 'त्वरित मरम्मत दल रवाना' }, actor: 'JE Roads' },
      { timestamp: '11:40 AM', event: { en: 'Repair Photo Uploaded for AI Proof-of-Work', mr: 'दुरुस्तीचा फोटो एआय पडताळणीसाठी जमा', hi: 'मरम्मत फोटो एआई सत्यापन हेतु अपलोड' }, actor: 'Er. Sachin Shinde' }
    ]
  },
  {
    id: 'comp-102',
    ticketNumber: 'BMC-2026-9102',
    title: {
      en: 'Milan Subway Completely Waterlogged, Drainage Pump Failed',
      mr: 'मिलन सबवेमध्ये ३ फूट पाणी, पाण्याचा निचरा पंप बंद',
      hi: 'मिलन सबवे में ३ फीट जलभराव, ड्रेनेज पंप बंद'
    },
    description: {
      en: 'Storm water accumulated, subway barricaded by traffic police. Sludge choking suction line.',
      mr: 'पावसाचे पाणी साचून सबवे बंद करण्यात आला. गाळामुळे नाल्याचा प्रवाह अडकला आहे.',
      hi: 'सबवे में भारी जलभराव के कारण यातायात बंद। नाले में कचरा फंसा हुआ है।'
    },
    category: 'waterlogging',
    wardId: 'H/W',
    wardName: 'H/West (Bandra West)',
    locationAddress: 'Milan Subway, SV Road Junction, Santa Cruz',
    lat: 19.0835,
    lng: 72.8398,
    distanceMeters: 420,
    reportedAt: 'Today at 07:30 AM',
    status: 'in_progress',
    visualSeverity: 96,
    upvotes: 89,
    userUpvoted: false,
    priorityScore: 98,
    assignedDepartment: 'swd',
    assignedAgency: 'Storm Water Drain Rapid Dewatering Cell',
    assignedOfficer: 'Er. Pramod Kadam (Dy. Ch. Eng.)',
    slaHoursRemaining: 1,
    photoUrl: 'scen-waterlogging',
    citizenContactMasked: '+91 97****4491',
    aiInference: {
      detectedHazard: {
        en: 'Severe Subway Flash Inundation',
        mr: 'सबवे जलमय व तात्काळ उपसा आवश्यक',
        hi: 'सबवे में गंभीर जलभराव'
      },
      confidence: 99.2,
      hazardLevel: 'Critical',
      metrics: 'Water Level: 92cm | Outfall: Blocked by silt | Inflow: 450 m³/hr',
      riskAssessment: {
        en: 'Critical flood zone; potential drowning and vehicle engine hydraulic lock.',
        mr: 'अतिसंवेदनशील पूर स्थिती; वाहने बुडण्याचा व वाहतूक ठप्प होण्याचा धोका.',
        hi: 'गंभीर बाढ़ स्थिति; वाहन डूबने का खतरा।'
      },
      suggestedDepartment: 'swd',
      boundingBox: { x: 12, y: 15, width: 76, height: 68, label: 'INUNDATED SUBWAY (99.2%)' }
    },
    activityLog: [
      { timestamp: '07:30 AM', event: { en: 'Reported by 3 Commuters simultaneously', mr: '३ प्रवाशांनी एकाच वेळी नोंदवले', hi: '३ यात्रियों ने एक साथ दर्ज किया' }, actor: 'Commuters' },
      { timestamp: '07:32 AM', event: { en: 'Monsoon Red Alert boosted Priority Score to 98', mr: 'पावसाच्या रेड अलर्टमुळे प्राधान्य गुण ९८ वर पोहोचले', hi: 'रेड अलर्ट के कारण प्राथमिकता ९८ पर पहुंची' }, actor: 'Triage Engine' },
      { timestamp: '07:45 AM', event: { en: '89 Citizens tapped "+1 Me Too!" in 45 minutes', mr: '८९ नागरिकांनी "+१ मलाही दिसतंय" वर क्लिक केले', hi: '८९ नागरिकों ने समर्थन दिया' }, actor: 'Citizen Community' },
      { timestamp: '08:00 AM', event: { en: 'High-Capacity 500HP Dewatering Pump Deployed', mr: '५०० एचपी क्षमतेचा मोठा पंप तैनात', hi: '५०० एचपी का बड़ा पंप तैनात किया गया' }, actor: 'SWD Wing' }
    ]
  },
  {
    id: 'comp-103',
    ticketNumber: 'BMC-2026-9103',
    title: {
      en: 'Garbage Dump Overflow at Dadar Flower Market',
      mr: 'दादर फूल मार्केट येथे कचऱ्याचा मोठा ढीग व दुर्गंधी',
      hi: 'दादर फूल मार्केट के पास कचरे का ढेर व गंदगी'
    },
    description: {
      en: 'Rotten flower waste and plastics spread onto road during morning rush. Rain creating black leachate puddle.',
      mr: 'सडलेली फुले आणि प्लास्टिक कचरा रस्त्यावर पसरला आहे. दुर्गंधीमुळे पादचाऱ्यांना चालणे कठीण.',
      hi: 'सड़ी हुई फूल-पत्तियां और प्लास्टिक सड़क पर फैला हुआ है। भारी दुर्गंध।'
    },
    category: 'garbage',
    wardId: 'G/N',
    wardName: 'G/North (Dadar, Dharavi)',
    locationAddress: 'Senapati Bapat Marg, Outside Dadar West Market',
    lat: 19.0221,
    lng: 72.8428,
    distanceMeters: 650,
    reportedAt: 'Today at 06:45 AM',
    status: 'assigned',
    visualSeverity: 76,
    upvotes: 31,
    userUpvoted: false,
    priorityScore: 78,
    assignedDepartment: 'swm',
    assignedAgency: 'BMC Solid Waste Management Ward G/N Squad',
    assignedOfficer: 'Shri Santosh Gaikwad (Overseer SWM)',
    slaHoursRemaining: 5,
    photoUrl: 'scen-garbage',
    citizenContactMasked: '+91 99****8832',
    aiInference: {
      detectedHazard: {
        en: 'Solid Waste Overflow & Biohazard',
        mr: 'घनकचरा ओसंडणे व दुर्गंधीचा प्रादुर्भाव',
        hi: 'कचरा फैला हुआ व जनस्वास्थ्य को खतरा'
      },
      confidence: 96.1,
      hazardLevel: 'Severe',
      metrics: 'Estimated Volume: 3.8 Tons | Leachate Puddle: 22m²',
      riskAssessment: {
        en: 'Severe fly breeding and disease risk next to crowded railway station.',
        mr: 'दादर रेल्वे स्थानकालगत रोगराईचा व संसर्गाचा तीव्र धोका.',
        hi: 'भीड़भाड़ वाले स्टेशन के पास बीमारी फैलने का खतरा।'
      },
      suggestedDepartment: 'swm',
      boundingBox: { x: 20, y: 30, width: 60, height: 50, label: 'BIOHAZARD DUMP (96.1%)' }
    },
    activityLog: [
      { timestamp: '06:45 AM', event: { en: 'Photo Report Uploaded by Local Shopkeeper', mr: 'स्थानिक दुकानदाराने फोटो अपलोड केला', hi: 'दुकानदार द्वारा फोटो अपलोड' }, actor: 'Shopkeeper' },
      { timestamp: '07:15 AM', event: { en: 'Assigned to SWM Compactor Vehicle Unit 4', mr: 'घनकचरा कॉम्पॅक्टर वाहन क्रमांक ४ ला वर्ग', hi: 'कचरा गाड़ी यूनिट ४ को प्रेषित' }, actor: 'SWM Officer' }
    ]
  },
  {
    id: 'comp-104',
    ticketNumber: 'BMC-2026-9104',
    title: {
      en: 'Major Clean Water Pipeline Burst on LBS Marg',
      mr: 'एलबीएस मार्गावर पिण्याच्या पाण्याची मुख्य पाईप फुटली',
      hi: 'एलबीएस मार्ग पर पेयजल मुख्य पाइपलाइन फटी'
    },
    description: {
      en: 'Water gushing out at high pressure. Millions of litres wasting while road foundation is washing away.',
      mr: 'पिण्याचे पाणी मोठ्या दाबाने रस्त्यावर वाहत आहे. हजारो लिटर पाण्याचा अपव्यय.',
      hi: 'तीव्र दबाव से पानी सड़क पर बह रहा है। पानी की भारी बर्बादी।'
    },
    category: 'pipeline',
    wardId: 'L',
    wardName: 'L Ward (Kurla West)',
    locationAddress: 'LBS Marg, Near Phoenix Marketcity, Kurla West',
    lat: 19.0864,
    lng: 72.8879,
    distanceMeters: 800,
    reportedAt: 'Today at 09:05 AM',
    status: 'assigned',
    visualSeverity: 84,
    upvotes: 27,
    userUpvoted: false,
    priorityScore: 82,
    assignedDepartment: 'hydraulic',
    assignedAgency: 'Hydraulic Engineering Leakage Redressal Unit',
    assignedOfficer: 'Er. Sandeep Sawant (Hydraulic Eng.)',
    slaHoursRemaining: 3,
    photoUrl: 'scen-pipe',
    citizenContactMasked: '+91 91****3301',
    aiInference: {
      detectedHazard: {
        en: 'Treated Water Main Rupture',
        mr: 'पिण्याच्या पाण्याची मुख्य जलवाहिनी फुटली',
        hi: 'पेयजल पाइपलाइन विच्छेद'
      },
      confidence: 97.2,
      hazardLevel: 'Severe',
      metrics: 'Pressure: 3.4 bar | Est. Loss: 50,000 L/hr | Sub-base erosion',
      riskAssessment: {
        en: 'Disruption of drinking water to 40,000 households in Kurla.',
        mr: 'कुर्ल्यातील ४०,००० कुटुंबांचा पाणीपुरवठा खंडित होण्याचा धोका.',
        hi: 'कुर्ला में हजारों घरों में जलापूर्ति बाधित होने का खतरा।'
      },
      suggestedDepartment: 'hydraulic',
      boundingBox: { x: 25, y: 20, width: 50, height: 60, label: 'PIPE BURST (97.2%)' }
    },
    activityLog: [
      { timestamp: '09:05 AM', event: { en: 'Reported by Auto-Rickshaw Driver Union', mr: 'रिक्षा चालक युनियनकडून तक्रार नोंदवली', hi: 'ऑटो रिक्शा चालक यूनियन द्वारा सूचना' }, actor: 'Union Rep' }
    ]
  },
  {
    id: 'comp-105',
    ticketNumber: 'BMC-2026-9105',
    title: {
      en: 'Fallen Banyan Branch on Live Electric Wire on Turner Road',
      mr: 'टर्नर रोडवर जिवंत विजेच्या तारेवर झाडाची फांदी पडली',
      hi: 'टर्नर रोड पर बिजली के तार पर पेड़ की डाली गिरी'
    },
    description: {
      en: 'High voltage sparks showering over footpath near school gate. Heavy rain making puddle conductive.',
      mr: 'शाळेच्या फाटकाजवळ विजेच्या ठिणग्या पडत आहेत. पावसामुळे पाणी साचले असून धोका वाढला आहे.',
      hi: 'स्कूल के पास बिजली के तार से चिंगारियां निकल रही हैं। जानलेवा स्थिति।'
    },
    category: 'wire',
    wardId: 'H/W',
    wardName: 'H/West (Bandra West)',
    locationAddress: 'Turner Road, Near National College, Bandra West',
    lat: 19.0624,
    lng: 72.8331,
    distanceMeters: 310,
    reportedAt: 'Today at 09:30 AM',
    status: 'assigned',
    visualSeverity: 98,
    upvotes: 64,
    userUpvoted: false,
    priorityScore: 99,
    assignedDepartment: 'electrical',
    assignedAgency: 'BEST Rapid Electrical Response & Tree Trimming Unit',
    assignedOfficer: 'Er. M. K. Kulkarni (BEST)',
    slaHoursRemaining: 1,
    photoUrl: 'scen-wire',
    citizenContactMasked: '+91 93****1290',
    aiInference: {
      detectedHazard: {
        en: 'High-Voltage Cable Contact & Fire Hazard',
        mr: 'उच्च दाबाची वीज तार व आग लागण्याचा धोका',
        hi: 'हाई वोल्टेज तार एवं करंट का भयानक खतरा'
      },
      confidence: 99.4,
      hazardLevel: 'Critical',
      metrics: 'Voltage: 415V | Proximity: 1.2m from walkway | Wet condition',
      riskAssessment: {
        en: 'Immediate life hazard. Power feeder trip requested immediately.',
        mr: 'जीवितास तत्काळ धोका. वीज पुरवठा त्वरित बंद करण्याची गरज.',
        hi: 'तत्काल जान का खतरा। तुरंत बिजली बंद करना आवश्यक।'
      },
      suggestedDepartment: 'electrical',
      boundingBox: { x: 30, y: 15, width: 45, height: 70, label: 'ELECTRICAL HAZARD (99.4%)' }
    },
    activityLog: [
      { timestamp: '09:30 AM', event: { en: 'Voice Report by Senior Citizen', mr: 'ज्येष्ठ नागरिकाने आवाजाद्वारे नोंदवले', hi: 'वरिष्ठ नागरिक द्वारा आवाज से दर्ज' }, actor: 'Mrs. Pereira' },
      { timestamp: '09:32 AM', event: { en: 'Multi-Agency Alert sent to BEST & Tree Authority', mr: 'बेस्ट व वृक्ष प्राधिकरण या दोन्ही विभागांना तत्काळ अलर्ट', hi: 'बेस्ट व वृक्ष प्राधिकरण दोनों को अलर्ट' }, actor: 'AI Dispatch' }
    ]
  }
];
