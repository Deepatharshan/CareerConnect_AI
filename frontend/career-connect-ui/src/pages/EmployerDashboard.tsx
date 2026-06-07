import React, { useState, useEffect } from 'react';
import { Building2, PlusCircle, Briefcase, Users, TrendingUp, CheckCircle, X, DollarSign, MapPin, FileText, Eye, Download, Mail, Phone, Home, Edit2, Trash2 } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'overview' | 'profile'>('overview');
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
          jobTitle: job.title
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
    await executeStatusUpdate(app.id, status, '');
  };

  const executeStatusUpdate = async (appId: string, status: string, instructions: string) => {
    setStatusUpdating(true);
    try {
      await updateApplicationStatus(appId, status, instructions, user!.email, user!.token);
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

  return (
    <div className="min-h-screen pt-20 pb-20">
      {/* Header Banner */}
      <div className="bg-surface-container-low/30 py-10 px-4 border-b border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-surface border border-white/10 rounded-2xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-on-surface">Employer Dashboard</h1>
              <p className="text-on-surface-variant text-sm mt-0.5">Welcome back, {user?.email?.split('@')[0]}</p>
            </div>
          </div>
          <button
            id="post-job-modal-btn"
            onClick={openNewJobModal}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-semibold rounded-xl hover:scale-105 transition-transform duration-300 hover:shadow-[0_0_15px_rgba(137,206,255,0.4)]"
          >
            <PlusCircle className="w-5 h-5" />
            Post a New Job
          </button>
        </div>
        
        {/* Tabs */}
        <div className="max-w-6xl mx-auto mt-6 flex items-center gap-2">
          <button 
            onClick={() => setActiveTab('overview')} 
            className={`px-5 py-2.5 rounded-t-xl font-semibold text-sm transition-colors ${activeTab === 'overview' ? 'bg-surface text-primary border-t border-x border-white/10' : 'bg-surface-container/50 text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
          >
            Dashboard Overview
          </button>
          <button 
            onClick={() => setActiveTab('profile')} 
            className={`px-5 py-2.5 rounded-t-xl font-semibold text-sm transition-colors ${activeTab === 'profile' ? 'bg-surface text-primary border-t border-x border-white/10' : 'bg-surface-container/50 text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
          >
            Company Profile
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {activeTab === 'profile' ? (
          <CompanyProfile />
        ) : (
          <>
            {/* Success Banner */}
        {success && (
          <div className="flex items-center gap-3 bg-green-400/10 border border-green-400/20 text-green-400 rounded-2xl px-5 py-4">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{success}</p>
            <button onClick={() => setSuccess('')} className="ml-auto text-green-400/60 hover:text-green-400"><X className="w-4 h-4" /></button>
          </div>
        )}

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

        {/* Your Active Job Listings */}
        <div>
          <div className="flex items-center justify-between mb-6 mt-12">
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

        {/* Recent Applicants - Card View */}
        <div>
          <div className="flex items-center justify-between mb-6 mt-12">
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
        </>
        )}
      </div>

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
                onClick={() => executeStatusUpdate(selectedApp.id, 'SELECTED', employerInstructions)}
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
