import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AnimatedCursor from './components/AnimatedCursor';
import ERPLayout from './components/ERPLayout';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Public & Error Pages
import Login from './pages/Login';
import AccessDenied from './pages/AccessDenied';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

// Owner Pages
import OwnerDashboard from './pages/owner/OwnerDashboard';
import OwnerEmployees from './pages/owner/OwnerEmployees';
import OwnerDepartments from './pages/owner/OwnerDepartments';
import OwnerManagers from './pages/owner/OwnerManagers';
import OwnerProjects from './pages/owner/OwnerProjects';
import OwnerTasks from './pages/owner/OwnerTasks';
import OwnerAnalytics from './pages/owner/OwnerAnalytics';
import OwnerFinance from './pages/owner/OwnerFinance';
import OwnerPayroll from './pages/owner/OwnerPayroll';
import OwnerAttendance from './pages/owner/OwnerAttendance';
import OwnerLeave from './pages/owner/OwnerLeave';
import OwnerPerformance from './pages/owner/OwnerPerformance';
import OwnerReports from './pages/owner/OwnerReports';
import OwnerAnnouncements from './pages/owner/OwnerAnnouncements';
import OwnerAuditLogs from './pages/owner/OwnerAuditLogs';
import OwnerSettings from './pages/owner/OwnerSettings';
import OwnerProfile from './pages/owner/OwnerProfile';

// HR Pages
import HRDashboard from './pages/hr/HRDashboard';
import HRTasks from './pages/hr/HRTasks';
import HRAnalytics from './pages/hr/HRAnalytics';
import HRRecruitment from './pages/hr/HRRecruitment';
import HROnboarding from './pages/hr/HROnboarding';
import HRTraining from './pages/hr/HRTraining';
import HRDocuments from './pages/hr/HRDocuments';
import HRIDCardRequestsPage from './pages/hr/HRIDCardRequestsPage';

// Manager Pages
import ManagerDashboard from './pages/manager/ManagerDashboard';
import ManagerTeam from './pages/manager/ManagerTeam';
import ManagerTasks from './pages/manager/ManagerTasks';
import ManagerAnalytics from './pages/manager/ManagerAnalytics';
import ManagerCalendar from './pages/manager/ManagerCalendar';

// Employee Pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import EmployeeTasks from './pages/employee/EmployeeTasks';
import EmployeeAnalytics from './pages/employee/EmployeeAnalytics';
import EmployeeProjects from './pages/employee/EmployeeProjects';
import EmployeeAttendance from './pages/employee/EmployeeAttendance';
import EmployeeLeave from './pages/employee/EmployeeLeave';
import EmployeePayslips from './pages/employee/EmployeePayslips';
import EmployeePerformance from './pages/employee/EmployeePerformance';
import EmployeeTraining from './pages/employee/EmployeeTraining';
import EmployeeAnnouncements from './pages/employee/EmployeeAnnouncements';
import EmployeeCalendar from './pages/employee/EmployeeCalendar';
import EmployeeDocuments from './pages/employee/EmployeeDocuments';
import EmployeeProfile from './pages/employee/EmployeeProfile';
import EmployeeSettings from './pages/employee/EmployeeSettings';
import EmployeeIDCardPage from './pages/employee/EmployeeIDCardPage';

