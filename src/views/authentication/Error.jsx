import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "src/components/ui/button";
import ErrorImg from "src/assets/images/backgrounds/errorimg.svg";

/**
 * Smart error page that redirects based on context:
 *
 * RULES (strict):
 * 1. No session (no auth_token) → auto-redirect to /auth/login after 2s
 * 2. Came from /school/* routes → button goes to /school/dashboard
 * 3. Came from /super/* routes → button goes to /super/dashboard
 * 4. Fallback → check user role from localStorage:
 *    - super_admin → /super/dashboard
 *    - all other roles → /school/dashboard
 * 5. No role info at all → /auth/login
 */
const Error = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const hasSession = !!localStorage.getItem('auth_token');

  // Determine dashboard from route state (passed by catch-all redirects in Router.jsx)
  const from = location.state?.from; // 'school' | 'super' | 'root'

  const getDashboardPath = () => {
    // Priority 1: Use route context if available
    if (from === 'school') return '/school/dashboard';
    if (from === 'super') return '/super/dashboard';

    // Priority 2: Check user role from localStorage
    try {
      const savedUser = localStorage.getItem('auth_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.role === 'super_admin') return '/super/dashboard';
        if (parsed.role) return '/school/dashboard';
      }
    } catch { /* ignore */ }

    // Priority 3: No info → go to login
    return '/auth/login';
  };

  // No session → auto-redirect to login
  useEffect(() => {
    if (!hasSession) {
      const timer = setTimeout(() => {
        navigate('/auth/login', { replace: true });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [hasSession, navigate]);

  const handleGoHome = () => {
    if (hasSession) {
      navigate(getDashboardPath(), { replace: true });
    } else {
      navigate('/auth/login', { replace: true });
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-white dark:bg-dark">
      <div className="text-center">
        <img src={ErrorImg} alt="error" className="mb-4" width={500} />
        <h1 className="text-ld text-4xl mb-6">Opps!!!</h1>
        <h6 className="text-xl text-ld">
          This page you are looking for could not be found.
        </h6>
        {!hasSession && (
          <p className="text-sm text-muted-foreground mt-2">
            Redirecting to login...
          </p>
        )}
        <Button
          variant="default"
          className="w-fit mt-6 mx-auto rounded-md"
          onClick={handleGoHome}
        >
          {hasSession ? 'Go to Dashboard' : 'Go to Login'}
        </Button>
      </div>
    </div>
  );
};

export default Error;
