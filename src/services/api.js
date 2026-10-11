// NEXORA ERP API Service Client
// Communicates with Node.js Express + SQLite backend via /api endpoints

const API_BASE = '/api';

const request = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || errData.message || `Request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn(`[API] ${options.method || 'GET'} ${endpoint} failed:`, err.message);
    throw err;
  }
};

export const api = {
  // Health
  checkHealth: () => request('/health'),

  // Auth
  auth: {
    login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    getUsers: () => request('/auth/users')
  },

  // Employees
  employees: {
    getAll: () => request('/employees'),
    getById: (id) => request(`/employees/${id}`),
    create: (data) => request('/employees', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    toggleStatus: (id) => request(`/employees/${id}/toggle-status`, { method: 'PATCH' }),
    delete: (id) => request(`/employees/${id}`, { method: 'DELETE' })
  },

  // Departments
  departments: {
    getAll: () => request('/departments'),
    create: (data) => request('/departments', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/departments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/departments/${id}`, { method: 'DELETE' })
  },

  // Projects
  projects: {
    getAll: () => request('/projects'),
    create: (data) => request('/projects', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/projects/${id}`, { method: 'DELETE' })
  },

  // Tasks
  tasks: {
    getAll: (params = '') => request(`/tasks${params}`),
    create: (data) => request('/tasks', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    updateStatus: (id, status) => request(`/tasks/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    addComment: (id, text, author, authorRole, avatar) => request(`/tasks/${id}/comments`, { method: 'POST', body: JSON.stringify({ text, author, authorRole, avatar }) }),
    updateHours: (id, actualHours) => request(`/tasks/${id}/hours`, { method: 'PATCH', body: JSON.stringify({ actualHours }) }),
    delete: (id) => request(`/tasks/${id}`, { method: 'DELETE' })
  },

  // Attendance & WFH
  attendance: {
    getAll: () => request('/attendance'),
    getToday: (date) => request(`/attendance/today${date ? `?date=${date}` : ''}`),
    checkIn: (data) => request('/attendance/check-in', { method: 'POST', body: JSON.stringify(data) }),
    checkOut: (data) => request('/attendance/check-out', { method: 'POST', body: JSON.stringify(data) }),
    reset: (data) => request('/attendance/reset', { method: 'POST', body: JSON.stringify(data) }),
    markWFH: (data) => request('/attendance/wfh', { method: 'POST', body: JSON.stringify(data) }),
    getWFHAuthorized: () => request('/attendance/wfh-authorized'),
    authorizeWFH: (data) => request('/attendance/wfh-authorize', { method: 'POST', body: JSON.stringify(data) }),
    revokeWFH: (empId) => request(`/attendance/wfh-authorize/${empId}`, { method: 'DELETE' })
  },

  // Digital ID Badges
  idCards: {
    getAll: () => request('/id-cards'),
    getByEmployee: (empId) => request(`/id-cards/employee/${empId}`),
    request: (data) => request('/id-cards/request', { method: 'POST', body: JSON.stringify(data) }),
    approve: (id, data) => request(`/id-cards/${id}/approve`, { method: 'POST', body: JSON.stringify(data) }),
    reject: (id, data) => request(`/id-cards/${id}/reject`, { method: 'POST', body: JSON.stringify(data) }),
    adminIssue: (data) => request('/id-cards/admin-issue', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id) => request(`/id-cards/${id}`, { method: 'DELETE' })
  },

  // Leaves & Balances
  leaves: {
    getAll: () => request('/leaves'),
    apply: (data) => request('/leaves', { method: 'POST', body: JSON.stringify(data) }),
    approve: (id, reviewedBy) => request(`/leaves/${id}/approve`, { method: 'PUT', body: JSON.stringify({ reviewedBy }) }),
    reject: (id, reviewedBy) => request(`/leaves/${id}/reject`, { method: 'PUT', body: JSON.stringify({ reviewedBy }) }),
    getBalances: () => request('/leaves/balances')
  },

  // Payroll
  payroll: {
    getAll: () => request('/payroll'),
    create: (data) => request('/payroll', { method: 'POST', body: JSON.stringify(data) }),
    markPaid: (id) => request(`/payroll/${id}/pay`, { method: 'PUT' })
  },

  // Inventory Management
  inventory: {
    getProducts: () => request('/inventory/products'),
    getProductById: (id) => request(`/inventory/products/${id}`),
    createProduct: (data) => request('/inventory/products', { method: 'POST', body: JSON.stringify(data) }),
    updateProduct: (id, data) => request(`/inventory/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteProduct: (id) => request(`/inventory/products/${id}`, { method: 'DELETE' }),

    getMovements: () => request('/inventory/movements'),
    stockIn: (data) => request('/inventory/stock-in', { method: 'POST', body: JSON.stringify(data) }),
    stockOut: (data) => request('/inventory/stock-out', { method: 'POST', body: JSON.stringify(data) }),

    getSuppliers: () => request('/inventory/suppliers'),
    createSupplier: (data) => request('/inventory/suppliers', { method: 'POST', body: JSON.stringify(data) }),
    updateSupplier: (id, data) => request(`/inventory/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteSupplier: (id) => request(`/inventory/suppliers/${id}`, { method: 'DELETE' }),

    getPurchaseOrders: () => request('/inventory/purchase-orders'),
    createPurchaseOrder: (data) => request('/inventory/purchase-orders', { method: 'POST', body: JSON.stringify(data) }),
    updatePOStatus: (id, status) => request(`/inventory/purchase-orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    receivePurchaseOrder: (id, data = {}) => request(`/inventory/purchase-orders/${id}/receive`, { method: 'POST', body: JSON.stringify(data) })
  },

  // Company WiFis & Geofencing
  wifis: {
    getAll: () => request('/wifis'),
    create: (data) => request('/wifis', { method: 'POST', body: JSON.stringify(data) }),
    toggleAttendance: (id, attendanceEnabled) => request(`/wifis/${id}/attendance`, { method: 'PUT', body: JSON.stringify({ attendanceEnabled }) }),
    delete: (id) => request(`/wifis/${id}`, { method: 'DELETE' })
  },

  // Announcements
  announcements: {
    getAll: () => request('/announcements'),
    create: (data) => request('/announcements', { method: 'POST', body: JSON.stringify(data) }),
    togglePin: (id) => request(`/announcements/${id}/pin`, { method: 'PUT' }),
    markRead: (id, userId) => request(`/announcements/${id}/read`, { method: 'POST', body: JSON.stringify({ userId }) }),
    delete: (id) => request(`/announcements/${id}`, { method: 'DELETE' })
  },

  // Notifications
  notifications: {
    getAll: () => request('/notifications'),
    create: (data) => request('/notifications', { method: 'POST', body: JSON.stringify(data) }),
    markRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
    markAllRead: () => request('/notifications/read-all', { method: 'PUT' }),
    delete: (id) => request(`/notifications/${id}`, { method: 'DELETE' })
  },

  // Audit Logs
  audit: {
    getAll: () => request('/audit-logs'),
    log: (data) => request('/audit-logs', { method: 'POST', body: JSON.stringify(data) })
  },

  // Recruitment
  recruitment: {
    getJobs: () => request('/recruitment/jobs'),
    createJob: (data) => request('/recruitment/jobs', { method: 'POST', body: JSON.stringify(data) }),
    getCandidates: () => request('/recruitment/candidates'),
    createCandidate: (data) => request('/recruitment/candidates', { method: 'POST', body: JSON.stringify(data) }),
    updateStage: (id, stage) => request(`/recruitment/candidates/${id}/stage`, { method: 'PUT', body: JSON.stringify({ stage }) })
  },

  // Performance Reviews
  performance: {
    getAll: () => request('/performance'),
    create: (data) => request('/performance', { method: 'POST', body: JSON.stringify(data) })
  }
};

export default api;