export const App = () => {
  const { isAuthenticated, role } = useAuth();

  // Root redirect helper
  const getRootRedirect = () => {
    if (!isAuthenticated) return '/login';
    switch (role) {
      case 'admin': return '/admin/dashboard';
      case 'owner': return '/owner/dashboard';
      case 'hr': return '/hr/dashboard';
      case 'manager': return '/manager/dashboard';
      case 'employee': return '/employee/dashboard';
      default: return '/login';
    }
  };

  return (
    <>
      <AnimatedCursor />

      <ErrorBoundary>
        <Routes>
        {/* Root Redirect */}
        <Route path="/" element={<Navigate to={getRootRedirect()} replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/access-denied" element={<AccessDenied />} />

        {/* ================= ADMIN / SUPER ADMIN ROUTES ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ERPLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="employees" element={<OwnerEmployees />} />
          <Route path="departments" element={<OwnerDepartments />} />
          <Route path="managers" element={<OwnerManagers />} />
          <Route path="projects" element={<OwnerProjects />} />
          <Route path="tasks" element={<ManagerTasks />} />
          <Route path="finance" element={<OwnerFinance />} />
          <Route path="payroll" element={<OwnerPayroll />} />
          <Route path="attendance" element={<OwnerAttendance />} />
          <Route path="leave" element={<OwnerLeave />} />
          <Route path="recruitment" element={<HRRecruitment />} />
          <Route path="onboarding" element={<HROnboarding />} />
          <Route path="performance" element={<OwnerPerformance />} />
          <Route path="training" element={<HRTraining />} />
          <Route path="documents" element={<HRDocuments />} />
          <Route path="id-cards" element={<HRIDCardRequestsPage />} />
          <Route path="reports" element={<OwnerReports />} />
          <Route path="announcements" element={<OwnerAnnouncements />} />
          <Route path="audit-logs" element={<OwnerAuditLogs />} />
          <Route path="settings" element={<OwnerSettings />} />
          <Route path="profile" element={<OwnerProfile />} />
        </Route>

        {/* ================= COMPANY OWNER ROUTES ================= */}
        <Route
          path="/owner"
          element={
            <ProtectedRoute allowedRoles={['owner']}>
              <ERPLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/owner/dashboard" replace />} />
          <Route path="dashboard" element={<OwnerDashboard />} />
          <Route path="employees" element={<OwnerEmployees />} />
          <Route path="departments" element={<OwnerDepartments />} />
          <Route path="managers" element={<OwnerManagers />} />
          <Route path="projects" element={<OwnerProjects />} />
          <Route path="tasks" element={<OwnerTasks />} />
          <Route path="analytics" element={<OwnerAnalytics />} />
          <Route path="finance" element={<OwnerFinance />} />
          <Route path="payroll" element={<OwnerPayroll />} />
          <Route path="attendance" element={<OwnerAttendance />} />
          <Route path="leave" element={<OwnerLeave />} />
          <Route path="performance" element={<OwnerPerformance />} />
          <Route path="reports" element={<OwnerReports />} />
          <Route path="announcements" element={<OwnerAnnouncements />} />
          <Route path="audit-logs" element={<OwnerAuditLogs />} />
          <Route path="settings" element={<OwnerSettings />} />
          <Route path="profile" element={<OwnerProfile />} />
        </Route>

        {/* ================= HR ROUTES ================= */}
        <Route
          path="/hr"
          element={
            <ProtectedRoute allowedRoles={['hr']}>
              <ERPLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/hr/dashboard" replace />} />
          <Route path="dashboard" element={<HRDashboard />} />
          <Route path="employees" element={<OwnerEmployees />} />
          <Route path="departments" element={<OwnerDepartments />} />
          <Route path="tasks" element={<HRTasks />} />
          <Route path="analytics" element={<HRAnalytics />} />
          <Route path="attendance" element={<OwnerAttendance />} />
          <Route path="leave" element={<OwnerLeave />} />
          <Route path="recruitment" element={<HRRecruitment />} />
          <Route path="onboarding" element={<HROnboarding />} />
          <Route path="payroll" element={<OwnerPayroll />} />
          <Route path="performance" element={<OwnerPerformance />} />
          <Route path="training" element={<HRTraining />} />
          <Route path="documents" element={<HRDocuments />} />
          <Route path="id-cards" element={<HRIDCardRequestsPage />} />
          <Route path="announcements" element={<OwnerAnnouncements />} />
          <Route path="reports" element={<OwnerReports />} />
          <Route path="profile" element={<OwnerProfile />} />
        </Route>

        {/* ================= MANAGER ROUTES ================= */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedRoles={['manager']}>
              <ERPLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/manager/dashboard" replace />} />
          <Route path="dashboard" element={<ManagerDashboard />} />
          <Route path="team" element={<ManagerTeam />} />
          <Route path="tasks" element={<ManagerTasks />} />
          <Route path="analytics" element={<ManagerAnalytics />} />
          <Route path="projects" element={<OwnerProjects />} />
          <Route path="attendance" element={<OwnerAttendance />} />
          <Route path="leave" element={<OwnerLeave />} />
          <Route path="performance" element={<OwnerPerformance />} />
          <Route path="calendar" element={<ManagerCalendar />} />
          <Route path="announcements" element={<EmployeeAnnouncements />} />
          <Route path="reports" element={<OwnerReports />} />
          <Route path="profile" element={<OwnerProfile />} />
        </Route>

        {/* ================= EMPLOYEE ROUTES ================= */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRoles={['employee']}>
              <ERPLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/employee/dashboard" replace />} />
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="tasks" element={<EmployeeTasks />} />
          <Route path="analytics" element={<EmployeeAnalytics />} />
          <Route path="projects" element={<EmployeeProjects />} />
          <Route path="attendance" element={<EmployeeAttendance />} />
          <Route path="leave" element={<EmployeeLeave />} />
          <Route path="payslips" element={<EmployeePayslips />} />
          <Route path="performance" element={<EmployeePerformance />} />
          <Route path="training" element={<EmployeeTraining />} />
          <Route path="announcements" element={<EmployeeAnnouncements />} />
          <Route path="calendar" element={<EmployeeCalendar />} />
          <Route path="documents" element={<EmployeeDocuments />} />
          <Route path="id-card" element={<EmployeeIDCardPage />} />
          <Route path="profile" element={<EmployeeProfile />} />
          <Route path="settings" element={<EmployeeSettings />} />
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to={getRootRedirect()} replace />} />
      </Routes>
    </ErrorBoundary>
  </>
  );
};
export default App;
