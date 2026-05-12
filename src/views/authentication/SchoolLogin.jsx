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
  IconAlertCircle
} from '@tabler/icons-react';
import { api } from 'src/lib/api-client';

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
      const tenantId = sessionStorage.getItem('tenant_id') || localStorage.getItem('tenant_id') || 'default';
      if (tenantId === 'default') return;
      navigate(`/${tenantId}/books`, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Authenticate with backend
      console.log('Attempting login for:', username);
      const response = await api.post('/api/v1/auth/school-login', {
        username: username.trim(),
        password: password.trim()
      });
      console.log('Login successful response:', response);

      // Save token and user data
      const token = response.access_token;
      const userData = response.user;

      if (userData.tenant_id === 'default' || userData.role === 'admin') {
        throw new Error('Please use /admin/login for admin access.');
      }

      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      localStorage.setItem('tenant_id', userData.tenant_id);

      // Call login from context to update state
      login(token, userData);
      console.log('Redirecting to:', `/${userData.tenant_id}/books`);
      navigate(`/${userData.tenant_id}/books`, { replace: true });

    } catch (err) {
      console.error('Detailed Login Error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_user');
      sessionStorage.removeItem('tenant_id');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('tenant_id');

      if (err.response && err.response.status === 401) {
        setError('Invalid username or password');
      } else {
        setError(err.message || 'Login failed. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase = "block w-full rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-60";

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-slate-50 px-4 py-8 sm:px-6">
      <div className="w-full max-w-[440px]">
        {/* Logo / branding */}
        <div className="text-center mb-6">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-xl shadow-blue-600/20 mb-4">
            <IconSchool size={32} stroke={1.8} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-950">MindWhile ERP</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to your school portal</p>
        </div>

        {/* Login card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label htmlFor="school-login-username" className="mb-2 block text-sm font-semibold text-slate-700">
                Username
              </label>
              <div className="relative">
                <IconMail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="school-login-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className={`${inputBase} py-3 pl-11 pr-4 text-base placeholder:text-slate-400`}
                  style={{ height: 48 }}
                  disabled={isLoading}
                  required />

              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="school-login-password" className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <IconLock size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="school-login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`${inputBase} py-3 pl-11 pr-12 text-base placeholder:text-slate-400`}
                  style={{ height: 48 }}
                  disabled={isLoading}
                  required />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={isLoading}>

                  {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error &&
              <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                <IconAlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            }

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-base font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60">

              {isLoading ?
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> :

                <>
                  Sign In
                  <IconArrowRight size={16} />
                </>
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SchoolLogin;
