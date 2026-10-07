export const INITIAL_LEAVES = [
  {
    id: 'LEV-501',
    employeeId: 'EMP-1004',
    employeeName: 'Elena Rostova',
    department: 'Engineering',
    leaveType: 'Casual Leave',
    startDate: '2026-10-14',
    endDate: '2026-10-16',
    days: 3,
    reason: 'Family reunion and personal travel commitments.',
    status: 'Pending',
    appliedOn: '2026-09-30',
    approver: 'Marcus Sterling',
    remarks: ''
  },
  {
    id: 'LEV-502',
    employeeId: 'EMP-1011',
    employeeName: 'Nate Chen',
    department: 'Customer Success',
    leaveType: 'Sick Leave',
    startDate: '2026-10-01',
    endDate: '2026-10-03',
    days: 3,
    reason: 'Medical recovery following dental surgery.',
    status: 'Approved',
    appliedOn: '2026-09-28',
    approver: 'Saurabh Kumar',
    remarks: 'Approved. Get well soon!'
  },
  {
    id: 'LEV-503',
    employeeId: 'EMP-1006',
    employeeName: 'Aria Takahashi',
    department: 'Product & Design',
    leaveType: 'Earned Leave',
    startDate: '2026-10-22',
    endDate: '2026-10-26',
    days: 5,
    reason: 'Annual autumn vacation and design conference attendance in Tokyo.',
    status: 'Pending',
    appliedOn: '2026-09-29',
    approver: 'Marcus Sterling',
    remarks: ''
  },
  {
    id: 'LEV-504',
    employeeId: 'EMP-1005',
    employeeName: 'Devon Carter',
    department: 'Engineering',
    leaveType: 'Emergency Leave',
    startDate: '2026-09-20',
    endDate: '2026-09-21',
    days: 2,
    reason: 'Urgent home plumbing repair and electrical rewiring emergency.',
    status: 'Approved',
    appliedOn: '2026-09-19',
    approver: 'Marcus Sterling',
    remarks: 'Approved as per emergency policy.'
  },
  {
    id: 'LEV-505',
    employeeId: 'EMP-1008',
    employeeName: 'Clara Oswald',
    department: 'Engineering',
    leaveType: 'Casual Leave',
    startDate: '2026-09-10',
    endDate: '2026-09-12',
    days: 3,
    reason: 'Attending sibling graduation ceremony.',
    status: 'Approved',
    appliedOn: '2026-09-02',
    approver: 'Marcus Sterling',
    remarks: 'Approved.'
  },
  {
    id: 'LEV-506',
    employeeId: 'EMP-1009',
    employeeName: 'Liam Hemsworth-Brown',
    department: 'Finance & Accounts',
    leaveType: 'Unpaid Leave',
    startDate: '2026-08-15',
    endDate: '2026-08-18',
    days: 4,
    reason: 'Extended personal leave for relocation.',
    status: 'Rejected',
    appliedOn: '2026-08-10',
    approver: 'Saurabh Kumar',
    remarks: 'Clashes with Q2 financial filing deadline.'
  }
];

export const INITIAL_LEAVE_BALANCES = {
  'EMP-1004': {
    casual: { total: 12, used: 3, remaining: 9 },
    sick: { total: 10, used: 2, remaining: 8 },
    earned: { total: 15, used: 4, remaining: 11 },
    emergency: { total: 5, used: 0, remaining: 5 }
  }
};
