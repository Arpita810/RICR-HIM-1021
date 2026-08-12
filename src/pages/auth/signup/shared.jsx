import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

// ── Input field ───────────────────────────────────────────────────────────────
export function Field({ label, error, required, children }) {
      return (
            <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        {label} {required && <span className="text-red-400">*</span>}
                  </label>
                  {children}
                  {error && <p className="mt-1 text-xs text-red-500 flex items-center gap-1">⚠ {error}</p>}
            </div>
      );
}

// ── Text input ────────────────────────────────────────────────────────────────
export function Input({ icon: Icon, error, className = '', ...props }) {
      return (
            <div className="relative">
                  {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-[18px] h-[18px]" />}
                  <input
                        {...props}
                        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-white border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${error ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200 focus:border-blue-400'
                              } ${className}`}
                  />
            </div>
      );
}

// ── Password input with show/hide ─────────────────────────────────────────────
export function PasswordInput({ show, onToggle, icon: Icon, error, ...props }) {
      return (
            <div className="relative">
                  {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-[18px] h-[18px]" />}
                  <input
                        type={show ? 'text' : 'password'}
                        {...props}
                        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-11 py-3 bg-white border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${error ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200 focus:border-blue-400'
                              }`}
                  />
                  <button type="button" onClick={onToggle}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
            </div>
      );
}

// ── Password strength meter ───────────────────────────────────────────────────
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
            { label: 'Fair', color: 'bg-amber-400', width: '60%' },
            { label: 'Strong', color: 'bg-emerald-500', width: '80%' },
            { label: 'Very Strong', color: 'bg-emerald-600', width: '100%' },
      ];
      const level = levels[Math.min(score - 1, 4)] || levels[0];

      return (
            <div className="mt-2">
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${level.color} rounded-full transition-all duration-500`} style={{ width: level.width }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Strength: <span className="font-semibold">{level.label}</span></p>
            </div>
      );
}

// ── Password match indicator ──────────────────────────────────────────────────
export function PasswordMatch({ password, confirm }) {
      if (!confirm) return null;
      if (password === confirm) {
            return <p className="mt-1 text-xs text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Passwords match</p>;
      }
      return <p className="mt-1 text-xs text-red-500">⚠ Passwords do not match</p>;
}

// ── Select dropdown ───────────────────────────────────────────────────────────
export function Select({ icon: Icon, error, children, ...props }) {
      return (
            <div className="relative">
                  {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-[18px] h-[18px] pointer-events-none" />}
                  <select
                        {...props}
                        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-white border rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 transition-all appearance-none ${error ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200 focus:border-blue-400'
                              }`}
                  >
                        {children}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▾</div>
            </div>
      );
}

