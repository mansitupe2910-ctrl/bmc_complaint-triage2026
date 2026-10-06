export type Language = 'mr' | 'en';

export type DepartmentId = 
  | 'roads' 
  | 'swd' 
  | 'swm' 
  | 'hydraulic' 
  | 'electrical' 
  | 'disaster' 
  | 'tree';

export interface DepartmentInfo {
  id: DepartmentId;
  name: { en: string; mr: string; hi: string };
  code: string;
  leadOfficer: string;
  phone: string;
  standardSlaHours: number;
  color: string;
}

export interface WardInfo {
  id: string; // e.g. 'K/W', 'H/W'
  code: string;
  name: { en: string; mr: string; hi: string };
  zone: string;
  keyAreas: string;
  wardOfficer: string;
  controlRoomPhone: string;
  lat: number;
  lng: number;
  monsoonVulnerability: 'Critical' | 'High' | 'Moderate' | 'Low';
}

export interface AiInferenceResult {
  detectedHazard: { en: string; mr: string; hi: string };
  confidence: number; // 0 - 100
  hazardLevel: 'Critical' | 'Severe' | 'Moderate' | 'Low';
  metrics: string; // e.g., "Depth: ~18cm | Hazard Area: 1.4m²"
  riskAssessment: { en: string; mr: string; hi: string };
  suggestedDepartment: DepartmentId;
  boundingBox?: { x: number; y: number; width: number; height: number; label: string };
}

export interface ProofPhotoItem {
  id: string;
  url: string;
  caption?: string;
  stage: 'during_work' | 'after_repair' | 'site_supervision' | 'material_check';
  uploadedBy: string; // Worker name, JE name, or Supervisor
  role: 'Worker' | 'Junior Engineer' | 'Site Supervisor' | 'Contractor';
  timestamp: string;
}

export interface ProofOfWorkAudit {
  repairPhotoUrl: string;
  repairPhotos?: ProofPhotoItem[];
  submittedAt: string;
  engineerName: string;
  engineerId?: string; // e.g. 'E101', 'ENG-101'
  locationTag?: string; // Geotagged site GPS & address
  timestamp?: string; // Date & time recorded on site
  supervisorName?: string;
  workerTeam?: string;
  structuralIntegrityScore: number; // 0-100
  debrisClearanceScore: number; // 0-100
  surfaceSmoothnessScore: number; // 0-100
  overallMatchScore: number; // 0-100
  passed: boolean;
  notes: { en: string; mr: string; hi: string };
  verifiedAt?: string;
  verifiedBy?: string;
  officerRemarks?: string;
}

export interface Complaint {
  id: string;
  ticketNumber: string;
  title: { en: string; mr: string; hi: string };
  description: { en: string; mr: string; hi: string };
  category: 'pothole' | 'waterlogging' | 'garbage' | 'pipeline' | 'wire' | 'tree' | 'manhole';
  wardId: string;
  wardName: string;
  locationAddress: string;
  lat: number;
  lng: number;
  distanceMeters?: number; // for nearby triage
  reportedAt: string;
  status: 'new' | 'assigned' | 'in_progress' | 'verification_pending' | 'resolved';
  
  // Priority calculation factors
  visualSeverity: number; // 0 - 100
  upvotes: number; // Community "+1 Me Too" count
  userUpvoted?: boolean;
  priorityScore: number; // Calculated dynamic score 0 - 100
  
  assignedDepartment: DepartmentId;
  assignedAgency: string;
  assignedOfficer: string;
  slaHoursRemaining: number;
  
  photoUrl: string;
  aiInference: AiInferenceResult;
  proofOfWork?: ProofOfWorkAudit;
  
  citizenContactMasked?: string;
  activityLog: {
    timestamp: string;
    event: { en: string; mr: string; hi: string };
    actor: string;
  }[];
}

export interface MonsoonAlert {
  alertLevel: 'Red Alert' | 'Orange Alert' | 'Yellow Alert' | 'Normal';
  rainfallMmPerHour: number;
  highTideTime: string;
  highTideHeightMeters: number;
  riskMultiplier: number;
  advisory: { en: string; mr: string; hi: string };
  affectedWards: string[];
}

export interface CitizenUser {
  id: string;
  fullName: string;
  mobile: string; // 10-digit mobile number
  wardId: string;
  address?: string;
  registeredAt: string;
}

export interface OfficerUser {
  officerId: string; // Predefined code/ID (e.g. BMC-OFFICER-2026, WARD-KW-101)
  name: string;
  designation: string;
  assignedWard: string; // e.g. "K/W", "ALL"
  badgeNumber: string;
  phone: string;
}

export interface FieldEngineerUser {
  engineerId: string; // e.g. 'E101', 'ENG-101'
  name: string;
  designation: string;
  assignedWard: string;
  department: string;
  phone?: string;
}

