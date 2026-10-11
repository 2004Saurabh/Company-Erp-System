import { query, execute } from './db.js';
import { INITIAL_USERS } from '../../src/data/users.js';
import { INITIAL_EMPLOYEES } from '../../src/data/employees.js';
import { INITIAL_DEPARTMENTS } from '../../src/data/departments.js';
import { INITIAL_PROJECTS } from '../../src/data/projects.js';
import { INITIAL_TASKS } from '../../src/data/tasks.js';
import { INITIAL_ATTENDANCE } from '../../src/data/attendance.js';
import { INITIAL_ID_CARD_REQUESTS } from '../../src/data/idCards.js';
import {
  INITIAL_INVENTORY_PRODUCTS,
  INITIAL_INVENTORY_SUPPLIERS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_STOCK_MOVEMENTS
} from '../../src/data/inventory.js';
import { INITIAL_LEAVES, INITIAL_LEAVE_BALANCES } from '../../src/data/leaves.js';
import { INITIAL_PAYROLL } from '../../src/data/payroll.js';
import { INITIAL_ANNOUNCEMENTS } from '../../src/data/announcements.js';
import { INITIAL_NOTIFICATIONS } from '../../src/data/notifications.js';
import { INITIAL_AUDIT_LOGS } from '../../src/data/auditLogs.js';
import { INITIAL_COMPANY_WIFIS } from '../../src/data/wifiNetworks.js';
import { INITIAL_JOB_OPENINGS, INITIAL_CANDIDATES } from '../../src/data/recruitment.js';
import { INITIAL_PERFORMANCE } from '../../src/data/performance.js';

