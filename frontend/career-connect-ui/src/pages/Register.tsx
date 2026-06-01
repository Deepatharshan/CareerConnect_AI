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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white flex items-center justify-center px-4 pt-20 pb-10">
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-sky-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className="relative w-full max-w-md animate-slide-up">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200 border border-white/80 p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl shadow-lg shadow-blue-200 mb-2">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
            <p className="text-sm text-slate-500">Join thousands of professionals on CareerConnect AI</p>
          </div>

          {/* Role Picker */}
          <div className="grid grid-cols-2 gap-3">
            <button
              id="role-jobseeker-btn"
              type="button"
              onClick={() => setRole('JOB_SEEKER')}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 ${role === 'JOB_SEEKER' ? 'border-blue-500 bg-blue-50 shadow-sm shadow-blue-100' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
            >
              <div className={`p-2.5 rounded-xl ${role === 'JOB_SEEKER' ? 'bg-blue-500' : 'bg-slate-100'}`}>
                <User className={`w-5 h-5 ${role === 'JOB_SEEKER' ? 'text-white' : 'text-slate-500'}`} />
              </div>
              <span className={`text-sm font-semibold ${role === 'JOB_SEEKER' ? 'text-blue-700' : 'text-slate-600'}`}>Job Seeker</span>
              <span className="text-xs text-slate-400 text-center">Find & apply to jobs</span>
            </button>

            <button
              id="role-employer-btn"
              type="button"
              onClick={() => setRole('EMPLOYER')}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 ${role === 'EMPLOYER' ? 'border-blue-500 bg-blue-50 shadow-sm shadow-blue-100' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
            >
              <div className={`p-2.5 rounded-xl ${role === 'EMPLOYER' ? 'bg-blue-500' : 'bg-slate-100'}`}>
                <Building2 className={`w-5 h-5 ${role === 'EMPLOYER' ? 'text-white' : 'text-slate-500'}`} />
              </div>
              <span className={`text-sm font-semibold ${role === 'EMPLOYER' ? 'text-blue-700' : 'text-slate-600'}`}>Employer</span>
              <span className="text-xs text-slate-400 text-center">Post jobs & hire talent</span>
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all placeholder-slate-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Min. 6 characters"
                  className="w-full pl-10 pr-12 py-3 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all placeholder-slate-400"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password strength indicator */}
              <div className="flex gap-1 pt-1">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${password.length >= i * 2 ? (password.length >= 8 ? 'bg-green-400' : 'bg-yellow-400') : 'bg-slate-200'}`} />
                ))}
              </div>
            </div>

            <button
              id="register-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-blue-700 to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" id="goto-login-link" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
