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
    <nav className="fixed top-0 w-full z-50 bg-surface/60 backdrop-blur-xl border-b border-white/10 shadow-2xl">
      <div className="max-w-container-max mx-auto px-margin-desktop flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 flex items-center justify-center bg-primary/20 rounded-xl border border-primary/40 group-hover:bg-primary/30 transition-colors">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          <span className="font-headline-md text-headline-md font-bold text-primary drop-shadow-[0_0_8px_rgba(137,206,255,0.5)]">
            CareerConnect AI
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/jobs" className={`font-body-md text-body-md font-medium transition-all duration-300 ${isActive('/jobs') ? 'text-primary border-b-2 border-primary pb-1 font-bold' : 'text-on-surface-variant hover:text-primary'}`}>
            Find Jobs
          </Link>
          {isAuthenticated && user?.role === 'EMPLOYER' && (
            <Link to="/dashboard" className={`font-body-md text-body-md font-medium transition-all duration-300 ${isActive('/dashboard') ? 'text-primary border-b-2 border-primary pb-1 font-bold' : 'text-on-surface-variant hover:text-primary'}`}>
              Dashboard
            </Link>
          )}
          {isAuthenticated && user?.role === 'JOB_SEEKER' && (
            <Link to="/workspace" className={`font-body-md text-body-md font-medium transition-all duration-300 ${isActive('/workspace') ? 'text-primary border-b-2 border-primary pb-1 font-bold' : 'text-on-surface-variant hover:text-primary'}`}>
              Workspace
            </Link>
          )}
          {isAuthenticated && user?.role === 'ADMIN' && (
            <Link to="/admin" className={`font-body-md text-body-md font-medium transition-all duration-300 ${isActive('/admin') ? 'text-primary border-b-2 border-primary pb-1 font-bold' : 'text-on-surface-variant hover:text-primary'}`}>
              Admin
            </Link>
          )}
          <Link to="/ai-studio" className={`flex items-center gap-1 font-body-md text-body-md font-medium transition-all duration-300 ${isActive('/ai-studio') ? 'text-primary border-b-2 border-primary pb-1 font-bold' : 'text-on-surface-variant hover:text-primary'}`}>
            <Sparkles className="w-4 h-4 text-primary" />
            AI Studio
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-lg border border-white/10">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold border border-primary/30">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-on-surface">{user?.email?.split('@')[0]}</span>
                <span className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded-full border border-primary/20">{user?.role}</span>
              </div>
              <button
                id="logout-btn"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-error hover:bg-error/10 rounded-xl transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" id="signin-btn" className="text-on-surface-variant hover:text-primary transition-colors font-medium">
                Sign In
              </Link>
              <Link to="/register" id="getstarted-btn" className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-full font-bold scale-105 active:scale-95 transition-transform hover:shadow-[0_0_15px_rgba(137,206,255,0.4)]">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 text-on-surface-variant hover:text-primary" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface-container border-t border-white/10 px-4 py-4 space-y-2">
          <Link to="/jobs" className="flex items-center gap-2 px-4 py-3 rounded-xl text-on-surface hover:bg-white/5 transition-all" onClick={() => setMobileOpen(false)}>Find Jobs</Link>
          {isAuthenticated && user?.role === 'JOB_SEEKER' && (
            <Link to="/workspace" className="flex items-center gap-2 px-4 py-3 rounded-xl text-on-surface hover:bg-white/5 transition-all" onClick={() => setMobileOpen(false)}>
              <UserRound className="w-4 h-4" /> Workspace
            </Link>
          )}
          <Link to="/ai-studio" className="flex items-center gap-2 px-4 py-3 rounded-xl text-on-surface hover:bg-white/5 transition-all" onClick={() => setMobileOpen(false)}>
            <Sparkles className="w-4 h-4 text-primary" /> AI Studio
          </Link>
          {isAuthenticated && user?.role === 'EMPLOYER' && (
            <Link to="/dashboard" className="flex items-center gap-2 px-4 py-3 rounded-xl text-on-surface hover:bg-white/5 transition-all" onClick={() => setMobileOpen(false)}>
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
          )}
          {isAuthenticated ? (
            <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-error hover:bg-error/10 font-medium transition-all">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-2 px-4 py-3 rounded-xl text-on-surface hover:bg-white/5 transition-all" onClick={() => setMobileOpen(false)}>Sign In</Link>
              <Link to="/register" className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-on-primary-container bg-primary-container font-medium transition-all" onClick={() => setMobileOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
