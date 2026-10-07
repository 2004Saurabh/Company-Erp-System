// Master Tasks Dataset - 58 Comprehensive Tasks with Full Schemas
export const INITIAL_TASKS = [
  {
    "id": "TSK-201",
    "title": "Implement Dark Mode and Contrast Checkers",
    "description": "Ensure all components meet WCAG AAA contrast guidelines and smooth transitions in theme switching.",
    "assignedTo": "Elena Rostova",
    "assignedToId": "EMP-1004",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Engineering",
    "project": "Next-Gen Mobile App Overhaul",
    "projectId": "PRJ-102",
    "priority": "High",
    "status": "In Progress",
    "startDate": "2026-09-28",
    "dueDate": "2026-10-10",
    "completionDate": null,
    "estimatedHours": 24,
    "actualHours": 18,
    "attachments": [
      {
        "name": "dark_mode_guidelines.pdf",
        "size": "2.1 MB",
        "type": "pdf"
      },
      {
        "name": "color_tokens.json",
        "size": "48 KB",
        "type": "json"
      }
    ],
    "comments": [
      {
        "id": "CMT-201-1",
        "author": "Marcus Sterling",
        "authorRole": "Manager",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        "text": "Please ensure high contrast ratios on mobile AMOLED screens.",
        "timestamp": "2026-09-29 10:15"
      },
      {
        "id": "CMT-201-2",
        "author": "Elena Rostova",
        "authorRole": "Employee",
        "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
        "text": "Implemented dynamic palette switching, currently validating OLED true black values.",
        "timestamp": "2026-10-02 14:30"
      }
    ],
    "activityTimeline": [
      {
        "id": "ACT-201-1",
        "action": "Task created and assigned to Elena Rostova",
        "user": "Marcus Sterling",
        "timestamp": "2026-09-28 09:00"
      },
      {
        "id": "ACT-201-2",
        "action": "Status moved from Pending to In Progress",
        "user": "Elena Rostova",
        "timestamp": "2026-09-28 11:30"
      },
      {
        "id": "ACT-201-3",
        "action": "Logged 18 hours of progress",
        "user": "Elena Rostova",
        "timestamp": "2026-10-02 14:30"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-09-28"
  },
  {
    "id": "TSK-202",
    "title": "Biometric TouchID & FaceID Native Auth Flow",
    "description": "Integrate native keychain storage and biometric prompts for fast local session unlock.",
    "assignedTo": "Elena Rostova",
    "assignedToId": "EMP-1004",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Engineering",
    "project": "Next-Gen Mobile App Overhaul",
    "projectId": "PRJ-102",
    "priority": "Critical",
    "status": "Completed",
    "startDate": "2026-09-15",
    "dueDate": "2026-09-30",
    "completionDate": "2026-09-29",
    "estimatedHours": 32,
    "actualHours": 29,
    "attachments": [
      {
        "name": "biometric_security_spec.pdf",
        "size": "1.8 MB",
        "type": "pdf"
      }
    ],
    "comments": [
      {
        "id": "CMT-202-1",
        "author": "Elena Rostova",
        "authorRole": "Employee",
        "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
        "text": "Merged into staging branch. Passed biometric fallback PIN test.",
        "timestamp": "2026-09-29 16:45"
      }
    ],
    "activityTimeline": [
      {
        "id": "ACT-202-1",
        "action": "Task assigned to Elena Rostova",
        "user": "Marcus Sterling",
        "timestamp": "2026-09-15 10:00"
      },
      {
        "id": "ACT-202-2",
        "action": "Status moved to Completed",
        "user": "Elena Rostova",
        "timestamp": "2026-09-29 17:00"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-09-15"
  },
  {
    "id": "TSK-203",
    "title": "Offline Data Sync with IndexedDB Queue",
    "description": "Implement optimistic UI updates and background synchronization when network connectivity restores.",
    "assignedTo": "Elena Rostova",
    "assignedToId": "EMP-1004",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Engineering",
    "project": "Next-Gen Mobile App Overhaul",
    "projectId": "PRJ-102",
    "priority": "High",
    "status": "Completed",
    "startDate": "2026-09-18",
    "dueDate": "2026-10-02",
    "completionDate": "2026-10-01",
    "estimatedHours": 28,
    "actualHours": 26,
    "attachments": [],
    "comments": [
      {
        "id": "CMT-203-1",
        "author": "Elena Rostova",
        "authorRole": "Employee",
        "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
        "text": "All conflict resolutions default to server timestamp with local stash preserved.",
        "timestamp": "2026-10-01 11:20"
      }
    ],
    "activityTimeline": [
      {
        "id": "ACT-203-1",
        "action": "Status moved to Completed",
        "user": "Elena Rostova",
        "timestamp": "2026-10-01 11:30"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-09-18"
  },
  {
    "id": "TSK-204",
    "title": "Optimize Core Web Vitals for Dashboard",
    "description": "Reduce Largest Contentful Paint (LCP) below 1.2s and eliminate Cumulative Layout Shift.",
    "assignedTo": "Elena Rostova",
    "assignedToId": "EMP-1004",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Engineering",
    "project": "Next-Gen Mobile App Overhaul",
    "projectId": "PRJ-102",
    "priority": "Medium",
    "status": "Pending",
    "startDate": "2026-10-05",
    "dueDate": "2026-10-18",
    "completionDate": null,
    "estimatedHours": 16,
    "actualHours": 2,
    "attachments": [
      {
        "name": "lighthouse_audit_report.json",
        "size": "320 KB",
        "type": "json"
      }
    ],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-204-1",
        "action": "Task created",
        "user": "Marcus Sterling",
        "timestamp": "2026-10-05 09:30"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-10-05"
  },
  {
    "id": "TSK-205",
    "title": "Q3 Accessibility Compliance Audit Fixes",
    "description": "Resolve keyboard traps in deep navigation dropdowns and screen reader accessibility tags.",
    "assignedTo": "Elena Rostova",
    "assignedToId": "EMP-1004",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Engineering",
    "project": "Next-Gen Mobile App Overhaul",
    "projectId": "PRJ-102",
    "priority": "High",
    "status": "Pending",
    "startDate": "2026-09-20",
    "dueDate": "2026-10-04",
    "completionDate": null,
    "estimatedHours": 20,
    "actualHours": 8,
    "attachments": [
      {
        "name": "accessibility_violations.xlsx",
        "size": "1.2 MB",
        "type": "excel"
      }
    ],
    "comments": [
      {
        "id": "CMT-205-1",
        "author": "Marcus Sterling",
        "authorRole": "Manager",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        "text": "This missed the Oct 4 release cut! Please prioritize immediately.",
        "timestamp": "2026-10-05 08:30"
      }
    ],
    "activityTimeline": [
      {
        "id": "ACT-205-1",
        "action": "Flagged as overdue due date passed on Oct 4",
        "user": "System",
        "timestamp": "2026-10-05 00:00"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-09-20"
  },
  {
    "id": "TSK-206",
    "title": "Migrate React Router v6 Data Loaders",
    "description": "Transition client-side query waterfalls into parallel route loaders for instant page transitions.",
    "assignedTo": "Elena Rostova",
    "assignedToId": "EMP-1004",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Engineering",
    "project": "Next-Gen Mobile App Overhaul",
    "projectId": "PRJ-102",
    "priority": "Medium",
    "status": "Completed",
    "startDate": "2026-09-08",
    "dueDate": "2026-09-22",
    "completionDate": "2026-09-20",
    "estimatedHours": 24,
    "actualHours": 22,
    "attachments": [],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-206-1",
        "action": "Completed ahead of schedule",
        "user": "Elena Rostova",
        "timestamp": "2026-09-20 15:00"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-09-08"
  },
  {
    "id": "TSK-207",
    "title": "AI Prompt Engineering UI Components",
    "description": "Design interactive token cost calculator and prompt template selector for internal talent search.",
    "assignedTo": "Elena Rostova",
    "assignedToId": "EMP-1004",
    "assignedManager": "Sophia Montgomery",
    "assignedManagerId": "EMP-1002",
    "department": "Human Resources",
    "project": "AI Predictive Talent Matching Engine",
    "projectId": "PRJ-108",
    "priority": "High",
    "status": "In Progress",
    "startDate": "2026-09-25",
    "dueDate": "2026-10-12",
    "completionDate": null,
    "estimatedHours": 30,
    "actualHours": 20,
    "attachments": [
      {
        "name": "talent_match_wireframes.figma",
        "size": "14 MB",
        "type": "figma"
      }
    ],
    "comments": [
      {
        "id": "CMT-207-1",
        "author": "Sophia Montgomery",
        "authorRole": "HR Head",
        "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
        "text": "HR recruitment team tested the beta prototype, feedback is very positive!",
        "timestamp": "2026-10-04 11:00"
      }
    ],
    "activityTimeline": [
      {
        "id": "ACT-207-1",
        "action": "Task initiated",
        "user": "Sophia Montgomery",
        "timestamp": "2026-09-25 10:00"
      }
    ],
    "createdBy": "Sophia Montgomery",
    "createdDate": "2026-09-25"
  },
  {
    "id": "TSK-208",
    "title": "Review Engineering Career Ladder Framework",
    "description": "Standardize junior, mid, senior, staff engineer competencies across departments.",
    "assignedTo": "Elena Rostova",
    "assignedToId": "EMP-1004",
    "assignedManager": "Sophia Montgomery",
    "assignedManagerId": "EMP-1002",
    "department": "Human Resources",
    "project": "Global Workforce Upskilling 2026",
    "projectId": "PRJ-104",
    "priority": "Low",
    "status": "Completed",
    "startDate": "2026-09-10",
    "dueDate": "2026-09-25",
    "completionDate": "2026-09-24",
    "estimatedHours": 12,
    "actualHours": 10,
    "attachments": [
      {
        "name": "eng_ladder_rubric_v3.pdf",
        "size": "940 KB",
        "type": "pdf"
      }
    ],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-208-1",
        "action": "Completed and approved by HR committee",
        "user": "Elena Rostova",
        "timestamp": "2026-09-24 14:00"
      }
    ],
    "createdBy": "Sophia Montgomery",
    "createdDate": "2026-09-10"
  },
  {
    "id": "TSK-209",
    "title": "Frontend CI Bundle Size Budget Automation",
    "description": "Add GitHub action check enforcing max gzipped JS bundle size under 350KB per entry chunk.",
    "assignedTo": "Elena Rostova",
    "assignedToId": "EMP-1004",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Engineering",
    "project": "Cloud Infrastructure Migration v2.0",
    "projectId": "PRJ-101",
    "priority": "Medium",
    "status": "Completed",
    "startDate": "2026-08-20",
    "dueDate": "2026-09-05",
    "completionDate": "2026-09-03",
    "estimatedHours": 16,
    "actualHours": 14,
    "attachments": [],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-209-1",
        "action": "Merged PR #412",
        "user": "Elena Rostova",
        "timestamp": "2026-09-03 16:20"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-08-20"
  },
  {
    "id": "TSK-210",
    "title": "Realtime WebSocket Notification Toast System",
    "description": "Provide instant UI notifications for task assignments, approvals, and system broadcast alerts.",
    "assignedTo": "Elena Rostova",
    "assignedToId": "EMP-1004",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Engineering",
    "project": "Next-Gen Mobile App Overhaul",
    "projectId": "PRJ-102",
    "priority": "High",
    "status": "Completed",
    "startDate": "2026-09-01",
    "dueDate": "2026-09-15",
    "completionDate": "2026-09-14",
    "estimatedHours": 28,
    "actualHours": 25,
    "attachments": [],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-210-1",
        "action": "Completed and deployed",
        "user": "Elena Rostova",
        "timestamp": "2026-09-14 18:00"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-09-01"
  },
  {
    "id": "TSK-211",
    "title": "Export Data Reports to PDF and CSV Engine",
    "description": "Client-side PDF generator using jsPDF with branded templates and table formatting.",
    "assignedTo": "Elena Rostova",
    "assignedToId": "EMP-1004",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Engineering",
    "project": "Next-Gen Mobile App Overhaul",
    "projectId": "PRJ-102",
    "priority": "Medium",
    "status": "Completed",
    "startDate": "2026-08-15",
    "dueDate": "2026-08-30",
    "completionDate": "2026-08-28",
    "estimatedHours": 20,
    "actualHours": 19,
    "attachments": [],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-211-1",
        "action": "Finished feature",
        "user": "Elena Rostova",
        "timestamp": "2026-08-28 12:00"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-08-15"
  },
  {
    "id": "TSK-212",
    "title": "Micro-Frontend Module Federation Setup",
    "description": "Decouple billing sub-system into independently deployable federated remote bundle.",
    "assignedTo": "Elena Rostova",
    "assignedToId": "EMP-1004",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Engineering",
    "project": "Cloud Infrastructure Migration v2.0",
    "projectId": "PRJ-101",
    "priority": "Critical",
    "status": "Completed",
    "startDate": "2026-08-01",
    "dueDate": "2026-08-20",
    "completionDate": "2026-08-19",
    "estimatedHours": 40,
    "actualHours": 38,
    "attachments": [
      {
        "name": "webpack_module_fed_arch.png",
        "size": "850 KB",
        "type": "image"
      }
    ],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-212-1",
        "action": "Module federation deployed to AWS CloudFront",
        "user": "Elena Rostova",
        "timestamp": "2026-08-19 19:30"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-08-01"
  },
  {
    "id": "TSK-213",
    "title": "Interactive Employee Dashboard Kanban View",
    "description": "Drag-and-drop task card kanban board with lane animations and instant persistence.",
    "assignedTo": "Elena Rostova",
    "assignedToId": "EMP-1004",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Engineering",
    "project": "Next-Gen Mobile App Overhaul",
    "projectId": "PRJ-102",
    "priority": "High",
    "status": "In Progress",
    "startDate": "2026-10-01",
    "dueDate": "2026-10-15",
    "completionDate": null,
    "estimatedHours": 26,
    "actualHours": 15,
    "attachments": [],
    "comments": [
      {
        "id": "CMT-213-1",
        "author": "Elena Rostova",
        "authorRole": "Employee",
        "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
        "text": "Kanban cards render smoothly with framer-motion.",
        "timestamp": "2026-10-04 15:45"
      }
    ],
    "activityTimeline": [
      {
        "id": "ACT-213-1",
        "action": "In Progress update logged",
        "user": "Elena Rostova",
        "timestamp": "2026-10-01 10:00"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-10-01"
  },
  {
    "id": "TSK-214",
    "title": "Dynamic Currency Formatter & INR Localization",
    "description": "Ensure all financial amounts display in Indian Rupee format with standard Lakhs and Crores grouping.",
    "assignedTo": "Elena Rostova",
    "assignedToId": "EMP-1004",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Engineering",
    "project": "Automated Billing & Invoicing Engine",
    "projectId": "PRJ-106",
    "priority": "Medium",
    "status": "Completed",
    "startDate": "2026-09-22",
    "dueDate": "2026-10-03",
    "completionDate": "2026-10-02",
    "estimatedHours": 14,
    "actualHours": 12,
    "attachments": [],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-214-1",
        "action": "Completed and verified",
        "user": "Elena Rostova",
        "timestamp": "2026-10-02 16:00"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-09-22"
  },
  {
    "id": "TSK-215",
    "title": "Fix Safari iOS Keyboard Viewport Jump Bug",
    "description": "Virtual keyboard pushes header offscreen in iOS 18 WebKit rendering engine.",
    "assignedTo": "Elena Rostova",
    "assignedToId": "EMP-1004",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Engineering",
    "project": "Next-Gen Mobile App Overhaul",
    "projectId": "PRJ-102",
    "priority": "Critical",
    "status": "In Progress",
    "startDate": "2026-10-03",
    "dueDate": "2026-10-09",
    "completionDate": null,
    "estimatedHours": 16,
    "actualHours": 10,
    "attachments": [],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-215-1",
        "action": "Assigned as high urgency hotfix",
        "user": "Marcus Sterling",
        "timestamp": "2026-10-03 09:00"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-10-03"
  },
  {
    "id": "TSK-216",
    "title": "Customer Ticket Quick Response Component",
    "description": "Build rich text snippet expansion and canned responses picker for support staff.",
    "assignedTo": "Elena Rostova",
    "assignedToId": "EMP-1004",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Engineering",
    "project": "Omnichannel Customer Support Hub",
    "projectId": "PRJ-107",
    "priority": "Low",
    "status": "Completed",
    "startDate": "2026-09-05",
    "dueDate": "2026-09-18",
    "completionDate": "2026-09-17",
    "estimatedHours": 18,
    "actualHours": 16,
    "attachments": [],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-216-1",
        "action": "Delivered to CS team",
        "user": "Elena Rostova",
        "timestamp": "2026-09-17 17:00"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-09-05"
  },
  {
    "id": "TSK-217",
    "title": "Fix Broken Pagination in Audit Log Modal",
    "description": "Audit log table breaks when navigating beyond page 10 due to off-by-one slice calculation.",
    "assignedTo": "Elena Rostova",
    "assignedToId": "EMP-1004",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Engineering",
    "project": "Enterprise SOC2 Compliance Audit",
    "projectId": "PRJ-103",
    "priority": "High",
    "status": "In Progress",
    "startDate": "2026-09-22",
    "dueDate": "2026-10-01",
    "completionDate": null,
    "estimatedHours": 10,
    "actualHours": 6,
    "attachments": [],
    "comments": [
      {
        "id": "CMT-217-1",
        "author": "Marcus Sterling",
        "authorRole": "Manager",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        "text": "This is overdue as of Oct 1. Please push the PR today.",
        "timestamp": "2026-10-05 10:00"
      }
    ],
    "activityTimeline": [
      {
        "id": "ACT-217-1",
        "action": "Flagged overdue",
        "user": "System",
        "timestamp": "2026-10-02 00:00"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-09-22"
  },
  {
    "id": "TSK-218",
    "title": "Design System Typography Scale Calibration",
    "description": "Harmonize Inter and JetBrains Mono fluid typography clamp across mobile, tablet, and 4k displays.",
    "assignedTo": "Elena Rostova",
    "assignedToId": "EMP-1004",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Engineering",
    "project": "Next-Gen Mobile App Overhaul",
    "projectId": "PRJ-102",
    "priority": "Low",
    "status": "Completed",
    "startDate": "2026-08-10",
    "dueDate": "2026-08-25",
    "completionDate": "2026-08-24",
    "estimatedHours": 14,
    "actualHours": 11,
    "attachments": [],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-218-1",
        "action": "Completed and merged",
        "user": "Elena Rostova",
        "timestamp": "2026-08-24 16:30"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-08-10"
  },
  {
    "id": "TSK-219",
    "title": "Migrate Redis Cache Cluster to Multi-AZ",
    "description": "Configure Redis Enterprise replication group with in-transit encryption and snapshot backup.",
    "assignedTo": "Devon Carter",
    "assignedToId": "EMP-1005",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Engineering",
    "project": "Cloud Infrastructure Migration v2.0",
    "projectId": "PRJ-101",
    "priority": "High",
    "status": "In Progress",
    "startDate": "2026-09-28",
    "dueDate": "2026-10-12",
    "completionDate": null,
    "estimatedHours": 32,
    "actualHours": 22,
    "attachments": [
      {
        "name": "redis_cluster_topology.pdf",
        "size": "1.4 MB",
        "type": "pdf"
      }
    ],
    "comments": [
      {
        "id": "CMT-219-1",
        "author": "Devon Carter",
        "authorRole": "Employee",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        "text": "Replication latency under 2ms between us-east-1a and 1b.",
        "timestamp": "2026-10-04 18:20"
      }
    ],
    "activityTimeline": [
      {
        "id": "ACT-219-1",
        "action": "Cluster provisioned",
        "user": "Devon Carter",
        "timestamp": "2026-10-02 11:00"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-09-28"
  },
  {
    "id": "TSK-220",
    "title": "Implement GraphQL Subscriptions for Order Feeds",
    "description": "Deploy Apollo Server v4 subscription server over WebSockets with heartbeat keepalive.",
    "assignedTo": "Devon Carter",
    "assignedToId": "EMP-1005",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Engineering",
    "project": "Automated Billing & Invoicing Engine",
    "projectId": "PRJ-106",
    "priority": "Critical",
    "status": "Completed",
    "startDate": "2026-09-12",
    "dueDate": "2026-09-28",
    "completionDate": "2026-09-27",
    "estimatedHours": 36,
    "actualHours": 34,
    "attachments": [],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-220-1",
        "action": "Completed successfully",
        "user": "Devon Carter",
        "timestamp": "2026-09-27 15:00"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-09-12"
  },
  {
    "id": "TSK-221",
    "title": "PostgreSQL Database Partitioning for Billing Logs",
    "description": "Partition monthly ledger tables by range (billing_year_month) to maintain sub-10ms query times.",
    "assignedTo": "Devon Carter",
    "assignedToId": "EMP-1005",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Engineering",
    "project": "Automated Billing & Invoicing Engine",
    "projectId": "PRJ-106",
    "priority": "High",
    "status": "Pending",
    "startDate": "2026-09-20",
    "dueDate": "2026-10-03",
    "completionDate": null,
    "estimatedHours": 24,
    "actualHours": 12,
    "attachments": [],
    "comments": [
      {
        "id": "CMT-221-1",
        "author": "Marcus Sterling",
        "authorRole": "Manager",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        "text": "Due date passed on Oct 3. Needs migration dry-run on staging.",
        "timestamp": "2026-10-06 09:30"
      }
    ],
    "activityTimeline": [
      {
        "id": "ACT-221-1",
        "action": "Marked overdue by scheduler",
        "user": "System",
        "timestamp": "2026-10-04 00:00"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-09-20"
  },
  {
    "id": "TSK-222",
    "title": "OAuth2 Multi-Tenant Single Sign-On Gateway",
    "description": "Build SAML 2.0 and Okta integration layer with JWT token signing and rotation.",
    "assignedTo": "Devon Carter",
    "assignedToId": "EMP-1005",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Engineering",
    "project": "Enterprise SOC2 Compliance Audit",
    "projectId": "PRJ-103",
    "priority": "Critical",
    "status": "Completed",
    "startDate": "2026-08-25",
    "dueDate": "2026-09-18",
    "completionDate": "2026-09-16",
    "estimatedHours": 45,
    "actualHours": 42,
    "attachments": [],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-222-1",
        "action": "SAML endpoint verified with Okta sandbox",
        "user": "Devon Carter",
        "timestamp": "2026-09-16 14:00"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-08-25"
  },
  {
    "id": "TSK-223",
    "title": "Asynchronous Stripe Webhook Event Processor",
    "description": "Process payment_intent.succeeded with idempotent deduplication and dead-letter queue.",
    "assignedTo": "Devon Carter",
    "assignedToId": "EMP-1005",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Engineering",
    "project": "Automated Billing & Invoicing Engine",
    "projectId": "PRJ-106",
    "priority": "High",
    "status": "In Progress",
    "startDate": "2026-10-01",
    "dueDate": "2026-10-14",
    "completionDate": null,
    "estimatedHours": 20,
    "actualHours": 8,
    "attachments": [],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-223-1",
        "action": "Task in progress",
        "user": "Devon Carter",
        "timestamp": "2026-10-02 09:30"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-10-01"
  },
  {
    "id": "TSK-224",
    "title": "Containerize Microservices with Alpine Dockerfiles",
    "description": "Shrink node and go microservice containers from 850MB to under 95MB using multi-stage builds.",
    "assignedTo": "Devon Carter",
    "assignedToId": "EMP-1005",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Engineering",
    "project": "Cloud Infrastructure Migration v2.0",
    "projectId": "PRJ-101",
    "priority": "Medium",
    "status": "Completed",
    "startDate": "2026-08-10",
    "dueDate": "2026-08-25",
    "completionDate": "2026-08-23",
    "estimatedHours": 18,
    "actualHours": 15,
    "attachments": [],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-224-1",
        "action": "Images published to Amazon ECR",
        "user": "Devon Carter",
        "timestamp": "2026-08-23 17:00"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-08-10"
  },
  {
    "id": "TSK-225",
    "title": "Draft SOC2 Type II Audit Evidence Pack",
    "description": "Compile cryptographic key rotation policies and employee onboarding background checks.",
    "assignedTo": "Clara Oswald",
    "assignedToId": "EMP-1008",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Engineering",
    "project": "Enterprise SOC2 Compliance Audit",
    "projectId": "PRJ-103",
    "priority": "Critical",
    "status": "In Progress",
    "startDate": "2026-09-20",
    "dueDate": "2026-10-15",
    "completionDate": null,
    "estimatedHours": 35,
    "actualHours": 24,
    "attachments": [
      {
        "name": "soc2_evidence_checklist.xlsx",
        "size": "2.5 MB",
        "type": "excel"
      }
    ],
    "comments": [
      {
        "id": "CMT-225-1",
        "author": "Clara Oswald",
        "authorRole": "Employee",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        "text": "AWS CloudTrail immutable retention verified for 365 days.",
        "timestamp": "2026-10-04 14:15"
      }
    ],
    "activityTimeline": [
      {
        "id": "ACT-225-1",
        "action": "Auditor pack 80% populated",
        "user": "Clara Oswald",
        "timestamp": "2026-10-04 14:15"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-09-20"
  },
  {
    "id": "TSK-226",
    "title": "Configure Terraform Multi-Region VPC Peering",
    "description": "Automate zero-trust inter-region peering mesh between us-east-1 and eu-central-1.",
    "assignedTo": "Clara Oswald",
    "assignedToId": "EMP-1008",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Engineering",
    "project": "Cloud Infrastructure Migration v2.0",
    "projectId": "PRJ-101",
    "priority": "High",
    "status": "Completed",
    "startDate": "2026-08-18",
    "dueDate": "2026-09-08",
    "completionDate": "2026-09-06",
    "estimatedHours": 28,
    "actualHours": 27,
    "attachments": [],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-226-1",
        "action": "Terraform plan applied successfully",
        "user": "Clara Oswald",
        "timestamp": "2026-09-06 13:00"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-08-18"
  },
  {
    "id": "TSK-227",
    "title": "Automated Daily Database Snapshot Archival to S3 Glacier",
    "description": "Lifecycle transition rules to push RDS encrypted snapshots to Glacier Deep Archive after 30 days.",
    "assignedTo": "Clara Oswald",
    "assignedToId": "EMP-1008",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Engineering",
    "project": "Cloud Infrastructure Migration v2.0",
    "projectId": "PRJ-101",
    "priority": "Medium",
    "status": "Completed",
    "startDate": "2026-08-01",
    "dueDate": "2026-08-15",
    "completionDate": "2026-08-14",
    "estimatedHours": 16,
    "actualHours": 13,
    "attachments": [],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-227-1",
        "action": "Lifecycle rule tested and confirmed",
        "user": "Clara Oswald",
        "timestamp": "2026-08-14 11:00"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-08-01"
  },
  {
    "id": "TSK-228",
    "title": "Kubernetes Pod Autoscaler (HPA) Tuning",
    "description": "Set custom Prometheus metric triggers for CPU spike > 70% and memory footprint > 80%.",
    "assignedTo": "Clara Oswald",
    "assignedToId": "EMP-1008",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Engineering",
    "project": "Cloud Infrastructure Migration v2.0",
    "projectId": "PRJ-101",
    "priority": "High",
    "status": "Pending",
    "startDate": "2026-09-24",
    "dueDate": "2026-10-05",
    "completionDate": null,
    "estimatedHours": 22,
    "actualHours": 10,
    "attachments": [],
    "comments": [
      {
        "id": "CMT-228-1",
        "author": "Clara Oswald",
        "authorRole": "Employee",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        "text": "Load test simulator is waiting on staging DB replica sync.",
        "timestamp": "2026-10-05 16:00"
      }
    ],
    "activityTimeline": [
      {
        "id": "ACT-228-1",
        "action": "Overdue detected",
        "user": "System",
        "timestamp": "2026-10-06 00:00"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-09-24"
  },
  {
    "id": "TSK-229",
    "title": "Deploy Prometheus & Grafana Health Dashboard",
    "description": "Set up cluster alerting for node memory exhaustion, disk IOPS throttles, and HTTP 5xx spikes.",
    "assignedTo": "Clara Oswald",
    "assignedToId": "EMP-1008",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Engineering",
    "project": "Cloud Infrastructure Migration v2.0",
    "projectId": "PRJ-101",
    "priority": "Medium",
    "status": "Completed",
    "startDate": "2026-08-25",
    "dueDate": "2026-09-12",
    "completionDate": "2026-09-11",
    "estimatedHours": 20,
    "actualHours": 18,
    "attachments": [],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-229-1",
        "action": "Grafana dashboards shared with team",
        "user": "Clara Oswald",
        "timestamp": "2026-09-11 15:45"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-08-25"
  },
  {
    "id": "TSK-230",
    "title": "Automated SSL/TLS Certificate Auto-Renewal with Cert-Manager",
    "description": "Configure Let’s Encrypt DNS-01 challenge automation with Route53 IAM roles.",
    "assignedTo": "Clara Oswald",
    "assignedToId": "EMP-1008",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Engineering",
    "project": "Cloud Infrastructure Migration v2.0",
    "projectId": "PRJ-101",
    "priority": "Low",
    "status": "Completed",
    "startDate": "2026-09-01",
    "dueDate": "2026-09-15",
    "completionDate": "2026-09-13",
    "estimatedHours": 12,
    "actualHours": 11,
    "attachments": [],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-230-1",
        "action": "Cert renewals verified",
        "user": "Clara Oswald",
        "timestamp": "2026-09-13 10:20"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-09-01"
  },
  {
    "id": "TSK-231",
    "title": "Conduct Automated E2E Regression Suite",
    "description": "Run Cypress suite on staging branch before Q4 release candidate deployment.",
    "assignedTo": "Sarah Jenkins",
    "assignedToId": "EMP-1012",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Engineering",
    "project": "Next-Gen Mobile App Overhaul",
    "projectId": "PRJ-102",
    "priority": "High",
    "status": "Completed",
    "startDate": "2026-09-20",
    "dueDate": "2026-10-04",
    "completionDate": "2026-10-03",
    "estimatedHours": 26,
    "actualHours": 24,
    "attachments": [
      {
        "name": "cypress_test_matrix.html",
        "size": "4.2 MB",
        "type": "html"
      }
    ],
    "comments": [
      {
        "id": "CMT-231-1",
        "author": "Sarah Jenkins",
        "authorRole": "Employee",
        "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
        "text": "184 tests passed, 0 failures across Chromium and Safari WebKit.",
        "timestamp": "2026-10-03 16:30"
      }
    ],
    "activityTimeline": [
      {
        "id": "ACT-231-1",
        "action": "Report signed off for sprint release",
        "user": "Sarah Jenkins",
        "timestamp": "2026-10-03 17:00"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-09-20"
  },
  {
    "id": "TSK-232",
    "title": "Mobile Gesture & Pinch-to-Zoom Playwright Tests",
    "description": "Implement gesture automation for mobile pinch, pan, and card swipe interactions.",
    "assignedTo": "Sarah Jenkins",
    "assignedToId": "EMP-1012",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Engineering",
    "project": "Next-Gen Mobile App Overhaul",
    "projectId": "PRJ-102",
    "priority": "Medium",
    "status": "In Progress",
    "startDate": "2026-10-01",
    "dueDate": "2026-10-14",
    "completionDate": null,
    "estimatedHours": 20,
    "actualHours": 9,
    "attachments": [],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-232-1",
        "action": "In Progress",
        "user": "Sarah Jenkins",
        "timestamp": "2026-10-02 10:00"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-10-01"
  },
  {
    "id": "TSK-233",
    "title": "Payment Gateway Flaky Network Retry Test Harness",
    "description": "Simulate 3G packet drop and 504 gateway timeout to ensure user transactions are idempotent.",
    "assignedTo": "Sarah Jenkins",
    "assignedToId": "EMP-1012",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Engineering",
    "project": "Automated Billing & Invoicing Engine",
    "projectId": "PRJ-106",
    "priority": "Critical",
    "status": "Completed",
    "startDate": "2026-09-15",
    "dueDate": "2026-09-28",
    "completionDate": "2026-09-26",
    "estimatedHours": 25,
    "actualHours": 22,
    "attachments": [],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-233-1",
        "action": "Completed test run",
        "user": "Sarah Jenkins",
        "timestamp": "2026-09-26 14:00"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-09-15"
  },
  {
    "id": "TSK-234",
    "title": "Stress Load Testing with k6 (10,000 Virtual Users)",
    "description": "Run distributed k6 load test simulating simultaneous morning clock-in surges.",
    "assignedTo": "Sarah Jenkins",
    "assignedToId": "EMP-1012",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Engineering",
    "project": "Cloud Infrastructure Migration v2.0",
    "projectId": "PRJ-101",
    "priority": "High",
    "status": "Pending",
    "startDate": "2026-09-25",
    "dueDate": "2026-10-04",
    "completionDate": null,
    "estimatedHours": 28,
    "actualHours": 12,
    "attachments": [
      {
        "name": "k6_preliminary_results.json",
        "size": "890 KB",
        "type": "json"
      }
    ],
    "comments": [
      {
        "id": "CMT-234-1",
        "author": "Marcus Sterling",
        "authorRole": "Manager",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        "text": "This missed the deadline on Oct 4. Need peak load graphs today.",
        "timestamp": "2026-10-06 11:00"
      }
    ],
    "activityTimeline": [
      {
        "id": "ACT-234-1",
        "action": "Flagged overdue",
        "user": "System",
        "timestamp": "2026-10-05 00:00"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-09-25"
  },
  {
    "id": "TSK-235",
    "title": "Accessibility Automated Axe-Core CI Integration",
    "description": "Add axe-core scanner into pull request review workflow to block code breaking aria attributes.",
    "assignedTo": "Sarah Jenkins",
    "assignedToId": "EMP-1012",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Engineering",
    "project": "Next-Gen Mobile App Overhaul",
    "projectId": "PRJ-102",
    "priority": "Low",
    "status": "Completed",
    "startDate": "2026-09-02",
    "dueDate": "2026-09-16",
    "completionDate": "2026-09-15",
    "estimatedHours": 15,
    "actualHours": 14,
    "attachments": [],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-235-1",
        "action": "GitHub action live on main branch",
        "user": "Sarah Jenkins",
        "timestamp": "2026-09-15 11:30"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-09-02"
  },
  {
    "id": "TSK-236",
    "title": "Design Checkout & Payment Processing Modal",
    "description": "Deliver interactive prototypes in Figma for 3-step checkout with split card payments.",
    "assignedTo": "Aria Takahashi",
    "assignedToId": "EMP-1006",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Product & Design",
    "project": "Automated Billing & Invoicing Engine",
    "projectId": "PRJ-106",
    "priority": "Medium",
    "status": "Completed",
    "startDate": "2026-09-15",
    "dueDate": "2026-10-04",
    "completionDate": "2026-10-03",
    "estimatedHours": 28,
    "actualHours": 25,
    "attachments": [
      {
        "name": "checkout_figma_handoff.pdf",
        "size": "5.6 MB",
        "type": "pdf"
      }
    ],
    "comments": [
      {
        "id": "CMT-236-1",
        "author": "Aria Takahashi",
        "authorRole": "Employee",
        "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
        "text": "All states including 3D Secure verification flows designed.",
        "timestamp": "2026-10-03 14:00"
      }
    ],
    "activityTimeline": [
      {
        "id": "ACT-236-1",
        "action": "Handoff complete to frontend engineers",
        "user": "Aria Takahashi",
        "timestamp": "2026-10-03 15:00"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-09-15"
  },
  {
    "id": "TSK-237",
    "title": "Design System Token Library Expansion for iOS & Android",
    "description": "Publish Figma variable collections synced with Tailwind CSS 3.4 design tokens.",
    "assignedTo": "Aria Takahashi",
    "assignedToId": "EMP-1006",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Product & Design",
    "project": "Next-Gen Mobile App Overhaul",
    "projectId": "PRJ-102",
    "priority": "High",
    "status": "Completed",
    "startDate": "2026-08-20",
    "dueDate": "2026-09-10",
    "completionDate": "2026-09-08",
    "estimatedHours": 30,
    "actualHours": 28,
    "attachments": [],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-237-1",
        "action": "Design tokens exported",
        "user": "Aria Takahashi",
        "timestamp": "2026-09-08 17:00"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-08-20"
  },
  {
    "id": "TSK-238",
    "title": "Customer Onboarding Walkthrough User Journey Map",
    "description": "Map friction points and completion rate drop-offs for first-time SaaS platform users.",
    "assignedTo": "Aria Takahashi",
    "assignedToId": "EMP-1006",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Product & Design",
    "project": "Omnichannel Customer Support Hub",
    "projectId": "PRJ-107",
    "priority": "Medium",
    "status": "In Progress",
    "startDate": "2026-09-26",
    "dueDate": "2026-10-11",
    "completionDate": null,
    "estimatedHours": 22,
    "actualHours": 14,
    "attachments": [
      {
        "name": "user_journey_onboarding_v2.pdf",
        "size": "3.1 MB",
        "type": "pdf"
      }
    ],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-238-1",
        "action": "Interviews completed with 8 beta customers",
        "user": "Aria Takahashi",
        "timestamp": "2026-10-02 12:00"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-09-26"
  },
  {
    "id": "TSK-239",
    "title": "Mobile Navigation Bottom Sheet Micro-Interactions",
    "description": "Prototype spring physics and haptic vibration feedback for swipe-to-dismiss sheets.",
    "assignedTo": "Aria Takahashi",
    "assignedToId": "EMP-1006",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Product & Design",
    "project": "Next-Gen Mobile App Overhaul",
    "projectId": "PRJ-102",
    "priority": "Low",
    "status": "Completed",
    "startDate": "2026-09-01",
    "dueDate": "2026-09-18",
    "completionDate": "2026-09-16",
    "estimatedHours": 16,
    "actualHours": 15,
    "attachments": [],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-239-1",
        "action": "Approved by mobile lead",
        "user": "Aria Takahashi",
        "timestamp": "2026-09-16 16:30"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-09-01"
  },
  {
    "id": "TSK-240",
    "title": "Customer Feedback Rating Widget (CSAT & NPS)",
    "description": "Design dynamic 5-star and 10-point NPS interactive survey modal with emoji animations.",
    "assignedTo": "Aria Takahashi",
    "assignedToId": "EMP-1006",
    "assignedManager": "Marcus Sterling",
    "assignedManagerId": "EMP-1003",
    "department": "Product & Design",
    "project": "Omnichannel Customer Support Hub",
    "projectId": "PRJ-107",
    "priority": "Medium",
    "status": "Pending",
    "startDate": "2026-09-22",
    "dueDate": "2026-10-03",
    "completionDate": null,
    "estimatedHours": 18,
    "actualHours": 6,
    "attachments": [],
    "comments": [
      {
        "id": "CMT-240-1",
        "author": "Marcus Sterling",
        "authorRole": "Manager",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        "text": "This was due on Oct 3 and is currently overdue. Let us finish the prototypes.",
        "timestamp": "2026-10-05 14:00"
      }
    ],
    "activityTimeline": [
      {
        "id": "ACT-240-1",
        "action": "Overdue detected",
        "user": "System",
        "timestamp": "2026-10-04 00:00"
      }
    ],
    "createdBy": "Marcus Sterling",
    "createdDate": "2026-09-22"
  },
  {
    "id": "TSK-241",
    "title": "Screen Senior Cloud DevOps Engineer Candidates",
    "description": "Resume review and initial cultural fit screening for 45 incoming applicant profiles.",
    "assignedTo": "Zoe Kravitz-Lin",
    "assignedToId": "EMP-1010",
    "assignedManager": "Sophia Montgomery",
    "assignedManagerId": "EMP-1002",
    "department": "Human Resources",
    "project": "Global Workforce Upskilling 2026",
    "projectId": "PRJ-104",
    "priority": "High",
    "status": "Completed",
    "startDate": "2026-09-18",
    "dueDate": "2026-10-02",
    "completionDate": "2026-10-01",
    "estimatedHours": 24,
    "actualHours": 22,
    "attachments": [
      {
        "name": "shortlisted_candidates.xlsx",
        "size": "1.8 MB",
        "type": "excel"
      }
    ],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-241-1",
        "action": "6 candidates advanced to technical panel",
        "user": "Zoe Kravitz-Lin",
        "timestamp": "2026-10-01 16:00"
      }
    ],
    "createdBy": "Sophia Montgomery",
    "createdDate": "2026-09-18"
  },
  {
    "id": "TSK-242",
    "title": "Organize October Engineering Tech Talk on Generative AI",
    "description": "Coordinate speaker deck, conference room A/V, and catering for company-wide lunch & learn.",
    "assignedTo": "Zoe Kravitz-Lin",
    "assignedToId": "EMP-1010",
    "assignedManager": "Sophia Montgomery",
    "assignedManagerId": "EMP-1002",
    "department": "Human Resources",
    "project": "Global Workforce Upskilling 2026",
    "projectId": "PRJ-104",
    "priority": "Medium",
    "status": "In Progress",
    "startDate": "2026-09-28",
    "dueDate": "2026-10-14",
    "completionDate": null,
    "estimatedHours": 16,
    "actualHours": 8,
    "attachments": [],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-242-1",
        "action": "Guest keynote speaker confirmed",
        "user": "Zoe Kravitz-Lin",
        "timestamp": "2026-10-03 11:30"
      }
    ],
    "createdBy": "Sophia Montgomery",
    "createdDate": "2026-09-28"
  },
  {
    "id": "TSK-243",
    "title": "Audit Employee Wellness Benefit Enrollment Records",
    "description": "Reconcile healthcare insurance enrollment files with monthly benefits invoice statements.",
    "assignedTo": "Zoe Kravitz-Lin",
    "assignedToId": "EMP-1010",
    "assignedManager": "Sophia Montgomery",
    "assignedManagerId": "EMP-1002",
    "department": "Human Resources",
    "project": "Global Workforce Upskilling 2026",
    "projectId": "PRJ-104",
    "priority": "High",
    "status": "Pending",
    "startDate": "2026-09-15",
    "dueDate": "2026-09-30",
    "completionDate": null,
    "estimatedHours": 20,
    "actualHours": 8,
    "attachments": [],
    "comments": [
      {
        "id": "CMT-243-1",
        "author": "Sophia Montgomery",
        "authorRole": "HR Head",
        "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
        "text": "Insurance provider needs the final file! Please submit by tomorrow.",
        "timestamp": "2026-10-04 09:00"
      }
    ],
    "activityTimeline": [
      {
        "id": "ACT-243-1",
        "action": "Marked overdue",
        "user": "System",
        "timestamp": "2026-10-01 00:00"
      }
    ],
    "createdBy": "Sophia Montgomery",
    "createdDate": "2026-09-15"
  },
  {
    "id": "TSK-244",
    "title": "AI Resume Keyword Matching Parser Test Dataset",
    "description": "Assemble 100 anonymized resume vectors to evaluate talent matching accuracy.",
    "assignedTo": "Zoe Kravitz-Lin",
    "assignedToId": "EMP-1010",
    "assignedManager": "Sophia Montgomery",
    "assignedManagerId": "EMP-1002",
    "department": "Human Resources",
    "project": "AI Predictive Talent Matching Engine",
    "projectId": "PRJ-108",
    "priority": "Critical",
    "status": "Completed",
    "startDate": "2026-09-08",
    "dueDate": "2026-09-25",
    "completionDate": "2026-09-23",
    "estimatedHours": 30,
    "actualHours": 26,
    "attachments": [],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-244-1",
        "action": "Vector embeddings generated",
        "user": "Zoe Kravitz-Lin",
        "timestamp": "2026-09-23 15:00"
      }
    ],
    "createdBy": "Sophia Montgomery",
    "createdDate": "2026-09-08"
  },
  {
    "id": "TSK-245",
    "title": "Publish Annual Employee Satisfaction Survey (Pulse 2026)",
    "description": "Deploy 24-question survey gauging psychological safety, work-life balance, and management clarity.",
    "assignedTo": "Zoe Kravitz-Lin",
    "assignedToId": "EMP-1010",
    "assignedManager": "Sophia Montgomery",
    "assignedManagerId": "EMP-1002",
    "department": "Human Resources",
    "project": "Global Workforce Upskilling 2026",
    "projectId": "PRJ-104",
    "priority": "Medium",
    "status": "Completed",
    "startDate": "2026-08-20",
    "dueDate": "2026-09-05",
    "completionDate": "2026-09-04",
    "estimatedHours": 18,
    "actualHours": 16,
    "attachments": [],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-245-1",
        "action": "Survey delivered to 112 employees",
        "user": "Zoe Kravitz-Lin",
        "timestamp": "2026-09-04 10:00"
      }
    ],
    "createdBy": "Sophia Montgomery",
    "createdDate": "2026-08-20"
  },
  {
    "id": "TSK-246",
    "title": "Q3 Enterprise Closed-Won Revenue Audit",
    "description": "Audit closed enterprise contracts for ₹4.2 Crore pipeline and customer onboarding terms.",
    "assignedTo": "Julian Hayes",
    "assignedToId": "EMP-1007",
    "assignedManager": "Saurabh Kumar",
    "assignedManagerId": "EMP-1001",
    "department": "Sales & Marketing",
    "project": "Q3 Enterprise Sales Acceleration",
    "projectId": "PRJ-105",
    "priority": "Critical",
    "status": "Completed",
    "startDate": "2026-09-01",
    "dueDate": "2026-09-30",
    "completionDate": "2026-09-29",
    "estimatedHours": 40,
    "actualHours": 38,
    "attachments": [
      {
        "name": "enterprise_deals_q3_summary.pdf",
        "size": "3.4 MB",
        "type": "pdf"
      }
    ],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-246-1",
        "action": "Signed contracts reconciled",
        "user": "Julian Hayes",
        "timestamp": "2026-09-29 18:00"
      }
    ],
    "createdBy": "Saurabh Kumar",
    "createdDate": "2026-09-01"
  },
  {
    "id": "TSK-247",
    "title": "Enterprise Tier SaaS Pricing Calculator",
    "description": "Build interactive quoting sheet with tiered user volume discounts and custom SLA add-ons.",
    "assignedTo": "Julian Hayes",
    "assignedToId": "EMP-1007",
    "assignedManager": "Saurabh Kumar",
    "assignedManagerId": "EMP-1001",
    "department": "Sales & Marketing",
    "project": "Q3 Enterprise Sales Acceleration",
    "projectId": "PRJ-105",
    "priority": "High",
    "status": "In Progress",
    "startDate": "2026-09-24",
    "dueDate": "2026-10-15",
    "completionDate": null,
    "estimatedHours": 24,
    "actualHours": 16,
    "attachments": [],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-247-1",
        "action": "Draft calculator shared with sales reps",
        "user": "Julian Hayes",
        "timestamp": "2026-10-03 14:00"
      }
    ],
    "createdBy": "Saurabh Kumar",
    "createdDate": "2026-09-24"
  },
  {
    "id": "TSK-248",
    "title": "Outbound Cold Email Sequence Personalization",
    "description": "Set up Apollo.io automated 4-step sequence targeting VP of Engineering at Fortune 500 tech firms.",
    "assignedTo": "Julian Hayes",
    "assignedToId": "EMP-1007",
    "assignedManager": "Saurabh Kumar",
    "assignedManagerId": "EMP-1001",
    "department": "Sales & Marketing",
    "project": "Q3 Enterprise Sales Acceleration",
    "projectId": "PRJ-105",
    "priority": "Medium",
    "status": "Pending",
    "startDate": "2026-09-18",
    "dueDate": "2026-10-02",
    "completionDate": null,
    "estimatedHours": 20,
    "actualHours": 8,
    "attachments": [],
    "comments": [
      {
        "id": "CMT-248-1",
        "author": "Saurabh Kumar",
        "authorRole": "Owner",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        "text": "This sequence is overdue. What is holding back email verification?",
        "timestamp": "2026-10-04 10:30"
      }
    ],
    "activityTimeline": [
      {
        "id": "ACT-248-1",
        "action": "Flagged overdue",
        "user": "System",
        "timestamp": "2026-10-03 00:00"
      }
    ],
    "createdBy": "Saurabh Kumar",
    "createdDate": "2026-09-18"
  },
  {
    "id": "TSK-249",
    "title": "G2 & Gartner Peer Insights Review Drive",
    "description": "Engage 25 champion clients to submit verified reviews on G2 Crowd to improve category ranking.",
    "assignedTo": "Julian Hayes",
    "assignedToId": "EMP-1007",
    "assignedManager": "Saurabh Kumar",
    "assignedManagerId": "EMP-1001",
    "department": "Sales & Marketing",
    "project": "Q3 Enterprise Sales Acceleration",
    "projectId": "PRJ-105",
    "priority": "Low",
    "status": "Completed",
    "startDate": "2026-08-15",
    "dueDate": "2026-09-10",
    "completionDate": "2026-09-09",
    "estimatedHours": 16,
    "actualHours": 14,
    "attachments": [],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-249-1",
        "action": "G2 badge Leader Fall 2026 unlocked",
        "user": "Julian Hayes",
        "timestamp": "2026-09-09 17:00"
      }
    ],
    "createdBy": "Saurabh Kumar",
    "createdDate": "2026-08-15"
  },
  {
    "id": "TSK-250",
    "title": "Finalize Q3 Commission Calculations",
    "description": "Review CRM closed-won deal values and disburse incentive structures for sales executives.",
    "assignedTo": "Liam Hemsworth-Brown",
    "assignedToId": "EMP-1009",
    "assignedManager": "Saurabh Kumar",
    "assignedManagerId": "EMP-1001",
    "department": "Finance & Accounts",
    "project": "Automated Billing & Invoicing Engine",
    "projectId": "PRJ-106",
    "priority": "High",
    "status": "Completed",
    "startDate": "2026-09-22",
    "dueDate": "2026-10-03",
    "completionDate": "2026-10-02",
    "estimatedHours": 24,
    "actualHours": 21,
    "attachments": [
      {
        "name": "sales_commissions_q3.xlsx",
        "size": "2.8 MB",
        "type": "excel"
      }
    ],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-250-1",
        "action": "Commissions processed to payroll ledger",
        "user": "Liam Hemsworth-Brown",
        "timestamp": "2026-10-02 18:30"
      }
    ],
    "createdBy": "Saurabh Kumar",
    "createdDate": "2026-09-22"
  },
  {
    "id": "TSK-251",
    "title": "Automated GST & TDS Reconciliation Statement",
    "description": "Generate electronic TDS Form 26Q and GST GSTR-1 monthly filing tax statements.",
    "assignedTo": "Liam Hemsworth-Brown",
    "assignedToId": "EMP-1009",
    "assignedManager": "Saurabh Kumar",
    "assignedManagerId": "EMP-1001",
    "department": "Finance & Accounts",
    "project": "Automated Billing & Invoicing Engine",
    "projectId": "PRJ-106",
    "priority": "Critical",
    "status": "In Progress",
    "startDate": "2026-09-28",
    "dueDate": "2026-10-10",
    "completionDate": null,
    "estimatedHours": 28,
    "actualHours": 19,
    "attachments": [],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-251-1",
        "action": "Draft returns generated from ERP ledger",
        "user": "Liam Hemsworth-Brown",
        "timestamp": "2026-10-04 15:00"
      }
    ],
    "createdBy": "Saurabh Kumar",
    "createdDate": "2026-09-28"
  },
  {
    "id": "TSK-252",
    "title": "Stripe Merchant Account Payout Reconciliation",
    "description": "Reconcile ₹1.8 Crore gross card payments against daily bank account credit alerts.",
    "assignedTo": "Liam Hemsworth-Brown",
    "assignedToId": "EMP-1009",
    "assignedManager": "Saurabh Kumar",
    "assignedManagerId": "EMP-1001",
    "department": "Finance & Accounts",
    "project": "Automated Billing & Invoicing Engine",
    "projectId": "PRJ-106",
    "priority": "Medium",
    "status": "Completed",
    "startDate": "2026-09-01",
    "dueDate": "2026-09-18",
    "completionDate": "2026-09-17",
    "estimatedHours": 20,
    "actualHours": 19,
    "attachments": [],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-252-1",
        "action": "No discrepancies detected",
        "user": "Liam Hemsworth-Brown",
        "timestamp": "2026-09-17 14:00"
      }
    ],
    "createdBy": "Saurabh Kumar",
    "createdDate": "2026-09-01"
  },
  {
    "id": "TSK-253",
    "title": "Audit Employee Expense Reimbursement Claims",
    "description": "Verify travel receipts and hotel per-diem vouchers submitted during Q3 client summits.",
    "assignedTo": "Liam Hemsworth-Brown",
    "assignedToId": "EMP-1009",
    "assignedManager": "Saurabh Kumar",
    "assignedManagerId": "EMP-1001",
    "department": "Finance & Accounts",
    "project": "Automated Billing & Invoicing Engine",
    "projectId": "PRJ-106",
    "priority": "Low",
    "status": "Pending",
    "startDate": "2026-09-16",
    "dueDate": "2026-09-30",
    "completionDate": null,
    "estimatedHours": 15,
    "actualHours": 5,
    "attachments": [],
    "comments": [
      {
        "id": "CMT-253-1",
        "author": "Saurabh Kumar",
        "authorRole": "Owner",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        "text": "Overdue! Employees are waiting for reimbursement credits.",
        "timestamp": "2026-10-04 12:00"
      }
    ],
    "activityTimeline": [
      {
        "id": "ACT-253-1",
        "action": "Flagged overdue",
        "user": "System",
        "timestamp": "2026-10-01 00:00"
      }
    ],
    "createdBy": "Saurabh Kumar",
    "createdDate": "2026-09-16"
  },
  {
    "id": "TSK-254",
    "title": "Implement Omnichannel Zendesk Ticket Auto-Tagging",
    "description": "Classify incoming customer tickets automatically into Billing, Bugs, or Feature Requests.",
    "assignedTo": "Nate Chen",
    "assignedToId": "EMP-1011",
    "assignedManager": "Saurabh Kumar",
    "assignedManagerId": "EMP-1001",
    "department": "Customer Success",
    "project": "Omnichannel Customer Support Hub",
    "projectId": "PRJ-107",
    "priority": "High",
    "status": "Completed",
    "startDate": "2026-09-10",
    "dueDate": "2026-09-28",
    "completionDate": "2026-09-26",
    "estimatedHours": 24,
    "actualHours": 20,
    "attachments": [],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-254-1",
        "action": "Rules configured and active in production",
        "user": "Nate Chen",
        "timestamp": "2026-09-26 16:00"
      }
    ],
    "createdBy": "Saurabh Kumar",
    "createdDate": "2026-09-10"
  },
  {
    "id": "TSK-255",
    "title": "Customer Success Onboarding Playbook Refresh",
    "description": "Update PDF guides and Loom demo videos for 14-day customer launch milestone.",
    "assignedTo": "Nate Chen",
    "assignedToId": "EMP-1011",
    "assignedManager": "Saurabh Kumar",
    "assignedManagerId": "EMP-1001",
    "department": "Customer Success",
    "project": "Omnichannel Customer Support Hub",
    "projectId": "PRJ-107",
    "priority": "Medium",
    "status": "In Progress",
    "startDate": "2026-09-25",
    "dueDate": "2026-10-12",
    "completionDate": null,
    "estimatedHours": 18,
    "actualHours": 11,
    "attachments": [
      {
        "name": "onboarding_playbook_2026.pdf",
        "size": "4.8 MB",
        "type": "pdf"
      }
    ],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-255-1",
        "action": "Playbook v2 draft compiled",
        "user": "Nate Chen",
        "timestamp": "2026-10-03 15:00"
      }
    ],
    "createdBy": "Saurabh Kumar",
    "createdDate": "2026-09-25"
  },
  {
    "id": "TSK-256",
    "title": "Resolve Enterprise SLA Escaped Incidents Review",
    "description": "Conduct root-cause analysis on 2 high-priority tickets that breached 4-hour response SLA.",
    "assignedTo": "Nate Chen",
    "assignedToId": "EMP-1011",
    "assignedManager": "Saurabh Kumar",
    "assignedManagerId": "EMP-1001",
    "department": "Customer Success",
    "project": "Omnichannel Customer Support Hub",
    "projectId": "PRJ-107",
    "priority": "Critical",
    "status": "Pending",
    "startDate": "2026-09-20",
    "dueDate": "2026-10-04",
    "completionDate": null,
    "estimatedHours": 14,
    "actualHours": 6,
    "attachments": [],
    "comments": [
      {
        "id": "CMT-256-1",
        "author": "Saurabh Kumar",
        "authorRole": "Owner",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        "text": "This missed the deadline on Oct 4. Need this analysis for the executive board.",
        "timestamp": "2026-10-05 10:00"
      }
    ],
    "activityTimeline": [
      {
        "id": "ACT-256-1",
        "action": "Flagged overdue",
        "user": "System",
        "timestamp": "2026-10-05 00:00"
      }
    ],
    "createdBy": "Saurabh Kumar",
    "createdDate": "2026-09-20"
  },
  {
    "id": "TSK-257",
    "title": "SOC2 External Penetration Testing Final Sign-off",
    "description": "Review third-party red-team penetration testing report and authorize remediations.",
    "assignedTo": "Marcus Sterling",
    "assignedToId": "EMP-1003",
    "assignedManager": "Saurabh Kumar",
    "assignedManagerId": "EMP-1001",
    "department": "Engineering",
    "project": "Enterprise SOC2 Compliance Audit",
    "projectId": "PRJ-103",
    "priority": "Critical",
    "status": "In Progress",
    "startDate": "2026-09-28",
    "dueDate": "2026-10-15",
    "completionDate": null,
    "estimatedHours": 20,
    "actualHours": 14,
    "attachments": [
      {
        "name": "pentest_executive_summary.pdf",
        "size": "3.6 MB",
        "type": "pdf"
      }
    ],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-257-1",
        "action": "Pen test review underway",
        "user": "Marcus Sterling",
        "timestamp": "2026-10-02 11:00"
      }
    ],
    "createdBy": "Saurabh Kumar",
    "createdDate": "2026-09-28"
  },
  {
    "id": "TSK-258",
    "title": "Q4 Annual Compensation Review & Band Calibration",
    "description": "Calibrate engineering and business unit salary benchmark adjustments across tier-1 cities.",
    "assignedTo": "Sophia Montgomery",
    "assignedToId": "EMP-1002",
    "assignedManager": "Saurabh Kumar",
    "assignedManagerId": "EMP-1001",
    "department": "Human Resources",
    "project": "Global Workforce Upskilling 2026",
    "projectId": "PRJ-104",
    "priority": "High",
    "status": "In Progress",
    "startDate": "2026-09-25",
    "dueDate": "2026-10-18",
    "completionDate": null,
    "estimatedHours": 35,
    "actualHours": 20,
    "attachments": [
      {
        "name": "compensation_bands_2026.xlsx",
        "size": "2.1 MB",
        "type": "excel"
      }
    ],
    "comments": [],
    "activityTimeline": [
      {
        "id": "ACT-258-1",
        "action": "Market parity analysis conducted",
        "user": "Sophia Montgomery",
        "timestamp": "2026-10-01 16:30"
      }
    ],
    "createdBy": "Saurabh Kumar",
    "createdDate": "2026-09-25"
  }
];
