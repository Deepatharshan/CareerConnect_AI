import { Link } from 'react-router-dom';
import { Search, Navigation, Sparkles, Star, ArrowRight, Briefcase, Zap, Shield, Globe } from 'lucide-react';

const stats = [
  { label: 'Active Jobs', value: '50K+' },
  { label: 'Companies', value: '8K+' },
  { label: 'Hired This Month', value: '12K+' },
];

const features = [
  {
    icon: <Sparkles className="w-6 h-6 text-sky-400" />,
    title: 'AI CV Analysis',
    desc: 'Get an ATS score instantly. Our AI identifies missing skills and tells you exactly how to improve your resume for specific roles.',
  },
  {
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    title: 'Smart Job Matching',
    desc: 'Stop scrolling. Our recommendation engine surfaces the top 10 jobs that truly match your experience level and skill set.',
  },
  {
    icon: <Shield className="w-6 h-6 text-green-400" />,
    title: 'One-Click Apply',
    desc: 'Apply to jobs with a single click. Track your application status from Applied → Shortlisted → Offer in real time.',
  },
  {
    icon: <Globe className="w-6 h-6 text-purple-400" />,
    title: 'Video Interviews',
    desc: 'Schedule and attend interviews without leaving the platform. Built-in video calling powered by WebRTC.',
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero */}
      <section className="relative pt-36 pb-24 px-4 overflow-hidden">
        {/* Gradient blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-br from-blue-100 via-sky-50 to-white rounded-full blur-3xl opacity-70 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto text-center space-y-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-medium text-sm shadow-sm">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span>The AI-Powered Hiring Platform — Trusted by 8,000+ Companies</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mx-auto max-w-4xl leading-[1.1]">
            Find Your Dream Job with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-500 to-sky-400">
              Superhuman Precision
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Upload your CV, get an instant AI score, discover your skills gap, and match with employers who are actively searching for your profile — all in one place.
          </p>

          {/* Search bar */}
          <div className="max-w-3xl mx-auto mt-6">
            <div className="bg-white border border-slate-200 shadow-xl shadow-slate-100 rounded-2xl p-2 flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 gap-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input type="text" placeholder="Job title, skill, or company…" className="w-full bg-transparent text-slate-700 placeholder-slate-400 focus:outline-none text-sm" />
              </div>
              <div className="flex-1 flex items-center px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 gap-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Navigation className="w-4 h-4 text-slate-400 shrink-0" />
                <input type="text" placeholder="City, state, or Remote" className="w-full bg-transparent text-slate-700 placeholder-slate-400 focus:outline-none text-sm" />
              </div>
              <Link to="/jobs" id="hero-search-btn" className="px-8 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-700 to-blue-500 rounded-xl shadow-md hover:shadow-blue-200 hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap flex items-center gap-2">
                Search Jobs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 pt-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-slate-900">{s.value}</p>
                <p className="text-sm text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest">Why CareerConnect AI</p>
            <h2 className="text-4xl font-bold text-slate-900">Everything You Need to Land the Job</h2>
            <p className="text-slate-500 max-w-xl mx-auto">From AI resume analysis to live video interviews, we've built the complete toolkit for modern hiring.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-700 to-blue-500 rounded-3xl p-12 text-center text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
          <div className="relative space-y-6">
            <h2 className="text-4xl font-bold">Ready to Supercharge Your Career?</h2>
            <p className="text-blue-100 text-lg">Join thousands of professionals who found their next role using CareerConnect AI.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" id="cta-jobseeker-btn" className="px-8 py-3.5 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 hover:-translate-y-0.5 transition-all duration-300 shadow-lg">
                🚀 I'm Looking for a Job
              </Link>
              <Link to="/register" id="cta-employer-btn" className="px-8 py-3.5 bg-blue-600/50 text-white font-semibold rounded-xl border border-white/30 hover:bg-blue-600/70 hover:-translate-y-0.5 transition-all duration-300">
                🏢 I'm Hiring Talent
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 px-4 text-center text-slate-400 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Briefcase className="w-4 h-4 text-blue-500" />
          <span className="font-semibold text-slate-600">CareerConnect AI</span>
        </div>
        <p>© 2026 CareerConnect AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