export const seedDatabase = async () => {
  console.log('🌱 Checking SQLite database seed status...');

  // 1. Users
  const usersCount = await query('SELECT COUNT(*) as count FROM users');
  if (usersCount[0].count === 0) {
    console.log('🌱 Seeding users...');
    for (const u of INITIAL_USERS) {
      await execute(
        `INSERT INTO users (id, name, email, password, role, title, department, phone, avatar, joiningDate, status, location, emergencyContact, employeeId)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [u.id, u.name, u.email, u.password || 'password123', u.role, u.title, u.department, u.phone, u.avatar, u.joiningDate, u.status || 'Active', u.location, u.emergencyContact, u.employeeId || null]
      );
    }
  }

  // 2. Employees
  const empCount = await query('SELECT COUNT(*) as count FROM employees');
  if (empCount[0].count === 0) {
    console.log('🌱 Seeding employees...');
    for (const e of INITIAL_EMPLOYEES) {
      await execute(
        `INSERT INTO employees (id, name, email, role, department, designation, salary, phone, joinDate, status, avatar, managerId, location, skills, performanceScore)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [e.id, e.name || e.fullName, e.email, e.role, e.department, e.designation, e.salary || 0, e.phone, e.joinDate, e.status || 'Active', e.avatar, e.managerId, e.location, JSON.stringify(e.skills || []), e.performanceScore || 4.2]
      );
    }
  }

  // 3. Departments
  const deptCount = await query('SELECT COUNT(*) as count FROM departments');
  if (deptCount[0].count === 0) {
    console.log('🌱 Seeding departments...');
    for (const d of INITIAL_DEPARTMENTS) {
      await execute(
        `INSERT INTO departments (id, name, head, headId, employeeCount, budget, color, icon, description)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [d.id, d.name, d.head, d.headId, d.employeeCount || 0, d.budget || 0, d.color, d.icon, d.description]
      );
    }
  }

  // 4. Projects
  const prjCount = await query('SELECT COUNT(*) as count FROM projects');
  if (prjCount[0].count === 0) {
    console.log('🌱 Seeding projects...');
    for (const p of INITIAL_PROJECTS) {
      await execute(
        `INSERT INTO projects (id, name, department, departmentId, managerId, status, progress, budget, spent, startDate, deadline, team, priority, description)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.id, p.name, p.department, p.departmentId, p.managerId, p.status || 'In Progress', p.progress || 0, p.budget || 0, p.spent || 0, p.startDate, p.deadline, JSON.stringify(p.team || []), p.priority || 'Medium', p.description]
      );
    }
  }

  // 5. Tasks
  const taskCount = await query('SELECT COUNT(*) as count FROM tasks');
  if (taskCount[0].count === 0) {
    console.log('🌱 Seeding tasks...');
    for (const t of INITIAL_TASKS) {
      await execute(
        `INSERT INTO tasks (id, title, description, assignedTo, assignedToId, assignedManager, assignedManagerId, department, project, projectId, priority, status, startDate, dueDate, completionDate, estimatedHours, actualHours, tags, comments, attachments, createdBy, createdDate)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          t.id, t.title, t.description, t.assignedTo, t.assignedToId,
          t.assignedManager, t.assignedManagerId, t.department, t.project, t.projectId,
          t.priority || 'Medium', t.status || 'Pending', t.startDate, t.dueDate,
          t.completionDate || null, t.estimatedHours || 0, t.actualHours || 0,
          JSON.stringify(t.tags || []), JSON.stringify(t.comments || []),
          JSON.stringify(t.attachments || []), t.createdBy, t.createdDate
        ]
      );
    }
  }

  // 6. Attendance
  const attCount = await query('SELECT COUNT(*) as count FROM attendance');
  if (attCount[0].count === 0) {
    console.log('🌱 Seeding attendance...');
    for (const a of INITIAL_ATTENDANCE) {
      await execute(
        `INSERT INTO attendance (id, employeeId, employeeName, date, checkIn, checkOut, workHours, status, isWFH, workMode, networkName, networkVerified, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          a.id, a.employeeId, a.employeeName, a.date, a.checkIn, a.checkOut,
          a.workHours || 0, a.status || 'Present', a.isWFH ? 1 : 0,
          a.workMode || 'In Office', a.networkName || null,
          a.networkVerified !== false ? 1 : 0, a.notes || null
        ]
      );
    }
  }

  // 7. WFH Authorized Initial Employees
  const wfhCount = await query('SELECT COUNT(*) as count FROM wfh_authorized');
  if (wfhCount[0].count === 0) {
    console.log('🌱 Seeding WFH authorizations...');
    const INITIAL_WFH_AUTHORIZED = [
      {
        id: 'WFH-AUTH-1001',
        employeeId: 'EMP-1004',
        employeeName: 'Elena Rostova',
        department: 'Engineering',
        designation: 'Senior Frontend Engineer',
        authorizedBy: 'Administrator (Saurabh Kumar)',
        authorizedDate: '2026-09-28',
        validUntil: '2026-10-31',
        status: 'Authorized',
        reason: 'Remote Project Sprint Delivery (Austin/Remote)',
        idCardVerified: 1,
        notes: 'Official Admin ID authorization for remote geofence exemption'
      },
      {
        id: 'WFH-AUTH-1002',
        employeeId: 'EMP-1008',
        employeeName: 'Clara Oswald',
        department: 'Engineering',
        designation: 'Staff Backend Architect',
        authorizedBy: 'Administrator (Saurabh Kumar)',
        authorizedDate: '2026-09-25',
        validUntil: '2026-10-31',
        status: 'Authorized',
        reason: 'Cloud Infrastructure Migration & Remote Standup',
        idCardVerified: 1,
        notes: 'Admin pre-approved WFH ID access'
      }
    ];
    for (const w of INITIAL_WFH_AUTHORIZED) {
      await execute(
        `INSERT INTO wfh_authorized (id, employeeId, employeeName, department, designation, authorizedBy, authorizedDate, validUntil, status, reason, idCardVerified, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [w.id, w.employeeId, w.employeeName, w.department, w.designation, w.authorizedBy, w.authorizedDate, w.validUntil, w.status, w.reason, w.idCardVerified, w.notes]
      );
    }
  }

  // 8. ID Card Requests
  const idcCount = await query('SELECT COUNT(*) as count FROM id_card_requests');
  if (idcCount[0].count === 0) {
    console.log('🌱 Seeding ID card requests...');
    for (const r of INITIAL_ID_CARD_REQUESTS) {
      await execute(
        `INSERT INTO id_card_requests (id, employeeId, employeeName, department, designation, photo, status, requestDate, issuedDate, serialNumber, rfidCode, approvedBy, qrData, reason, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          r.id, r.employeeId, r.employeeName, r.department, r.designation,
          r.photo, r.status, r.requestDate, r.issuedDate || null,
          r.serialNumber || null, r.rfidCode || null, r.approvedBy || null,
          r.qrData || null, r.reason || null, r.notes || null
        ]
      );
    }
  }

  // 9. Leaves & Leave Balances
  const leavesCount = await query('SELECT COUNT(*) as count FROM leaves');
  if (leavesCount[0].count === 0) {
    console.log('🌱 Seeding leaves...');
    for (const l of INITIAL_LEAVES) {
      await execute(
        `INSERT INTO leaves (id, employeeId, employeeName, leaveType, startDate, endDate, days, reason, status, appliedDate, reviewedBy)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [l.id, l.employeeId, l.employeeName, l.leaveType, l.startDate, l.endDate, l.days || 1, l.reason, l.status, l.appliedDate, l.reviewedBy || null]
      );
    }
  }

  const lbCount = await query('SELECT COUNT(*) as count FROM leave_balances');
  if (lbCount[0].count === 0) {
    console.log('🌱 Seeding leave balances...');
    for (const [empId, bal] of Object.entries(INITIAL_LEAVE_BALANCES)) {
      await execute(
        `INSERT INTO leave_balances (id, employeeId, casual, sick, paid, total)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [`LB-${empId}`, empId, bal.casual || 12, bal.sick || 10, bal.paid || 18, (bal.casual || 12) + (bal.sick || 10) + (bal.paid || 18)]
      );
    }
  }

  // 10. Payroll
  const payCount = await query('SELECT COUNT(*) as count FROM payroll');
  if (payCount[0].count === 0) {
    console.log('🌱 Seeding payroll...');
    for (const p of INITIAL_PAYROLL) {
      await execute(
        `INSERT INTO payroll (id, employeeId, employeeName, month, basicSalary, allowances, deductions, netSalary, status, paymentDate)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.id, p.employeeId, p.employeeName, p.month, p.basicSalary, p.allowances || 0, p.deductions || 0, p.netSalary, p.status || 'Paid', p.paymentDate]
      );
    }
  }

  // 11. Inventory: Products, Suppliers, POs, Movements
  const invPrdCount = await query('SELECT COUNT(*) as count FROM inventory_products');
  if (invPrdCount[0].count === 0) {
    console.log('🌱 Seeding inventory products...');
    for (const ip of INITIAL_INVENTORY_PRODUCTS) {
      await execute(
        `INSERT INTO inventory_products (id, sku, name, category, quantity, minThreshold, unit, costPrice, sellingPrice, warehouseLocation, supplier, description, status, lastRestocked)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [ip.id, ip.sku, ip.name, ip.category, ip.quantity, ip.minThreshold, ip.unit || 'units', ip.costPrice, ip.sellingPrice, ip.warehouseLocation, ip.supplier, ip.description, ip.status, ip.lastRestocked]
      );
    }
  }

  const invSupCount = await query('SELECT COUNT(*) as count FROM inventory_suppliers');
  if (invSupCount[0].count === 0) {
    console.log('🌱 Seeding inventory suppliers...');
    for (const is of INITIAL_INVENTORY_SUPPLIERS) {
      await execute(
        `INSERT INTO inventory_suppliers (id, name, contactPerson, email, phone, city, categories, paymentTerms, rating, status, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [is.id, is.name, is.contactPerson, is.email, is.phone, is.city, JSON.stringify(is.categories || []), is.paymentTerms, is.rating, is.status, is.notes]
      );
    }
  }

  const invPoCount = await query('SELECT COUNT(*) as count FROM inventory_purchase_orders');
  if (invPoCount[0].count === 0) {
    console.log('🌱 Seeding purchase orders...');
    for (const po of INITIAL_PURCHASE_ORDERS) {
      await execute(
        `INSERT INTO inventory_purchase_orders (id, poNumber, supplierName, orderDate, expectedDelivery, status, items, totalAmount, requestedBy, receivedDate, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          po.id,
          po.poNumber || po.orderNumber || `PO-${po.id}`,
          po.supplierName,
          po.orderDate,
          po.expectedDelivery,
          po.status,
          JSON.stringify(po.items || []),
          po.totalAmount,
          po.requestedBy || po.createdBy || 'Saurabh Kumar',
          po.receivedDate || null,
          po.notes || ''
        ]
      );
    }
  }

  const invMovCount = await query('SELECT COUNT(*) as count FROM inventory_stock_movements');
  if (invMovCount[0].count === 0) {
    console.log('🌱 Seeding stock movements...');
    for (const sm of INITIAL_STOCK_MOVEMENTS) {
      const isOut = sm.type === 'Stock Out' || sm.type === 'OUT';
      const qty = Math.abs(sm.quantityChange !== undefined ? sm.quantityChange : (sm.quantity || 1));
      await execute(
        `INSERT INTO inventory_stock_movements (id, productId, productName, sku, type, quantity, unitPrice, totalAmount, previousStock, newStock, reason, referenceNo, destination, department, supplier, performedBy, timestamp, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          sm.id,
          sm.productId,
          sm.productName,
          sm.sku,
          isOut ? 'OUT' : 'IN',
          qty,
          sm.unitPrice || 0,
          sm.totalAmount || 0,
          sm.previousStock || 0,
          sm.newStock || 0,
          sm.reason || 'Inventory movement',
          sm.reference || sm.referenceNo || 'REF-001',
          sm.recipient || sm.destination || 'Operations',
          sm.department || 'General',
          sm.supplier || null,
          sm.performedBy || 'System',
          sm.timestamp,
          sm.notes || ''
        ]
      );
    }
  }

  // 12. WiFi Networks
  const wifiCount = await query('SELECT COUNT(*) as count FROM company_wifis');
  if (wifiCount[0].count === 0) {
    console.log('🌱 Seeding company WiFis...');
    for (const w of INITIAL_COMPANY_WIFIS) {
      await execute(
        `INSERT INTO company_wifis (id, ssid, bssid, ipRange, location, isPrimary, attendanceEnabled)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [w.id, w.ssid, w.bssid, w.ipRange, w.location, w.isPrimary ? 1 : 0, w.attendanceEnabled !== false ? 1 : 0]
      );
    }
  }

  // 13. Announcements
  const annCount = await query('SELECT COUNT(*) as count FROM announcements');
  if (annCount[0].count === 0) {
    console.log('🌱 Seeding announcements...');
    for (const an of INITIAL_ANNOUNCEMENTS) {
      await execute(
        `INSERT INTO announcements (id, title, description, date, priority, pinned, author, category, readBy)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [an.id, an.title, an.description, an.date, an.priority, an.pinned ? 1 : 0, an.author, an.category, JSON.stringify(an.readBy || [])]
      );
    }
  }

  // 14. Notifications
  const notifCount = await query('SELECT COUNT(*) as count FROM notifications');
  if (notifCount[0].count === 0) {
    console.log('🌱 Seeding notifications...');
    for (const n of INITIAL_NOTIFICATIONS) {
      await execute(
        `INSERT INTO notifications (id, title, message, type, time, read, roles, link)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [n.id, n.title, n.message, n.type, n.time, n.read ? 1 : 0, JSON.stringify(n.roles || []), n.link]
      );
    }
  }

  // 15. Audit Logs
  const auditCount = await query('SELECT COUNT(*) as count FROM audit_logs');
  if (auditCount[0].count === 0) {
    console.log('🌱 Seeding audit logs...');
    for (const l of INITIAL_AUDIT_LOGS) {
      await execute(
        `INSERT INTO audit_logs (id, user, role, action, module, details, date, time)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [l.id, l.user, l.role, l.action, l.module, l.details, l.date, l.time]
      );
    }
  }

  // 16. Recruitment: Job Openings & Candidates
  const jobCount = await query('SELECT COUNT(*) as count FROM job_openings');
  if (jobCount[0].count === 0) {
    console.log('🌱 Seeding job openings...');
    for (const j of INITIAL_JOB_OPENINGS) {
      await execute(
        `INSERT INTO job_openings (id, title, department, location, type, experience, applicantsCount, status, salaryRange, postedDate)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [j.id, j.title, j.department, j.location, j.type, j.experience, j.applicantsCount || 0, j.status || 'Open', j.salaryRange, j.postedDate]
      );
    }
  }

  const candCount = await query('SELECT COUNT(*) as count FROM candidates');
  if (candCount[0].count === 0) {
    console.log('🌱 Seeding candidates...');
    for (const c of INITIAL_CANDIDATES) {
      await execute(
        `INSERT INTO candidates (id, name, email, phone, appliedRole, jobId, stage, rating, appliedDate, experience, resumeUrl)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [c.id, c.name, c.email, c.phone, c.appliedRole, c.jobId, c.stage || 'Applied', c.rating || 4.0, c.appliedDate, c.experience, c.resumeUrl]
      );
    }
  }

  // 17. Performance Reviews
  const perfCount = await query('SELECT COUNT(*) as count FROM performance_reviews');
  if (perfCount[0].count === 0) {
    console.log('🌱 Seeding performance reviews...');
    for (const pr of INITIAL_PERFORMANCE) {
      await execute(
        `INSERT INTO performance_reviews (id, employeeId, employeeName, reviewer, reviewPeriod, rating, feedback, goals, date, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [pr.id, pr.employeeId, pr.employeeName, pr.reviewer, pr.reviewPeriod, pr.rating || 4.0, pr.feedback, JSON.stringify(pr.goals || []), pr.date, pr.status || 'Reviewed']
      );
    }
  }

  console.log('✅ SQLite database seeding completed successfully!');
};