// ── Submit button ─────────────────────────────────────────────────────────────
export function SubmitButton({ loading, children, gradient = 'from-blue-600 to-violet-600' }) {
      return (
            <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r ${gradient} text-white font-bold rounded-xl shadow-lg text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]`}
            >
                  {loading ? (
                        <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                  ) : children}
            </button>
      );
}

// ── Section header ────────────────────────────────────────────────────────────
export function SectionHeader({ icon, title, color = 'text-blue-600 bg-blue-50' }) {
      return (
            <div className={`flex items-center gap-2 px-3 py-2 ${color} rounded-xl mb-4`}>
                  <span className="text-base">{icon}</span>
                  <span className="text-sm font-bold">{title}</span>
            </div>
      );
}

// ── Error alert ───────────────────────────────────────────────────────────────
export function ErrorAlert({ message }) {
      if (!message) return null;
      return (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">!</span>
                  {message}
            </div>
      );
}

// ── OTP section ───────────────────────────────────────────────────────────────
export function OTPSection({ email, otpSent, otpVerified, otp, setOtp, timer, onSend, onVerify, sending, verifying }) {
      const inputRefs = React.useRef([]);

      // Handle individual digit input
      const handleDigit = (index, value) => {
            const digit = value.replace(/\D/, '').slice(-1);
            const arr = (otp || '').split('');
            arr[index] = digit;
            const newOtp = arr.join('').slice(0, 6);
            setOtp(newOtp);
            // Auto-focus next
            if (digit && index < 5) {
                  inputRefs.current[index + 1]?.focus();
            }
      };

      const handleKeyDown = (index, e) => {
            if (e.key === 'Backspace') {
                  if (!otp[index] && index > 0) {
                        inputRefs.current[index - 1]?.focus();
                  }
                  const arr = (otp || '').split('');
                  arr[index] = '';
                  setOtp(arr.join(''));
            }
            if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus();
            if (e.key === 'ArrowRight' && index < 5) inputRefs.current[index + 1]?.focus();
      };

      const handlePaste = (e) => {
            e.preventDefault();
            const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
            setOtp(pasted);
            const focusIdx = Math.min(pasted.length, 5);
            inputRefs.current[focusIdx]?.focus();
      };

      return (
            <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-base">✉️</div>
                              <div>
                                    <p className="text-sm font-bold text-blue-900">Email Verification</p>
                                    <p className="text-xs text-blue-600">
                                          {otpVerified ? 'Email verified!' : email ? `Send OTP to ${email}` : 'Enter email above first'}
                                    </p>
                              </div>
                        </div>
                        {otpVerified && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 border border-emerald-200 rounded-full">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    <span className="text-xs font-bold text-emerald-700">Verified</span>
                              </motion.div>
                        )}
                  </div>

                  <AnimatePresence mode="wait">
                        {otpVerified ? (
                              /* ── Success state ── */
                              <motion.div key="verified" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                          <p className="text-sm font-bold text-emerald-800">Email Verified Successfully!</p>
                                          <p className="text-xs text-emerald-600">{email} has been verified. You can proceed.</p>
                                    </div>
                              </motion.div>

                        ) : !otpSent ? (
                              /* ── Send OTP button ── */
                              <motion.div key="send" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                                    <motion.button type="button" onClick={onSend} disabled={!email || sending}
                                          whileHover={!sending && email ? { scale: 1.02, boxShadow: '0 8px 20px rgba(37,99,235,0.3)' } : {}}
                                          whileTap={!sending && email ? { scale: 0.98 } : {}}
                                          className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold rounded-xl text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                                          {sending ? (
                                                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending OTP...</>
                                          ) : (
                                                <><span className="text-base">📨</span> Send Verification OTP</>
                                          )}
                                    </motion.button>
                              </motion.div>

                        ) : (
                              /* ── OTP input boxes ── */
                              <motion.div key="verify" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                                    className="space-y-3">
                                    <p className="text-xs text-center text-gray-500">
                                          Enter the 6-digit code sent to <strong className="text-blue-600">{email}</strong>
                                    </p>

                                    {/* 6 individual digit boxes */}
                                    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                                          {[0, 1, 2, 3, 4, 5].map(i => (
                                                <motion.input
                                                      key={i}
                                                      ref={el => inputRefs.current[i] = el}
                                                      type="text"
                                                      inputMode="numeric"
                                                      maxLength={1}
                                                      value={otp[i] || ''}
                                                      onChange={e => handleDigit(i, e.target.value)}
                                                      onKeyDown={e => handleKeyDown(i, e)}
                                                      whileFocus={{ scale: 1.08 }}
                                                      className={`w-11 h-12 text-center text-xl font-black border-2 rounded-xl focus:outline-none transition-all duration-200 ${otp[i]
                                                                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md shadow-blue-100'
                                                                  : 'border-gray-200 bg-white text-gray-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                                                            }`}
                                                />
                                          ))}
                                    </div>

                                    {/* Verify button */}
                                    <motion.button type="button" onClick={onVerify}
                                          disabled={!otp || otp.length !== 6 || verifying}
                                          whileHover={otp.length === 6 && !verifying ? { scale: 1.02 } : {}}
                                          whileTap={otp.length === 6 && !verifying ? { scale: 0.98 } : {}}
                                          className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md">
                                          {verifying ? (
                                                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Verifying...</>
                                          ) : (
                                                <><CheckCircle2 className="w-4 h-4" /> Verify OTP</>
                                          )}
                                    </motion.button>

                                    {/* Timer / Resend */}
                                    <div className="flex items-center justify-between text-xs">
                                          <span className="text-gray-400">Didn't receive it?</span>
                                          {timer > 0 ? (
                                                <span className="font-semibold text-blue-600 tabular-nums">
                                                      Resend in {timer}s
                                                </span>
                                          ) : (
                                                <button type="button" onClick={onSend} disabled={sending}
                                                      className="font-semibold text-blue-600 hover:text-blue-700 hover:underline disabled:opacity-50 transition-colors">
                                                      {sending ? 'Sending...' : 'Resend OTP'}
                                                </button>
                                          )}
                                    </div>
                              </motion.div>
                        )}
                  </AnimatePresence>
            </div>
      );
}

// ─── Step Progress Bar ────────────────────────────────────────────────────────
export function StepProgress({ steps, current }) {
      return (
            <div className="flex items-start gap-0 mt-1">
                  {steps.map((label, i) => (
                        <React.Fragment key={label}>
                              <div className="flex flex-col items-center min-w-0">
                                    <motion.div
                                          animate={{
                                                background: i < current
                                                      ? 'linear-gradient(135deg,#10b981,#059669)'
                                                      : i === current
                                                            ? 'linear-gradient(135deg,#ffffff,#e0e7ff)'
                                                            : 'rgba(255,255,255,0.25)',
                                                scale: i === current ? 1.1 : 1,
                                          }}
                                          transition={{ duration: 0.3 }}
                                          className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black shadow-md border border-white/40"
                                          style={{ color: i === current ? '#2563eb' : i < current ? 'white' : 'rgba(255,255,255,0.7)' }}
                                    >
                                          {i < current ? '✓' : i + 1}
                                    </motion.div>
                                    <span className={`text-[9px] font-semibold mt-1 hidden sm:block truncate max-w-[52px] text-center ${i === current ? 'text-white' : i < current ? 'text-emerald-200' : 'text-white/50'
                                          }`}>
                                          {label}
                                    </span>
                              </div>
                              {i < steps.length - 1 && (
                                    <div className="flex-1 h-0.5 mt-3.5 mx-0.5 rounded-full overflow-hidden bg-white/20">
                                          <motion.div
                                                animate={{ width: i < current ? '100%' : '0%' }}
                                                transition={{ duration: 0.4, ease: 'easeOut' }}
                                                className="h-full bg-gradient-to-r from-emerald-400 to-blue-300 rounded-full"
                                          />
                                    </div>
                              )}
                        </React.Fragment>
                  ))}
            </div>
      );
}
