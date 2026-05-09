import { useState } from 'react';
import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';
import { Label } from 'src/components/ui/label';
import { Icon } from '@iconify/react';

const STEPS = { EMAIL: 'email', OTP: 'otp', RESET: 'reset', SUCCESS: 'success' };

const AuthForgotPassword = () => {
  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  // --- Helpers ---
  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const maskEmail = (em) => {
    const [user, domain] = em.split('@');
    return user.length <= 3
      ? user[0] + '***@' + domain
      : user.slice(0, 2) + '***' + user.slice(-1) + '@' + domain;
  };

  // --- Handlers ---
  const handleSendOtp = (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep(STEPS.OTP);
      startResendTimer();
    }, 1200);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setError('');
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter the full 6-digit code.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(STEPS.RESET);
    }, 1000);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(STEPS.SUCCESS);
    }, 1200);
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      startResendTimer();
    }, 800);
  };

  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Auto-focus next input
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      if (next) next.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      if (prev) prev.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) newOtp[i] = pasted[i] || '';
      setOtp(newOtp);
      const focusIdx = Math.min(pasted.length, 5);
      const el = document.getElementById(`otp-${focusIdx}`);
      if (el) el.focus();
    }
  };

  // --- Step indicators ---
  const stepLabels = ['Email', 'Verify', 'Reset'];
  const stepIndex = step === STEPS.EMAIL ? 0 : step === STEPS.OTP ? 1 : step === STEPS.RESET ? 2 : 3;

  return (
    <>
      {/* Progress steps (hide on success) */}
      {step !== STEPS.SUCCESS && (
        <div className="flex items-center justify-center gap-2 mb-6 mt-2">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i <= stepIndex
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-muted text-muted-foreground'
                    }`}
                >
                  {i < stepIndex ? (
                    <Icon icon="solar:check-circle-bold" width={18} />
                  ) : (
                    i + 1
                  )}
                </div>
                <span className={`text-[10px] mt-1 font-medium ${i <= stepIndex ? 'text-primary' : 'text-muted-foreground'}`}>
                  {label}
                </span>
              </div>
              {i < stepLabels.length - 1 && (
                <div className={`w-10 h-0.5 mb-4 rounded ${i < stepIndex ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-destructive/10 text-destructive text-sm">
          <Icon icon="solar:danger-triangle-bold" width={18} />
          {error}
        </div>
      )}

      {/* ─── Step 1: Enter Email ─── */}
      {step === STEPS.EMAIL && (
        <form onSubmit={handleSendOtp}>
          <div className="mb-4">
            <div className="mb-2 block">
              <Label htmlFor="forgot-email">Email Address</Label>
            </div>
            <Input
              id="forgot-email"
              type="email"
              placeholder="you@school.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </div>
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <Icon icon="svg-spinners:ring-resize" width={18} />
                Sending…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Icon icon="solar:letter-bold" width={18} />
                Send Reset Code
              </span>
            )}
          </Button>
        </form>
      )}

      {/* ─── Step 2: Verify OTP ─── */}
      {step === STEPS.OTP && (
        <form onSubmit={handleVerifyOtp}>
          <div className="text-center mb-5">
            <div className="mx-auto mb-3 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon icon="solar:chat-round-check-bold-duotone" width={28} className="text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              We sent a 6-digit code to <strong className="text-foreground">{maskEmail(email)}</strong>
            </p>
          </div>

          {/* OTP boxes */}
          <div className="flex justify-center gap-2 mb-5" onPaste={handleOtpPaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                className="w-11 h-12 text-center text-lg font-bold rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                autoFocus={i === 0}
              />
            ))}
          </div>

          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <Icon icon="svg-spinners:ring-resize" width={18} />
                Verifying…
              </span>
            ) : (
              'Verify Code'
            )}
          </Button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendTimer > 0 || loading}
              className={`text-sm font-medium transition-colors ${resendTimer > 0 ? 'text-muted-foreground cursor-not-allowed' : 'text-primary hover:underline cursor-pointer'
                }`}
            >
              {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend Code'}
            </button>
          </div>
        </form>
      )}

      {/* ─── Step 3: Reset Password ─── */}
      {step === STEPS.RESET && (
        <form onSubmit={handleResetPassword}>
          <div className="text-center mb-5">
            <div className="mx-auto mb-3 w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Icon icon="solar:shield-check-bold-duotone" width={28} className="text-emerald-500" />
            </div>
            <p className="text-sm text-muted-foreground">
              Identity verified! Create a new password for your account.
            </p>
          </div>

          <div className="mb-4">
            <div className="mb-2 block">
              <Label htmlFor="new-password">New Password</Label>
            </div>
            <Input
              id="new-password"
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </div>
          <div className="mb-4">
            <div className="mb-2 block">
              <Label htmlFor="confirm-password">Confirm Password</Label>
            </div>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <Icon icon="svg-spinners:ring-resize" width={18} />
                Resetting…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Icon icon="solar:lock-password-bold" width={18} />
                Reset Password
              </span>
            )}
          </Button>
        </form>
      )}

      {/* ─── Step 4: Success ─── */}
      {step === STEPS.SUCCESS && (
        <div className="text-center py-4">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <Icon icon="solar:check-circle-bold-duotone" width={40} className="text-emerald-500" />
          </div>
          <h4 className="text-lg font-bold mb-1">Password Reset!</h4>
          <p className="text-sm text-muted-foreground mb-6">
            Your password has been updated successfully. You can now log in with your new credentials.
          </p>
        </div>
      )}
    </>
  );
};

export default AuthForgotPassword;
