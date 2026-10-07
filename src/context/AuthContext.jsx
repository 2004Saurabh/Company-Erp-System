import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../data/users';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('nexora_auth_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.name === 'Alexander Vance') {
          parsed.name = 'Saurabh Kumar';
          localStorage.setItem('nexora_auth_user', JSON.stringify(parsed));
        }
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  const [role, setRole] = useState(() => {
    const saved = localStorage.getItem('nexora_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved).role;
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('nexora_auth_user'));
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('nexora_auth_user', JSON.stringify(currentUser));
      setRole(currentUser.role);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('nexora_auth_user');
      setRole(null);
      setIsAuthenticated(false);
    }
  }, [currentUser]);

  const login = (email, password, roleHint) => {
    const cleanEmail = (email || '').trim().toLowerCase();

    let matched = null;

    // 1. Direct role keywords / aliases
    if (cleanEmail === 'staff' || cleanEmail === 'staff@company.com' || cleanEmail === 'employee' || cleanEmail === 'employee@company.com') {
      matched = INITIAL_USERS.find(u => u.role === 'employee');
    } else if (cleanEmail === 'owner' || cleanEmail === 'owner@company.com' || cleanEmail.includes('saurabh')) {
      matched = INITIAL_USERS.find(u => u.role === 'owner');
    } else if (cleanEmail === 'admin' || cleanEmail === 'admin@company.com') {
      matched = INITIAL_USERS.find(u => u.role === 'admin');
    } else if (cleanEmail === 'manager' || cleanEmail === 'manager@company.com') {
      matched = INITIAL_USERS.find(u => u.role === 'manager');
    } else if (cleanEmail === 'hr' || cleanEmail === 'hr@company.com') {
      matched = INITIAL_USERS.find(u => u.role === 'hr');
    } else if (cleanEmail) {
      // 2. Exact email match in users
      matched = INITIAL_USERS.find(
        u => u.email.toLowerCase() === cleanEmail
      );
    }

    // 3. Substring matching for staff / employee intent
    if (!matched && cleanEmail) {
      if (cleanEmail.includes('staff') || cleanEmail.includes('employee')) {
        matched = INITIAL_USERS.find(u => u.role === 'employee');
      } else if (cleanEmail.includes('admin')) {
        matched = INITIAL_USERS.find(u => u.role === 'admin');
      } else if (cleanEmail.includes('owner')) {
        matched = INITIAL_USERS.find(u => u.role === 'owner');
      }
    }

    // 4. Role-based fallback only when requested
    if (!matched && roleHint) {
      const normalizedHint = (roleHint === 'staff') ? 'employee' : roleHint;
      matched = INITIAL_USERS.find(u => u.role === normalizedHint);
    }

    if (matched) {
      localStorage.setItem('nexora_auth_user', JSON.stringify(matched));
      setCurrentUser(matched);
      setRole(matched.role);
      setIsAuthenticated(true);
      return { success: true, user: matched };
    }

    return { success: false, message: 'Invalid credentials. Please select a role card or use demo logins.' };
  };

  const switchRole = (targetRole) => {
    const roleUser = INITIAL_USERS.find(u => u.role === targetRole);
    if (roleUser) {
      localStorage.setItem('nexora_auth_user', JSON.stringify(roleUser));
      setCurrentUser(roleUser);
      setRole(roleUser.role);
      setIsAuthenticated(true);
      return { success: true, user: roleUser };
    }
    return { success: false, message: 'Role user not found' };
  };

  const logout = () => {
    localStorage.removeItem('nexora_auth_user');
    setCurrentUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  const updateProfile = (updatedFields) => {
    setCurrentUser(prev => {
      const next = { ...prev, ...updatedFields };
      localStorage.setItem('nexora_auth_user', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      role,
      isAuthenticated,
      login,
      logout,
      switchRole,
      updateProfile,
      setCurrentUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
