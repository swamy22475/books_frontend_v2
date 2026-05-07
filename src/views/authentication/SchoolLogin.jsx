import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  IconSchool,
  IconMail,
  IconLock,
  IconEye,
  IconEyeOff,
  IconArrowRight,
  IconBuildingBank
} from
  '@tabler/icons-react';
import { api } from 'src/lib/api-client';

// ——————————————————————————————————————————
// Demo credentials for development / testing.
// Remove or replace with real API calls in production.
// ——————————————————————————————————————————
const DEMO_USERS = {
  school_admin: {
    password: 'admin123',
    user: {
      id: 1,
      email: 'admin@school.com',
      username: 'school_admin',
      fullName: 'School Administrator',
      role: 'school_admin',
      schoolId: 1
    }
  },
  branch_admin: {
    password: 'branch123',
    user: {
      id: 2,
      email: 'branch@school.com',
      username: 'branch_admin',
      fullName: 'Branch Administrator',
      role: 'branch_admin',
      schoolId: 1,
      branchId: 1,
      branchName: 'Main Branch'
    }
  },
  teacher: {
    password: 'teacher123',
    user: {
      id: 3,
      email: 'teacher@school.com',
      username: 'teacher1',
      fullName: 'John Teacher',
      role: 'teacher',
      schoolId: 1,
      branchId: 1,
      branchName: 'Main Branch'
    }
  }
};

const SchoolLogin = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      const savedUser = localStorage.getItem('auth_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed.role === 'super_admin') {
            navigate('/super/dashboard', { replace: true });
          } else {
            navigate('/school/book-sales', { replace: true });
          }
        } catch { 
          navigate('/school/book-sales', { replace: true });
        }
      } else {
        navigate('/school/book-sales', { replace: true });
      }
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. Authenticate with backend
      const response = await api.post('/super-admin/login', {
        username,
        password
      });

      // 2. Save token FIRST — axios interceptor needs it for the /me call
      localStorage.setItem('auth_token', response.access_token);

      // 3. Fetch profile and add role
      const profile = await api.get('/super-admin/me');
      const userData = { ...profile, role: 'super_admin' };

      // 4. Persist user to localStorage and do a full reload to ensure clean state
      localStorage.setItem('auth_user', JSON.stringify(userData));

      if (userData.is_first_login) {
        window.location.href = userData.role === 'super_admin' ? '/super/update-password' : '/school/update-password';
      } else {
        window.location.href = userData.role === 'super_admin' ? '/super/dashboard' : '/school/dashboard';
      }

    } catch (err) {
      console.error('Login error:', err);
      // Clean up any partial state
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');

      if (err.response && err.response.status === 401) {
        setError('Invalid username or password');
      } else {
        setError('Login failed. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (role) => {
    const demo = DEMO_USERS[role];
    if (demo) {
      setUsername(role);
      setPassword(demo.password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo / branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25 mb-4">
            <IconSchool size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">MindWhile ERP</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to your school portal</p>
        </div>

        {/* Login card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <IconMail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all text-sm"
                  required />

              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <IconLock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all text-sm"
                  required />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">

                  {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error &&
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm px-4 py-2.5 rounded-xl border border-red-100 dark:border-red-800">
                {error}
              </div>
            }

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed">

              {isLoading ?
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> :

                <>
                  Sign In
                  <IconArrowRight size={16} />
                </>
              }
            </button>
          </form>

          {/* Quick login buttons (dev only) */}
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-3 text-center">Quick Login (Demo)</p>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(DEMO_USERS).map(([key, demo]) =>
                <button
                  key={key}
                  onClick={() => quickLogin(key)}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center">

                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                    {key === 'branch_admin' ?
                      <IconBuildingBank size={16} className="text-blue-500" /> :

                      <IconSchool size={16} className="text-blue-500" />
                    }
                  </div>
                  <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400 leading-tight">
                    {demo.user.fullName.split(' ')[0]}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>);

};

export default SchoolLogin;