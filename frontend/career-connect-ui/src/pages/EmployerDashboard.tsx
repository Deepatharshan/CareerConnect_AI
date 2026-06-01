import React, { useState, useEffect } from 'react';
import { Building2, PlusCircle, Briefcase, Users, TrendingUp, CheckCircle, X, DollarSign, MapPin, FileText, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, getCompanyJobs, getJobApplications } from '../api';

const emptyForm = { title: '', description: '', requirements: '', location: '', jobType: 'FULL_TIME', salaryMin: '', salaryMax: '' };

const EmployerDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Dashboard Data State
  const [jobsCount, setJobsCount] = useState(0);
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
      // 1. Fetch all jobs created by this employer
      const companyJobs = await getCompanyJobs(user!.userId, user!.token);
      setJobsCount(companyJobs.length);

      // 2. For each job, fetch its applicants
      let allApplicants: any[] = [];
      for (const job of companyJobs) {
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
      <div className="min-h-screen bg-slate-50 pt-28 flex flex-col items-center justify-center gap-4 px-4">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
          <X className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Access Restricted</h2>
        <p className="text-slate-500 text-sm text-center max-w-sm">This dashboard is only available for Employer accounts. Please register or log in as an Employer.</p>
        <button onClick={() => navigate('/register')} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">Register as Employer</button>
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
      const res = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user?.token}` },
        body: JSON.stringify({ ...form, companyId: user?.userId, salaryMin: Number(form.salaryMin), salaryMax: Number(form.salaryMax) }),
      });
      if (!res.ok) throw new Error();
      setSuccess('Job posted successfully! The listing is now live.');
      setForm(emptyForm);
      setShowModal(false);
      fetchDashboardData(); // Refresh table
    } catch {
      setError('Failed to post job. Make sure the backend is running.');
    } finally {
      setSubmitting(false);
    }
  };

  const shortlistedCount = applicants.filter(a => a.status === 'SHORTLISTED' || a.status === 'INTERVIEW_SCHEDULED').length;

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Employer Dashboard</h1>
              <p className="text-blue-200 text-sm mt-0.5">Welcome back, {user?.email?.split('@')[0]}</p>
            </div>
          </div>
          <button
            id="post-job-modal-btn"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            <PlusCircle className="w-5 h-5" />
            Post a New Job
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Success Banner */}
        {success && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-2xl px-5 py-4">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{success}</p>
            <button onClick={() => setSuccess('')} className="ml-auto text-green-500 hover:text-green-700"><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center shrink-0"><Briefcase className="w-5 h-5 text-blue-500" /></div>
            <div><p className="text-2xl font-bold text-slate-900">{jobsCount}</p><p className="text-xs text-slate-500 mt-0.5">Jobs Posted</p></div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-11 h-11 bg-purple-50 rounded-xl flex items-center justify-center shrink-0"><Users className="w-5 h-5 text-purple-500" /></div>
            <div><p className="text-2xl font-bold text-slate-900">{applicants.length}</p><p className="text-xs text-slate-500 mt-0.5">Total Applicants</p></div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center shrink-0"><CheckCircle className="w-5 h-5 text-green-500" /></div>
            <div><p className="text-2xl font-bold text-slate-900">{shortlistedCount}</p><p className="text-xs text-slate-500 mt-0.5">Shortlisted</p></div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center shrink-0"><TrendingUp className="w-5 h-5 text-orange-500" /></div>
            <div><p className="text-2xl font-bold text-slate-900">{jobsCount}</p><p className="text-xs text-slate-500 mt-0.5">Active Listings</p></div>
          </div>
        </div>

        {/* Recent Applicants Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent Applications</h2>
            <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">Real-time</span>
          </div>
          <div className="overflow-x-auto">
            {loadingData ? (
              <div className="p-8 text-center text-slate-500">Loading applicants...</div>
            ) : applicants.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No applicants yet. Post a job to get started!</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium">Candidate ID</th>
                    <th className="px-6 py-3 text-left font-medium">Job Applied</th>
                    <th className="px-6 py-3 text-left font-medium">Date</th>
                    <th className="px-6 py-3 text-left font-medium">Status</th>
                    <th className="px-6 py-3 text-left font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {applicants.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {a.candidateId?.charAt(0)?.toUpperCase() || 'C'}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">Candidate #{a.candidateId?.substring(0, 4)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{a.jobTitle || 'Unknown Job'}</td>
                      <td className="px-6 py-4 text-slate-400">{new Date(a.appliedAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                          a.status === 'SHORTLISTED' || a.status === 'INTERVIEW_SCHEDULED' ? 'bg-green-50 text-green-700 border-green-200' :
                          a.status === 'UNDER_REVIEW' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          a.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {a.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-xs text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center gap-1">
                          Manage <ChevronDown className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Post Job Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-6">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Post a New Job</h2>
                <p className="text-sm text-slate-500">Fill in the details below to create a listing</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">⚠ {error}</div>}

            <form onSubmit={handlePostJob} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Job Title *</label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input id="job-title-input" name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Senior React Developer" className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Location *</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input id="job-location-input" name="location" value={form.location} onChange={handleChange} required placeholder="e.g. Remote, Bangalore" className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Job Type</label>
                  <select id="job-type-select" name="jobType" value={form.jobType} onChange={handleChange} className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="INTERNSHIP">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Salary Min ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input id="salary-min-input" name="salaryMin" type="number" value={form.salaryMin} onChange={handleChange} placeholder="60000" className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Description *</label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <textarea id="job-desc-input" name="description" value={form.description} onChange={handleChange} required placeholder="Describe the role, responsibilities…" rows={3} className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Requirements</label>
                <textarea id="job-req-input" name="requirements" value={form.requirements} onChange={handleChange} placeholder="Skills, qualifications, experience required…" rows={2} className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                  Cancel
                </button>
                <button id="post-job-submit-btn" type="submit" disabled={submitting} className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-700 to-blue-500 rounded-xl shadow-md hover:shadow-blue-200 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60">
                  {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '🚀 Post Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;
