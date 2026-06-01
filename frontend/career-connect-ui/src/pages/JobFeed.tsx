import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Clock, DollarSign, Sparkles, ChevronRight, Building2, Bookmark, CheckCircle } from 'lucide-react';
import { fetchOpenJobs, applyForJob } from '../api';
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
}

const jobTypeBadge: Record<string, string> = {
  FULL_TIME: 'bg-green-50 text-green-700 border-green-200',
  PART_TIME: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  CONTRACT: 'bg-purple-50 text-purple-700 border-purple-200',
  INTERNSHIP: 'bg-sky-50 text-sky-700 border-sky-200',
};

const placeholderJobs: Job[] = [
  { id: '1', title: 'Senior Java Backend Engineer', companyId: 'TechCorp', location: 'Remote', jobType: 'FULL_TIME', salaryMin: 90000, salaryMax: 130000, description: 'Build scalable microservices using Java Spring Boot, Kafka, and Kubernetes.', status: 'OPEN', createdAt: '2026-05-25T10:00:00' },
  { id: '2', title: 'React Frontend Developer', companyId: 'StartupXYZ', location: 'Bangalore, IN', jobType: 'FULL_TIME', salaryMin: 60000, salaryMax: 90000, description: 'Craft beautiful, high-performance user interfaces using React, TypeScript, and Tailwind CSS.', status: 'OPEN', createdAt: '2026-05-24T10:00:00' },
];

const JobFeed = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [appliedSet, setAppliedSet] = useState<Set<string>>(new Set());
  const [applying, setApplying] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchOpenJobs()
      .then(data => setJobs(data.length ? data : placeholderJobs))
      .catch(() => setJobs(placeholderJobs))
      .finally(() => setLoading(false));
  }, []);

  const handleApply = async (jobId: string) => {
    if (!user) return;
    setApplying(jobId);
    try {
      await applyForJob(jobId, user.userId, user.token);
      setAppliedSet(prev => new Set(prev).add(jobId));
    } catch (err) {
      alert("Failed to apply for job. Ensure the backend is running.");
    } finally {
      setApplying(null);
    }
  };

  const filtered = jobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.location?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'ALL' || j.jobType === filterType;
    return matchSearch && matchType;
  });

  const toggleSave = (id: string) => {
    setSaved(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const formatSalary = (min: number, max: number) => {
    if (!min && !max) return 'Competitive';
    const fmt = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;
    return `${fmt(min)} – ${fmt(max)}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      {/* Top Search Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 py-10 px-4">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-blue-100 text-sm font-medium">{filtered.length} jobs match your profile</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Find Your Next Opportunity</h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3">
              <Search className="w-4 h-4 text-white/70 shrink-0" />
              <input
                id="job-search-input"
                type="text"
                placeholder="Search jobs or location…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent text-white placeholder-white/60 focus:outline-none text-sm w-full"
              />
            </div>
            <select
              id="job-type-filter"
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="text-slate-800">All Types</option>
              <option value="FULL_TIME" className="text-slate-800">Full Time</option>
              <option value="PART_TIME" className="text-slate-800">Part Time</option>
              <option value="CONTRACT" className="text-slate-800">Contract</option>
              <option value="INTERNSHIP" className="text-slate-800">Internship</option>
            </select>
          </div>
        </div>
      </div>

      {/* Job Cards */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No jobs found</p>
            <p className="text-sm">Try a different search term</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(job => (
              <div key={job.id} id={`job-card-${job.id}`} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-300 group p-6">
                <div className="flex items-start justify-between gap-4">
                  {/* Company Avatar */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                      <Building2 className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">{job.title}</h2>
                      <p className="text-sm text-slate-500 mt-0.5">{job.companyId || 'Company'}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${jobTypeBadge[job.jobType] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                          {job.jobType?.replace('_', ' ') || 'Full Time'}
                        </span>
                        {job.location && (
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <MapPin className="w-3 h-3" /> {job.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <DollarSign className="w-3 h-3" /> {formatSalary(job.salaryMin, job.salaryMax)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <button
                      onClick={() => toggleSave(job.id)}
                      className={`p-2 rounded-xl transition-all duration-200 ${saved.has(job.id) ? 'bg-blue-100 text-blue-600' : 'text-slate-300 hover:text-slate-500 hover:bg-slate-50'}`}
                    >
                      <Bookmark className="w-4 h-4" fill={saved.has(job.id) ? 'currentColor' : 'none'} />
                    </button>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-sm text-slate-500 leading-relaxed line-clamp-2">{job.description}</p>

                <div className="mt-4 flex items-center justify-between">
                  {isAuthenticated ? (
                    appliedSet.has(job.id) ? (
                      <button disabled className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-green-700 bg-green-50 border border-green-200 rounded-xl cursor-default">
                        <CheckCircle className="w-4 h-4" /> Applied
                      </button>
                    ) : (
                      <button id={`apply-btn-${job.id}`} onClick={() => handleApply(job.id)} disabled={applying === job.id} className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-700 to-blue-500 rounded-xl hover:shadow-md hover:shadow-blue-200 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-wait">
                        {applying === job.id ? 'Applying...' : 'Apply Now'} <ChevronRight className="w-4 h-4" />
                      </button>
                    )
                  ) : (
                    <Link to="/login" className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-blue-600 border-2 border-blue-200 rounded-xl hover:bg-blue-50 transition-all">
                      Sign in to Apply
                    </Link>
                  )}
                  <span className="text-xs text-slate-400 hidden sm:block">Posted by {job.companyId || 'Anonymous'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobFeed;
