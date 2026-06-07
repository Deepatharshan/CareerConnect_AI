export const API_BASE_URL = 'http://localhost:8080/api/v1';

// Authentication Endpoints
export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error('Login failed');
  }
  return response.json();
};

export const register = async (email: string, password: string, role: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role }),
  });
  if (!response.ok) {
    throw new Error('Registration failed');
  }
  return response.json();
};

// Job Endpoints
export const fetchOpenJobs = async (params: Record<string, string> = {}) => {
  const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value)).toString();
  const response = await fetch(`${API_BASE_URL}/jobs${query ? `?${query}` : ''}`);
  if (!response.ok) {
    throw new Error('Failed to fetch jobs');
  }
  return response.json();
};

export const createJob = async (jobData: any, token: string) => {
  const response = await fetch(`${API_BASE_URL}/jobs`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(jobData),
  });
  if (!response.ok) {
    throw new Error('Failed to create job');
  }
  return response.json();
};

export const getJobById = async (jobId: string) => {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch job details');
  }
  return response.json();
};

export const updateJob = async (jobId: string, jobData: any, token: string) => {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(jobData),
  });
  if (!response.ok) {
    throw new Error('Failed to update job');
  }
  return response.json();
};

export const deleteJob = async (jobId: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Failed to delete job');
  }
};

// Company Endpoints
export const getCompanyJobs = async (companyId: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/jobs/company/${companyId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch company jobs');
  }
  return response.json();
};
export const getCompanyByOwner = async (ownerId: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/companies/owner/${ownerId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch company details');
  return response.json();
};

export const updateCompany = async (company: any, token: string) => {
  const response = await fetch(`${API_BASE_URL}/companies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(company)
  });
  if (!response.ok) throw new Error('Failed to update company');
  return response.json();
};

export const uploadCompanyLogo = async (file: File, token: string) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${API_BASE_URL}/companies/uploads/logo`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
  if (!response.ok) throw new Error('Failed to upload logo');
  return response.text();
};

export const uploadJobPoster = async (file: File, token: string) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${API_BASE_URL}/jobs/uploads/poster`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
  if (!response.ok) throw new Error('Failed to upload poster');
  return response.text();
};
// Application Endpoints
export const applyForJob = async (jobId: string, candidateId: string, token: string, details: Record<string, unknown> = {}) => {
  const response = await fetch(`${API_BASE_URL}/applications/apply/${jobId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ candidateId, ...details })
  });
  if (!response.ok) {
    throw new Error('Failed to apply for job');
  }
  return response.json();
};

export const getApplications = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/applications`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch applications');
  }
  return response.json();
};

export const getUserApplications = async (userId: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/applications/user/${userId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch user applications');
  return response.json();
};

export const saveJob = async (jobId: string, candidateId: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/applications/save/${jobId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ candidateId })
  });
  if (!response.ok) throw new Error('Failed to save job');
  return response.json();
};

export const withdrawApplication = async (applicationId: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/withdraw`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to withdraw application');
  return response.json();
};

export const updateApplicationStatus = async (applicationId: string, status: string, employerInstructions: string, employerEmail: string, jobTitle: string, companyName: string, token: string) => {
  const payload: any = { status };
  if (employerInstructions) {
    payload.employerInstructions = employerInstructions;
  }
  if (employerEmail) {
    payload.employerEmail = employerEmail;
  }
  if (jobTitle) {
    payload.jobTitle = jobTitle;
  }
  if (companyName) {
    payload.companyName = companyName;
  }
  const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to update application status');
  return response.json();
};

export const deleteApplication = async (applicationId: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/applications/${applicationId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to delete application');
  return response.text();
};

export const analyzeCv = async (cvText: string, targetJobId?: string) => {
  const response = await fetch(`${API_BASE_URL}/ai/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cvText, targetJobId }),
  });
  if (!response.ok) throw new Error('Failed to analyze CV');
  return response.json();
};

export const analyzeCvFile = async (file: File, targetJobId?: string) => {
  const formData = new FormData();
  formData.append('file', file);
  if (targetJobId) {
    formData.append('targetJobId', targetJobId);
  }
  const response = await fetch(`${API_BASE_URL}/ai/cv/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to analyze CV file');
  return response.json();
};

export const matchJobsWithCv = async (files: File[], jobs: any[]) => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  formData.append('jobsJson', JSON.stringify(jobs));

  const response = await fetch(`${API_BASE_URL}/ai/cv/match-jobs`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to match jobs with CV');
  return response.json();
};

export const getRecommendations = async (userId: string, skills = '') => {
  const response = await fetch(`${API_BASE_URL}/recommendations/jobs/${userId}?skills=${encodeURIComponent(skills)}`);
  if (!response.ok) throw new Error('Failed to fetch recommendations');
  return response.json();
};

export const getProfile = async (userId: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/profiles/${userId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Failed to fetch profile');
  return response.json();
};

export const saveProfile = async (profile: Record<string, unknown>, token: string) => {
  const response = await fetch(`${API_BASE_URL}/profiles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(profile),
  });
  if (!response.ok) throw new Error('Failed to save profile');
  return response.json();
};

export const uploadCv = async (userId: string, file: File, token: string, name?: string) => {
  const formData = new FormData();
  formData.append('file', file);
  if (name) formData.append('name', name);

  const response = await fetch(`${API_BASE_URL}/profiles/${userId}/cv`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(errText || 'Failed to upload CV');
  }
  return response.json();
};

export const deleteCv = async (userId: string, cvId: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/profiles/${userId}/cv/${cvId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to delete CV');
  return response.json();
};

export const uploadProfilePicture = async (userId: string, file: File, token: string) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/profiles/${userId}/picture`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to upload profile picture');
  return response.json();
};

export const scheduleInterview = async (payload: Record<string, string>, token: string) => {
  const response = await fetch(`${API_BASE_URL}/interviews/schedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to schedule interview');
  return response.json();
};

export const sendChatMessage = async (roomId: string, payload: Record<string, string>, token: string) => {
  const response = await fetch(`${API_BASE_URL}/chat/rooms/${roomId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to send message');
  return response.json();
};

export const fetchChatMessages = async (roomId: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/chat/rooms/${roomId}/messages`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch messages');
  return response.json();
};

export const getAdminAnalytics = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/admin/analytics`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch analytics');
  return response.json();
};

export const getJobApplications = async (jobId: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/applications/job/${jobId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch job applications');
  }
  return response.json();
};
