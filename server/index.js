import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './config/db.js';
import { seedDatabase } from './config/seed.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import idCardRoutes from './routes/idCardRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import payrollRoutes from './routes/payrollRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import wifiRoutes from './routes/wifiRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import recruitmentRoutes from './routes/recruitmentRoutes.js';
import performanceRoutes from './routes/performanceRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.originalUrl.startsWith('/api')) {
      console.log(`[${req.method}] ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'NEXORA Company ERP Backend Server',
    database: 'SQLite (nexora.db)',
    timestamp: new Date().toISOString(),
    uptime: `${Math.round(process.uptime())}s`
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/id-cards', idCardRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/wifis', wifiRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/recruitment', recruitmentRoutes);
app.use('/api/performance', performanceRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start server after initializing & seeding SQLite database
const startServer = async () => {
  try {
    await initDatabase();
    await seedDatabase();

    app.listen(PORT, () => {
      console.log('========================================================');
      console.log(`🚀 NEXORA ERP BACKEND RUNNING AT: http://localhost:${PORT}`);
      console.log(`📡 REST API ENDPOINTS:        http://localhost:${PORT}/api/health`);
      console.log(`💾 DATABASE:                  SQLite (server/database/nexora.db)`);
      console.log('========================================================');
    });
  } catch (err) {
    console.error('❌ Failed to start NEXORA ERP server:', err);
    process.exit(1);
  }
};

startServer();
