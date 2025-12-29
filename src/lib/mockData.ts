// Mock Data for SCN Operating System Demo

export const verticals = [
  { id: 'scn-hq', name: 'SCN (HQ)', shortName: 'HQ', color: 'bg-slate-600' },
  { id: 'khuwaish', name: 'Khuwaish Disability Care', shortName: 'KDC', color: 'bg-blue-600' },
  { id: 'educare', name: 'Educare Academy', shortName: 'EDU', color: 'bg-emerald-600' },
  { id: 'old-age', name: 'Old Age Homes', shortName: 'OAH', color: 'bg-amber-600' },
  { id: 'therapy', name: 'Therapy & OPD Center', shortName: 'TOC', color: 'bg-purple-600' },
  { id: 'humanitarian', name: 'Humanitarian Relief', shortName: 'HUM', color: 'bg-red-600' },
];

export const roles = [
  { id: 'super-admin', name: 'Super Admin', level: 'full', restricted: true },
  { id: 'vertical-admin', name: 'Vertical Admin', level: 'vertical', restricted: false },
  { id: 'finance', name: 'Finance', level: 'department', restricted: false },
  { id: 'hr', name: 'HR', level: 'department', restricted: false },
  { id: 'procurement', name: 'Procurement', level: 'department', restricted: false },
  { id: 'programs-mel', name: 'Programs / MEL', level: 'department', restricted: false },
  { id: 'safeguarding', name: 'Safeguarding Officer', level: 'restricted', restricted: true },
  { id: 'donor', name: 'Donor', level: 'external', restricted: false },
  { id: 'parent', name: 'Parent (Educare)', level: 'external', restricted: false },
  { id: 'volunteer', name: 'Volunteer', level: 'external', restricted: false },
  { id: 'vendor', name: 'Vendor', level: 'external', restricted: false },
  { id: 'auditor', name: 'Auditor / Board', level: 'readonly', restricted: false },
];

export type Role = typeof roles[number];

export const rolePermissions: Record<string, string[]> = {
  'super-admin': ['*'],
  'vertical-admin': ['dashboard', 'users', 'contacts', 'donations', 'fees', 'volunteers', 'procurement', 'hr', 'programs', 'events', 'exceptions', 'messaging', 'reports'],
  'finance': ['dashboard', 'donations', 'fees', 'procurement', 'reports'],
  'hr': ['dashboard', 'users', 'volunteers', 'hr'],
  'procurement': ['dashboard', 'procurement'],
  'programs-mel': ['dashboard', 'programs', 'reports'],
  'safeguarding': ['dashboard', 'safeguarding'],
  'donor': ['dashboard', 'donations', 'reports'],
  'parent': ['dashboard', 'fees'],
  'volunteer': ['dashboard', 'volunteers'],
  'vendor': ['dashboard', 'procurement'],
  'auditor': ['dashboard', 'audit', 'reports', 'exceptions'],
};

export const dashboardStats = {
  tier1Risks: 3,
  openExceptions: 12,
  complianceScore: 94,
  safeguardingCases: 2,
  totalDonations: 4250000,
  pendingApprovals: 8,
  activeVolunteers: 156,
  staffCount: 89,
};

export const tier1Risks = [
  { id: 1, title: 'Safeguarding case SLA breach imminent', vertical: 'Khuwaish Disability Care', hoursRemaining: 4, severity: 'critical' },
  { id: 2, title: 'Payment approval delayed beyond 72h', vertical: 'SCN (HQ)', hoursRemaining: 12, severity: 'high' },
  { id: 3, title: 'Volunteer insurance expired - access auto-locked', vertical: 'Educare Academy', hoursRemaining: 0, severity: 'critical' },
];

export const openExceptions = [
  { id: 1, type: 'Fee Waiver', description: 'Emergency waiver for beneficiary #1234', status: 'Pending Approval', escalationLevel: 2, createdAt: '2024-01-15', vertical: 'Educare Academy' },
  { id: 2, type: 'Procurement Override', description: 'Single-source procurement for emergency supplies', status: 'Under Review', escalationLevel: 3, createdAt: '2024-01-14', vertical: 'Humanitarian Relief' },
  { id: 3, type: 'Budget Reallocation', description: 'Transfer from unrestricted to restricted fund', status: 'Pending Approval', escalationLevel: 1, createdAt: '2024-01-16', vertical: 'Khuwaish Disability Care' },
  { id: 4, type: 'Staff Overtime', description: 'Extended hours for emergency response', status: 'Approved', escalationLevel: 1, createdAt: '2024-01-13', vertical: 'Humanitarian Relief' },
];

