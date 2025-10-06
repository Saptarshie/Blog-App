"use client";

import React, { useEffect, useRef, useState } from 'react';
import { sendOtp, verifyOtp, ResetPasswordAction } from '@/action';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP flow state
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCooldown = (seconds = 60) => {
    setResendTimer(seconds);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    setError('');
    setSuccess('');
    if (!email) return setError('Please enter your email');

    try {
      setSendingOtp(true);
      const res = await sendOtp(email);
      if (res?.success) {
        setOtpSent(true);
        startCooldown(60);
        setSuccess('OTP sent to your email');
      } else {
        setError(res?.message || 'Failed to send OTP');
      }
    } catch (err) {
      console.error(err);
      setError('Unexpected error while sending OTP');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    setSuccess('');
    if (!email || !otp) return setError('Enter email and OTP to verify');

    try {
      setLoading(true);
      const res = await verifyOtp(email, otp);
      if (res?.success) {
        setSuccess('OTP verified — you can reset your password now');
      } else {
        setError(res?.message || 'OTP verification failed');
      }
    } catch (err) {
      console.error(err);
      setError('Unexpected error while verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !otp) return setError('Email and OTP are required');
    if (!newPassword || newPassword.length < 8) return setError('Password must be at least 8 characters');
    if (newPassword !== confirmPassword) return setError('Passwords do not match');

    try {
      setLoading(true);
      // Option A: backend ResetPasswordAction will verify OTP again (recommended)
      // Option B: you may choose to call verifyOtp() before this — not required if ResetPasswordAction verifies.

      const res = await ResetPasswordAction(email, otp, newPassword);
      if (res?.success) {
        // redirect to sign-in after success
        router.push('/authenticate/sign-in');
      } else {
        setError(res?.message || 'Failed to reset password');
      }
    } catch (err) {
      console.error(err);
      setError('Unexpected error while resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Forgot Password</h2>
        <p className="text-sm text-gray-500 mb-4">Enter your email to receive a one-time code to reset your password.</p>

        {error && <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-100 px-3 py-2 rounded">{error}</div>}
        {success && <div className="mb-3 text-sm text-green-700 bg-green-50 border border-green-100 px-3 py-2 rounded">{success}</div>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={sendingOtp || resendTimer > 0}
                className={`px-3 py-2 rounded-lg font-medium border ${sendingOtp || resendTimer > 0 ? 'opacity-60 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                {sendingOtp ? 'Sending...' : (resendTimer > 0 ? `Resend in ${Math.floor(resendTimer / 60)}:${String(resendTimer % 60).padStart(2,'0')}` : (otpSent ? 'Resend OTP' : 'Send OTP'))}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                pattern="\\d*"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="6-digit code"
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loading}
                className="px-3 py-2 rounded-lg font-medium bg-green-600 hover:bg-green-700 text-white"
              >
                Verify
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">If verification succeeds you can reset your password. ResetPasswordAction will also verify OTP server-side.</p>
          </div>

          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
                minLength={8}
                required
              />
              <p className="text-xs text-gray-400 mt-1">At least 8 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm new password"
                minLength={8}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-lg font-medium text-white ${loading ? 'bg-blue-500 opacity-80 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>

        <p className="mt-4 text-xs text-gray-400">Note: This page expects <code>sendOtp(email)</code>, <code>verifyOtp(email, otp)</code> and <code>ResetPasswordAction(email, otp, newPassword)</code> to be implemented server-side (or in your action file). ResetPasswordAction should verify the OTP and update the user's password. On success this page redirects to <code>/authenticate/sign-in</code>.</p>
      </div>
    </div>
  );
}

  