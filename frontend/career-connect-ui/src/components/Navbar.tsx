import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, Sparkles, Menu, X, LogOut, LayoutDashboard, UserRound, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed w-full z-50 top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl shadow-lg group-hover:shadow-blue-200 transition-all duration-300">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-blue-700">
              CareerConnect <span className="text-blue-600">AI</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/jobs" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/jobs') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'}`}>
              Find Jobs
            </Link>
            {isAuthenticated && user?.role === 'EMPLOYER' && (
              <Link to="/dashboard" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/dashboard') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'}`}>
                Dashboard
              </Link>
            )}
            {isAuthenticated && user?.role === 'JOB_SEEKER' && (
              <Link to="/workspace" className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/workspace') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'}`}>
                <UserRound className="w-4 h-4" />
                Workspace
              </Link>
            )}
            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link to="/admin" className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/admin') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'}`}>
                <ShieldCheck className="w-4 h-4" />
                Admin
              </Link>
            )}
            <Link to="/ai-studio" className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/ai-studio') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'}`}>
              <Sparkles className="w-4 h-4 text-sky-400" />
              AI Studio
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold">
                    {user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-blue-800">{user?.email?.split('@')[0]}</span>
                  <span className="text-xs text-blue-500 bg-blue-100 px-1.5 py-0.5 rounded-full">{user?.role}</span>
                </div>
                <button
                  id="logout-btn"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" id="signin-btn" className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-700 rounded-lg hover:bg-slate-50 transition-all duration-200">
                  Sign In
                </Link>
                <Link to="/register" id="getstarted-btn" className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-700 to-blue-500 rounded-xl shadow-md hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 transition-all duration-300">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 text-slate-600 hover:text-blue-600" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-2 animate-fade-in">
          <Link to="/jobs" className="flex items-center gap-2 px-4 py-3 rounded-xl text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-medium transition-all" onClick={() => setMobileOpen(false)}>Find Jobs</Link>
          {isAuthenticated && user?.role === 'JOB_SEEKER' && (
            <Link to="/workspace" className="flex items-center gap-2 px-4 py-3 rounded-xl text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-medium transition-all" onClick={() => setMobileOpen(false)}>
              <UserRound className="w-4 h-4" /> Workspace
            </Link>
          )}
          <Link to="/ai-studio" className="flex items-center gap-2 px-4 py-3 rounded-xl text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-medium transition-all" onClick={() => setMobileOpen(false)}>
            <Sparkles className="w-4 h-4" /> AI Studio
          </Link>
          {isAuthenticated && user?.role === 'EMPLOYER' && (
            <Link to="/dashboard" className="flex items-center gap-2 px-4 py-3 rounded-xl text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-medium transition-all" onClick={() => setMobileOpen(false)}>
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
          )}
          {isAuthenticated ? (
            <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-medium transition-all">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-2 px-4 py-3 rounded-xl text-slate-700 hover:bg-blue-50 font-medium transition-all" onClick={() => setMobileOpen(false)}>Sign In</Link>
              <Link to="/register" className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white bg-blue-600 font-medium transition-all" onClick={() => setMobileOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