export const users = [
  { id: 1, name: 'Dr. Ayesha Khan', email: 'ayesha.khan@scn.org', role: 'Super Admin', vertical: 'SCN (HQ)', status: 'Active', lastLogin: '2024-01-16 09:32', policyAck: true, restrictedAccess: true },
  { id: 2, name: 'Mohammad Rizwan', email: 'm.rizwan@scn.org', role: 'Vertical Admin', vertical: 'Khuwaish Disability Care', status: 'Active', lastLogin: '2024-01-16 08:15', policyAck: true, restrictedAccess: false },
  { id: 3, name: 'Fatima Begum', email: 'f.begum@scn.org', role: 'Finance', vertical: 'SCN (HQ)', status: 'Active', lastLogin: '2024-01-15 17:45', policyAck: true, restrictedAccess: false },
  { id: 4, name: 'Zahid Hussain', email: 'z.hussain@scn.org', role: 'Safeguarding Officer', vertical: 'Khuwaish Disability Care', status: 'Active', lastLogin: '2024-01-16 10:00', policyAck: true, restrictedAccess: true },
  { id: 5, name: 'Sarah Ahmed', email: 's.ahmed@scn.org', role: 'Programs / MEL', vertical: 'Educare Academy', status: 'Active', lastLogin: '2024-01-14 14:30', policyAck: false, restrictedAccess: false },
  { id: 6, name: 'Ali Hassan', email: 'a.hassan@scn.org', role: 'HR', vertical: 'SCN (HQ)', status: 'Pending', lastLogin: 'Never', policyAck: false, restrictedAccess: false },
  { id: 7, name: 'Nadia Malik', email: 'n.malik@scn.org', role: 'Procurement', vertical: 'Humanitarian Relief', status: 'Active', lastLogin: '2024-01-16 07:00', policyAck: true, restrictedAccess: false },
];

export const donors = [
  { id: 1, name: 'Ahmad Foundation', type: 'Foundation', totalDonated: 1500000, lastDonation: '2024-01-10', status: 'Active', contactPerson: 'Mr. Ahmad Shah', email: 'contact@ahmadfoundation.org' },
  { id: 2, name: 'Global Care Partners', type: 'CSR', totalDonated: 850000, lastDonation: '2024-01-05', status: 'Active', contactPerson: 'Ms. Jennifer Liu', email: 'j.liu@globalcare.com' },
  { id: 3, name: 'Zakat International', type: 'Islamic Charity', totalDonated: 2500000, lastDonation: '2024-01-12', status: 'Active', contactPerson: 'Sheikh Abdullah', email: 'info@zakatintl.org' },
  { id: 4, name: 'Individual Donor #4521', type: 'Individual', totalDonated: 25000, lastDonation: '2024-01-15', status: 'Active', contactPerson: 'Anonymous', email: 'donor@private.com' },
];

export const donations = [
  { id: 'DON-2024-001', donor: 'Ahmad Foundation', amount: 500000, type: 'Restricted', fundType: 'Education', vertical: 'Educare Academy', date: '2024-01-10', status: 'Allocated', receiptNo: 'RCP-24-001' },
  { id: 'DON-2024-002', donor: 'Zakat International', amount: 750000, type: 'Zakat', fundType: 'Zakat Pool', vertical: 'Multiple', date: '2024-01-12', status: 'Pending Allocation', receiptNo: 'RCP-24-002' },
  { id: 'DON-2024-003', donor: 'Global Care Partners', amount: 350000, type: 'Unrestricted', fundType: 'General', vertical: 'SCN (HQ)', date: '2024-01-05', status: 'Allocated', receiptNo: 'RCP-24-003' },
  { id: 'DON-2024-004', donor: 'Individual Donor #4521', amount: 25000, type: 'Restricted', fundType: 'Medical Care', vertical: 'Therapy & OPD Center', date: '2024-01-15', status: 'Allocated', receiptNo: 'RCP-24-004' },
];

export const feePlans = [
  { id: 1, name: 'Standard Education Fee', vertical: 'Educare Academy', monthlyFee: 5000, enrolledCount: 245, waiverCount: 32 },
  { id: 2, name: 'Therapy Session (Per Visit)', vertical: 'Therapy & OPD Center', monthlyFee: 2500, enrolledCount: 156, waiverCount: 18 },
  { id: 3, name: 'Residential Care', vertical: 'Old Age Homes', monthlyFee: 15000, enrolledCount: 48, waiverCount: 12 },
  { id: 4, name: 'Disability Care Program', vertical: 'Khuwaish Disability Care', monthlyFee: 8000, enrolledCount: 89, waiverCount: 45 },
];

