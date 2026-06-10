import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Clock, DollarSign, Sparkles, ChevronRight, Building2, Bookmark, CheckCircle, X, Mail, Phone, Home, UserCircle2, FileText } from 'lucide-react';
import { API_BASE_URL, fetchOpenJobs, applyForJob, getProfile, uploadCv, matchJobsWithCv } from '../api';
import { useAuth } from '../context/AuthContext';

interface Job {
  id: string;
  title: string;
  companyId: string;
  location: string;
  jobType: string;
  salaryMin: number;
  salaryMax: number;
  description: string;
  status: string;
  createdAt: string;
  companyName?: string;
  companyLogoUrl?: string;
  posterUrl?: string;
}

interface ApplicationForm {
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  applicantAddress: string;
  applicantCurrentStatus: string;
  resumeUrlUsed: string;
  expectedSalaryMin: string;
  expectedSalaryMax: string;
  applicantDescription: string;
}

const jobTypeBadge: Record<string, string> = {
  FULL_TIME: 'bg-primary/10 text-primary border-primary/20',
  PART_TIME: 'bg-secondary/10 text-secondary border-secondary/20',
  CONTRACT: 'bg-tertiary/10 text-tertiary border-tertiary/20',
  INTERNSHIP: 'bg-primary-container/10 text-primary-container border-primary-container/20',
};

const placeholderJobs: Job[] = [
  { id: '1', title: 'Senior Java Backend Engineer', companyId: 'TechCorp', location: 'Remote', jobType: 'FULL_TIME', salaryMin: 90000, salaryMax: 130000, description: 'Build scalable microservices using Java Spring Boot, Kafka, and Kubernetes.', status: 'OPEN', createdAt: '2026-05-25T10:00:00' },
  { id: '2', title: 'React Frontend Developer', companyId: 'StartupXYZ', location: 'Bangalore, IN', jobType: 'FULL_TIME', salaryMin: 60000, salaryMax: 90000, description: 'Craft beautiful, high-performance user interfaces using React, TypeScript, and Tailwind CSS.', status: 'OPEN', createdAt: '2026-05-24T10:00:00' },
];

const emptyApplicationForm: ApplicationForm = {
  applicantName: '',
  applicantEmail: '',
  applicantPhone: '',
  applicantAddress: '',
  applicantCurrentStatus: '',
  resumeUrlUsed: '',
  expectedSalaryMin: '',
  expectedSalaryMax: '',
  applicantDescription: '',
};

