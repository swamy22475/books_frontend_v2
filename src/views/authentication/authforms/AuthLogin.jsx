import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from 'src/context/AuthContext';
import FullLogo from "src/layouts/full/shared/logo/FullLogo";

// Helper to decode JWT and safely extract the role
function getRoleFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || 'super_admin'; // fallback just in case
  } catch (e) {
    return 'super_admin';
  }
}
import { Button } from 'src/components/ui/button';
import { Checkbox } from 'src/components/ui/checkbox';
import { Label } from 'src/components/ui/label';
import { api } from 'src/lib/api-client';
import { IconSchool, IconBuildingBank, IconUser, IconLock, IconEye, IconEyeOff, IconMail } from '@tabler/icons-react';

const DEMO_USERS = {
  school_admin: {
    username: 'school_admin',
    password: 'admin123',
    label: 'School Admin',
    icon: IconSchool,
  },
  branch_admin: {
    username: 'branch_admin',
    password: 'branch123',
    label: 'Branch Admin',
    icon: IconBuildingBank,
  },
  teacher: {
    username: 'teacher1',
    password: 'teacher123',
    label: 'Teacher',
    icon: IconUser,
  }
};

const AuthLogin = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickLogin = (role) => {
    const demo = DEMO_USERS[role];
    if (demo) {
      setUsername(demo.username);
      setPassword(demo.password);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Username and password are required');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/super-admin/login', {
        username,
        password
      });

      localStorage.setItem('auth_token', response.access_token);

      // Try to fetch super admin profile to verify success
      try {
        const profile = await api.get('/super-admin/me');

        // The /super-admin/me endpoint doesn't return 'role', but RoleGuard needs it.
        // Extract it from the JWT token and inject it into the profile.
        const userRole = getRoleFromToken(response.access_token);
        const userProfileWithRole = { ...profile, role: userRole };

        // Update AuthContext state (so AuthGuard sees isAuthenticated = true and user.role)
        authLogin(response.access_token, userProfileWithRole);
        localStorage.setItem('auth_user', JSON.stringify(userProfileWithRole));

        if (profile.is_first_login) {
          navigate(userProfileWithRole.role === 'super_admin' ? '/super/update-password' : '/school/update-password');
        } else {
          navigate('/dashboard');
        }
      } catch (profileError) {
        console.error("Failed to fetch profile", profileError);
        localStorage.removeItem('auth_token');
        setError('Failed to fetch user profile. Please try again.');
      }

    } catch (err) {
      console.error('Login error:', err);
      if (err.response && err.response.status === 401) {
        setError('Incorrect username or password');
      } else {
        setError('Login failed. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25 mb-4 mx-auto">
          <IconSchool size={32} className="text-white" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to your school portal</p>
      </div>

      <form className="mt-6" onSubmit={handleLogin}>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Username */}
        <div className="mb-4">
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
              disabled={isLoading}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-4">
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
              disabled={isLoading}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex justify-between my-5">
          <div className="flex items-center gap-2">
            <Checkbox id="accept" />
            <Label htmlFor="accept" className="opacity-90 font-normal cursor-pointer">
              Remember this Device
            </Label>
          </div>
          <Link to={'/auth/auth2/forgot-password'} className="text-primary text-sm font-medium">
            Forgot Password ?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full mt-4"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      {/* Quick login buttons (dev only) */}
      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-3 text-center">Quick Login (Demo)</p>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(DEMO_USERS).map(([key, demo]) => (
            <button
              key={key}
              type="button"
              onClick={() => quickLogin(key)}
              className="flex flex-col items-center gap-1 p-2 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                <demo.icon size={16} className="text-blue-500" />
              </div>
              <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400 leading-tight">
                {demo.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default AuthLogin;

