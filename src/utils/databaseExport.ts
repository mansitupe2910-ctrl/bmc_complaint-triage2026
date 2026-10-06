import { Complaint, WardInfo } from '../types';
import { mumbaiWards } from '../data/mockData';

export function generateClientSqlDump(complaints: Complaint[], wards: WardInfo[] = mumbaiWards): string {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

  let sql = `-- =======================================================
-- BMC Civic Complaint Triage & Ward Governance Database
-- Generated for XAMPP MySQL / phpMyAdmin / CMD CLI
-- Timestamp: ${timestamp}
-- Total Complaints: ${complaints.length}
-- =======================================================

SET FOREIGN_KEY_CHECKS = 0;
CREATE DATABASE IF NOT EXISTS \`bmc_complaints_db\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`bmc_complaints_db\`;

-- -------------------------------------------------------
-- Table structure for \`wards\` (24 BMC Administrative Wards)
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

-- -------------------------------------------------------
-- Dumping data for table \`wards\`
-- -------------------------------------------------------
INSERT INTO \`wards\` (\`ward_id\`, \`ward_code\`, \`ward_name_en\`, \`ward_name_mr\`, \`zone\`, \`key_areas\`, \`ward_officer\`, \`control_room_phone\`, \`lat\`, \`lng\`) VALUES
`;

  const wardRows = wards.map((w) => {
    const esc = (s: string) => (s || '').replace(/'/g, "''").replace(/\\/g, '\\\\');
    return `('${esc(w.id)}', '${esc(w.code)}', '${esc(w.name.en)}', '${esc(w.name.mr)}', '${esc(w.zone)}', '${esc(w.keyAreas)}', '${esc(w.wardOfficer)}', '${esc(w.controlRoomPhone)}', ${w.lat}, ${w.lng})`;
  });
  sql += wardRows.join(',\n') + ';\n\n';

  if (complaints.length > 0) {
    sql += `-- -------------------------------------------------------
-- Dumping data for table \`complaints\` (${complaints.length} records)
-- -------------------------------------------------------
INSERT INTO \`complaints\` (\`id\`, \`ticket_number\`, \`title_en\`, \`title_mr\`, \`category\`, \`ward_id\`, \`ward_name\`, \`location_address\`, \`latitude\`, \`longitude\`, \`reported_at\`, \`status\`, \`visual_severity\`, \`upvotes\`, \`priority_score\`, \`assigned_department\`, \`assigned_officer\`, \`sla_hours_remaining\`, \`photo_url\`) VALUES
`;
    const complaintRows = complaints.map((c) => {
      const esc = (s: string) => (s || '').replace(/'/g, "''").replace(/\\/g, '\\\\');
      return `('${esc(c.id)}', '${esc(c.ticketNumber)}', '${esc(c.title.en)}', '${esc(c.title.mr)}', '${esc(c.category)}', '${esc(c.wardId)}', '${esc(c.wardName)}', '${esc(c.locationAddress)}', ${c.lat || 19.0760}, ${c.lng || 72.8777}, '${esc(c.reportedAt)}', '${esc(c.status)}', ${c.visualSeverity || 50}, ${c.upvotes || 1}, ${c.priorityScore || 50}, '${esc(c.assignedDepartment)}', '${esc(c.assignedOfficer)}', ${c.slaHoursRemaining || 24}, '${esc((c.photoUrl || '').substring(0, 500))}')`;
    });
    sql += complaintRows.join(',\n') + ';\n';
  } else {
    sql += `-- (No citizen complaints currently registered in database)\n`;
  }

  sql += `
SET FOREIGN_KEY_CHECKS = 1;
-- End of SQL Dump
`;
  return sql;
}

export function downloadSqlFile(complaints: Complaint[]) {
  const sql = generateClientSqlDump(complaints);
  const blob = new Blob([sql], { type: 'application/sql;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `bmc_complaints_database_${Date.now()}.sql`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadJsonFile(complaints: Complaint[]) {
  const data = {
    exportedAt: new Date().toISOString(),
    system: 'BMC Civic Complaint Triage Portal',
    complaintCount: complaints.length,
    complaints: complaints
  };
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `bmc_database_export_${Date.now()}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
