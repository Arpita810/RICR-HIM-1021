import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../../../api/axios';
import toast from 'react-hot-toast';

export default function useOTP() {
      const [otpSent, setOtpSent] = useState(false);
      const [otpVerified, setOtpVerified] = useState(false);
      const [otp, setOtp] = useState('');
      const [timer, setTimer] = useState(0);
      const [sending, setSending] = useState(false);
      const [verifying, setVerifying] = useState(false);
      const [attempts, setAttempts] = useState(0);
      const intervalRef = useRef(null);

      // ── Countdown timer ─────────────────────────────────────────────────────
      const startTimer = useCallback((seconds = 60) => {
            clearInterval(intervalRef.current);
            setTimer(seconds);
            intervalRef.current = setInterval(() => {
                  setTimer(t => {
                        if (t <= 1) { clearInterval(intervalRef.current); return 0; }
                        return t - 1;
                  });
            }, 1000);
      }, []);

      useEffect(() => () => clearInterval(intervalRef.current), []);

      // ── Send OTP ────────────────────────────────────────────────────────────
      const sendOTP = useCallback(async (email, purpose = 'register') => {
            if (!email) {
                  toast.error('Please enter your email address first');
                  return false;
            }
            if (!/^\S+@\S+\.\S+$/.test(email)) {
                  toast.error('Please enter a valid email address');
                  return false;
            }

            setSending(true);
            try {
                  const { data } = await api.post('/auth/send-otp', { email, purpose });

                  toast.success(data.message || 'OTP sent to your email!', { duration: 5000 });

                  // Dev mode hint
                  if (data.devNote) {
                        toast('💡 Dev mode: Check server console for OTP', {
                              icon: '🔧',
                              style: { background: '#1e293b', color: '#94a3b8' },
                              duration: 8000,
                        });
                  }

                  setOtpSent(true);
                  setOtp('');
                  setAttempts(0);
                  startTimer(60);
                  return true;
            } catch (err) {
                  const msg = err.response?.data?.message || 'Failed to send OTP. Please try again.';
                  toast.error(msg);
                  return false;
            } finally {
                  setSending(false);
            }
      }, [startTimer]);

      // ── Verify OTP ──────────────────────────────────────────────────────────
      const verifyOTP = useCallback(async (email, purpose = 'register') => {
            if (!otp || otp.length !== 6) {
                  toast.error('Please enter the complete 6-digit OTP');
                  return false;
            }

            setVerifying(true);
            try {
                  const { data } = await api.post('/auth/verify-otp', { email, otp, purpose });

                  toast.success(data.message || '✅ Email verified successfully!', { duration: 5000 });
                  setOtpVerified(true);
                  clearInterval(intervalRef.current);
                  setTimer(0);
                  return true;
            } catch (err) {
                  const msg = err.response?.data?.message || 'Invalid OTP. Please try again.';
                  toast.error(msg);
                  setAttempts(a => a + 1);
                  return false;
            } finally {
                  setVerifying(false);
            }
      }, [otp]);

      // ── Reset ───────────────────────────────────────────────────────────────
      const reset = useCallback(() => {
            setOtpSent(false);
            setOtpVerified(false);
            setOtp('');
            setTimer(0);
            setAttempts(0);
            clearInterval(intervalRef.current);
      }, []);

      return {
            otpSent, otpVerified,
            otp, setOtp,
            timer, sending, verifying, attempts,
            sendOTP, verifyOTP, reset,
      };
}
