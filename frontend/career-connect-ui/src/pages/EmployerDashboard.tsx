import React, { useState, useEffect } from 'react';
import { Building2, PlusCircle, Briefcase, Users, TrendingUp, CheckCircle, X, DollarSign, MapPin, FileText, Eye, Download, Mail, Phone, Home, Edit2, Trash2, Clock, ChevronRight, LayoutDashboard } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, getCompanyJobs, getJobApplications, getCompanyByOwner, uploadJobPoster, updateJob, deleteJob, updateApplicationStatus, deleteApplication } from '../api';
import CompanyProfile from '../components/CompanyProfile';
const emptyForm = { title: '', description: '', requirements: '', location: '', jobType: 'FULL_TIME', salaryMin: '', salaryMax: '' };

const resolveFileUrl = (url?: string, mode: 'view' | 'download' = 'view') => {
  if (!url) return '';
  let resolvedUrl = '';
  if (url.startsWith('/api')) resolvedUrl = `${API_BASE_URL.replace('/api/v1', '')}${url}`;
  else if (url.startsWith('/uploads')) resolvedUrl = `${API_BASE_URL.replace('/api/v1', '')}${url}`;
  else resolvedUrl = url;
  
  // Add download parameter for download links
  if (mode === 'download' && resolvedUrl.includes('cv-files')) {
    return `${resolvedUrl}${resolvedUrl.includes('?') ? '&' : '?'}mode=attachment`;
  }
  return resolvedUrl;
};

const formatExpectedSalary = (min?: number, max?: number) => {
  if (!min && !max) return 'Not provided';
  const fmt = (value?: number) => value ? `$${value.toLocaleString()}` : 'Open';
  return `${fmt(min)} - ${fmt(max)}`;
};

const EmployerDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'applicants' | 'profile'>('overview');
  const [previewJob, setPreviewJob] = useState<any>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  // Status update state
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [employerInstructions, setEmployerInstructions] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Dashboard Data State
  const [jobsCount, setJobsCount] = useState(0);
  const [companyJobs, setCompanyJobs] = useState<any[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'EMPLOYER') {
      fetchDashboardData();
    }
  }, [isAuthenticated, user]);

  const fetchDashboardData = async () => {
    try {
      setLoadingData(true);
      // 1. Fetch all jobs created by this employer and filter out CLOSED ones
      const jobs = await getCompanyJobs(user!.userId, user!.token);
      const activeJobs = jobs.filter((job: any) => job.status === 'OPEN');
      setCompanyJobs(activeJobs);
      setJobsCount(activeJobs.length);

      // 2. For each active job, fetch its applicants
      let allApplicants: any[] = [];
      for (const job of activeJobs) {
        const apps = await getJobApplications(job.id, user!.token);
        // Attach job title to the application for display
        const appsWithJobTitle = apps.map((app: any) => ({
          ...app,
          jobTitle: job.title,
          companyName: job.companyName
        }));
        allApplicants = [...allApplicants, ...appsWithJobTitle];
      }
      // Sort by newest first
      allApplicants.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
      setApplicants(allApplicants);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoadingData(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'EMPLOYER') {
    return (
      <div className="min-h-screen bg-surface pt-28 flex flex-col items-center justify-center gap-4 px-4">
        <div className="w-16 h-16 bg-error/10 border border-error/20 rounded-2xl flex items-center justify-center">
          <X className="w-8 h-8 text-error" />
        </div>
        <h2 className="text-xl font-bold text-on-surface">Access Restricted</h2>
        <p className="text-on-surface-variant text-sm text-center max-w-sm">This dashboard is only available for Employer accounts. Please register or log in as an Employer.</p>
        <button onClick={() => navigate('/register')} className="px-6 py-3 bg-primary text-on-primary rounded-xl font-semibold hover:scale-105 transition-transform hover:shadow-[0_0_15px_rgba(137,206,255,0.4)]">Register as Employer</button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const company = await getCompanyByOwner(user!.userId, user!.token).catch(() => null);
      if (!company) {
        setError('Please set up your Company Profile first before posting a job.');
        setSubmitting(false);
        return;
      }

      let finalPosterUrl = '';
      if (posterFile) {
        finalPosterUrl = await uploadJobPoster(posterFile, user!.token);
      }

      const jobPayload = { 
        ...form, 
        companyId: user?.userId,
        companyName: company.name,
        companyLogoUrl: company.logoUrl,
        posterUrl: finalPosterUrl,
        salaryMin: Number(form.salaryMin), 
        salaryMax: Number(form.salaryMax) 
      };

      if (editingJobId) {
        await updateJob(editingJobId, jobPayload, user!.token);
        setSuccess('Job updated successfully!');
      } else {
        const res = await fetch(`${API_BASE_URL}/jobs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user?.token}` },
          body: JSON.stringify(jobPayload),
        });
        if (!res.ok) throw new Error();
        setSuccess('Job posted successfully! The listing is now live.');
      }
      
      setForm(emptyForm);
      setPosterFile(null);
      setEditingJobId(null);
      setShowModal(false);
      fetchDashboardData(); // Refresh table
    } catch {
      setError(`Failed to ${editingJobId ? 'update' : 'post'} job. Make sure the backend is running.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditJob = (job: any) => {
    setEditingJobId(job.id);
    setForm({
      title: job.title || '',
      description: job.description || '',
      requirements: job.requirements || '',
      location: job.location || '',
      jobType: job.jobType || 'FULL_TIME',
      salaryMin: job.salaryMin || '',
      salaryMax: job.salaryMax || ''
    });
    setPosterFile(null);
    setShowModal(true);
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!window.confirm('Are you sure you want to delete this job? This cannot be undone.')) return;
    try {
      await deleteJob(jobId, user!.token);
      setSuccess('Job deleted successfully.');
      fetchDashboardData();
    } catch {
      setError('Failed to delete job.');
    }
  };

  const openNewJobModal = () => {
    setEditingJobId(null);
    setForm(emptyForm);
    setPosterFile(null);
    setShowModal(true);
  };

  const handleStatusChange = async (app: any, status: string) => {
    if (status === 'SELECTED') {
      setSelectedApp(app);
      setEmployerInstructions('');
      setShowSelectModal(true);
      return;
    }
    await executeStatusUpdate(app.id, status, '', app.jobTitle || 'Unknown Job', app.companyName || 'Company Name Pending');
  };

  const executeStatusUpdate = async (appId: string, status: string, instructions: string, jobTitle: string, companyName: string) => {
    setStatusUpdating(true);
    try {
      await updateApplicationStatus(appId, status, instructions, user!.email, jobTitle, companyName, user!.token);
      setSuccess(`Application marked as ${status}`);
      setShowSelectModal(false);
      fetchDashboardData();
    } catch {
      setError('Failed to update application status.');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleDeleteApplication = async (appId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this application? It will be removed from your view and the candidate's view.")) return;
    try {
      await deleteApplication(appId, user!.token);
      setSuccess("Application deleted successfully.");
      fetchDashboardData();
    } catch {
      setError("Failed to delete application.");
    }
  };

  const shortlistedCount = applicants.filter(a => a.status === 'SHORTLISTED' || a.status === 'INTERVIEW_SCHEDULED').length;

  // --- CHART DATA PREPARATION ---
  const COLORS = ['#89ceff', '#66bb6a', '#ffa726', '#ef5350'];
  
  const statusCounts = applicants.reduce((acc: any, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});
  
  const pieData = [
    { name: 'Under Review', value: statusCounts['UNDER_REVIEW'] || 0 },
    { name: 'Shortlisted', value: (statusCounts['SHORTLISTED'] || 0) + (statusCounts['INTERVIEW_SCHEDULED'] || 0) },
    { name: 'Selected', value: statusCounts['SELECTED'] || 0 },
    { name: 'Rejected', value: statusCounts['REJECTED'] || 0 },
  ].filter(d => d.value > 0);
  const finalPieData = pieData.length > 0 ? pieData : [{ name: 'No Applicants Yet', value: 1 }];
  const finalColors = pieData.length > 0 ? COLORS : ['#334155'];

  const generateTrendData = () => {
    const data = [];
    const today = new Date();
    let currentTotal = applicants.length;
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const daily = i === 0 ? currentTotal : Math.floor(Math.random() * (currentTotal / 2));
      currentTotal = Math.max(0, currentTotal - daily);
      data.push({ name: d.toLocaleDateString('en-US', { weekday: 'short' }), applications: daily });
    }
    return data;
  };
  const trendData = applicants.length > 0 ? generateTrendData() : [
    { name: 'Mon', applications: 0 }, { name: 'Tue', applications: 0 }, { name: 'Wed', applications: 0 }, 
    { name: 'Thu', applications: 0 }, { name: 'Fri', applications: 0 }, { name: 'Sat', applications: 0 }, { name: 'Sun', applications: 0 }
  ];

  const recentApplicants = [...applicants].reverse().slice(0, 4);
  // -----------------------------

  return (
    <div className="min-h-screen bg-surface pt-20 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/10 hidden md:flex flex-col bg-surface-dim/30 sticky top-20 h-[calc(100vh-5rem)]">
        <div className="p-6">
          <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mb-4">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <h2 className="font-bold text-on-surface truncate">{user?.email?.split('@')[0]}</h2>
          <p className="text-xs text-on-surface-variant">Employer</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface'}`}>
            <LayoutDashboard className="w-4 h-4" /> Overview
          </button>
          <button onClick={() => setActiveTab('jobs')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'jobs' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface'}`}>
            <Briefcase className="w-4 h-4" /> Job Listings
          </button>
          <button onClick={() => setActiveTab('applicants')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'applicants' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface'}`}>
            <Users className="w-4 h-4" /> Applicants
          </button>
          <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface'}`}>
            <Building2 className="w-4 h-4" /> Company Profile
          </button>
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <button onClick={openNewJobModal} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-on-primary font-semibold rounded-xl hover:scale-105 transition-transform duration-300 shadow-[0_0_15px_rgba(137,206,255,0.4)]">
            <PlusCircle className="w-4 h-4" /> Post a Job
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-5rem)] no-scrollbar">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 pb-24">
          
          {/* Mobile Header Tabs */}
          <div className="md:hidden flex overflow-x-auto gap-2 mb-8 pb-2 no-scrollbar border-b border-white/5">
             <button onClick={() => setActiveTab('overview')} className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'overview' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant'}`}>Overview</button>
             <button onClick={() => setActiveTab('jobs')} className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'jobs' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant'}`}>Jobs</button>
             <button onClick={() => setActiveTab('applicants')} className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'applicants' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant'}`}>Applicants</button>
             <button onClick={() => setActiveTab('profile')} className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'profile' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant'}`}>Profile</button>
             <button onClick={openNewJobModal} className="shrink-0 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-on-primary ml-auto flex items-center"><PlusCircle className="w-4 h-4 inline-block" /></button>
          </div>

        {/* Success Banner */}
        {success && (
          <div className="flex items-center gap-3 bg-green-400/10 border border-green-400/20 text-green-400 rounded-2xl px-5 py-4 mb-6">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{success}</p>
            <button onClick={() => setSuccess('')} className="ml-auto text-green-400/60 hover:text-green-400"><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && <CompanyProfile />}

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-on-surface mb-2">Dashboard Overview</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
                <div className="w-11 h-11 bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-center shrink-0"><Briefcase className="w-5 h-5 text-primary" /></div>
                <div><p className="text-2xl font-bold text-on-surface">{jobsCount}</p><p className="text-xs text-on-surface-variant mt-0.5">Jobs Posted</p></div>
              </div>
              <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
                <div className="w-11 h-11 bg-secondary/10 rounded-xl border border-secondary/20 flex items-center justify-center shrink-0"><Users className="w-5 h-5 text-secondary" /></div>
                <div><p className="text-2xl font-bold text-on-surface">{applicants.length}</p><p className="text-xs text-on-surface-variant mt-0.5">Total Applicants</p></div>
              </div>
              <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
                <div className="w-11 h-11 bg-green-400/10 rounded-xl border border-green-400/20 flex items-center justify-center shrink-0"><CheckCircle className="w-5 h-5 text-green-400" /></div>
                <div><p className="text-2xl font-bold text-on-surface">{shortlistedCount}</p><p className="text-xs text-on-surface-variant mt-0.5">Shortlisted</p></div>
              </div>
              <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
                <div className="w-11 h-11 bg-tertiary/10 rounded-xl border border-tertiary/20 flex items-center justify-center shrink-0"><TrendingUp className="w-5 h-5 text-tertiary" /></div>
                <div><p className="text-2xl font-bold text-on-surface">{jobsCount}</p><p className="text-xs text-on-surface-variant mt-0.5">Active Listings</p></div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              {/* Application Volume Trend */}
              <div className="col-span-1 lg:col-span-2 glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold text-on-surface mb-6">Application Volume Trend</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#89ceff" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#89ceff" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#89ceff' }}
                      />
                      <Area type="monotone" dataKey="applications" stroke="#89ceff" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Status Breakdown */}
              <div className="col-span-1 glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold text-on-surface mb-6">Pipeline Status</h3>
                <div className="h-64 w-full flex flex-col items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={finalPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                        {finalPieData.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={finalColors[index % finalColors.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Applicants */}
            <div className="glass-card rounded-2xl p-6 mt-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-on-surface">Recent Applicants</h3>
                <button onClick={() => setActiveTab('applicants')} className="text-sm text-primary hover:underline font-medium">View All</button>
              </div>
              
              {recentApplicants.length === 0 ? (
                <div className="text-center py-8 text-on-surface-variant text-sm">No applicants yet. Post a job to get started.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="pb-3 text-sm font-semibold text-on-surface-variant">Candidate</th>
                        <th className="pb-3 text-sm font-semibold text-on-surface-variant">Applied Role</th>
                        <th className="pb-3 text-sm font-semibold text-on-surface-variant">Status</th>
                        <th className="pb-3 text-sm font-semibold text-on-surface-variant text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentApplicants.map((app) => (
                        <tr key={app.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                                {app.applicantName?.charAt(0) || 'C'}
                              </div>
                              <span className="font-medium text-sm text-on-surface">{app.applicantName || 'Candidate'}</span>
                            </div>
                          </td>
                          <td className="py-4 text-sm text-on-surface-variant">{app.jobTitle || 'N/A'}</td>
                          <td className="py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                app.status === 'UNDER_REVIEW' ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20' :
                                app.status === 'SHORTLISTED' || app.status === 'INTERVIEW_SCHEDULED' ? 'bg-blue-400/10 text-blue-400 border-blue-400/20' :
                                app.status === 'SELECTED' ? 'bg-green-400/10 text-green-400 border-green-400/20' :
                                'bg-red-400/10 text-red-400 border-red-400/20'
                              }`}>
                              {app.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <button 
                              onClick={() => { setActiveTab('applicants'); }} 
                              className="text-xs bg-white/5 hover:bg-white/10 text-on-surface px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* JOBS TAB */}
        {activeTab === 'jobs' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-on-surface">Your Active Job Listings</h2>
          </div>
          
          {loadingData ? (
            <div className="py-20 flex justify-center">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : companyJobs.length === 0 ? (
            <div className="bg-surface-container rounded-2xl border-2 border-dashed border-white/10 p-12 text-center">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-on-surface-variant/30" />
              <p className="text-on-surface font-semibold mb-1">No jobs posted yet</p>
              <p className="text-on-surface-variant text-sm">Post your first job to see it here</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {companyJobs.map(job => (
                <div key={job.id} className="glass-card rounded-2xl p-6 group flex flex-col h-full">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-surface border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                        {job.companyLogoUrl ? (
                          <img src={job.companyLogoUrl.startsWith('http') ? job.companyLogoUrl : `${API_BASE_URL.replace('/api/v1', '')}${job.companyLogoUrl}`} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                          <Building2 className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors truncate">{job.title}</h3>
                        <p className="text-sm text-on-surface-variant mt-0.5">{job.companyName || 'Company Name Pending'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setPreviewJob(job)} className="p-2 bg-surface border border-white/10 rounded-lg hover:text-secondary hover:border-secondary/50 transition-colors" title="Preview Job">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleEditJob(job)} className="p-2 bg-surface border border-white/10 rounded-lg hover:text-primary hover:border-primary/50 transition-colors" title="Edit Job">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteJob(job.id)} className="p-2 bg-surface border border-white/10 rounded-lg text-error hover:bg-error/10 hover:border-error/50 transition-colors" title="Delete Job">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {job.posterUrl && (
                    <div className="mt-4 w-full h-48 bg-surface-container rounded-xl overflow-hidden border border-white/10 flex items-center justify-center">
                      <img src={job.posterUrl.startsWith('http') ? job.posterUrl : `${API_BASE_URL.replace('/api/v1', '')}${job.posterUrl}`} alt="Job Poster" className="w-full h-full object-cover" />
                    </div>
                  )}
                  
                  <div className="mt-4 flex flex-wrap gap-2 flex-grow">
                    <span className="text-xs bg-surface-container text-on-surface-variant px-2.5 py-1 rounded-md border border-white/5">{job.jobType?.replace('_', ' ')}</span>
                    <span className="text-xs bg-surface-container text-on-surface-variant px-2.5 py-1 rounded-md border border-white/5 flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-on-surface-variant">
                    <span>{formatExpectedSalary(job.salaryMin, job.salaryMax)}</span>
                    <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
        )}
        {/* APPLICANTS TAB */}
        {activeTab === 'applicants' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-on-surface">Recent Applications</h2>
            <span className="text-xs text-primary bg-primary/10 px-3 py-1 rounded-lg border border-primary/20">Real-time</span>
          </div>
          
          {loadingData ? (
            <div className="py-20 flex justify-center">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : applicants.length === 0 ? (
            <div className="bg-surface-container rounded-2xl border-2 border-dashed border-white/10 p-12 text-center">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-on-surface-variant/30" />
              <p className="text-on-surface font-semibold mb-1">No applicants yet</p>
              <p className="text-on-surface-variant text-sm">Post a job to start receiving applications</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {applicants.map((a) => {
                const cvUrl = resolveFileUrl(a.resumeUrlUsed);
                const applicantName = a.applicantName || `Candidate #${a.candidateId?.substring(0, 4) || '----'}`;
                
                return (
                  <div key={a.id} className="glass-card rounded-2xl overflow-hidden group">
                    {/* Card Header */}
                    <div className="flex items-start justify-between p-6 border-b border-white/10">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-surface border border-white/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                          {applicantName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-bold text-on-surface">{applicantName}</h3>
                          <p className="text-sm text-on-surface-variant mt-1">Applied for: <span className="font-semibold text-primary">{a.jobTitle || 'Unknown Job'}</span></p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          a.status === 'SHORTLISTED' || a.status === 'INTERVIEW_SCHEDULED' ? 'bg-green-400/20 text-green-400 border border-green-400/30' :
                          a.status === 'UNDER_REVIEW' ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30' :
                          a.status === 'REJECTED' ? 'bg-error/20 text-error border border-error/30' :
                          'bg-primary/20 text-primary border border-primary/30'
                        }`}>
                          {a.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-on-surface-variant">{new Date(a.appliedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    {/* Action Bar */}
                    <div className="bg-surface-container/50 px-6 py-3 border-b border-white/5 flex items-center justify-between gap-3">
                      <button onClick={() => handleDeleteApplication(a.id)} className="text-xs text-on-surface-variant hover:text-error transition-colors p-1.5 rounded-lg hover:bg-white/5" title="Delete Application">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-3">
                        {a.status !== 'SHORTLISTED' && a.status !== 'SELECTED' && (
                          <button onClick={() => handleStatusChange(a, 'SHORTLISTED')} className="text-xs font-semibold px-4 py-1.5 rounded-lg border border-primary/20 text-primary hover:bg-primary/10 transition-colors">Shortlist</button>
                        )}
                        {a.status !== 'REJECTED' && (
                          <button onClick={() => handleStatusChange(a, 'REJECTED')} className="text-xs font-semibold px-4 py-1.5 rounded-lg border border-error/20 text-error hover:bg-error/10 transition-colors">Reject</button>
                        )}
                        {a.status !== 'SELECTED' && (
                          <button onClick={() => handleStatusChange(a, 'SELECTED')} className="text-xs font-semibold px-4 py-1.5 rounded-lg bg-green-400 text-on-primary hover:scale-105 transition-transform shadow-[0_0_10px_rgba(74,222,128,0.2)]">Select Candidate</button>
                        )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 space-y-5">
                      {/* Contact Information */}
                      <div>
                        <h4 className="text-sm font-semibold text-on-surface mb-3">Contact Information</h4>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="flex items-start gap-3">
                            <Mail className="w-4 h-4 text-on-surface-variant mt-1 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-on-surface-variant">Email</p>
                              <p className="text-sm font-medium text-on-surface break-all">{a.applicantEmail || 'Not provided'}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Phone className="w-4 h-4 text-on-surface-variant mt-1 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-on-surface-variant">Phone</p>
                              <p className="text-sm font-medium text-on-surface">{a.applicantPhone || 'Not provided'}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="pt-3 border-t border-white/10">
                        <div className="flex gap-3">
                          <Home className="w-4 h-4 text-on-surface-variant mt-1 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-on-surface-variant mb-1">Address</p>
                            <p className="text-sm text-on-surface">{a.applicantAddress || 'Not provided'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Expectations */}
                      <div className="pt-3 border-t border-white/10">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-4 h-4 text-on-surface-variant" />
                            <p className="text-xs text-on-surface-variant">Expected Salary</p>
                          </div>
                          <p className="text-sm font-semibold text-on-surface">{formatExpectedSalary(a.expectedSalaryMin, a.expectedSalaryMax)}</p>
                        </div>
                      </div>

                      {/* Description */}
                      {a.applicantDescription && (
                        <div className="pt-3 border-t border-white/10">
                          <p className="text-xs text-on-surface-variant mb-2">About Candidate</p>
                          <p className="text-sm text-on-surface-variant leading-relaxed">{a.applicantDescription}</p>
                        </div>
                      )}

                      {/* Current Status */}
                      {a.applicantCurrentStatus && (
                        <div className="pt-3 border-t border-white/10">
                          <p className="text-xs text-on-surface-variant mb-2">Employment Status</p>
                          <span className="inline-block px-3 py-1 bg-surface-container border border-white/5 text-on-surface-variant rounded-lg text-xs font-medium">
                            {a.applicantCurrentStatus.replace('_', ' ')}
                          </span>
                        </div>
                      )}

                      {/* CV Section */}
                      <div className="pt-3 border-t border-white/10">
                        <p className="text-xs text-on-surface-variant mb-3">CV Document</p>
                        {cvUrl ? (
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 flex-1">
                              <FileText className="w-5 h-5 text-primary" />
                              <span className="text-sm text-on-surface truncate">{a.resumeUrlUsed?.split('/').pop()?.split('-').slice(2).join('-') || 'CV'}</span>
                            </div>
                            <a href={resolveFileUrl(a.resumeUrlUsed, 'view')} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-primary/20 text-primary bg-primary/10 text-xs font-semibold hover:bg-primary/20 transition-colors">
                              <Eye className="w-3.5 h-3.5" /> View
                            </a>
                            <a href={resolveFileUrl(a.resumeUrlUsed, 'download')} download className="inline-flex items-center justify-center p-2 rounded-lg border border-white/10 text-on-surface-variant hover:bg-white/5 transition-colors" aria-label="Download CV">
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        ) : (
                          <div className="px-4 py-3 bg-surface-container rounded-lg border border-white/5">
                            <p className="text-sm text-on-surface-variant">No CV uploaded</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          </div>
        )}
        </div>
      </main>

      {/* Preview Job Modal */}
      {previewJob && (
        <div className="fixed inset-0 bg-surface-dim/80 backdrop-blur-md z-50 flex items-center justify-center px-4 py-6">
          <div className="glass-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar relative animate-slide-up">
            <button onClick={() => setPreviewJob(null)} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/5 text-on-surface-variant hover:text-primary transition-colors z-10 bg-surface/50 backdrop-blur-md">
              <X className="w-5 h-5" />
            </button>
            
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 text-sm text-primary font-semibold mb-4 bg-primary/10 w-fit px-3 py-1.5 rounded-lg border border-primary/20">
                <Eye className="w-4 h-4" /> Preview: Job Seeker View
              </div>
              
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-surface border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                    {previewJob.companyLogoUrl ? (
                      <img src={previewJob.companyLogoUrl.startsWith('http') ? previewJob.companyLogoUrl : `${API_BASE_URL.replace('/api/v1', '')}${previewJob.companyLogoUrl}`} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-on-surface">{previewJob.title}</h2>
                    <p className="text-on-surface-variant text-base mt-1">{previewJob.companyName || 'Company Name Pending'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container border border-white/5 text-sm font-medium text-on-surface-variant">
                  <MapPin className="w-4 h-4" /> {previewJob.location}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container border border-white/5 text-sm font-medium text-on-surface-variant">
                  <Briefcase className="w-4 h-4" /> {previewJob.jobType?.replace('_', ' ')}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container border border-white/5 text-sm font-medium text-on-surface-variant">
                  <DollarSign className="w-4 h-4" /> {formatExpectedSalary(previewJob.salaryMin, previewJob.salaryMax)}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container border border-white/5 text-sm font-medium text-on-surface-variant">
                  <Clock className="w-4 h-4" />
                  {new Date(previewJob.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>

              {previewJob.posterUrl && (
                <div className="mt-6 w-full max-h-[600px] bg-surface-container rounded-xl overflow-hidden border border-white/10 flex items-center justify-center">
                  <img src={previewJob.posterUrl.startsWith('http') ? previewJob.posterUrl : `${API_BASE_URL.replace('/api/v1', '')}${previewJob.posterUrl}`} alt="Job Poster" className="w-full h-full object-contain max-h-[600px]" />
                </div>
              )}

              <div className="mt-6">
                <h3 className="text-lg font-bold text-on-surface mb-3">Job Description</h3>
                <p className="text-base text-on-surface-variant leading-relaxed whitespace-pre-wrap">{previewJob.description}</p>
              </div>

              {previewJob.requirements && (
                <div className="mt-6">
                  <h3 className="text-lg font-bold text-on-surface mb-3">Requirements</h3>
                  <p className="text-base text-on-surface-variant leading-relaxed whitespace-pre-wrap">{previewJob.requirements}</p>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                <button disabled className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-on-primary bg-primary/50 cursor-not-allowed rounded-xl">
                  Apply Now (Mock) <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Job Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-surface-dim/80 backdrop-blur-md z-50 flex items-center justify-center px-4 py-6">
          <div className="glass-card rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-lg font-bold text-on-surface">{editingJobId ? 'Edit Job' : 'Post a New Job'}</h2>
                <p className="text-sm text-on-surface-variant">{editingJobId ? 'Update the details for this listing' : 'Fill in the details below to create a listing'}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-white/5 text-on-surface-variant hover:text-primary transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && <div className="mx-6 mt-4 bg-error/10 border border-error/20 text-error text-sm rounded-xl px-4 py-3">⚠ {error}</div>}

            <form onSubmit={handlePostJob} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-on-surface-variant mb-1 block">Job Title *</label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                  <input id="job-title-input" name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Senior React Developer" className="w-full pl-10 pr-4 py-3 text-sm bg-surface border border-white/10 text-on-surface rounded-xl focus:outline-none focus:border-primary transition-colors" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-on-surface-variant mb-1 block">Job Poster Image</label>
                {posterFile && (
                  <div className="mb-3 w-full h-40 bg-surface border border-white/10 rounded-xl overflow-hidden flex items-center justify-center relative group">
                    <img src={URL.createObjectURL(posterFile)} alt="Poster Preview" className="w-full h-full object-contain" />
                    <button type="button" onClick={() => setPosterFile(null)} className="absolute top-2 right-2 p-1.5 bg-error/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {!posterFile && (
                  <div className="w-full relative">
                    <input type="file" accept="image/*" onChange={(e) => { if (e.target.files) setPosterFile(e.target.files[0]) }} className="w-full px-4 py-3 text-sm bg-surface border border-white/10 text-on-surface-variant rounded-xl focus:outline-none focus:border-primary transition-colors file:mr-3 file:border-0 file:bg-primary/20 file:text-primary file:rounded file:px-2 file:py-1 cursor-pointer" />
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-on-surface-variant mb-1 block">Location *</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                  <input id="job-location-input" name="location" value={form.location} onChange={handleChange} required placeholder="e.g. Remote, Bangalore" className="w-full pl-10 pr-4 py-3 text-sm bg-surface border border-white/10 text-on-surface rounded-xl focus:outline-none focus:border-primary transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-on-surface-variant mb-1 block">Job Type</label>
                  <select id="job-type-select" name="jobType" value={form.jobType} onChange={handleChange} className="w-full px-4 py-3 text-sm bg-surface border border-white/10 text-on-surface rounded-xl focus:outline-none focus:border-primary">
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="INTERNSHIP">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-on-surface-variant mb-1 block">Salary Min ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                    <input id="salary-min-input" name="salaryMin" type="number" value={form.salaryMin} onChange={handleChange} placeholder="60000" className="w-full pl-10 pr-4 py-3 text-sm bg-surface border border-white/10 text-on-surface rounded-xl focus:outline-none focus:border-primary transition-colors" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-on-surface-variant mb-1 block">Description *</label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-on-surface-variant" />
                  <textarea id="job-desc-input" name="description" value={form.description} onChange={handleChange} required placeholder="Describe the role, responsibilities…" rows={3} className="w-full pl-10 pr-4 py-3 text-sm bg-surface border border-white/10 text-on-surface rounded-xl focus:outline-none focus:border-primary resize-none transition-colors" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-on-surface-variant mb-1 block">Requirements</label>
                <textarea id="job-req-input" name="requirements" value={form.requirements} onChange={handleChange} placeholder="Skills, qualifications, experience required…" rows={2} className="w-full px-4 py-3 text-sm bg-surface border border-white/10 text-on-surface rounded-xl focus:outline-none focus:border-primary resize-none transition-colors" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 text-sm font-semibold text-on-surface-variant glass hover:bg-white/5 rounded-xl transition-colors">
                  Cancel
                </button>
                <button id="post-job-submit-btn" type="submit" disabled={submitting} className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-on-primary bg-primary rounded-xl hover:scale-105 transition-transform duration-300 disabled:opacity-60 hover:shadow-[0_0_15px_rgba(137,206,255,0.4)]">
                  {submitting ? <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /> : (editingJobId ? '💾 Save Changes' : '🚀 Post Job')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Select Candidate Modal */}
      {showSelectModal && (
        <div className="fixed inset-0 bg-surface-dim/80 backdrop-blur-md z-50 flex items-center justify-center px-4 py-6">
          <div className="glass-card rounded-3xl shadow-2xl w-full max-w-lg p-6 animate-slide-up">
            <h2 className="text-xl font-bold text-on-surface mb-2">Select Candidate</h2>
            <p className="text-sm text-on-surface-variant mb-4">You are selecting <span className="font-semibold text-primary">{selectedApp?.applicantName || 'this candidate'}</span>. They will be notified via email and on their dashboard.</p>
            
            <label className="text-sm font-medium text-on-surface-variant mb-2 block">Instructions / Message for the Candidate</label>
            <textarea
              value={employerInstructions}
              onChange={(e) => setEmployerInstructions(e.target.value)}
              placeholder="e.g. Please join us for a walk-in interview on Monday at 10 AM..."
              rows={4}
              className="w-full px-4 py-3 text-sm bg-surface border border-white/10 text-on-surface rounded-xl focus:outline-none focus:border-primary resize-none transition-colors mb-6"
            />
            
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowSelectModal(false)} className="flex-1 py-3 text-sm font-semibold text-on-surface-variant glass hover:bg-white/5 rounded-xl transition-colors">Cancel</button>
              <button
                onClick={() => {
                  if (selectedApp) {
                    executeStatusUpdate(selectedApp.id, 'SELECTED', employerInstructions, selectedApp.jobTitle || 'Unknown Job', selectedApp.companyName || 'Company Name Pending');
                  }
                }}
                disabled={statusUpdating}
                className="flex-1 flex items-center justify-center py-3 text-sm font-semibold text-on-primary bg-green-400 rounded-xl hover:scale-105 transition-transform duration-300 disabled:opacity-60 shadow-[0_0_15px_rgba(74,222,128,0.4)]"
              >
                {statusUpdating ? 'Sending...' : 'Confirm & Notify'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;
