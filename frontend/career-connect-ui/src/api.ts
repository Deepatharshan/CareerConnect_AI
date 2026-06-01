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

// Application Endpoints
export const applyForJob = async (jobId: string, candidateId: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/applications/apply/${jobId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ candidateId })
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

export const analyzeCv = async (cvText: string, targetJobId?: string) => {
  const response = await fetch(`${API_BASE_URL}/ai/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cvText, targetJobId }),
  });
  if (!response.ok) throw new Error('Failed to analyze CV');
  return response.json();
};

export const getRecommendations = async (userId: string, skills = '') => {
  const response = await fetch(`${API_BASE_URL}/recommendations/jobs/${userId}?skills=${encodeURIComponent(skills)}`);
  if (!response.ok) throw new Error('Failed to fetch recommendations');
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
