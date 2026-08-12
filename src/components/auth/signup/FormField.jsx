import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function FormField({ label, error, icon: Icon, type = 'text', required, children, hint, ...props }) {
      const [show, setShow] = useState(false);
      const isPassword = type === 'password';
      const inputType = isPassword ? (show ? 'text' : 'password') : type;

      return (
            <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        {label} {required && <span className="text-red-400">*</span>}
                  </label>
                  <div className="relative">
                        {Icon && (
                              <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-[18px] h-[18px] pointer-events-none" />
                        )}
                        {children ? children : (
                              <input
                                    type={inputType}
                                    {...props}
                                    className={`w-full ${Icon ? 'pl-10' : 'pl-4'} ${isPassword ? 'pr-11' : 'pr-4'} py-3 bg-white border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${error
                                                ? 'border-red-300 focus:ring-red-200'
                                                : 'border-gray-200 focus:ring-blue-200 focus:border-blue-400'
                                          }`}
                              />
                        )}
                        {isPassword && (
                              <button
                                    type="button"
                                    onClick={() => setShow(!show)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                        )}
                  </div>
                  {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
                  {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
      );
}

export function PasswordStrength({ password }) {
      if (!password) return null;
      let score = 0;
      if (password.length >= 8) score++;
      if (/[A-Z]/.test(password)) score++;
      if (/[a-z]/.test(password)) score++;
      if (/\d/.test(password)) score++;
      if (/[^A-Za-z0-9]/.test(password)) score++;

      const levels = [
            { label: 'Very Weak', color: 'bg-red-500', width: '20%' },
            { label: 'Weak', color: 'bg-orange-400', width: '40%' },
            { label: 'Fair', color: 'bg-yellow-400', width: '60%' },
            { label: 'Strong', color: 'bg-blue-500', width: '80%' },
            { label: 'Very Strong', color: 'bg-emerald-500', width: '100%' },
      ];
      const level = levels[Math.max(0, score - 1)] || levels[0];

      return (
            <div className="mt-2">
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                              className={`h-full ${level.color} rounded-full transition-all duration-500`}
                              style={{ width: level.width }}
                        />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                        Strength: <span className="font-semibold">{level.label}</span>
                  </p>
            </div>
      );
}

export function OTPSection({ email, onVerified }) {
      const [sent, setSent] = useState(false);
      const [otp, setOtp] = useState('');
      const [loading, setLoading] = useState(false);
      const [verified, setVerified] = useState(false);
      const [error, setError] = useState('');
      const [timer, setTimer] = useState(0);

      const startTimer = () => {
            setTimer(60);
            const interval = setInterval(() => {
                  setTimer((t) => {
                        if (t <= 1) { clearInterval(interval); return 0; }
                        return t - 1;
                  });
            }, 1000);
      };

      const sendOTP = async () => {
            if (!email) { setError('Enter your email first'); return; }
            setLoading(true); setError('');
            try {
                  const res = await fetch('/api/auth/send-otp', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, purpose: 'register' }),
                  });
                  const data = await res.json();
                  if (data.success) { setSent(true); startTimer(); }
                  else setError(data.message);
            } catch { setError('Failed to send OTP'); }
            finally { setLoading(false); }
      };

      const verifyOTP = async () => {
            if (!otp || otp.length !== 6) { setError('Enter 6-digit OTP'); return; }
            setLoading(true); setError('');
            try {
                  const res = await fetch('/api/auth/verify-otp', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, otp, purpose: 'register' }),
                  });
                  const data = await res.json();
                  if (data.success) { setVerified(true); onVerified?.(); }
                  else setError(data.message);
            } catch { setError('Verification failed'); }
            finally { setLoading(false); }
      };

      if (verified) {
            return (
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <span className="text-emerald-500 text-lg">✓</span>
                        <span className="text-sm font-semibold text-emerald-700">Email verified successfully!</span>
                  </div>
            );
      }

      return (
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-3">
                  <p className="text-sm font-semibold text-blue-800">📧 Email Verification</p>
                  {error && <p className="text-xs text-red-500">{error}</p>}
                  {!sent ? (
                        <button
                              type="button"
                              onClick={sendOTP}
                              disabled={loading || !email}
                              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-bold rounded-xl disabled:opacity-60"
                        >
                              {loading ? 'Sending...' : 'Send OTP to Email'}
                        </button>
                  ) : (
                        <div className="space-y-2">
                              <div className="flex gap-2">
                                    <input
                                          type="text"
                                          value={otp}
                                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                          placeholder="Enter 6-digit OTP"
                                          className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-center tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-blue-200"
                                          maxLength={6}
                                    />
                                    <button
                                          type="button"
                                          onClick={verifyOTP}
                                          disabled={loading}
                                          className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-bold rounded-xl disabled:opacity-60"
                                    >
                                          {loading ? '...' : 'Verify'}
                                    </button>
                              </div>
                              <div className="flex items-center justify-between">
                                    <p className="text-xs text-gray-500">OTP sent to {email}</p>
                                    {timer > 0 ? (
                                          <p className="text-xs text-gray-400">Resend in {timer}s</p>
                                    ) : (
                                          <button type="button" onClick={sendOTP} className="text-xs text-blue-600 font-semibold hover:underline">
                                                Resend OTP
                                          </button>
                                    )}
                              </div>
                        </div>
                  )}
            </div>
      );
}
