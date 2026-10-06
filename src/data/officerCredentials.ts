import { OfficerUser } from '../types';

export interface PredefinedOfficer {
  code: string; // The code / ID entered by officer
  passcode: string;
  user: OfficerUser;
}

export const PREDEFINED_OFFICERS: PredefinedOfficer[] = [
  {
    code: 'BMC-OFFICER-2026',
    passcode: 'bmc@2026',
    user: {
      officerId: 'BMC-OFFICER-2026',
      name: 'श्री भूषण गगराणी (Shri Bhushan Gagrani)',
      designation: 'मुख्य नियंत्रण व सनियंत्रण अधिकारी (Chief Control Officer)',
      assignedWard: 'ALL',
      badgeNumber: 'BMC-HQ-001',
      phone: '022-22620251',
    },
  },
  {
    code: 'WARD-KW-101',
    passcode: 'kw@ward2026',
    user: {
      officerId: 'WARD-KW-101',
      name: 'श्री पृथ्वीराज चव्हाण (Shri Prithviraj Chauhan)',
      designation: 'सहाय्यक आयुक्त - के/पश्चिम वॉर्ड (Assistant Commissioner - Ward K/W)',
      assignedWard: 'K/W',
      badgeNumber: 'BMC-KW-101',
      phone: '022-26239131',
    },
  },
  {
    code: 'WARD-GN-102',
    passcode: 'gn@ward2026',
    user: {
      officerId: 'WARD-GN-102',
      name: 'श्री प्रशांत सपकाळे (Shri Prashant Sapkale)',
      designation: 'सहाय्यक आयुक्त - जी/उत्तर वॉर्ड (Assistant Commissioner - Ward G/N)',
      assignedWard: 'G/N',
      badgeNumber: 'BMC-GN-102',
      phone: '022-24397800',
    },
  },
  {
    code: 'WARD-HW-103',
    passcode: 'hw@ward2026',
    user: {
      officerId: 'WARD-HW-103',
      name: 'श्री विनायक विस्पुते (Shri Vinayak Vispute)',
      designation: 'सहाय्यक आयुक्त - एच/पश्चिम वॉर्ड (Assistant Commissioner - Ward H/W)',
      assignedWard: 'H/W',
      badgeNumber: 'BMC-HW-103',
      phone: '022-26422311',
    },
  },
  {
    code: 'WARD-FN-104',
    passcode: 'fn@ward2026',
    user: {
      officerId: 'WARD-FN-104',
      name: 'श्री गजानन बेल्लाळे (Shri Gajanan Bellale)',
      designation: 'सहाय्यक आयुक्त - एफ/उत्तर वॉर्ड (Assistant Commissioner - Ward F/N)',
      assignedWard: 'F/N',
      badgeNumber: 'BMC-FN-104',
      phone: '022-24024000',
    },
  },
  {
    code: 'BMC100',
    passcode: '123456',
    user: {
      officerId: 'BMC100',
      name: 'श्री एस. के. शिंदे (Shri S. K. Shinde)',
      designation: 'कार्यकारी वॉर्ड अधिकारी (Executive Ward Officer - Quick Access)',
      assignedWard: 'ALL',
      badgeNumber: 'BMC-EX-100',
      phone: '022-22694725',
    },
  },
];
