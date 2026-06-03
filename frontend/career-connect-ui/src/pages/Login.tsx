import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginApi(email, password);
      login({ userId: data.userId, email, role: data.role, token: data.token });
      if (data.role === 'EMPLOYER') navigate('/dashboard');
      else navigate('/jobs');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-20 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 -left-32 w-[30rem] h-[30rem] bg-primary/20 rounded-full blur-[100px] pointer-events-none animate-pulse-slow mix-blend-screen" />
      <div className="absolute bottom-1/4 -right-32 w-[30rem] h-[30rem] bg-secondary/20 rounded-full blur-[100px] pointer-events-none animate-pulse-slow mix-blend-screen" />

      <div className="relative w-full max-w-md animate-slide-up z-10">
        {/* Card */}
        <div className="glass-card rounded-3xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-surface border border-white/10 rounded-2xl mb-2">
              <Briefcase className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-on-surface">Welcome back</h1>
            <p className="text-sm text-on-surface-variant">Sign in to your CareerConnect AI account</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-error/10 border border-error/20 text-error text-sm rounded-xl px-4 py-3 flex items-center gap-2">
              <span className="text-error">⚠</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-on-surface-variant">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 text-sm text-on-surface bg-surface border border-white/10 rounded-xl focus:outline-none focus:border-primary transition-colors placeholder-on-surface-variant/50"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-on-surface-variant">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 text-sm text-on-surface bg-surface border border-white/10 rounded-xl focus:outline-none focus:border-primary transition-colors placeholder-on-surface-variant/50"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-primary text-on-primary font-semibold rounded-xl hover:scale-105 transition-transform duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(137,206,255,0.4)]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-on-surface-variant font-medium">NEW TO CAREERCONNECT?</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <Link to="/register" id="goto-register-link" className="w-full flex items-center justify-center gap-2 py-3 px-4 glass border border-white/10 text-on-surface font-semibold rounded-xl hover:bg-white/5 transition-all duration-200 text-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            Create your free account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
