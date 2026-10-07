export const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-01',
    title: 'New Leave Request Received',
    message: 'Elena Rostova submitted a Casual Leave request for Oct 14 - Oct 16.',
    type: 'leave',
    targetRole: ['owner', 'hr', 'manager'],
    read: false,
    timestamp: '2026-10-01T09:30:00Z',
    link: '/manager/leave'
  },
  {
    id: 'NOTIF-02',
    title: 'Task Deadline Approaching',
    message: 'Task "Implement Dark Mode and Contrast Checkers" is due on Oct 5.',
    type: 'task',
    targetRole: ['employee', 'manager'],
    read: false,
    timestamp: '2026-10-01T08:00:00Z',
    link: '/employee/tasks'
  },
  {
    id: 'NOTIF-03',
    title: 'Company Announcement Published',
    message: 'CEO Saurabh Kumar posted "Q4 2026 Company All-Hands & Product Roadmap".',
    type: 'announcement',
    targetRole: ['owner', 'hr', 'manager', 'employee'],
    read: false,
    timestamp: '2026-10-01T07:15:00Z',
    link: '/employee/announcements'
  },
  {
    id: 'NOTIF-04',
    title: 'September Payroll Disbursed',
    message: 'Salary for September 2026 has been successfully credited via Direct Deposit.',
    type: 'payroll',
    targetRole: ['employee'],
    read: true,
    timestamp: '2026-09-30T17:00:00Z',
    link: '/employee/payslips'
  },
  {
    id: 'NOTIF-05',
    title: 'Project Milestone Achieved',
    message: 'Project "Cloud Infrastructure Migration v2.0" reached 68% completion.',
    type: 'project',
    targetRole: ['owner', 'manager'],
    read: true,
    timestamp: '2026-09-30T14:30:00Z',
    link: '/owner/projects'
  },
  {
    id: 'NOTIF-06',
    title: 'Quarterly Performance Review Open',
    message: 'Q3 2026 self-assessment reviews are now open for submission.',
    type: 'performance',
    targetRole: ['employee', 'manager'],
    read: false,
    timestamp: '2026-09-29T10:00:00Z',
    link: '/employee/performance'
  }
];