const JobFeed = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [appliedSet, setAppliedSet] = useState<Set<string>>(new Set());
  const [applying, setApplying] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applicationForm, setApplicationForm] = useState<ApplicationForm>(emptyApplicationForm);
  const [formLoading, setFormLoading] = useState(false);
  const [cvUploading, setCvUploading] = useState(false);
  const [selectedCvName, setSelectedCvName] = useState('');
  const [applicationError, setApplicationError] = useState('');
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [profileCvs, setProfileCvs] = useState<any[]>([]);
  const [selectedCvForAi, setSelectedCvForAi] = useState<string>('');
  const [aiProcessing, setAiProcessing] = useState(false);
  const [aiScores, setAiScores] = useState<Record<string, {score: number, reasoning: string}>>({});
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchOpenJobs()
      .then(data => setJobs(data.length ? data : placeholderJobs))
      .catch(() => setJobs(placeholderJobs))
      .finally(() => setLoading(false));
  }, []);

  const openAiModal = async () => {
    if (!user) return;
    setAiModalOpen(true);
    setSelectedCvForAi('');
    try {
      const profile = await getProfile(user.userId, user.token);
      if (profile && profile.cvs) {
        setProfileCvs(profile.cvs);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAiSuggest = async () => {
    if (!user || !selectedCvForAi || jobs.length === 0) return;
    setAiProcessing(true);
    
    try {
      const cvsToSend = selectedCvForAi === 'ALL' 
        ? profileCvs 
        : profileCvs.filter(cv => cv.id === selectedCvForAi);
        
      const files: File[] = [];
      for (const cv of cvsToSend) {
        const cvUrl = cv.url.startsWith('http') ? cv.url : `${API_BASE_URL.replace('/api/v1', '')}${cv.url}`;
        const res = await fetch(cvUrl);
        const blob = await res.blob();
        files.push(new File([blob], cv.name, { type: blob.type }));
      }
      
      const simplifiedJobs = jobs.map(j => ({
        id: j.id,
        title: j.title,
        description: j.description.substring(0, 500)
      }));
      
      const results = await matchJobsWithCv(files, simplifiedJobs);
      
      const scoresMap: Record<string, {score: number, reasoning: string}> = {};
      results.forEach((r: any) => {
        scoresMap[r.jobId] = { score: r.score, reasoning: r.reasoning };
      });
      setAiScores(scoresMap);
      setAiModalOpen(false);
    } catch (e) {
      console.error(e);
      alert('Failed to analyze jobs. Please try again.');
    } finally {
      setAiProcessing(false);
    }
  };

  const openApplyForm = async (job: Job) => {
    if (!user) return;
    setSelectedJob(job);
    setApplicationError('');
    setSelectedCvName('');
    setApplicationForm({
      ...emptyApplicationForm,
      applicantEmail: user.email || '',
      applicantName: user.email?.split('@')[0] || '',
    });
    setFormLoading(true);

    try {
      const profile = await getProfile(user.userId, user.token);
      if (profile) {
        if (profile.cvs) setProfileCvs(profile.cvs);
        const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ').trim();
        setApplicationForm(current => ({
          ...current,
          applicantName: fullName || current.applicantName,
          applicantCurrentStatus: profile.currentJobStatus || '',
          applicantPhone: profile.phone || '',
          applicantAddress: profile.address || '',
          resumeUrlUsed: profile.cvs && profile.cvs.length > 0 ? profile.cvs[0].url : '',
        }));
        if (profile.cvs && profile.cvs.length > 0) {
          setSelectedCvName(profile.cvs[0].name);
        }
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      // Continue with form even if profile fetch fails
    } finally {
      setFormLoading(false);
    }
  };

  const closeApplyForm = () => {
    if (applying || cvUploading) return;
    setSelectedJob(null);
    setApplicationError('');
  };

  const updateApplicationField = (field: keyof ApplicationForm, value: string) => {
    setApplicationForm(prev => ({ ...prev, [field]: value }));
    setApplicationError('');
  };

  const handleCvChange = async (file?: File) => {
    if (!file || !user) return;
    setSelectedCvName(file.name);
    setCvUploading(true);
    setApplicationError('');
    try {
      const saved = await uploadCv(user.userId, file, user.token);
      const url = saved.url || saved.cvUrl || '';
      updateApplicationField('resumeUrlUsed', url);
      setProfileCvs(prev => [...prev.filter(c => c.id !== saved.id), saved]);
    } catch {
      setApplicationError('Could not upload CV. Check that the profile service is running.');
    } finally {
      setCvUploading(false);
    }
  };

  const handleApplySubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || !selectedJob) return;

    // Validate all required fields
    if (!applicationForm.applicantName.trim()) {
      setApplicationError('Please provide your name.');
      return;
    }
    if (!applicationForm.applicantEmail.trim()) {
      setApplicationError('Please provide your email.');
      return;
    }
    if (!applicationForm.applicantPhone.trim()) {
      setApplicationError('Please provide your phone number.');
      return;
    }
    if (!applicationForm.applicantAddress.trim()) {
      setApplicationError('Please provide your address.');
      return;
    }
    if (!applicationForm.resumeUrlUsed.trim()) {
      setApplicationError('Please upload your CV before applying.');
      return;
    }

    setApplying(selectedJob.id);
    setApplicationError('');
    try {
      await applyForJob(selectedJob.id, user.userId, user.token, {
        applicantName: applicationForm.applicantName.trim(),
        applicantEmail: applicationForm.applicantEmail.trim(),
        applicantPhone: applicationForm.applicantPhone.trim(),
        applicantAddress: applicationForm.applicantAddress.trim(),
        applicantCurrentStatus: applicationForm.applicantCurrentStatus,
        resumeUrlUsed: applicationForm.resumeUrlUsed.trim(),
        expectedSalaryMin: applicationForm.expectedSalaryMin ? Number(applicationForm.expectedSalaryMin) : null,
        expectedSalaryMax: applicationForm.expectedSalaryMax ? Number(applicationForm.expectedSalaryMax) : null,
        applicantDescription: applicationForm.applicantDescription.trim(),
        aiMatchScore: aiScores[selectedJob.id] ? aiScores[selectedJob.id].score : null,
      });
      setAppliedSet(prev => new Set(prev).add(selectedJob.id));
      setSelectedJob(null);
    } catch (error) {
      console.error('Application submission error:', error);
      setApplicationError('Failed to apply for job. Ensure the backend is running.');
    } finally {
      setApplying(null);
    }
  };

  let filtered = jobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.location?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'ALL' || j.jobType === filterType;
    return matchSearch && matchType;
  });

  if (Object.keys(aiScores).length > 0) {
    filtered = filtered
      .filter(j => (aiScores[j.id]?.score || 0) >= 60)
      .sort((a, b) => (aiScores[b.id]?.score || 0) - (aiScores[a.id]?.score || 0));
  }

  const toggleSave = (id: string) => {
    setSaved(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const formatSalary = (min: number, max: number) => {
    if (!min && !max) return 'Competitive';
    const fmt = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;
    return `${fmt(min)} - ${fmt(max)}`;
  };

  const cvHref = applicationForm.resumeUrlUsed.startsWith('/api')
    ? `${API_BASE_URL.replace('/api/v1', '')}${applicationForm.resumeUrlUsed}`
    : applicationForm.resumeUrlUsed;

  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="bg-surface-container-low/30 py-10 px-4 border-b border-white/5">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-on-surface-variant text-sm font-medium">{filtered.length} jobs match your profile</span>
          </div>
          <h1 className="text-3xl font-bold text-on-surface">Find Your Next Opportunity</h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 glass rounded-xl px-4 py-3">
              <Search className="w-4 h-4 text-on-surface-variant shrink-0" />
              <input
                id="job-search-input"
                type="text"
                placeholder="Search jobs or location..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent text-on-surface placeholder-on-surface-variant/60 focus:outline-none text-sm w-full"
              />
            </div>
            <select
              id="job-type-filter"
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="glass rounded-xl px-4 py-3 text-on-surface text-sm focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-surface text-on-surface">All Types</option>
              <option value="FULL_TIME" className="bg-surface text-on-surface">Full Time</option>
              <option value="PART_TIME" className="bg-surface text-on-surface">Part Time</option>
              <option value="CONTRACT" className="bg-surface text-on-surface">Contract</option>
              <option value="INTERNSHIP" className="bg-surface text-on-surface">Internship</option>
            </select>
            {isAuthenticated && (
              <button onClick={openAiModal} className="flex items-center justify-center gap-2 px-4 py-3 bg-primary/10 text-primary border border-primary/30 rounded-xl hover:bg-primary/20 transition-all font-semibold text-sm whitespace-nowrap hover:shadow-[0_0_15px_rgba(137,206,255,0.2)]">
                <Sparkles className="w-4 h-4" /> AI Suggestion
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-on-surface-variant">
            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No jobs found</p>
            <p className="text-sm">Try a different search term</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(job => (
              <div key={job.id} id={`job-card-${job.id}`} className="glass-card rounded-2xl p-6 group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-surface border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                      {job.companyLogoUrl ? (
                        <img src={job.companyLogoUrl.startsWith('http') ? job.companyLogoUrl : `${API_BASE_URL.replace('/api/v1', '')}${job.companyLogoUrl}`} alt="Company Logo" className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors truncate">{job.title}</h2>
                      <p className="text-sm text-on-surface-variant mt-0.5">{job.companyName || job.companyId || 'Company'}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {aiScores[job.id] && (
                          <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-primary/20 text-purple-300 border border-purple-500/30" title={aiScores[job.id].reasoning}>
                            <Sparkles className="w-3 h-3 text-purple-400" /> {aiScores[job.id].score}% Match
                          </span>
                        )}
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${jobTypeBadge[job.jobType] || 'bg-surface-container text-on-surface-variant border-white/10'}`}>
                          {job.jobType?.replace('_', ' ') || 'Full Time'}
                        </span>
                        {job.location && (
                          <span className="flex items-center gap-1 text-xs text-on-surface-variant">
                            <MapPin className="w-3 h-3" /> {job.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-xs text-on-surface-variant">
                          <DollarSign className="w-3 h-3" /> {formatSalary(job.salaryMin, job.salaryMax)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <button
                      onClick={() => toggleSave(job.id)}
                      className={`p-2 rounded-xl transition-all duration-200 ${saved.has(job.id) ? 'glass text-primary' : 'text-on-surface-variant hover:text-primary hover:bg-white/5'}`}
                    >
                      <Bookmark className="w-4 h-4" fill={saved.has(job.id) ? 'currentColor' : 'none'} />
                    </button>
                    <span className="flex items-center gap-1 text-xs text-on-surface-variant">
                      <Clock className="w-3 h-3" />
                      {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>

                {job.posterUrl && (
                  <div className="mt-4 w-full max-h-[600px] bg-surface-container rounded-xl overflow-hidden border border-white/10 flex items-center justify-center">
                    <img src={job.posterUrl.startsWith('http') ? job.posterUrl : `${API_BASE_URL.replace('/api/v1', '')}${job.posterUrl}`} alt="Job Poster" className="w-full h-full object-contain max-h-[600px]" />
                  </div>
                )}

                <p className="mt-4 text-sm text-on-surface-variant leading-relaxed line-clamp-2">{job.description}</p>

                <div className="mt-4 flex items-center justify-between">
                  {isAuthenticated ? (
                    appliedSet.has(job.id) ? (
                      <button disabled className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-green-400 glass border border-green-400/20 rounded-xl cursor-default">
                        <CheckCircle className="w-4 h-4" /> Applied
                      </button>
                    ) : (
                      <button id={`apply-btn-${job.id}`} onClick={() => openApplyForm(job)} disabled={applying === job.id} className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-on-primary bg-primary rounded-xl hover:scale-105 transition-transform duration-300 disabled:opacity-70 disabled:cursor-wait hover:shadow-[0_0_15px_rgba(137,206,255,0.4)]">
                        Apply Now <ChevronRight className="w-4 h-4" />
                      </button>
                    )
                  ) : (
                    <Link to="/login" className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-primary border-2 border-primary/20 rounded-xl hover:bg-primary/10 transition-all">
                      Sign in to Apply
                    </Link>
                  )}
                  <span className="text-xs text-on-surface-variant hidden sm:block">Posted by {job.companyName || job.companyId || 'Anonymous'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedJob && (
        <div className="fixed inset-0 bg-surface-dim/80 backdrop-blur-md z-50 flex items-center justify-center px-4 py-6">
          <div className="glass-card rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-start justify-between gap-4 p-6 border-b border-white/10">
              <div>
                <h2 className="text-lg font-bold text-on-surface">Apply for {selectedJob.title}</h2>
                <p className="text-sm text-on-surface-variant mt-1">Your profile name and status are filled automatically.</p>
              </div>
              <button onClick={closeApplyForm} className="p-2 rounded-xl hover:bg-white/5 text-on-surface-variant hover:text-primary transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {applicationError && <div className="mx-6 mt-4 bg-error/10 border border-error/20 text-error text-sm rounded-xl px-4 py-3">{applicationError}</div>}

            <form onSubmit={handleApplySubmit} className="p-6 space-y-4">
              {formLoading ? (
                <div className="py-10 flex justify-center">
                  <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-xs font-semibold text-on-surface-variant">Name *</span>
                      <div className="relative mt-1">
                        <UserCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                        <input required value={applicationForm.applicantName} onChange={event => updateApplicationField('applicantName', event.target.value)} placeholder="Your full name" className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg bg-surface border border-white/10 text-on-surface focus:outline-none focus:border-primary transition-colors" />
                      </div>
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold text-on-surface-variant">Profile status</span>
                      <input value={applicationForm.applicantCurrentStatus.replace('_', ' ') || 'Not set'} readOnly className="mt-1 w-full px-3 py-2.5 text-sm rounded-lg bg-surface-container border border-white/5 text-on-surface-variant cursor-not-allowed" />
                    </label>
                  </div>

                  <label className="block">
                    <span className="text-xs font-semibold text-on-surface-variant">Email *</span>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                      <input type="email" required value={applicationForm.applicantEmail} onChange={event => updateApplicationField('applicantEmail', event.target.value)} className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg bg-surface border border-white/10 text-on-surface focus:outline-none focus:border-primary transition-colors" />
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold text-on-surface-variant">Phone number *</span>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                      <input type="tel" required value={applicationForm.applicantPhone} onChange={event => updateApplicationField('applicantPhone', event.target.value)} placeholder="+94 77 123 4567" className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg bg-surface border border-white/10 text-on-surface focus:outline-none focus:border-primary transition-colors" />
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold text-on-surface-variant">Address *</span>
                    <div className="relative mt-1">
                      <Home className="absolute left-3 top-3 w-4 h-4 text-on-surface-variant" />
                      <textarea required value={applicationForm.applicantAddress} onChange={event => updateApplicationField('applicantAddress', event.target.value)} rows={3} placeholder="Your current address" className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg bg-surface border border-white/10 text-on-surface focus:outline-none focus:border-primary transition-colors resize-none" />
                    </div>
                  </label>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-xs font-semibold text-on-surface-variant">Expected salary min</span>
                      <div className="relative mt-1">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                        <input type="number" min="0" value={applicationForm.expectedSalaryMin} onChange={event => updateApplicationField('expectedSalaryMin', event.target.value)} placeholder="50000" className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg bg-surface border border-white/10 text-on-surface focus:outline-none focus:border-primary transition-colors" />
                      </div>
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold text-on-surface-variant">Expected salary max</span>
                      <div className="relative mt-1">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                        <input type="number" min="0" value={applicationForm.expectedSalaryMax} onChange={event => updateApplicationField('expectedSalaryMax', event.target.value)} placeholder="75000" className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg bg-surface border border-white/10 text-on-surface focus:outline-none focus:border-primary transition-colors" />
                      </div>
                    </label>
                  </div>

                  <label className="block">
                    <span className="text-xs font-semibold text-on-surface-variant">Short description</span>
                    <div className="relative mt-1">
                      <FileText className="absolute left-3 top-3 w-4 h-4 text-on-surface-variant" />
                      <textarea value={applicationForm.applicantDescription} onChange={event => updateApplicationField('applicantDescription', event.target.value)} rows={3} maxLength={1000} placeholder="Briefly tell the company why you are a good fit" className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg bg-surface border border-white/10 text-on-surface focus:outline-none focus:border-primary transition-colors resize-none" />
                    </div>
                  </label>

                  <div className="rounded-lg border border-white/10 bg-surface-container p-4 flex flex-col gap-3">
                    <p className="text-sm font-semibold text-on-surface">Select or Upload CV *</p>
                    
                    {profileCvs.length > 0 && (
                      <div className="space-y-2 mb-2">
                        {profileCvs.map(cv => (
                          <label key={cv.id} className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-surface cursor-pointer hover:border-primary/50 transition-colors">
                            <input 
                              type="radio" 
                              name="apply_cv_select" 
                              value={cv.url} 
                              checked={applicationForm.resumeUrlUsed === cv.url} 
                              onChange={() => {
                                updateApplicationField('resumeUrlUsed', cv.url);
                                setSelectedCvName(cv.name);
                              }} 
                              className="text-primary focus:ring-primary h-4 w-4 bg-surface border-white/20" 
                            />
                            <span className="text-sm font-medium text-on-surface truncate">{cv.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 min-w-0 mt-2 border-t border-white/10 pt-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0 border border-primary/30">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-[180px] flex-1">
                        <label htmlFor="application-cv-input" className="block text-xs font-semibold text-on-surface-variant mb-1">Upload a New CV</label>
                        <input
                          id="application-cv-input"
                          type="file"
                          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          disabled={cvUploading}
                          onChange={event => handleCvChange(event.target.files?.[0])}
                          className="block w-full cursor-pointer rounded-lg border border-white/10 bg-surface text-xs text-on-surface-variant file:mr-3 file:border-0 file:bg-primary/20 file:px-3 file:py-2.5 file:text-xs file:font-semibold file:text-primary hover:file:bg-primary/30 disabled:cursor-wait disabled:opacity-60"
                        />
                      </div>
                    </div>
                    {cvUploading && <p className="text-xs text-primary text-center">Uploading CV...</p>}
                    {applicationForm.resumeUrlUsed && (
                       <a href={cvHref} target="_blank" rel="noreferrer" className="text-xs text-primary hover:text-primary-fixed block mt-2 text-center underline">Preview selected CV ({selectedCvName || 'File'})</a>
                    )}
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeApplyForm} disabled={Boolean(applying || cvUploading)} className="flex-1 py-3 text-sm font-semibold text-on-surface-variant glass hover:bg-white/5 rounded-xl transition-colors disabled:opacity-60">
                  Cancel
                </button>
                <button type="submit" disabled={Boolean(applying || cvUploading || formLoading)} className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-on-primary bg-primary rounded-xl hover:scale-105 transition-transform duration-300 disabled:opacity-60 hover:shadow-[0_0_15px_rgba(137,206,255,0.4)]">
                  {applying ? 'Applying...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {aiModalOpen && (
        <div className="fixed inset-0 bg-surface-dim/80 backdrop-blur-md z-50 flex items-center justify-center px-4 py-6">
          <div className="glass-card rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> AI Job Suggestion
              </h2>
              <button onClick={() => setAiModalOpen(false)} disabled={aiProcessing} className="p-2 rounded-xl hover:bg-white/5 text-on-surface-variant transition-colors disabled:opacity-50">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {aiProcessing ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-sm font-medium text-primary animate-pulse">Gemini AI is analyzing your CV...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-on-surface-variant">Select a CV to analyze against open jobs and find your best matches.</p>
                {profileCvs.length === 0 ? (
                  <div className="bg-surface-container rounded-xl p-4 text-center">
                    <p className="text-sm text-on-surface-variant">You don't have any CVs uploaded yet. Please upload a CV in your profile first.</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2 max-h-[40vh] overflow-y-auto no-scrollbar">
                      <label className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-surface-container cursor-pointer hover:border-primary/50 transition-colors">
                        <input type="radio" name="ai_cv_select" value="ALL" checked={selectedCvForAi === 'ALL'} onChange={() => setSelectedCvForAi('ALL')} className="text-primary focus:ring-primary h-4 w-4 bg-surface border-white/20" />
                        <span className="text-sm font-medium text-on-surface">All CVs (Combined Analysis)</span>
                      </label>
                      {profileCvs.map(cv => (
                        <label key={cv.id} className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-surface-container cursor-pointer hover:border-primary/50 transition-colors">
                          <input type="radio" name="ai_cv_select" value={cv.id} checked={selectedCvForAi === cv.id} onChange={() => setSelectedCvForAi(cv.id)} className="text-primary focus:ring-primary h-4 w-4 bg-surface border-white/20" />
                          <span className="text-sm font-medium text-on-surface truncate">{cv.name}</span>
                        </label>
                      ))}
                    </div>
                    <button onClick={handleAiSuggest} disabled={!selectedCvForAi} className="w-full mt-4 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-on-primary bg-primary rounded-xl hover:scale-105 transition-transform duration-300 disabled:opacity-60 disabled:hover:scale-100 hover:shadow-[0_0_15px_rgba(137,206,255,0.4)]">
                      <Sparkles className="w-4 h-4" /> Analyze with Gemini AI
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobFeed;
