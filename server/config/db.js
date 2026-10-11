import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Resolving directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database path
const dbDir = path.resolve(__dirname, '../database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
const dbPath = path.join(dbDir, 'nexora.db');

sqlite3.verbose();
export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Failed to open SQLite database:', err.message);
  } else {
    console.log('✅ SQLite database connected at:', dbPath);
  }
});

// Async Promise Wrappers
export const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

export const getOne = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row || null);
    });
  });
};

export const execute = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

// Initialize Schemas
export const initDatabase = async () => {
  console.log('⏳ Initializing SQLite tables & schemas...');

  await execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      title TEXT,
      department TEXT,
      phone TEXT,
      avatar TEXT,
      joiningDate TEXT,
      status TEXT DEFAULT 'Active',
      location TEXT,
      emergencyContact TEXT,
      employeeId TEXT
    );
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS employees (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      role TEXT NOT NULL,
      department TEXT NOT NULL,
      designation TEXT,
      salary REAL DEFAULT 0,
      phone TEXT,
      joinDate TEXT,
      status TEXT DEFAULT 'Active',
      avatar TEXT,
      managerId TEXT,
      location TEXT,
      skills TEXT,
      performanceScore REAL DEFAULT 4.0
    );
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS departments (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      head TEXT,
      headId TEXT,
      employeeCount INTEGER DEFAULT 0,
      budget REAL DEFAULT 0,
      color TEXT,
      icon TEXT,
      description TEXT
    );
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      department TEXT NOT NULL,
      departmentId TEXT,
      managerId TEXT,
      status TEXT DEFAULT 'Planning',
      progress INTEGER DEFAULT 0,
      budget REAL DEFAULT 0,
      spent REAL DEFAULT 0,
      startDate TEXT,
      deadline TEXT,
      team TEXT,
      priority TEXT DEFAULT 'Medium',
      description TEXT
    );
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      assignedTo TEXT NOT NULL,
      assignedToId TEXT NOT NULL,
      assignedManager TEXT,
      assignedManagerId TEXT,
      department TEXT NOT NULL,
      project TEXT NOT NULL,
      projectId TEXT,
      priority TEXT DEFAULT 'Medium',
      status TEXT DEFAULT 'Pending',
      startDate TEXT,
      dueDate TEXT NOT NULL,
      completionDate TEXT,
      estimatedHours REAL DEFAULT 0,
      actualHours REAL DEFAULT 0,
      tags TEXT,
      comments TEXT,
      attachments TEXT,
      createdBy TEXT,
      createdDate TEXT
    );
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS attendance (
      id TEXT PRIMARY KEY,
      employeeId TEXT NOT NULL,
      employeeName TEXT NOT NULL,
      date TEXT NOT NULL,
      checkIn TEXT,
      checkOut TEXT,
      workHours REAL DEFAULT 0,
      status TEXT DEFAULT 'Present',
      isWFH INTEGER DEFAULT 0,
      workMode TEXT DEFAULT 'In Office',
      networkName TEXT,
      networkVerified INTEGER DEFAULT 1,
      notes TEXT
    );
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS wfh_authorized (
      id TEXT PRIMARY KEY,
      employeeId TEXT NOT NULL,
      employeeName TEXT NOT NULL,
      department TEXT,
      designation TEXT,
      authorizedBy TEXT,
      authorizedDate TEXT,
      validUntil TEXT,
      status TEXT DEFAULT 'Authorized',
      reason TEXT,
      idCardVerified INTEGER DEFAULT 1,
      notes TEXT
    );
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS id_card_requests (
      id TEXT PRIMARY KEY,
      employeeId TEXT NOT NULL,
      employeeName TEXT NOT NULL,
      department TEXT,
      designation TEXT,
      photo TEXT,
      status TEXT DEFAULT 'Pending',
      requestDate TEXT,
      issuedDate TEXT,
      serialNumber TEXT,
      rfidCode TEXT,
      approvedBy TEXT,
      qrData TEXT,
      reason TEXT,
      notes TEXT
    );
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS leaves (
      id TEXT PRIMARY KEY,
      employeeId TEXT NOT NULL,
      employeeName TEXT NOT NULL,
      leaveType TEXT NOT NULL,
      startDate TEXT NOT NULL,
      endDate TEXT NOT NULL,
      days INTEGER DEFAULT 1,
      reason TEXT,
      status TEXT DEFAULT 'Pending',
      appliedDate TEXT,
      reviewedBy TEXT
    );
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS leave_balances (
      id TEXT PRIMARY KEY,
      employeeId TEXT UNIQUE NOT NULL,
      casual INTEGER DEFAULT 12,
      sick INTEGER DEFAULT 10,
      paid INTEGER DEFAULT 18,
      total INTEGER DEFAULT 40
    );
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS payroll (
      id TEXT PRIMARY KEY,
      employeeId TEXT NOT NULL,
      employeeName TEXT NOT NULL,
      month TEXT NOT NULL,
      basicSalary REAL NOT NULL,
      allowances REAL DEFAULT 0,
      deductions REAL DEFAULT 0,
      netSalary REAL NOT NULL,
      status TEXT DEFAULT 'Paid',
      paymentDate TEXT
    );
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS inventory_products (
      id TEXT PRIMARY KEY,
      sku TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      quantity INTEGER DEFAULT 0,
      minThreshold INTEGER DEFAULT 10,
      unit TEXT DEFAULT 'units',
      costPrice REAL DEFAULT 0,
      sellingPrice REAL DEFAULT 0,
      warehouseLocation TEXT,
      supplier TEXT,
      description TEXT,
      status TEXT DEFAULT 'In Stock',
      lastRestocked TEXT
    );
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS inventory_suppliers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      contactPerson TEXT,
      email TEXT,
      phone TEXT,
      city TEXT,
      categories TEXT,
      paymentTerms TEXT DEFAULT 'Net 30',
      rating REAL DEFAULT 4.5,
      status TEXT DEFAULT 'Active',
      notes TEXT
    );
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS inventory_purchase_orders (
      id TEXT PRIMARY KEY,
      poNumber TEXT UNIQUE NOT NULL,
      supplierName TEXT NOT NULL,
      orderDate TEXT NOT NULL,
      expectedDelivery TEXT,
      status TEXT DEFAULT 'Pending',
      items TEXT NOT NULL,
      totalAmount REAL DEFAULT 0,
      requestedBy TEXT,
      receivedDate TEXT,
      notes TEXT
    );
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS inventory_stock_movements (
      id TEXT PRIMARY KEY,
      productId TEXT NOT NULL,
      productName TEXT NOT NULL,
      sku TEXT NOT NULL,
      type TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unitPrice REAL DEFAULT 0,
      totalAmount REAL DEFAULT 0,
      previousStock INTEGER DEFAULT 0,
      newStock INTEGER DEFAULT 0,
      reason TEXT,
      referenceNo TEXT,
      destination TEXT,
      department TEXT,
      supplier TEXT,
      performedBy TEXT,
      timestamp TEXT NOT NULL,
      notes TEXT
    );
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS company_wifis (
      id TEXT PRIMARY KEY,
      ssid TEXT NOT NULL,
      bssid TEXT,
      ipRange TEXT,
      location TEXT,
      isPrimary INTEGER DEFAULT 0,
      attendanceEnabled INTEGER DEFAULT 1
    );
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS announcements (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      priority TEXT DEFAULT 'Medium',
      pinned INTEGER DEFAULT 0,
      author TEXT,
      category TEXT,
      readBy TEXT
    );
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      message TEXT,
      type TEXT DEFAULT 'info',
      time TEXT,
      read INTEGER DEFAULT 0,
      roles TEXT,
      link TEXT
    );
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user TEXT NOT NULL,
      role TEXT NOT NULL,
      action TEXT NOT NULL,
      module TEXT NOT NULL,
      details TEXT,
      date TEXT,
      time TEXT
    );
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS job_openings (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      department TEXT NOT NULL,
      location TEXT,
      type TEXT DEFAULT 'Full-time',
      experience TEXT,
      applicantsCount INTEGER DEFAULT 0,
      status TEXT DEFAULT 'Open',
      salaryRange TEXT,
      postedDate TEXT
    );
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS candidates (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      appliedRole TEXT,
      jobId TEXT,
      stage TEXT DEFAULT 'Applied',
      rating REAL DEFAULT 4.0,
      appliedDate TEXT,
      experience TEXT,
      resumeUrl TEXT
    );
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS performance_reviews (
      id TEXT PRIMARY KEY,
      employeeId TEXT NOT NULL,
      employeeName TEXT NOT NULL,
      reviewer TEXT,
      reviewPeriod TEXT,
      rating REAL DEFAULT 4.0,
      feedback TEXT,
      goals TEXT,
      date TEXT,
      status TEXT DEFAULT 'Reviewed'
    );
  `);

  console.log('✅ SQLite schemas initialized successfully.');
};
