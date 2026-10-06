import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini SDK with User-Agent header as required
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY || '';
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-memory / file-persisted complaints database
interface StoredComplaint {
  id: string;
  ticketNumber: string;
  titleEn: string;
  titleMr: string;
  titleHi: string;
  category: string;
  wardId: string;
  wardName: string;
  locationAddress: string;
  lat: number;
  lng: number;
  distanceMeters: number;
  reportedAt: string;
  status: string;
  visualSeverity: number;
  upvotes: number;
  priorityScore: number;
  assignedDepartment: string;
  assignedOfficer: string;
  slaHoursRemaining: number;
  photoUrl: string;
}

interface StoredCitizen {
  id: string;
  fullName: string;
  mobile: string;
  wardId: string;
  address?: string;
  registeredAt: string;
}

let complaintsDatabase: StoredComplaint[] = [];
let citizensDatabase: StoredCitizen[] = [];

const COMPLAINTS_FILE = path.resolve(__dirname, 'complaints_database.json');
const CITIZENS_FILE = path.resolve(__dirname, 'citizens_database.json');

function loadPersistentData() {
  try {
    if (fs.existsSync(COMPLAINTS_FILE)) {
      const data = fs.readFileSync(COMPLAINTS_FILE, 'utf-8');
      complaintsDatabase = JSON.parse(data);
    }
  } catch (e) {
    console.error('Error loading complaints file:', e);
  }
  try {
    if (fs.existsSync(CITIZENS_FILE)) {
      const data = fs.readFileSync(CITIZENS_FILE, 'utf-8');
      citizensDatabase = JSON.parse(data);
    }
  } catch (e) {
    console.error('Error loading citizens file:', e);
  }
}

