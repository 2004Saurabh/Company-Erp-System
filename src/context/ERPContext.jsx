import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_EMPLOYEES } from '../data/employees';
import { INITIAL_DEPARTMENTS } from '../data/departments';
import { INITIAL_PROJECTS } from '../data/projects';
import { INITIAL_TASKS } from '../data/tasks';
import { INITIAL_ATTENDANCE } from '../data/attendance';
import { INITIAL_LEAVES, INITIAL_LEAVE_BALANCES } from '../data/leaves';
import { INITIAL_PAYROLL } from '../data/payroll';
import { INITIAL_ANNOUNCEMENTS } from '../data/announcements';
import { INITIAL_NOTIFICATIONS } from '../data/notifications';
import { INITIAL_JOB_OPENINGS, INITIAL_CANDIDATES } from '../data/recruitment';
import { INITIAL_PERFORMANCE } from '../data/performance';
import { INITIAL_AUDIT_LOGS } from '../data/auditLogs';
import { INITIAL_COMPANY_WIFIS, AVAILABLE_SIMULATION_NETWORKS } from '../data/wifiNetworks';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const ERPContext = createContext();

export const CURRENT_DATE_REF = '2026-10-07';

export const getEffectiveStatus = (task, todayStr = CURRENT_DATE_REF) => {
  if (!task) return 'Pending';
  if (task.status === 'Completed') return 'Completed';
  if (task.dueDate && task.dueDate < todayStr) return 'Overdue';
  return task.status === 'Todo' ? 'Pending' : (task.status || 'Pending');
};

export const calculateCompletionRate = (taskList) => {
  if (!taskList || taskList.length === 0) return 0;
  const completed = taskList.filter(t => getEffectiveStatus(t) === 'Completed').length;
  return Math.round((completed / taskList.length) * 100);
};

export const calculateProductivityScore = (taskList) => {
  if (!taskList || taskList.length === 0) return 0;
  const total = taskList.length;
  const completed = taskList.filter(t => getEffectiveStatus(t) === 'Completed').length;
  const overdue = taskList.filter(t => getEffectiveStatus(t) === 'Overdue').length;
  const inProgress = taskList.filter(t => getEffectiveStatus(t) === 'In Progress').length;
  const onTimeCompleted = taskList.filter(t => t.status === 'Completed' && (!t.dueDate || !t.completionDate || t.completionDate <= t.dueDate)).length;

  const compRate = (completed / total) * 100;
  const onTimeRate = completed > 0 ? (onTimeCompleted / completed) * 100 : 0;
  const overduePenalty = (overdue / total) * 25;
  const progressBonus = (inProgress / total) * 10;

  const rawScore = (compRate * 0.65) + (onTimeRate * 0.25) + progressBonus - overduePenalty;
  return Math.min(100, Math.max(10, Math.round(rawScore)));
};

