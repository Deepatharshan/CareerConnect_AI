import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Mail, Lock, Eye, EyeOff, ArrowRight, User, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { register as registerApi } from '../api';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'JOB_SEEKER' | 'EMPLOYER'>('JOB_SEEKER');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setError('');
    setLoading(true);
    try {
      const data = await registerApi(email, password, role);
      login({ userId: data.userId, email, role: data.role, token: data.token });
      if (data.role === 'EMPLOYER') navigate('/dashboard');
      else navigate('/jobs');
    } catch {
      setError('Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-20 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/4 -right-32 w-[30rem] h-[30rem] bg-primary/20 rounded-full blur-[100px] pointer-events-none animate-pulse-slow mix-blend-screen" />
      <div className="absolute bottom-1/4 -left-32 w-[30rem] h-[30rem] bg-secondary/20 rounded-full blur-[100px] pointer-events-none animate-pulse-slow mix-blend-screen" />

      <div className="relative w-full max-w-md animate-slide-up z-10">
        <div className="glass-card rounded-3xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-surface border border-white/10 rounded-2xl mb-2">
              <Briefcase className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-on-surface">Create your account</h1>
            <p className="text-sm text-on-surface-variant">Join thousands of professionals on CareerConnect AI</p>
          </div>

          {/* Role Picker */}
          <div className="grid grid-cols-2 gap-3">
            <button
              id="role-jobseeker-btn"
              type="button"
              onClick={() => setRole('JOB_SEEKER')}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-200 ${role === 'JOB_SEEKER' ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(137,206,255,0.2)]' : 'border-white/10 hover:border-white/20 bg-surface'}`}
            >
              <div className={`p-2.5 rounded-xl ${role === 'JOB_SEEKER' ? 'bg-primary' : 'bg-surface-container'}`}>
                <User className={`w-5 h-5 ${role === 'JOB_SEEKER' ? 'text-on-primary' : 'text-on-surface-variant'}`} />
              </div>
              <span className={`text-sm font-semibold ${role === 'JOB_SEEKER' ? 'text-primary' : 'text-on-surface-variant'}`}>Job Seeker</span>
              <span className="text-xs text-on-surface-variant/50 text-center">Find & apply to jobs</span>
            </button>

            <button
              id="role-employer-btn"
              type="button"
              onClick={() => setRole('EMPLOYER')}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-200 ${role === 'EMPLOYER' ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(137,206,255,0.2)]' : 'border-white/10 hover:border-white/20 bg-surface'}`}
            >
              <div className={`p-2.5 rounded-xl ${role === 'EMPLOYER' ? 'bg-primary' : 'bg-surface-container'}`}>
                <Building2 className={`w-5 h-5 ${role === 'EMPLOYER' ? 'text-on-primary' : 'text-on-surface-variant'}`} />
              </div>
              <span className={`text-sm font-semibold ${role === 'EMPLOYER' ? 'text-primary' : 'text-on-surface-variant'}`}>Employer</span>
              <span className="text-xs text-on-surface-variant/50 text-center">Post jobs & hire talent</span>
            </button>
          </div>

          {error && (
            <div className="bg-error/10 border border-error/20 text-error text-sm rounded-xl px-4 py-3">
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-on-surface-variant">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                <input
                  id="register-email"
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
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Min. 6 characters"
                  className="w-full pl-10 pr-12 py-3 text-sm text-on-surface bg-surface border border-white/10 rounded-xl focus:outline-none focus:border-primary transition-colors placeholder-on-surface-variant/50"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password strength indicator */}
              <div className="flex gap-1 pt-1">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${password.length >= i * 2 ? (password.length >= 8 ? 'bg-green-400' : 'bg-yellow-400') : 'bg-surface-container-high'}`} />
                ))}
              </div>
            </div>

            <button
              id="register-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-primary text-on-primary font-semibold rounded-xl hover:scale-105 transition-transform duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(137,206,255,0.4)]"
            >
              {loading ? <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-center text-sm text-on-surface-variant">
            Already have an account?{' '}
            <Link to="/login" id="goto-login-link" className="font-semibold text-primary hover:text-primary-fixed transition-colors">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