export const waiverRequests = [
  { id: 1, beneficiary: 'Beneficiary #1234', feePlan: 'Standard Education Fee', requestedAmount: 5000, reason: 'Family financial hardship - single parent household', status: 'Pending Approval', requestedBy: 'Sarah Ahmed', date: '2024-01-15' },
  { id: 2, beneficiary: 'Beneficiary #2156', feePlan: 'Disability Care Program', requestedAmount: 4000, reason: 'Government subsidy covers remaining', status: 'Approved', requestedBy: 'Mohammad Rizwan', date: '2024-01-14' },
  { id: 3, beneficiary: 'Beneficiary #3089', feePlan: 'Therapy Session', requestedAmount: 2500, reason: 'Referral from partner NGO', status: 'Pending Review', requestedBy: 'Zahid Hussain', date: '2024-01-16' },
];

export const volunteers = [
  { id: 1, name: 'Samina Yousuf', tier: 'Tier 1', vertical: 'Educare Academy', trainingStatus: 'Complete', insuranceValid: true, insuranceExpiry: '2024-12-31', accreditation: 'Child Safety Certified', hoursContributed: 156, status: 'Active' },
  { id: 2, name: 'Imran Ali', tier: 'Tier 2', vertical: 'Humanitarian Relief', trainingStatus: 'In Progress', insuranceValid: true, insuranceExpiry: '2024-06-30', accreditation: 'First Aid', hoursContributed: 89, status: 'Active' },
  { id: 3, name: 'Rubina Khatoon', tier: 'Tier 1', vertical: 'Khuwaish Disability Care', trainingStatus: 'Complete', insuranceValid: false, insuranceExpiry: '2024-01-10', accreditation: 'Disability Care Specialist', hoursContributed: 234, status: 'Access Locked' },
  { id: 4, name: 'Tariq Mehmood', tier: 'Tier 3', vertical: 'Old Age Homes', trainingStatus: 'Complete', insuranceValid: true, insuranceExpiry: '2024-09-15', accreditation: 'Elder Care', hoursContributed: 45, status: 'Active' },
];

export const procurementItems = [
  { id: 'REQ-2024-001', item: 'Educational Materials', quantity: 500, estimatedCost: 125000, status: 'PO Approved', stage: 'GRN Pending', vertical: 'Educare Academy', quotes: 3, selectedVendor: 'ABC Supplies' },
  { id: 'REQ-2024-002', item: 'Medical Equipment', quantity: 10, estimatedCost: 450000, status: 'Comparative Analysis', stage: '3 Quotes Received', vertical: 'Therapy & OPD Center', quotes: 3, selectedVendor: null },
  { id: 'REQ-2024-003', item: 'Emergency Relief Kits', quantity: 1000, estimatedCost: 850000, status: 'RFQ Sent', stage: 'Awaiting Quotes', vertical: 'Humanitarian Relief', quotes: 0, selectedVendor: null },
  { id: 'REQ-2024-004', item: 'Office Furniture', quantity: 25, estimatedCost: 75000, status: 'Payment Processed', stage: 'Complete', vertical: 'SCN (HQ)', quotes: 3, selectedVendor: 'Office World' },
];

export const staffMembers = [
  { id: 1, name: 'Dr. Ayesha Khan', position: 'Executive Director', department: 'Management', vertical: 'SCN (HQ)', attendance: '98%', overtimeHours: 12, contractEnd: '2025-12-31', policyAck: true },
  { id: 2, name: 'Mohammad Rizwan', position: 'Center Manager', department: 'Operations', vertical: 'Khuwaish Disability Care', attendance: '95%', overtimeHours: 24, contractEnd: '2025-06-30', policyAck: true },
  { id: 3, name: 'Fatima Begum', position: 'Finance Officer', department: 'Finance', vertical: 'SCN (HQ)', attendance: '100%', overtimeHours: 8, contractEnd: '2024-12-31', policyAck: true },
  { id: 4, name: 'Dr. Saima Noor', position: 'Chief Medical Officer', department: 'Medical', vertical: 'Therapy & OPD Center', attendance: '92%', overtimeHours: 45, contractEnd: '2025-03-31', policyAck: false },
];

export const programKPIs = [
  { id: 1, program: 'Inclusive Education Initiative', indicator: 'Student Enrollment', target: 300, actual: 245, unit: 'students', status: 'On Track', vertical: 'Educare Academy' },
  { id: 2, program: 'Disability Rehabilitation', indicator: 'Therapy Sessions Delivered', target: 500, actual: 478, unit: 'sessions', status: 'On Track', vertical: 'Khuwaish Disability Care' },
  { id: 3, program: 'Emergency Response 2024', indicator: 'Families Assisted', target: 1000, actual: 650, unit: 'families', status: 'Behind', vertical: 'Humanitarian Relief' },
  { id: 4, program: 'Elder Care Program', indicator: 'Resident Satisfaction', target: 90, actual: 92, unit: '%', status: 'Exceeded', vertical: 'Old Age Homes' },
];