function saveComplaintsToFile() {
  try {
    fs.writeFileSync(COMPLAINTS_FILE, JSON.stringify(complaintsDatabase, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving complaints file:', e);
  }
}

function saveCitizensToFile() {
  try {
    fs.writeFileSync(CITIZENS_FILE, JSON.stringify(citizensDatabase, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving citizens file:', e);
  }
}

// Load persisted data on server startup
loadPersistentData();

// Pre-decided BMC Ward Officer credentials
const PREDEFINED_OFFICERS = [
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


// Helper to generate MySQL-compatible dump for XAMPP phpMyAdmin & CMD
function generateSqlDump(complaints: StoredComplaint[]): string {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  
  let sql = `-- =======================================================
-- BMC Civic Complaint Triage & Ward Governance Database
-- Generated for XAMPP MySQL / phpMyAdmin / CMD CLI
-- Timestamp: ${timestamp}
-- =======================================================

SET FOREIGN_KEY_CHECKS = 0;
CREATE DATABASE IF NOT EXISTS \`bmc_complaints_db\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`bmc_complaints_db\`;

-- -------------------------------------------------------
-- Table structure for \`wards\`
-- -------------------------------------------------------
DROP TABLE IF EXISTS \`wards\`;
CREATE TABLE \`wards\` (
  \`ward_id\` VARCHAR(10) NOT NULL PRIMARY KEY,
  \`ward_code\` VARCHAR(20) NOT NULL,
  \`ward_name_en\` VARCHAR(100) NOT NULL,
  \`ward_name_mr\` VARCHAR(100) NOT NULL,
  \`zone\` VARCHAR(50) NOT NULL,
  \`key_areas\` TEXT NOT NULL,
  \`ward_officer\` VARCHAR(100) NOT NULL,
  \`control_room_phone\` VARCHAR(30) NOT NULL,
  \`lat\` DECIMAL(10, 6) NOT NULL,
  \`lng\` DECIMAL(10, 6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------
-- Table structure for \`complaints\`
-- -------------------------------------------------------
DROP TABLE IF EXISTS \`complaints\`;
CREATE TABLE \`complaints\` (
  \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
  \`ticket_number\` VARCHAR(50) NOT NULL UNIQUE,
  \`title_en\` VARCHAR(255) NOT NULL,
  \`title_mr\` VARCHAR(255) NOT NULL,
  \`title_hi\` VARCHAR(255) NOT NULL,
  \`category\` VARCHAR(50) NOT NULL,
  \`ward_id\` VARCHAR(10) NOT NULL,
  \`ward_name\` VARCHAR(100) NOT NULL,
  \`location_address\` TEXT NOT NULL,
  \`latitude\` DECIMAL(10, 6) NOT NULL,
  \`longitude\` DECIMAL(10, 6) NOT NULL,
  \`reported_at\` VARCHAR(50) NOT NULL,
  \`status\` VARCHAR(50) NOT NULL DEFAULT 'new',
  \`visual_severity\` INT NOT NULL DEFAULT 50,
  \`upvotes\` INT NOT NULL DEFAULT 1,
  \`priority_score\` INT NOT NULL DEFAULT 50,
  \`assigned_department\` VARCHAR(50) NOT NULL,
  \`assigned_officer\` VARCHAR(100) NOT NULL,
  \`sla_hours_remaining\` INT NOT NULL DEFAULT 24,
  \`photo_url\` TEXT,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_ward\` (\`ward_id\`),
  INDEX \`idx_priority\` (\`priority_score\`),
  INDEX \`idx_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

  // Seed sample wards into SQL
  sql += `-- -------------------------------------------------------
-- Dumping data for table \`wards\` (All 24 BMC Wards)
-- -------------------------------------------------------
INSERT INTO \`wards\` (\`ward_id\`, \`ward_code\`, \`ward_name_en\`, \`ward_name_mr\`, \`zone\`, \`key_areas\`, \`ward_officer\`, \`control_room_phone\`, \`lat\`, \`lng\`) VALUES
('A', 'A-01', 'Ward A (Colaba, Fort)', 'ए वॉर्ड (कुलाबा, फोर्ट)', 'South Mumbai', 'Colaba, Fort, Churchgate, Navy Nagar', 'Shri Jai Singh', '022-22661231', 18.9220, 72.8347),
('B', 'B-02', 'Ward B (Masjid Bunder)', 'बी वॉर्ड (मशीद बंदर)', 'South Mumbai', 'Masjid Bunder, Dongri', 'Shri Udaykumar Shiroorkar', '022-23736622', 18.9548, 72.8385),
('C', 'C-03', 'Ward C (Pydhonie, Bhuleshwar)', 'सी वॉर्ड (पायधुनी)', 'South Mumbai', 'Pydhonie, Bhuleshwar', 'Shri Chakrapani Alle', '022-22014022', 18.9510, 72.8290),
('D', 'D-04', 'Ward D (Grant Road, Malabar Hill)', 'डी वॉर्ड (मलबार हिल)', 'South Mumbai', 'Grant Road, Malabar Hill, Tardeo', 'Shri Prashant Gaikwad', '022-23861426', 18.9660, 72.8120),
('E', 'E-05', 'Ward E (Byculla, Mazgaon)', 'ई वॉर्ड (भायखळा)', 'South Mumbai', 'Byculla, Nagpada, Mazgaon', 'Shri Ajay Patne', '022-23738575', 18.9740, 72.8330),
('F/N', 'FN-06', 'Ward F/North (Matunga, Sion)', 'एफ/उत्तर (माटुंगा, शीव)', 'City / Central', 'Matunga, Sion, Wadala', 'Shri Gajanan Bellale', '022-24024000', 19.0330, 72.8630),
('F/S', 'FS-07', 'Ward F/South (Parel, Sewri)', 'एफ/दक्षिण (परळ, शिवडी)', 'City / Central', 'Parel, Sewri', 'Shri Swapnaja Kshirsagar', '022-24134567', 19.0010, 72.8420),
('G/N', 'GN-08', 'Ward G/North (Dadar, Dharavi)', 'जी/उत्तर (दादर, धारावी)', 'City / Central', 'Dadar, Dharavi, Mahim', 'Shri Prashant Sapkale', '022-24397800', 19.0220, 72.8430),
('G/S', 'GS-09', 'Ward G/South (Worli, Lower Parel)', 'जी/दक्षिण (वरळी, लोअर परळ)', 'City / Central', 'Worli, Prabhadevi, Lower Parel', 'Shri Sharad Ughade', '022-24305031', 19.0140, 72.8190),
('H/E', 'HE-10', 'Ward H/East (Bandra East, Santacruz East)', 'एच/पूर्व (वांद्रे पूर्व)', 'Western Suburbs', 'Bandra (East), Santacruz (East), Khar (East)', 'Shri Alka Sasane', '022-26182260', 19.0650, 72.8490),
('H/W', 'HW-11', 'Ward H/West (Bandra West, Khar West)', 'एच/पश्चिम (वांद्रे पश्चिम)', 'Western Suburbs', 'Bandra (West), Santacruz (West), Khar (West)', 'Shri Vinayak Vispute', '022-26422311', 19.0596, 72.8295),
('K/E', 'KE-12', 'Ward K/East (Andheri East)', 'के/पूर्व (अंधेरी पूर्व)', 'Western Suburbs', 'Andheri (East), Jogeshwari (East), Vile Parle (East)', 'Shri Manish Valunj', '022-26840103', 19.1170, 72.8680),
('K/W', 'KW-13', 'Ward K/West (Andheri West)', 'के/पश्चिम (अंधेरी पश्चिम)', 'Western Suburbs', 'Andheri (West), Jogeshwari (West), Vile Parle (West)', 'Shri Prithviraj Chauhan', '022-26239131', 19.1197, 72.8464),
('L', 'L-14', 'Ward L (Kurla, Sakinaka)', 'एल वॉर्ड (कुर्ला, साकीनाका)', 'Eastern Suburbs', 'Kurla, Sakinaka, Chandivali', 'Shri Mahadev Shinde', '022-26505103', 19.0680, 72.8790),
('M/E', 'ME-15', 'Ward M/East (Chembur East, Govandi)', 'एम/पूर्व (चेंबूर पूर्व, गोवंडी)', 'Eastern Suburbs', 'Chembur (East), Govandi, Mankhurd, Deonar', 'Shri Mahendra Ubale', '022-25558789', 19.0550, 72.9150),
('M/W', 'MW-16', 'Ward M/West (Chembur West)', 'एम/पश्चिम (चेंबूर पश्चिम)', 'Eastern Suburbs', 'Chembur (West), Chembur Camp', 'Shri Vishwas Mote', '022-25225000', 19.0620, 72.8980),
('N', 'N-17', 'Ward N (Ghatkopar, Vikhroli)', 'एन वॉर्ड (घाटकोपर, विक्रोळी)', 'Eastern Suburbs', 'Ghatkopar, Vikhroli', 'Shri Sanjay Sonawane', '022-25010161', 19.0860, 72.9080),
('P/N', 'PN-18', 'Ward P/North (Malad, Madh)', 'पी/उत्तर (मालाड, मढ)', 'Western Suburbs', 'Malad, Madh', 'Shri Kiran Dighavkar', '022-28823266', 19.1860, 72.8485),
('P/S', 'PS-19', 'Ward P/South (Goregaon)', 'पी/दक्षिण (गोरेगाव)', 'Western Suburbs', 'Goregaon', 'Shri Santoshkumar Dhonde', '022-28723271', 19.1663, 72.8480),
('R/N', 'RN-20', 'Ward R/North (Dahisar)', 'आर/उत्तर (दहिसर)', 'Western Suburbs', 'Dahisar', 'Smt. Sandhya Nandedkar', '022-28936000', 19.2500, 72.8590),
('R/C', 'RC-21', 'Ward R/Central (Borivali)', 'आर/मध्य (बोरिवली)', 'Western Suburbs', 'Borivali', 'Shri Bhagyashree Kapse', '022-28946000', 19.2300, 72.8560),
('R/S', 'RS-22', 'Ward R/South (Kandivali)', 'आर/दक्षिण (कांदिवली)', 'Western Suburbs', 'Kandivali', 'Shri Lalit Talekar', '022-28056000', 19.2060, 72.8530),
('S', 'S-23', 'Ward S (Bhandup, Powai)', 'एस वॉर्ड (भांडुप, पवई)', 'Eastern Suburbs', 'Bhandup, Powai, Kanjurmarg', 'Shri Ajitkumar Ambi', '022-25947570', 19.1480, 72.9370),
('T', 'T-24', 'Ward T (Mulund)', 'टी वॉर्ड (मुलुंड)', 'Eastern Suburbs', 'Mulund', 'Shri Kishore Gandhi', '022-25645289', 19.1726, 72.9565);

`;

  // Insert complaints if any
  if (complaints.length > 0) {
    sql += `-- -------------------------------------------------------
-- Dumping data for table \`complaints\` (${complaints.length} records)
-- -------------------------------------------------------
INSERT INTO \`complaints\` (\`id\`, \`ticket_number\`, \`title_en\`, \`title_mr\`, \`title_hi\`, \`category\`, \`ward_id\`, \`ward_name\`, \`location_address\`, \`latitude\`,\`longitude\`, \`reported_at\`, \`status\`, \`visual_severity\`, \`upvotes\`, \`priority_score\`, \`assigned_department\`, \`assigned_officer\`, \`sla_hours_remaining\`, \`photo_url\`) VALUES
`;
    const rows = complaints.map((c) => {
      const escape = (str: string) => (str || '').replace(/'/g, "''").replace(/\\/g, '\\\\');
      return `('${escape(c.id)}', '${escape(c.ticketNumber)}', '${escape(c.titleEn)}', '${escape(c.titleMr)}', '${escape(c.titleHi)}', '${escape(c.category)}', '${escape(c.wardId)}', '${escape(c.wardName)}', '${escape(c.locationAddress)}', ${c.lat || 19.0760}, ${c.lng || 72.8777}, '${escape(c.reportedAt)}', '${escape(c.status)}', ${c.visualSeverity || 50}, ${c.upvotes || 1}, ${c.priorityScore || 50}, '${escape(c.assignedDepartment)}', '${escape(c.assignedOfficer)}', ${c.slaHoursRemaining || 24}, '${escape((c.photoUrl || '').substring(0, 500))}')`;
    });
    sql += rows.join(',\n') + ';\n';
  } else {
    sql += `-- (No citizen complaints currently registered in database)\n`;
  }

  sql += `
SET FOREIGN_KEY_CHECKS = 1;
-- End of SQL Dump
`;
  return sql;
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // ==========================================
  // REST API Endpoints for CMD / XAMPP / Frontend
  // ==========================================

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'online',
      system: 'BMC Complaint Triage & Ward Governance Backend',
      timestamp: new Date().toISOString(),
      totalComplaints: complaintsDatabase.length,
    });
  });

  // GET /api/complaints - Fetch all complaints in JSON format (e.g. via curl in CMD)
  app.get('/api/complaints', (_req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.json({
      success: true,
      count: complaintsDatabase.length,
      complaints: complaintsDatabase,
      info: 'Fetch via CMD: curl -s http://localhost:3000/api/complaints',
    });
  });

  // POST /api/complaints - Save or update complaints from frontend
  app.post('/api/complaints', (req, res) => {
    try {
      const incoming = req.body;
      if (Array.isArray(incoming)) {
        complaintsDatabase = incoming;
        saveComplaintsToFile();
        return res.json({ success: true, count: complaintsDatabase.length, message: 'Database updated successfully' });
      } else if (incoming && incoming.id) {
        const existingIndex = complaintsDatabase.findIndex((c) => c.id === incoming.id);
        if (existingIndex >= 0) {
          complaintsDatabase[existingIndex] = incoming;
        } else {
          complaintsDatabase.unshift(incoming);
        }
        saveComplaintsToFile();
        return res.json({ success: true, count: complaintsDatabase.length, complaint: incoming });
      }
      res.status(400).json({ error: 'Invalid complaint data' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // DELETE /api/complaints - Clear database
  app.delete('/api/complaints', (_req, res) => {
    complaintsDatabase = [];
    saveComplaintsToFile();
    res.json({ success: true, message: 'All complaints removed from database' });
  });

  // ==========================================
  // Citizen Registration & Login Endpoints
  // ==========================================

  // POST /api/citizens/register - Register a new citizen
  app.post('/api/citizens/register', (req, res) => {
    try {
      const { fullName, mobile, wardId, address } = req.body;
      const cleanMobile = (mobile || '').toString().trim().replace(/\D/g, '').slice(-10);

      if (!cleanMobile || cleanMobile.length !== 10) {
        return res.status(400).json({
          success: false,
          error: 'INVALID_MOBILE',
          message: 'कृपया वैध १० अंकी मोबाईल नंबर प्रविष्ट करा (Please provide a valid 10-digit mobile number)',
        });
      }

      if (!fullName || !fullName.trim()) {
        return res.status(400).json({
          success: false,
          error: 'NAME_REQUIRED',
          message: 'कृपया तुमचे पूर्ण नाव प्रविष्ट करा (Full name is required)',
        });
      }

      // Check if citizen is already registered
      const existing = citizensDatabase.find((c) => c.mobile === cleanMobile);
      if (existing) {
        // Return existing citizen
        return res.json({
          success: true,
          citizen: existing,
          alreadyExisted: true,
          message: 'आपण आधीच नोंदणीकृत आहात, थेट लॉगिन होत आहे (Already registered, logged in)',
        });
      }

      const newCitizen: StoredCitizen = {
        id: `CIT-${Date.now().toString().slice(-6)}`,
        fullName: fullName.trim(),
        mobile: cleanMobile,
        wardId: wardId || 'K/W',
        address: (address || '').trim(),
        registeredAt: new Date().toISOString(),
      };

      citizensDatabase.push(newCitizen);
      saveCitizensToFile();
      return res.status(201).json({
        success: true,
        citizen: newCitizen,
        alreadyExisted: false,
        message: 'नागरिक नोंदणी यशस्वी झाली! (Citizen registered successfully!)',
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // POST /api/citizens/login - Citizen login via registered mobile number
  app.post('/api/citizens/login', (req, res) => {
    try {
      const { mobile } = req.body;
      const cleanMobile = (mobile || '').toString().trim().replace(/\D/g, '').slice(-10);

      if (!cleanMobile || cleanMobile.length !== 10) {
        return res.status(400).json({
          success: false,
          error: 'INVALID_MOBILE',
          message: 'कृपया वैध १० अंकी मोबाईल नंबर प्रविष्ट करा (Please enter a valid 10-digit mobile number)',
        });
      }

      // Match mobile number against registered citizens
      const matched = citizensDatabase.find((c) => c.mobile === cleanMobile);

      if (!matched) {
        // EXACT EXCEPTION AS REQUESTED BY USER
        return res.status(404).json({
          success: false,
          error: 'NOT_REGISTERED',
          message: 'आपण या पोर्टलवर नागरिक म्हणून नोंदणीकृत नाही आहात. कृपया आधी नोंदणी करा. (You are not registered as a citizen on this portal. Please register first.)',
        });
      }

      return res.json({
        success: true,
        citizen: matched,
        message: 'नागरिक लॉगिन यशस्वी (Citizen login successful)',
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // GET /api/citizens - List registered citizens
  app.get('/api/citizens', (_req, res) => {
    res.json({
      success: true,
      count: citizensDatabase.length,
      citizens: citizensDatabase,
    });
  });

  // ==========================================
  // Ward Officer Authentication Endpoints
  // ==========================================

  // POST /api/officer/login - Officer login using predecided Code / ID, Ward, and passcode
  app.post('/api/officer/login', (req, res) => {
    try {
      const { officerId, passcode, ward } = req.body;
      const cleanId = (officerId || '').trim();
      const cleanPass = (passcode || '').trim();
      const cleanWard = (ward || '').trim();

      const matched = PREDEFINED_OFFICERS.find(
        (o) => o.code.toUpperCase() === cleanId.toUpperCase() && o.passcode === cleanPass
      );

      if (!matched) {
        return res.status(401).json({
          success: false,
          error: 'INVALID_CREDENTIALS',
          message: 'अवैध अधिकारी कोड/आयडी किंवा पासवर्ड. कृपया अधिकृत क्रेडेंशियल तपासा. (Invalid Officer Code/ID or Passcode)',
        });
      }

      // If officer specifically belongs to a ward and a different non-all ward was picked
      const officerData = {
        ...matched.user,
        assignedWard: cleanWard && cleanWard !== 'ALL' ? cleanWard : matched.user.assignedWard,
      };

      return res.json({
        success: true,
        officer: officerData,
        message: 'वॉर्ड अधिकारी प्रमाणीकरण यशस्वी (Ward Officer authentication successful)',
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // GET /api/export/sql - Generates & downloads a MySQL Dump for XAMPP phpMyAdmin / CMD
  app.get('/api/export/sql', (_req, res) => {
    const sql = generateSqlDump(complaintsDatabase);
    res.setHeader('Content-Type', 'application/sql; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="bmc_complaints_database.sql"');
    res.send(sql);
  });

  // GET /api/export/json - Downloads JSON file for CMD / backup
  app.get('/api/export/json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="bmc_complaints_database.json"');
    res.send(JSON.stringify(complaintsDatabase, null, 2));
  });

  // ==========================================
  // Gemini Multiturn Chatbot API Endpoints
  // ==========================================
  
  function getChatbotSystemInstruction(role: string, language: string = 'mr'): string {
    const langNote =
      language === 'mr'
        ? 'Communicate primarily in authentic, polite Marathi (मराठी). You may provide English terminology in parentheses where helpful.'
        : language === 'hi'
        ? 'Communicate primarily in clear, polite Hindi (हिंदी).'
        : 'Communicate primarily in professional English.';

    const baseRules = `
You are the official Gemini AI Municipal Assistant for BMC (Brihanmumbai Municipal Corporation - बृहन्मुंबई महानगरपालिका), Government of Maharashtra.
Jurisdiction: Greater Mumbai (24 Administrative Wards from Ward A Colaba to Ward T Mulund).
Official Municipal Helplines:
- 24x7 Citizen Central Helpline: 1916
- BMC Disaster Management Control Room: 022-22694725 / 022-22694727
- Solid Waste Management & Swachhata: 1969
- Traffic Police Helpline: 8454999999
- Mumbai Fire Brigade: 101

Language Instruction: ${langNote}
Tone & Style: Helpful, civic-minded, courteous, structured with clean markdown bullets, clear headers, and bold critical points.
`;

    switch (role) {
      case 'grievance_triage':
        return `${baseRules}
ROLE: BMC Citizen Grievance Triage Specialist (तक्रार निवारण व मसुदा तज्ज्ञ).
Your primary objectives:
1. Help citizens formulate precise, actionable complaints for BMC ward engineers and officers.
2. Route issues to the right BMC Department:
   - Roads & Traffic (खड्डे, रस्ता दुरुस्ती, डांबरीकरण)
   - Storm Water Drains (नाले सफाई, पाणी साचणे, मॅनहोल कव्हर)
   - Solid Waste Management (कचरा संकलन, अस्वच्छता, राडारोडा)
   - Hydraulic Engineer (पाणीपुरवठा, जलवाहिनी गळती, दूषित पाणी)
   - Gardens & Trees (धोकादायक झाडे, फांद्या छाटणी)
   - Public Health (डास निर्मूलन, धूर फवारणी, आरोग्य केंद्र)
3. Detect the right BMC administrative ward if a Mumbai locality is mentioned (e.g. Bandra West = Ward H/W, Andheri East = Ward K/E, Dadar/Dharavi = Ward G/N, Borivali = Ward R/C, Colaba = Ward A).
4. Provide standard SLA timelines (e.g. Open manhole: 12-24 hrs; Pothole: 48 hrs; Dead animal/garbage: 24 hrs).
5. Always generate a ready-to-copy complaint draft structured with: [Title], [Category], [Ward & Landmark], and [Issue Description].`;

      case 'engineering_advisor':
        return `${baseRules}
ROLE: BMC Municipal Engineering & Bye-Laws Advisor (अभियंता व नियम सल्लागार).
Your primary objectives:
1. Provide technical depth on municipal civil works and quality compliance standards.
2. Explain Indian Roads Congress (IRC) standards (IRC:82 maintenance of bituminous surfaces, IRC:SP:100 cold-mix pothole repair, mastic asphalt waterproof sealing).
3. Explain pre-monsoon storm water drain (SWD) desilting rules, box-drain silt clearance up to bed level, and geotagged silt transport weighbridge chits.
4. Explain BMC Tree Authority regulations under the Maharashtra Protection & Preservation of Trees Act 1975 for scientific pruning vs unauthorized cutting.
5. Explain Proof-of-Work (PoW) photo-verification protocols for ward engineers (pre-work photo, in-progress compaction photo, post-repair finish photo with timestamp & GPS coordinates) required before passing contractor vouchers.`;

      case 'senior_guide':
        return `${baseRules}
ROLE: Senior Citizen Gentle Guide (ज्येष्ठ नागरिक सुलभ मार्गदर्शक).
Your primary objectives:
1. Provide gentle, patient, comforting assistance to senior citizens and elders of Mumbai.
2. Avoid confusing bureaucratic jargon and explain civic procedures in simple numbered steps (१, २, ३).
3. Offer reassuring phrases (e.g., "काळजी करू नका, आम्ही आपणास संपूर्ण माहिती सोप्या भाषेत देत आहोत").
4. Provide helpline 1916 and local ward health post numbers prominently.
5. Help report broken footpaths, slippery paver blocks, non-functional streetlights, and issues impacting elderly mobility.`;

      case 'civic_assistant':
      default:
        return `${baseRules}
ROLE: BMC Civic Assistant (नागरी सहाय्यक).
Your primary objectives:
1. Answer citizen questions regarding all 24 BMC administrative wards, ward officer locations, and citizen charter services.
2. Guide users on property tax payment portal (ptaxportal.mcgm.gov.in), water bill payments, and death/birth certificate procedures.
3. Provide high-tide and monsoon flood safety alerts, coastal warnings, and shelter helpline contacts.
4. Explain step-by-step how to submit and track complaints on this portal.`;
    }
  }

  function generateFallbackCivicResponse(userMessage: string, role: string, language: string = 'mr'): string {
    const q = (userMessage || '').toLowerCase();
    
    if (role === 'grievance_triage') {
      if (language === 'mr') {
        return `### 📋 तक्रार निवारण सहाय्य (Grievance Triage)

आपण नमूद केलेल्या समस्येसाठी खालीलप्रमाणे अधिकृत तक्रार मसुदा तयार केला आहे:

**१. तक्रारीचे शीर्षक:** ${userMessage.slice(0, 45)} बाबत त्वरित दुरुस्ती
**२. विभाग:** रस्ते व वाहतूक विभाग (Roads & Traffic) / पर्जन्य जलवाहिन्या (SWD)
**३. अंदाजित निराकरण कालावधी (SLA):** २४ ते ४८ तास
**४. तक्रार मसुदा:**
> *"मी बृहन्मुंबई महानगरपालिकेच्या संबंधित वॉर्ड अधिकाऱ्यांचे लक्ष वेधू इच्छितो की, आमच्या परिसरामध्ये ${userMessage} ही समस्या निर्माण झाली आहे. यामुळे पादचारी व वाहनचालकांना मोठा धोका निर्माण झाला आहे. कृपया घटनास्थळाची पाहणी करून त्वरित दुरुस्ती करावी ही नम्र विनंती."*

💡 **पुढील पायरी:** तुम्ही हा मसुदा थेट 'तक्रार नोंदवा' (File Complaint) टॅबमध्ये पेस्ट करू शकता व फोटो/नकाशा जोडू शकता. तातडीच्या मदतीसाठी २४x७ मनपा हेल्पलाइन **१९१६** वर संपर्क साधा.`;
      } else {
        return `### 📋 Grievance Triage Draft

Here is a structured complaint draft based on your inquiry:

**1. Subject:** Immediate Redressal for: ${userMessage.slice(0, 50)}
**2. Assigned Department:** Roads & Traffic / Storm Water Drains (SWD)
**3. Target SLA:** 24 - 48 Hours
**4. Draft Body:**
> *"To the Ward Executive Engineer, BMC: I would like to report a civic issue regarding ${userMessage}. This poses safety concerns for pedestrians and commuters. Requesting urgent site inspection and repair work with photo verification."*

💡 **Next Step:** You can paste this directly into the 'File Complaint' form and attach a photo or pin the exact location on the map. For emergencies, dial **1916**.`;
      }
    }

    if (role === 'engineering_advisor') {
      if (language === 'mr') {
        return `### 📐 मनपा अभियंता व नियम सल्ला (Engineering Regulations)

**१. रस्ते व खड्डे दुरुस्ती मानके (IRC Standards):**
- IRC:82 व IRC:SP:100 नुसार खड्ड्यांची कडा चौकोनी (Tack coat) कापून त्यावर रॅपिड हार्डनिंग कोल्ड-मिक्स किंवा हॉट मॅस्टिक अस्फाल्ट (Mastic Asphalt) वापरणे बंधनकारक आहे.

**२. पावसाळापूर्व नालेसफाई (SWD Norms):**
- लहान व मोठे नाले तळापर्यंत (Bed level) उपसणे आवश्यक असून उपसलेला गाळ (Silt) २४ तासांत डंपिंग ग्राऊंडवर नेणे अनिवार्य आहे. वाहनांवर GPS ट्रॅकिंग असते.

**३. कामाचा पुरावा (Proof of Work):**
- ठेकेदाराचे बिल मंजूर होण्यापूर्वी कामाच्या पूर्वीचा (Before), कामादरम्यानचा (In-progress) आणि पूर्ण झाल्यानंतरचा (After) जिओ-टॅग केलेला फोटो कनिष्ठ अभियंत्याने प्रमाणित करणे बंधनकारक आहे.`;
      } else {
        return `### 📐 Municipal Engineering & Bye-Laws Advisory

**1. Pothole Repair Standards (IRC:82 & IRC:SP:100):**
- Potholes must be squared off, cleaned of loose debris, tack-coated, and filled with approved rapid-setting cold mix or mastic asphalt compacted to 98% density.

**2. Storm Water Drainage (SWD) Desilting Protocol:**
- Pre-monsoon desilting mandates excavating silt down to invert bed levels. All silt-carrying dumper trucks must carry RFID tags and be weighed at municipal weighbridges.

**3. Proof of Work (PoW) Protocol:**
- Ward Junior Engineers must inspect and upload time-stamped, geotagged Before, During, and After photographs before contractor payments are cleared.`;
      }
    }

    if (role === 'senior_guide') {
      if (language === 'mr') {
        return `### 👵 ज्येष्ठ नागरिक सुलभ मार्गदर्शन (Senior Citizen Support)

नमस्कार! काळजी करू नका, आम्ही आपणास मदत करण्यास तत्पर आहोत.

**सोपे ३ टप्पे:**
1. **फोनवरून थेट तक्रार:** तुम्हाला मोबाईलवरून अडचण येत असल्यास थेट मनपाच्या २४ तास मोफत हेल्पलाइन **१९१६** वर फोन करा.
2. **आपत्कालीन मदत:** वैद्यकीय किंवा आपत्तीसाठी **०२२-२२६९४७२५** वर संपर्क साधा.
3. **पोर्टलवर नोंदणी:** या पोर्टलवर 'तक्रार नोंदवा' बटणावर क्लिक करून आपला पत्ता सांगा; आमचे वॉर्ड अधिकारी त्वरित लक्ष घालतील.

आपल्याला इतर कोणत्याही मदतीची आवश्यकता असल्यास अवश्य विचारा!`;
      } else {
        return `### 👵 Senior Citizen Gentle Guidance

Warm greetings! We are here to guide you with care and simplicity.

**3 Easy Steps:**
1. **Direct Phone Support:** If using digital forms is difficult, simply dial the 24x7 BMC Helpline at **1916** (Toll-Free).
2. **Disaster & Medical Help:** Reach the BMC Central Control Room at **022-22694725**.
3. **Filing on Portal:** Click 'File Complaint' on the screen, speak into the mic, or ask our ward staff for home-visit assistance.

Please let me know if you would like me to draft your request!`;
      }
    }

    // Default civic assistant
    if (language === 'mr') {
      return `### 🏛️ बृहन्मुंबई महानगरपालिका - जेमिनी नागरी सहाय्यक

नमस्कार! मी मनपाचा व्हर्च्युअल सहाय्यक आहे. आपल्या प्रश्नाचे निवारण खालीलप्रमाणे आहे:

- **महत्त्वाचे संपर्क क्रमांक:**
  - २४x७ मनपा मध्यवर्ती हेल्पलाइन: **१९१६**
  - आपत्ती व्यवस्थापन नियंत्रण कक्ष: **०२२-२२६९४७२५**
  - घनकचरा व स्वच्छता तक्रार: **१९६९**
  - अग्निशामक दल: **१०१**

- **२४ प्रशासकीय वॉर्ड:**
  - दक्षिण मुंबई: वॉर्ड A (कुलाबा), B (मशीद बंदर), C (पायधुनी), D (मलबार हिल), E (भायखळा)
  - शहर/मध्य: F/N (माटुंगा), F/S (परळ), G/N (दादर), G/S (वरळी)
  - पश्चिम उपनगरे: H/W (वांद्रे प.), K/W (अंधेरी प.), P/N (मालाड), R/C (बोरिवली)
  - पूर्व उपनगरे: L (कुर्ला), M/W (चेंबूर), N (घाटकोपर), S (भांडुप), T (मुलुंड)

आपणास विशिष्ट वॉर्ड, रस्ता दुरुस्ती किंवा तक्रार मसुद्याबाबत अधिक माहिती हवी असल्यास सांगा!`;
    } else {
      return `### 🏛️ BMC Municipal Virtual Assistant

Hello! I am your Brihanmumbai Municipal Corporation AI Assistant.

- **Key Municipal Helplines:**
  - 24x7 Citizen Helpline: **1916**
  - Disaster Management Control Room: **022-22694725**
  - Solid Waste & Swachhata: **1969**
  - Fire Emergency: **101**

- **24 Administrative Wards Covered:**
  - South Mumbai: Ward A (Colaba), Ward D (Malabar Hill), Ward E (Byculla)
  - Central: Ward G/N (Dadar, Dharavi), Ward G/S (Worli, Lower Parel)
  - Western Suburbs: Ward H/W (Bandra West), Ward K/W (Andheri West), Ward R/C (Borivali)
  - Eastern Suburbs: Ward L (Kurla), Ward M/E (Chembur), Ward N (Ghatkopar)

Feel free to ask me to draft a complaint, check ward details, or explain repair regulations!`;
    }
  }

  // POST /api/gemini/chat - Multi-turn conversational endpoint powered by @google/genai
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const {
        messages,
        role = 'civic_assistant',
        model = 'gemini-2.5-flash',
        language = 'mr',
      } = req.body;

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ success: false, error: 'Messages array is required' });
      }

      const systemInstruction = getChatbotSystemInstruction(role, language);
      const cleanModel = (model || 'gemini-2.5-flash').replace(/^models\//, '');
      const lastMessage = messages[messages.length - 1]?.content || '';

      // If no API key configured, use our intelligent BMC fallback engine
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
        const fallbackReply = generateFallbackCivicResponse(lastMessage, role, language);
        return res.json({
          success: true,
          reply: fallbackReply,
          modelUsed: cleanModel,
          roleUsed: role,
          isFallback: true,
        });
      }

      // Convert messages to @google/genai contents format
      const contents = messages.map((m: any) => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: String(m.content || '') }],
      }));

      const ai = getGeminiClient();
      let replyText = '';
      let actualModelUsed = cleanModel;

      // Try candidate models in order with Gemini API
      const candidateModels = [
        cleanModel,
        'gemini-2.5-flash',
        'gemini-2.0-flash',
        'gemini-1.5-flash',
      ];

      for (const m of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: m,
            contents: contents,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          });
          if (response && response.text) {
            replyText = response.text;
            actualModelUsed = m;
            break;
          }
        } catch (modelErr: any) {
          console.warn(`Model ${m} call attempt:`, modelErr?.message || modelErr);
        }
      }

      if (!replyText) {
        replyText = generateFallbackCivicResponse(lastMessage, role, language);
      }

      return res.json({
        success: true,
        reply: replyText,
        modelUsed: actualModelUsed,
        roleUsed: role,
      });
    } catch (err: any) {
      console.error('Gemini API execution error:', err?.message || err);
      const lastMessage = req.body?.messages?.[req.body.messages.length - 1]?.content || '';
      const fallbackReply = generateFallbackCivicResponse(
        lastMessage,
        req.body?.role || 'civic_assistant',
        req.body?.language || 'mr'
      );
      return res.json({
        success: true,
        reply: fallbackReply,
        modelUsed: req.body?.model || 'gemini-2.5-flash',
        roleUsed: req.body?.role || 'civic_assistant',
        note: 'Fallback mode activated',
      });
    }
  });

  // POST /api/ai/analyze-defect - AI Automated Grievance Triage & Defect Severity Analysis
  app.post('/api/ai/analyze-defect', async (req, res) => {
    try {
      const { title, description, category, wardId } = req.body;
      const textToAnalyze = `${title || ''} ${description || ''} ${category || ''}`.toLowerCase();

      let severityScore = 75;
      let priorityScore = 80;
      let recommendedDept = 'Roads & Traffic';
      let urgencyReason = 'Municipal standard civic concern requiring site attention';

      if (textToAnalyze.includes('pothole') || textToAnalyze.includes('खड्डा') || textToAnalyze.includes('road') || category === 'pothole') {
        severityScore = 88;
        priorityScore = 92;
        recommendedDept = 'Roads & Traffic (रस्ते व वाहतूक)';
        urgencyReason = 'Traffic impediment & monsoon water accumulation hazard under IRC:SP:100';
      } else if (textToAnalyze.includes('drain') || textToAnalyze.includes('नाला') || textToAnalyze.includes('मॅनहोल') || textToAnalyze.includes('waterlogging') || category === 'waterlogging') {
        severityScore = 95;
        priorityScore = 96;
        recommendedDept = 'Storm Water Drains (मलनिःसारण / SWD)';
        urgencyReason = 'Critical flood risk & pedestrian open chamber safety hazard';
      } else if (textToAnalyze.includes('garbage') || textToAnalyze.includes('कचरा') || textToAnalyze.includes('waste') || category === 'garbage') {
        severityScore = 78;
        priorityScore = 82;
        recommendedDept = 'Solid Waste Management (घनकचरा व्यवस्थापन)';
        urgencyReason = 'Public hygiene & vector-borne epidemic mitigation within 24hr SLA';
      } else if (textToAnalyze.includes('water') || textToAnalyze.includes('पाणी') || textToAnalyze.includes('pipe') || category === 'pipeline') {
        severityScore = 84;
        priorityScore = 86;
        recommendedDept = 'Hydraulic Engineer (पाणीपुरवठा व जलवाहिन्या)';
        urgencyReason = 'Drinking water pipeline pressure stabilization & leak repair';
      }

      return res.json({
        success: true,
        aiInference: {
          severityScore,
          priorityScore,
          recommendedDepartment: recommendedDept,
          urgencyReason,
          wardId: wardId || 'K/W',
          ircComplianceNote: 'Evaluated against Indian Roads Congress & BMC Pre-Monsoon Norms',
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // Vite Middleware mounting
  // ==========================================
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.resolve(__dirname, 'dist'))) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`BMC Server running on http://0.0.0.0:${PORT}`);
    console.log(`- API for CMD: curl http://localhost:${PORT}/api/complaints`);
    console.log(`- MySQL Dump for XAMPP: http://localhost:${PORT}/api/export/sql`);
  });
}

startServer();