export const ERPProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  // Helper for localStorage initial state
  const loadState = (key, fallback) => {
    try {
      const saved = localStorage.getItem(`nexora_${key}`);
      if (!saved) return fallback;
      const str = saved.replace(/Alexander Vance/g, 'Saurabh Kumar');
      return JSON.parse(str);
    } catch (e) {
      console.error(`Error loading ${key}`, e);
      return fallback;
    }
  };

  const [employees, setEmployees] = useState(() => {
    const loaded = loadState('employees', INITIAL_EMPLOYEES);
    if (loaded && loaded.some(e => e.id === 'EMP-1001' && e.salary < 1000000)) {
      return INITIAL_EMPLOYEES;
    }
    return loaded;
  });
  const [departments, setDepartments] = useState(() => {
    const loaded = loadState('departments', INITIAL_DEPARTMENTS);
    if (loaded && loaded.some(d => d.budget < 1000000)) {
      return INITIAL_DEPARTMENTS;
    }
    return loaded;
  });
  const [projects, setProjects] = useState(() => {
    const loaded = loadState('projects', INITIAL_PROJECTS);
    if (loaded && loaded.some(p => p.budget < 500000)) {
      return INITIAL_PROJECTS;
    }
    return loaded;
  });
  const [tasks, setTasks] = useState(() => {
    const loaded = loadState('tasks', INITIAL_TASKS);
    if (!loaded || loaded.length < 30 || !loaded[0]?.assignedManagerId || loaded.some(t => t.status === 'Todo')) {
      return INITIAL_TASKS;
    }
    return loaded;
  });
  const [attendance, setAttendance] = useState(() => {
    const loaded = loadState('attendance', INITIAL_ATTENDANCE);
    return loaded.map(a => {
      if (a.id === 'ATT-301' && a.checkIn === '09:05 AM' && !a.checkOut) {
        return { ...a, checkIn: null, checkOut: null, workHours: 0, status: 'Absent' };
      }
      if (a.id === 'ATT-308' && !a.isWFH) {
        return {
          ...a,
          isWFH: true,
          workMode: 'Work From Home',
          networkName: 'Work From Home (HR Authorized)',
          networkVerified: true
        };
      }
      return a;
    });
  });
  const [leaves, setLeaves] = useState(() => loadState('leaves', INITIAL_LEAVES));
  const [leaveBalances, setLeaveBalances] = useState(() => loadState('leaveBalances', INITIAL_LEAVE_BALANCES));
  const [payroll, setPayroll] = useState(() => {
    const loaded = loadState('payroll', INITIAL_PAYROLL);
    if (loaded && loaded.some(p => p.basicSalary < 50000)) {
      return INITIAL_PAYROLL;
    }
    return loaded;
  });
  const [announcements, setAnnouncements] = useState(() => {
    const loaded = loadState('announcements', INITIAL_ANNOUNCEMENTS);
    if (loaded && loaded.some(a => a.description && a.description.includes('$'))) {
      return INITIAL_ANNOUNCEMENTS;
    }
    return loaded;
  });
  const [notifications, setNotifications] = useState(() => loadState('notifications', INITIAL_NOTIFICATIONS));
  const [jobOpenings, setJobOpenings] = useState(() => {
    const loaded = loadState('jobs', INITIAL_JOB_OPENINGS);
    if (loaded && loaded.some(j => j.salaryRange && j.salaryRange.includes('$'))) {
      return INITIAL_JOB_OPENINGS;
    }
    return loaded;
  });
  const [candidates, setCandidates] = useState(() => loadState('candidates', INITIAL_CANDIDATES));
  const [performanceReviews, setPerformanceReviews] = useState(() => loadState('performance', INITIAL_PERFORMANCE));
  const [auditLogs, setAuditLogs] = useState(() => {
    const loaded = loadState('audit_logs', INITIAL_AUDIT_LOGS);
    if (loaded && loaded.some(l => l.details && l.details.includes('$'))) {
      return INITIAL_AUDIT_LOGS;
    }
    return loaded;
  });
  const [companyWifis, setCompanyWifis] = useState(() => loadState('company_wifis', INITIAL_COMPANY_WIFIS));
  const [currentNetwork, setCurrentNetwork] = useState(() => loadState('current_network', AVAILABLE_SIMULATION_NETWORKS[0]));
  const [wifiEnforcementEnabled, setWifiEnforcementEnabled] = useState(() => loadState('wifi_enforcement', true));

  // Sync to localStorage
  useEffect(() => { localStorage.setItem('nexora_employees', JSON.stringify(employees)); }, [employees]);
  useEffect(() => { localStorage.setItem('nexora_departments', JSON.stringify(departments)); }, [departments]);
  useEffect(() => { localStorage.setItem('nexora_projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('nexora_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('nexora_attendance', JSON.stringify(attendance)); }, [attendance]);
  useEffect(() => { localStorage.setItem('nexora_leaves', JSON.stringify(leaves)); }, [leaves]);
  useEffect(() => { localStorage.setItem('nexora_leaveBalances', JSON.stringify(leaveBalances)); }, [leaveBalances]);
  useEffect(() => { localStorage.setItem('nexora_payroll', JSON.stringify(payroll)); }, [payroll]);
  useEffect(() => { localStorage.setItem('nexora_announcements', JSON.stringify(announcements)); }, [announcements]);
  useEffect(() => { localStorage.setItem('nexora_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('nexora_jobs', JSON.stringify(jobOpenings)); }, [jobOpenings]);
  useEffect(() => { localStorage.setItem('nexora_candidates', JSON.stringify(candidates)); }, [candidates]);
  useEffect(() => { localStorage.setItem('nexora_performance', JSON.stringify(performanceReviews)); }, [performanceReviews]);
  useEffect(() => { localStorage.setItem('nexora_audit_logs', JSON.stringify(auditLogs)); }, [auditLogs]);
  useEffect(() => { localStorage.setItem('nexora_company_wifis', JSON.stringify(companyWifis)); }, [companyWifis]);
  useEffect(() => { localStorage.setItem('nexora_current_network', JSON.stringify(currentNetwork)); }, [currentNetwork]);
  useEffect(() => { localStorage.setItem('nexora_wifi_enforcement', JSON.stringify(wifiEnforcementEnabled)); }, [wifiEnforcementEnabled]);

  // Log Action Helper
  const logAudit = (action, module, details) => {
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      user: currentUser?.name || 'Saurabh Kumar',
      role: currentUser?.role || 'owner',
      action,
      module,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Success',
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Add Notification Helper
  const triggerNotification = (title, message, type, targetRole = ['owner', 'hr', 'manager', 'employee'], link = '/') => {
    const newNotif = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      title,
      message,
      type,
      targetRole,
      read: false,
      timestamp: new Date().toISOString(),
      link
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // =================== EMPLOYEES CRUD ===================
  const addEmployee = (empData) => {
    const newId = `EMP-${1000 + employees.length + 1}`;
    const newEmp = {
      id: newId,
      status: 'Active',
      avatar: empData.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      role: 'employee',
      ...empData
    };
    setEmployees(prev => [newEmp, ...prev]);
    logAudit('Employee Added', 'Employees', `Added ${newEmp.fullName} (${newEmp.id}) to ${newEmp.department}`);
    triggerNotification('New Employee Onboarded', `${newEmp.fullName} joined ${newEmp.department}`, 'employee', ['owner', 'hr', 'manager']);
    addToast(`Employee ${newEmp.fullName} added successfully!`, 'success');
    return newEmp;
  };

  const updateEmployee = (id, updatedFields) => {
    setEmployees(prev => prev.map(emp => (emp.id === id ? { ...emp, ...updatedFields } : emp)));
    logAudit('Employee Updated', 'Employees', `Updated details for employee ${id}`);
    addToast('Employee details updated successfully!', 'success');
  };

  const deleteEmployee = (id) => {
    const emp = employees.find(e => e.id === id);
    setEmployees(prev => prev.filter(e => e.id !== id));
    logAudit('Employee Deleted', 'Employees', `Removed employee ${emp?.fullName || id}`);
    addToast(`Employee ${emp?.fullName || id} removed.`, 'info');
  };

  const toggleEmployeeStatus = (id) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === id) {
        const nextStatus = emp.status === 'Active' ? 'Inactive' : 'Active';
        logAudit('Status Changed', 'Employees', `Changed ${emp.fullName} status to ${nextStatus}`);
        addToast(`Employee status changed to ${nextStatus}`, 'info');
        return { ...emp, status: nextStatus };
      }
      return emp;
    }));
  };

  // =================== DEPARTMENTS CRUD ===================
  const addDepartment = (deptData) => {
    const newId = `DEP-0${departments.length + 1}`;
    const newDept = {
      id: newId,
      status: 'Active',
      employeeCount: 0,
      ...deptData
    };
    setDepartments(prev => [...prev, newDept]);
    logAudit('Department Created', 'Departments', `Created ${newDept.name} department`);
    addToast(`Department ${newDept.name} created!`, 'success');
  };

  const updateDepartment = (id, updatedFields) => {
    setDepartments(prev => prev.map(d => (d.id === id ? { ...d, ...updatedFields } : d)));
    logAudit('Department Updated', 'Departments', `Updated department ${id}`);
    addToast('Department updated successfully!', 'success');
  };

  const deleteDepartment = (id) => {
    const dept = departments.find(d => d.id === id);
    setDepartments(prev => prev.filter(d => d.id !== id));
    logAudit('Department Deleted', 'Departments', `Deleted department ${dept?.name || id}`);
    addToast(`Department ${dept?.name || id} deleted.`, 'info');
  };

  // =================== PROJECTS CRUD ===================
  const addProject = (projectData) => {
    const newId = `PRJ-${100 + projects.length + 1}`;
    const newPrj = {
      id: newId,
      progress: 0,
      status: 'Planning',
      teamMembers: projectData.teamMembers || ['EMP-1004'],
      ...projectData
    };
    setProjects(prev => [newPrj, ...prev]);
    logAudit('Project Created', 'Projects', `Created project: ${newPrj.name}`);
    triggerNotification('New Project Initiated', `Project ${newPrj.name} has been launched`, 'project', ['owner', 'manager']);
    addToast(`Project "${newPrj.name}" created!`, 'success');
  };

  const updateProject = (id, updatedFields) => {
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, ...updatedFields } : p)));
    logAudit('Project Updated', 'Projects', `Updated project ${id}`);
    addToast('Project updated successfully!', 'success');
  };

  const deleteProject = (id) => {
    const prj = projects.find(p => p.id === id);
    setProjects(prev => prev.filter(p => p.id !== id));
    logAudit('Project Deleted', 'Projects', `Deleted project ${prj?.name || id}`);
    addToast(`Project ${prj?.name || id} deleted.`, 'info');
  };

  // =================== TASKS CRUD ===================
  const createTask = (taskData) => {
    const newId = `TSK-${200 + tasks.length + 1}`;
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const effectiveDept = taskData.department || (employees.find(e => e.fullName === taskData.assignedTo)?.department) || 'Engineering';
    const effectiveMgr = taskData.assignedManager || (employees.find(e => e.fullName === taskData.assignedTo)?.manager) || 'Marcus Sterling';
    const effectiveMgrObj = employees.find(e => e.fullName === effectiveMgr);

    const newTask = {
      id: newId,
      title: taskData.title || 'Untitled Task',
      description: taskData.description || '',
      assignedTo: taskData.assignedTo || 'Elena Rostova',
      assignedToId: taskData.assignedToId || 'EMP-1004',
      assignedManager: effectiveMgr,
      assignedManagerId: taskData.assignedManagerId || effectiveMgrObj?.id || 'EMP-1003',
      department: effectiveDept,
      project: taskData.project || 'Next-Gen Mobile App Overhaul',
      projectId: taskData.projectId || 'PRJ-102',
      priority: taskData.priority || 'Medium',
      status: taskData.status || 'Pending',
      startDate: taskData.startDate || CURRENT_DATE_REF,
      dueDate: taskData.dueDate || '2026-10-18',
      completionDate: taskData.status === 'Completed' ? CURRENT_DATE_REF : null,
      estimatedHours: Number(taskData.estimatedHours) || 16,
      actualHours: Number(taskData.actualHours) || 0,
      attachments: taskData.attachments || [],
      comments: taskData.comments || [],
      activityTimeline: [
        {
          id: `ACT-${Date.now()}-1`,
          action: `Task created and assigned to ${taskData.assignedTo || 'Elena Rostova'}`,
          user: currentUser?.name || 'Marcus Sterling',
          timestamp: `${CURRENT_DATE_REF} ${nowTimeStr}`
        }
      ],
      createdBy: currentUser?.name || 'Marcus Sterling',
      createdDate: CURRENT_DATE_REF
    };

    setTasks(prev => [newTask, ...prev]);
    logAudit('Task Created', 'Tasks', `Created task "${newTask.title}" (${newTask.id}) assigned to ${newTask.assignedTo}`);
    triggerNotification(
      'New Task Assigned',
      `You have been assigned: "${newTask.title}" for ${newTask.project}`,
      'task',
      ['employee', 'manager'],
      '/employee/tasks'
    );
    addToast(`Task "${newTask.title}" created successfully!`, 'success');
    return newTask;
  };

  const addTask = createTask;

  const updateTask = (id, updatedFields) => {
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const newTimeline = [...(t.activityTimeline || [])];
        newTimeline.push({
          id: `ACT-${Date.now()}`,
          action: `Task details updated`,
          user: currentUser?.name || 'System',
          timestamp: `${CURRENT_DATE_REF} ${nowTimeStr}`
        });
        return { ...t, ...updatedFields, activityTimeline: newTimeline };
      }
      return t;
    }));
    logAudit('Task Updated', 'Tasks', `Updated details for task ${id}`);
    addToast('Task updated successfully!', 'success');
  };

  const updateTaskStatus = (id, newStatus) => {
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let updatedTask = null;

    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const isCompleted = newStatus === 'Completed';
        const updated = {
          ...t,
          status: newStatus,
          completionDate: isCompleted ? (t.completionDate || CURRENT_DATE_REF) : null,
          actualHours: (isCompleted && (!t.actualHours || t.actualHours === 0)) ? (t.estimatedHours || 16) : t.actualHours,
          activityTimeline: [
            ...(t.activityTimeline || []),
            {
              id: `ACT-${Date.now()}`,
              action: `Status changed to ${newStatus}`,
              user: currentUser?.name || t.assignedTo || 'Employee',
              timestamp: `${CURRENT_DATE_REF} ${nowTimeStr}`
            }
          ]
        };
        updatedTask = updated;
        return updated;
      }
      return t;
    }));

    if (updatedTask) {
      logAudit('Task Status Changed', 'Tasks', `Moved "${updatedTask.title}" (${id}) to ${newStatus}`);
      if (newStatus === 'Completed') {
        triggerNotification(
          'Task Completed',
          `"${updatedTask.title}" was marked as Completed by ${currentUser?.name || updatedTask.assignedTo}`,
          'task',
          ['manager', 'owner', 'hr']
        );
      }
      addToast(`Task status updated to "${newStatus}"!`, 'success');
    }
  };

  const addTaskComment = (id, text) => {
    if (!text || !text.trim()) return;
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newComment = {
      id: `CMT-${Date.now()}`,
      author: currentUser?.name || 'Elena Rostova',
      authorRole: currentUser?.role === 'manager' ? 'Manager' : currentUser?.role === 'owner' ? 'Owner' : currentUser?.role === 'hr' ? 'HR' : 'Employee',
      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      text: text.trim(),
      timestamp: `${CURRENT_DATE_REF} ${nowTimeStr}`
    };

    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          comments: [...(t.comments || []), newComment],
          activityTimeline: [
            ...(t.activityTimeline || []),
            {
              id: `ACT-${Date.now()}`,
              action: `Added comment: "${text.trim().slice(0, 35)}..."`,
              user: currentUser?.name || 'Elena Rostova',
              timestamp: `${CURRENT_DATE_REF} ${nowTimeStr}`
            }
          ]
        };
      }
      return t;
    }));

    addToast('Comment added.', 'success');
  };

  const updateTaskHours = (id, actualHours) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, actualHours: Number(actualHours) } : t)));
    addToast('Hours updated.', 'info');
  };

  const deleteTask = (id) => {
    const t = tasks.find(x => x.id === id);
    setTasks(prev => prev.filter(x => x.id !== id));
    logAudit('Task Deleted', 'Tasks', `Deleted task ${t?.title || id}`);
    addToast('Task deleted successfully.', 'info');
  };

  // =================== WIFI GEOFENCE & ATTENDANCE ===================
  const getWifiNetworkInfo = (ssid) => {
    if (!ssid) return null;
    return companyWifis.find(w => w.ssid.toLowerCase() === ssid.toLowerCase());
  };

  const isNetworkAuthorized = (ssid) => {
    if (!ssid) return false;
    const match = getWifiNetworkInfo(ssid);
    // Must be a registered company WiFi AND attendanceEnabled must be true
    return Boolean(match && match.attendanceEnabled !== false);
  };

  const isCurrentWifiAuthorized = () => {
    return isNetworkAuthorized(currentNetwork?.ssid);
  };

  const toggleWifiAttendance = (wifiId, enableAttendance) => {
    let updatedWifi = null;
    setCompanyWifis(prev => prev.map(w => {
      if (w.id === wifiId) {
        const newStatus = enableAttendance !== undefined ? enableAttendance : !w.attendanceEnabled;
        updatedWifi = { ...w, attendanceEnabled: newStatus };
        return updatedWifi;
      }
      return w;
    }));

    if (updatedWifi) {
      const isAllowed = updatedWifi.attendanceEnabled;
      logAudit(
        'WiFi Policy Updated',
        'Settings',
        `Admin updated attendance permission for "${updatedWifi.ssid}" (${updatedWifi.location}) to: ${isAllowed ? 'ALLOWED' : 'DISABLED'}`
      );
      if (isAllowed) {
        addToast(`Attendance permission ENABLED for "${updatedWifi.ssid}". Employees on this WiFi can now mark attendance.`, 'success');
      } else {
        addToast(`Attendance permission DISABLED for "${updatedWifi.ssid}". Shift check-ins on this network are now restricted.`, 'warning');
      }
    }
  };

  const switchNetwork = (target) => {
    let net = target;
    if (typeof target === 'string') {
      net = AVAILABLE_SIMULATION_NETWORKS.find(n => n.ssid === target) || {
        ssid: target,
        label: target,
        location: 'Custom Network',
        ip: '192.168.0.50',
        bssid: '00:11:22:33:44:55',
        security: 'WPA2',
        isCompanyWifi: Boolean(getWifiNetworkInfo(target)),
        signalStrength: 75,
        speedMbps: 100,
        type: 'custom'
      };
    }
    const isCompany = Boolean(getWifiNetworkInfo(net.ssid));
    const isAuth = isNetworkAuthorized(net.ssid);
    const updatedNet = { ...net, isCompanyWifi: isCompany, attendanceAllowed: isAuth };
    setCurrentNetwork(updatedNet);
    logAudit('Network Switched', 'Security', `Device switched WiFi connection to "${net.ssid}" (${isAuth ? 'Authorized Office WiFi' : isCompany ? 'Company WiFi (Attendance Disabled by Admin)' : 'External/Unauthorized Network'})`);
    if (isAuth) {
      addToast(`Connected to Company WiFi "${net.ssid}". Attendance access authorized!`, 'success');
    } else if (isCompany) {
      addToast(`Connected to Company WiFi "${net.ssid}". Note: Admin has disabled attendance on this network.`, 'warning');
    } else {
      addToast(`Connected to "${net.ssid}". Attendance restricted to official office WiFi.`, 'warning');
    }
    return updatedNet;
  };

  const addCompanyWifi = (wifiData) => {
    const newId = `WIFI-${Date.now().toString().slice(-4)}`;
    const newWifi = {
      id: newId,
      ssid: wifiData.ssid.trim(),
      location: wifiData.location || 'Branch Office',
      ipRange: wifiData.ipRange || '192.168.1.0/24',
      security: wifiData.security || 'WPA3 Enterprise',
      isPrimary: false,
      speed: wifiData.speed || '500 Mbps',
      attendanceEnabled: wifiData.attendanceEnabled !== undefined ? wifiData.attendanceEnabled : true,
      description: wifiData.description || 'Configured by Administrator'
    };
    setCompanyWifis(prev => [...prev, newWifi]);
    logAudit('WiFi Config Added', 'Settings', `Authorized new company WiFi: ${newWifi.ssid} (${newWifi.location}) with Attendance: ${newWifi.attendanceEnabled ? 'Enabled' : 'Disabled'}`);
    addToast(`Company WiFi "${newWifi.ssid}" registered. Attendance is ${newWifi.attendanceEnabled ? 'ALLOWED' : 'DISABLED'}.`, 'success');
  };

  const deleteCompanyWifi = (id) => {
    const target = companyWifis.find(w => w.id === id);
    if (companyWifis.length <= 1) {
      addToast('Cannot delete the last remaining authorized office WiFi network!', 'warning');
      return;
    }
    setCompanyWifis(prev => prev.filter(w => w.id !== id));
    logAudit('WiFi Config Removed', 'Settings', `Revoked company WiFi: ${target?.ssid || id}`);
    addToast(`Company WiFi network removed.`, 'info');
  };

  const toggleWifiEnforcement = (enabled) => {
    setWifiEnforcementEnabled(enabled);
    logAudit('Security Policy Changed', 'Settings', `Office WiFi Attendance Restriction ${enabled ? 'Enforced' : 'Disabled'}`);
    addToast(`Office WiFi Attendance Enforcement ${enabled ? 'Enabled' : 'Disabled'}.`, 'info');
  };

  // =================== ATTENDANCE ===================
  const todayStr = '2026-10-01';
  const getTodayAttendanceForUser = (userId) => {
    return attendance.find(a => (a.employeeId === userId || a.employeeId === 'EMP-1004') && a.date === todayStr);
  };

  const checkInEmployee = (userId, userName, userDept) => {
    // 1. WiFi Enforcement Verification
    if (wifiEnforcementEnabled && !isCurrentWifiAuthorized()) {
      const currSsid = currentNetwork?.ssid || 'External Network';
      const companyInfo = getWifiNetworkInfo(currSsid);

      let errorMsg = `Attendance Blocked: You must connect to Company Office WiFi to mark attendance. (Current: "${currSsid}")`;
      if (companyInfo && companyInfo.attendanceEnabled === false) {
        errorMsg = `Attendance Blocked: Admin has disabled shift attendance on company WiFi "${currSsid}". Please connect to an authorized attendance WiFi.`;
      }

      addToast(errorMsg, 'error');
      logAudit(
        'Attendance Blocked',
        'Attendance',
        `${userName || 'Employee'} attempted check-in from network "${currSsid}" (${companyInfo ? 'Company WiFi disabled by Admin' : 'Unauthorized External Network'}). Denied by policy.`
      );
      return {
        success: false,
        reason: companyInfo ? 'WIFI_DISABLED_BY_ADMIN' : 'UNAUTHORIZED_WIFI',
        currentNetwork: currSsid,
        authorizedList: companyWifis.filter(w => w.attendanceEnabled !== false).map(w => w.ssid)
      };
    }

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const existing = attendance.find(a => a.employeeId === (userId || 'EMP-1004') && a.date === todayStr);

    if (existing && existing.checkIn) {
      addToast('Already checked in for today!', 'warning');
      return { success: false, reason: 'ALREADY_CHECKED_IN' };
    }

    const newRecord = {
      id: `ATT-${Date.now().toString().slice(-4)}`,
      employeeId: userId || 'EMP-1004',
      employeeName: userName || 'Elena Rostova',
      department: userDept || 'Engineering',
      date: todayStr,
      checkIn: timeNow,
      checkOut: null,
      workHours: 0.1,
      status: 'Present',
      networkVerified: true,
      networkName: currentNetwork?.ssid || 'NEXORA-CORP-5G',
      networkIp: currentNetwork?.ip || '192.168.1.142',
      networkLocation: currentNetwork?.location || 'HQ Main Office'
    };

    setAttendance(prev => [newRecord, ...prev.filter(a => !(a.employeeId === newRecord.employeeId && a.date === todayStr))]);
    logAudit('Check-In Verified', 'Attendance', `${newRecord.employeeName} checked in via Company WiFi (${newRecord.networkName} · ${newRecord.networkIp})`);
    addToast(`Checked in successfully at ${timeNow}! (Verified via ${newRecord.networkName})`, 'success');
    return { success: true, record: newRecord };
  };

  const checkOutEmployee = (userId) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const empId = userId || 'EMP-1004';

    setAttendance(prev => prev.map(a => {
      if (a.employeeId === empId && a.date === todayStr) {
        return {
          ...a,
          checkOut: timeNow,
          workHours: Math.max(a.workHours || 4.5, 8.2)
        };
      }
      return a;
    }));

    logAudit('Check-Out', 'Attendance', `Employee checked out at ${timeNow}`);
    addToast(`Checked out successfully at ${timeNow}! Total hours logged.`, 'success');
  };

  const resetEmployeeAttendance = (userId) => {
    const empId = userId || 'EMP-1004';
    setAttendance(prev => prev.map(a => {
      if ((a.employeeId === empId || a.employeeId === 'EMP-1004' || a.id === 'ATT-301') && a.date === todayStr) {
        return {
          ...a,
          checkIn: null,
          checkOut: null,
          workHours: 0,
          status: 'Absent'
        };
      }
      return a;
    }));
    logAudit('Attendance Reset', 'Attendance', `Reset attendance for employee ${empId} to test check-in.`);
    addToast('Attendance reset! Check In button is now available.', 'info');
  };

  const markWFHAttendance = ({
    employeeId,
    date = todayStr,
    checkIn = '09:00 AM',
    checkOut = null,
    status = 'Present',
    workHours = 8.0,
    notes = 'Authorized Work From Home'
  }) => {
    const emp = employees.find(e => e.id === employeeId || e.fullName.toLowerCase() === (employeeId || '').toLowerCase());
    if (!emp) {
      addToast(`Employee with ID or name "${employeeId}" not found.`, 'error');
      return { success: false, reason: 'EMPLOYEE_NOT_FOUND' };
    }

    const effectiveDate = date || todayStr;
    const existing = attendance.find(a => (a.employeeId === emp.id || a.employeeName === emp.fullName) && a.date === effectiveDate);
    const calculatedHours = checkOut ? Number(workHours || 8.5) : (status === 'Late' ? 7.0 : 8.0);

    const wfhRecord = {
      id: existing?.id || `ATT-WFH-${Date.now().toString().slice(-4)}`,
      employeeId: emp.id,
      employeeName: emp.fullName,
      department: emp.department,
      date: effectiveDate,
      checkIn: checkIn || '09:00 AM',
      checkOut: checkOut || (status === 'Present' || status === 'Late' ? '05:30 PM' : null),
      workHours: calculatedHours,
      status: status || 'Present',
      isWFH: true,
      workMode: 'Work From Home',
      networkVerified: true,
      networkName: 'Work From Home (HR Authorized)',
      networkLocation: 'Remote · Home Office',
      networkIp: '192.168.1.1 (Remote VPN)',
      markedBy: `HR (${currentUser?.name || 'Sophia Montgomery'})`,
      markedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: notes || 'WFH Approved & Marked by HR'
    };

    setAttendance(prev => {
      const filtered = prev.filter(a => !( (a.employeeId === emp.id || a.employeeName === emp.fullName) && a.date === effectiveDate));
      return [wfhRecord, ...filtered];
    });

    logAudit(
      'WFH Attendance Marked',
      'Attendance',
      `HR (${currentUser?.name || 'Sophia Montgomery'}) marked Work From Home attendance for ${emp.fullName} (${emp.id}) on ${effectiveDate} as ${status}.`
    );

    triggerNotification(
      'Work From Home Attendance Marked',
      `HR has marked your Work From Home (WFH) attendance for ${effectiveDate} as ${status}.`,
      'attendance',
      ['employee'],
      '/employee/attendance'
    );

    addToast(`WFH Attendance for ${emp.fullName} (${emp.id}) marked as ${status}!`, 'success');
    return { success: true, record: wfhRecord };
  };

  // =================== LEAVES ===================
  const applyLeave = (leaveData) => {
    const newId = `LEV-${500 + leaves.length + 1}`;
    const newLeave = {
      id: newId,
      employeeId: currentUser?.id === 'USR-004' ? 'EMP-1004' : (currentUser?.id || 'EMP-1004'),
      employeeName: currentUser?.name || 'Elena Rostova',
      department: currentUser?.department || 'Engineering',
      status: 'Pending',
      appliedOn: todayStr,
      approver: 'Marcus Sterling',
      remarks: '',
      ...leaveData
    };
    setLeaves(prev => [newLeave, ...prev]);
    logAudit('Leave Applied', 'Leave Management', `${newLeave.employeeName} applied for ${newLeave.leaveType} (${newLeave.days} days)`);
    triggerNotification('New Leave Application', `${newLeave.employeeName} submitted a leave request`, 'leave', ['manager', 'hr', 'owner'], '/manager/leave');
    addToast('Leave request submitted successfully!', 'success');
  };

  const approveLeave = (leaveId, remarks = '') => {
    setLeaves(prev => prev.map(l => {
      if (l.id === leaveId) {
        logAudit('Leave Approved', 'Leave Management', `Approved leave ${leaveId} for ${l.employeeName}`);
        triggerNotification('Leave Approved', `Your leave request from ${l.startDate} to ${l.endDate} was approved!`, 'leave', ['employee'], '/employee/leave');
        return { ...l, status: 'Approved', remarks: remarks || 'Approved by Manager' };
      }
      return l;
    }));
    addToast('Leave request approved!', 'success');
  };

  const rejectLeave = (leaveId, remarks = '') => {
    setLeaves(prev => prev.map(l => {
      if (l.id === leaveId) {
        logAudit('Leave Rejected', 'Leave Management', `Rejected leave ${leaveId} for ${l.employeeName}`);
        triggerNotification('Leave Request Update', `Your leave request for ${l.startDate} was not approved.`, 'leave', ['employee'], '/employee/leave');
        return { ...l, status: 'Rejected', remarks: remarks || 'Declined due to scheduling constraints.' };
      }
      return l;
    }));
    addToast('Leave request rejected.', 'info');
  };

  // =================== PAYROLL ===================
  const markPayrollPaid = (id) => {
    setPayroll(prev => prev.map(p => (p.id === id ? { ...p, status: 'Paid', paymentDate: todayStr } : p)));
    logAudit('Payroll Disbursed', 'Payroll', `Marked payslip ${id} as Paid`);
    addToast('Payroll record marked as Paid!', 'success');
  };

  // =================== ANNOUNCEMENTS ===================
  const addAnnouncement = (data) => {
    const newId = `ANC-${800 + announcements.length + 1}`;
    const newAnc = {
      id: newId,
      date: todayStr,
      author: currentUser?.name || 'Saurabh Kumar',
      authorRole: currentUser?.title || 'Executive',
      pinned: false,
      readBy: [],
      ...data
    };
    setAnnouncements(prev => [newAnc, ...prev]);
    logAudit('Announcement Published', 'Announcements', `Published: "${newAnc.title}"`);
    triggerNotification('New Announcement', newAnc.title, 'announcement', ['owner', 'hr', 'manager', 'employee'], '/employee/announcements');
    addToast('Announcement published successfully!', 'success');
  };

  const togglePinAnnouncement = (id) => {
    setAnnouncements(prev => prev.map(a => (a.id === id ? { ...a, pinned: !a.pinned } : a)));
  };

  const deleteAnnouncement = (id) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    logAudit('Announcement Deleted', 'Announcements', `Deleted announcement ${id}`);
    addToast('Announcement deleted.', 'info');
  };

  const markAnnouncementRead = (id, userId) => {
    const uid = userId || currentUser?.id || 'EMP-1004';
    setAnnouncements(prev => prev.map(a => {
      if (a.id === id && !a.readBy.includes(uid)) {
        return { ...a, readBy: [...a.readBy, uid] };
      }
      return a;
    }));
  };

  // =================== RECRUITMENT ===================
  const moveCandidateStage = (candidateId, newStage) => {
    setCandidates(prev => prev.map(c => {
      if (c.id === candidateId) {
        logAudit('Candidate Stage Moved', 'Recruitment', `Moved candidate ${c.name} to ${newStage}`);
        return { ...c, stage: newStage };
      }
      return c;
    }));
    addToast(`Candidate moved to ${newStage}`, 'info');
  };

  const addJobOpening = (jobData) => {
    const newId = `JOB-${400 + jobOpenings.length + 1}`;
    const newJob = {
      id: newId,
      status: 'Open',
      postedDate: todayStr,
      applicantsCount: 0,
      ...jobData
    };
    setJobOpenings(prev => [newJob, ...prev]);
    logAudit('Job Opening Created', 'Recruitment', `Created opening for ${newJob.title}`);
    addToast(`Job opening "${newJob.title}" created!`, 'success');
  };

  const addCandidate = (candData) => {
    const newId = `CND-${700 + candidates.length + 1}`;
    const newCand = {
      id: newId,
      stage: 'Applied',
      appliedDate: todayStr,
      rating: 4.0,
      ...candData
    };
    setCandidates(prev => [newCand, ...prev]);
    // increment applicant count on job
    setJobOpenings(prev => prev.map(j => j.id === newCand.jobId ? { ...j, applicantsCount: j.applicantsCount + 1 } : j));
    logAudit('Candidate Added', 'Recruitment', `Added candidate ${newCand.name}`);
    addToast(`Candidate ${newCand.name} registered!`, 'success');
  };

  // =================== PERFORMANCE ===================
  const addPerformanceReview = (reviewData) => {
    const newId = `PRF-${600 + performanceReviews.length + 1}`;
    const newReview = {
      id: newId,
      status: 'Reviewed',
      date: todayStr,
      ...reviewData
    };
    setPerformanceReviews(prev => [newReview, ...prev]);
    logAudit('Performance Review Added', 'Performance', `Reviewed employee ${newReview.employeeName}`);
    triggerNotification('Performance Review Available', `Review for ${newReview.reviewPeriod} has been published`, 'performance', ['employee'], '/employee/performance');
    addToast('Performance review submitted!', 'success');
  };

  // =================== NOTIFICATIONS ===================
  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast('All notifications marked as read', 'info');
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <ERPContext.Provider value={{
      employees,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      toggleEmployeeStatus,

      departments,
      addDepartment,
      updateDepartment,
      deleteDepartment,

      projects,
      addProject,
      updateProject,
      deleteProject,

      tasks,
      createTask,
      addTask,
      updateTask,
      updateTaskStatus,
      addTaskComment,
      updateTaskHours,
      deleteTask,
      calculateCompletionRate,
      calculateProductivityScore,
      getEffectiveStatus,
      currentDateRef: CURRENT_DATE_REF,

      attendance,
      checkInEmployee,
      checkOutEmployee,
      resetEmployeeAttendance,
      getTodayAttendanceForUser,
      markWFHAttendance,

      leaves,
      leaveBalances,
      applyLeave,
      approveLeave,
      rejectLeave,

      payroll,
      markPayrollPaid,

      announcements,
      addAnnouncement,
      togglePinAnnouncement,
      deleteAnnouncement,
      markAnnouncementRead,

      jobOpenings,
      candidates,
      moveCandidateStage,
      addJobOpening,
      addCandidate,

      performanceReviews,
      addPerformanceReview,

      notifications,
      markNotificationRead,
      markAllNotificationsRead,
      deleteNotification,
      triggerNotification,

      // WiFi Geofence & Network Management
      companyWifis,
      currentNetwork,
      wifiEnforcementEnabled,
      availableNetworks: AVAILABLE_SIMULATION_NETWORKS,
      switchNetwork,
      addCompanyWifi,
      deleteCompanyWifi,
      toggleWifiEnforcement,
      toggleWifiAttendance,
      getWifiNetworkInfo,
      isCurrentWifiAuthorized,

      auditLogs,
      logAudit
    }}>
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = () => {
  const context = useContext(ERPContext);
  if (!context) throw new Error('useERP must be used within ERPProvider');
  return context;
};