export const safeguardingCases = [
  { id: 'SG-2024-001', summary: '[REDACTED] - Tier 1 case under investigation', status: 'Active', slaDeadline: '2024-01-17 14:00', assignedTo: 'Zahid Hussain', vertical: 'Khuwaish Disability Care', notes: 3, createdAt: '2024-01-14' },
  { id: 'SG-2024-002', summary: '[REDACTED] - Near-miss logged for review', status: 'Under Review', slaDeadline: '2024-01-20 12:00', assignedTo: 'Zahid Hussain', vertical: 'Educare Academy', notes: 1, createdAt: '2024-01-15' },
];

export const auditLog = [
  { id: 1, action: 'Fee Waiver Approved', actor: 'Mohammad Rizwan', timestamp: '2024-01-16 10:32:15', reason: 'Verified financial hardship documentation', reference: 'WAIVER-2024-002', module: 'Fees' },
  { id: 2, action: 'Procurement PO Created', actor: 'Nadia Malik', timestamp: '2024-01-16 09:15:42', reason: 'Emergency supplies required', reference: 'REQ-2024-001', module: 'Procurement' },
  { id: 3, action: 'User Role Modified', actor: 'Dr. Ayesha Khan', timestamp: '2024-01-15 17:45:30', reason: 'Promotion to Vertical Admin', reference: 'USER-002', module: 'Users' },
  { id: 4, action: 'Safeguarding Case Created', actor: 'Zahid Hussain', timestamp: '2024-01-14 11:20:00', reason: 'Incident reported via hotline', reference: 'SG-2024-001', module: 'Safeguarding' },
  { id: 5, action: 'Manual Override Applied', actor: 'Dr. Ayesha Khan', timestamp: '2024-01-14 08:00:00', reason: 'Emergency protocol activation', reference: 'OVERRIDE-001', module: 'System' },
  { id: 6, action: 'Donation Allocated', actor: 'Fatima Begum', timestamp: '2024-01-12 14:30:00', reason: 'Zakat fund distribution per policy', reference: 'DON-2024-002', module: 'Donations' },
];

export const messagingLog = [
  { id: 1, type: 'Portal Alert', recipient: 'Zahid Hussain', subject: 'Safeguarding SLA Warning', status: 'Delivered', channel: 'Portal Only', timestamp: '2024-01-16 10:00', restricted: true },
  { id: 2, type: 'Email', recipient: 'Ahmad Foundation', subject: 'Donation Receipt - RCP-24-001', status: 'Delivered', channel: 'Email', timestamp: '2024-01-10 15:30', restricted: false },
  { id: 3, type: 'SMS', recipient: 'Parent #1234', subject: 'Fee Payment Reminder', status: 'Delivered', channel: 'SMS', timestamp: '2024-01-15 09:00', restricted: false },
  { id: 4, type: 'Portal Alert', recipient: 'Super Admin', subject: 'Tier 1 Risk Escalation', status: 'Delivered', channel: 'Portal Only', timestamp: '2024-01-16 08:00', restricted: true },
];

export const exceptionsEscalations = [
  { id: 1, type: 'Fee Waiver', level: 2, description: 'Emergency waiver exceeds threshold', owner: 'Mohammad Rizwan', deadline: '2024-01-17', status: 'Pending', vertical: 'Educare Academy' },
  { id: 2, type: 'Procurement Override', level: 3, description: 'Single-source over PKR 500,000', owner: 'Nadia Malik', deadline: '2024-01-18', status: 'Under Review', vertical: 'Humanitarian Relief' },
  { id: 3, type: 'Budget Transfer', level: 1, description: 'Fund reallocation request', owner: 'Fatima Begum', deadline: '2024-01-19', status: 'Approved', vertical: 'Khuwaish Disability Care' },
];

export const verticalHealth = [
  { id: 'scn-hq', name: 'SCN (HQ)', healthScore: 95, fundingStatus: 'Adequate', openExceptions: 2, staffCount: 25, complianceScore: 98 },
  { id: 'khuwaish', name: 'Khuwaish Disability Care', healthScore: 88, fundingStatus: 'Adequate', openExceptions: 3, staffCount: 18, complianceScore: 92 },
  { id: 'educare', name: 'Educare Academy', healthScore: 92, fundingStatus: 'Adequate', openExceptions: 2, staffCount: 22, complianceScore: 95 },
  { id: 'old-age', name: 'Old Age Homes', healthScore: 85, fundingStatus: 'Needs Attention', openExceptions: 1, staffCount: 12, complianceScore: 90 },
  { id: 'therapy', name: 'Therapy & OPD Center', healthScore: 90, fundingStatus: 'Adequate', openExceptions: 2, staffCount: 8, complianceScore: 94 },
  { id: 'humanitarian', name: 'Humanitarian Relief', healthScore: 78, fundingStatus: 'Critical', openExceptions: 4, staffCount: 15, complianceScore: 88 },
];
