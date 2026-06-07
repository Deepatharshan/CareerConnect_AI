import { useEffect, useState } from 'react';
import { CalendarClock, CheckCircle2, FileText, MessageSquare, Save, Send, Upload, UserCircle2, XCircle, Building2, Trash2, Camera, Bell } from 'lucide-react';
import { fetchChatMessages, getProfile, getUserApplications, saveProfile, scheduleInterview, sendChatMessage, uploadCv, deleteCv, uploadProfilePicture, withdrawApplication, getJobById, API_BASE_URL } from '../api';
import { useAuth } from '../context/AuthContext';

interface ProfileForm {
  firstName: string;
  lastName: string;
  headline: string;
  currentJobStatus: string;
  studyLevel: string;
  skillsText: string;
  cvs: any[];
  profilePictureUrl: string;
}

const emptyProfile: ProfileForm = {
  firstName: '',
  lastName: '',
  headline: '',
  currentJobStatus: '',
  studyLevel: '',
  skillsText: '',
  cvs: [],
  profilePictureUrl: '',
};

const completionItems = [
  { key: 'details', label: 'Personal details' },
  { key: 'currentJobStatus', label: 'Current job status' },
  { key: 'studyLevel', label: 'Study level' },
  { key: 'skills', label: 'Skills' },
  { key: 'cv', label: 'CV upload' },
];

const calculateProfileCompletion = (profile: ProfileForm) => {
  const completed = [
    Boolean(profile.firstName.trim() && profile.lastName.trim() && profile.headline.trim()),
    Boolean(profile.currentJobStatus),
    Boolean(profile.studyLevel),
    Boolean(profile.skillsText.trim()),
    Boolean(profile.cvs && profile.cvs.length > 0),
  ].filter(Boolean).length;

  return completed * 20;
};

const CandidateWorkspace = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [meeting, setMeeting] = useState<any>(null);
  const [profile, setProfile] = useState<ProfileForm>(emptyProfile);
  const [profileSaving, setProfileSaving] = useState(false);
  const [cvUploading, setCvUploading] = useState(false);
  const [picUploading, setPicUploading] = useState(false);
  const [profileNotice, setProfileNotice] = useState('');
  const [newCvName, setNewCvName] = useState('');

  useEffect(() => {
    if (!user) return;
    getUserApplications(user.userId, user.token).then(async (apps) => {
      const enrichedApps = await Promise.all(
        apps.map(async (app: any) => {
          try {
            const job = await getJobById(app.jobId);
            return { ...app, jobTitle: job.title, companyName: job.companyName || job.companyId, companyLogoUrl: job.companyLogoUrl };
          } catch (err) {
            return { ...app, jobTitle: 'Unknown Job', companyName: 'Unknown Company' };
          }
        })
      );
      enrichedApps.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
      setApplications(enrichedApps.filter(app => app.status !== 'WITHDRAWN'));
    }).catch(() => setApplications([]));
    fetchChatMessages(user.userId, user.token).then(setMessages).catch(() => setMessages([]));
    getProfile(user.userId, user.token)
      .then((data) => {
        if (!data) return;
        setProfile({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          headline: data.headline || '',
          currentJobStatus: data.currentJobStatus || '',
          studyLevel: data.studyLevel || '',
          skillsText: Array.isArray(data.skills) ? data.skills.join(', ') : '',
          cvs: data.cvs || [],
          profilePictureUrl: data.profilePictureUrl || '',
        });
      })
      .catch(() => setProfile(emptyProfile));
  }, [user]);

  const profileCompletion = calculateProfileCompletion(profile);
  const profileComplete = profileCompletion === 100;
  const displayedProfileCompletion = profileComplete ? 100 : Math.max(profileCompletion, 20);

  const updateProfileField = (field: keyof ProfileForm, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
    setProfileNotice('');
  };

  const handleCvChange = async (file?: File) => {
    if (!file || !user) return;
    setCvUploading(true);
    setProfileNotice('');
    try {
      const saved = await uploadCv(user.userId, file, user.token, newCvName);
      updateProfileField('cvs', saved.cvs || []);
      setNewCvName('');
      setProfileNotice('CV uploaded successfully.');
    } catch (err: any) {
      setProfileNotice(err.message || 'Could not upload CV.');
    } finally {
      setCvUploading(false);
    }
  };

  const handleCvDelete = async (cvId: string) => {
    if (!user) return;
    try {
      const saved = await deleteCv(user.userId, cvId, user.token);
      updateProfileField('cvs', saved.cvs || []);
      setProfileNotice('CV deleted.');
    } catch {
      setProfileNotice('Could not delete CV.');
    }
  };

  const handleProfilePictureChange = async (file?: File) => {
    if (!file || !user) return;
    setPicUploading(true);
    try {
      const saved = await uploadProfilePicture(user.userId, file, user.token);
      updateProfileField('profilePictureUrl', saved.profilePictureUrl);
      setProfileNotice('Profile picture updated.');
    } catch {
      setProfileNotice('Could not upload profile picture.');
    } finally {
      setPicUploading(false);
    }
  };

  const saveProfileSetup = async () => {
    if (!user) return;
    setProfileSaving(true);
    setProfileNotice('');
    try {
      const saved = await saveProfile({
        userId: user.userId,
        firstName: profile.firstName.trim(),
        lastName: profile.lastName.trim(),
        headline: profile.headline.trim(),
        currentJobStatus: profile.currentJobStatus,
        studyLevel: profile.studyLevel,
        skills: profile.skillsText.split(',').map((skill) => skill.trim()).filter(Boolean),
        cvs: profile.cvs,
        profilePictureUrl: profile.profilePictureUrl,
      }, user.token);

      setProfile({
        firstName: saved.firstName || profile.firstName,
        lastName: saved.lastName || profile.lastName,
        headline: saved.headline || profile.headline,
        currentJobStatus: saved.currentJobStatus || profile.currentJobStatus,
        studyLevel: saved.studyLevel || profile.studyLevel,
        skillsText: Array.isArray(saved.skills) ? saved.skills.join(', ') : profile.skillsText,
        cvs: saved.cvs || profile.cvs,
        profilePictureUrl: saved.profilePictureUrl || profile.profilePictureUrl,
      });
      setProfileNotice('Profile setup saved.');
    } catch {
      setProfileNotice('Could not save profile. Check that the profile service is running.');
    } finally {
      setProfileSaving(false);
    }
  };

  const send = async () => {
    if (!user || !message.trim()) return;
    const created = await sendChatMessage(user.userId, { senderId: user.userId, body: message }, user.token);
    setMessages((items) => [...items, created]);
    setMessage('');
  };

  const schedule = async () => {
    if (!user) return;
    const result = await scheduleInterview({ candidateId: user.userId, employerId: 'demo-employer' }, user.token);
    setMeeting(result);
  };

  const withdraw = async (id: string) => {
    if (!user) return;
    await withdrawApplication(id, user.token);
    setApplications((items) => items.filter((item) => item.id !== id));
  };

  const selectedApps = applications.filter(app => app.status === 'SELECTED' && app.employerInstructions);

  return (
    <div className="min-h-screen pt-24 pb-10 px-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_380px] gap-6 relative z-10">
        <main className="space-y-6">
          {selectedApps.length > 0 && (
            <div className="glass-card rounded-3xl p-6 bg-green-400/5 border border-green-400/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-400/20 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-green-400 animate-pulse" />
                </div>
                <h2 className="text-lg font-bold text-green-400">You have new notifications!</h2>
              </div>
              <div className="space-y-3">
                {selectedApps.map(app => (
                  <div key={app.id} className="p-4 rounded-xl bg-surface border border-white/5 shadow-lg">
                    <p className="text-sm font-semibold text-on-surface mb-1">Congratulations! You've been selected for <span className="text-primary">{app.jobTitle}</span> at {app.companyName}.</p>
                    <p className="text-xs text-on-surface-variant italic">"{app.employerInstructions}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <section className="glass-card rounded-3xl p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-5">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-full bg-surface-container border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                    {profile.profilePictureUrl ? (
                      <img src={profile.profilePictureUrl.startsWith('http') ? profile.profilePictureUrl : `${API_BASE_URL.replace('/api/v1', '')}${profile.profilePictureUrl}`} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <UserCircle2 className="w-10 h-10 text-on-surface-variant/50" />
                    )}
                  </div>
                  <label className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-6 h-6 text-white" />
                    <input type="file" accept="image/*" className="sr-only" disabled={picUploading} onChange={(e) => handleProfilePictureChange(e.target.files?.[0])} />
                  </label>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-on-surface flex items-center gap-2">
                    Complete Profile Setup
                  </h1>
                  <p className="mt-1 text-sm text-on-surface-variant">Fill every section so employers can see a ready candidate profile.</p>
                </div>
              </div>
              <div className={`rounded-xl border px-4 py-3 min-w-[170px] ${profileComplete ? 'border-green-400/20 bg-green-400/10' : 'border-error/20 bg-error/10'}`}>
                <div className={`text-2xl font-bold ${profileComplete ? 'text-green-400' : 'text-error'}`}>{displayedProfileCompletion}%</div>
                <p className={`text-xs font-semibold ${profileComplete ? 'text-green-400/70' : 'text-error/70'}`}>
                  {profileComplete ? 'Profile setup complete' : 'Profile incomplete'}
                </p>
              </div>
            </div>

            <div className="mt-6 h-2 rounded-full bg-surface-container-high overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-1000 ${profileComplete ? 'bg-green-400' : 'bg-primary'}`} style={{ width: `${displayedProfileCompletion}%` }} />
            </div>

            {!profileComplete && (
              <div className="mt-6 rounded-xl border border-error/20 bg-error/10 p-3 text-sm text-error flex items-center gap-2">
                <XCircle className="w-4 h-4 shrink-0" />
                {displayedProfileCompletion}% setup. Add the missing details below to reach 100%.
              </div>
            )}

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-semibold text-on-surface-variant">First name</span>
                <input value={profile.firstName} onChange={(event) => updateProfileField('firstName', event.target.value)} className="mt-1.5 w-full rounded-xl bg-surface border border-white/10 px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors" />
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-on-surface-variant">Last name</span>
                <input value={profile.lastName} onChange={(event) => updateProfileField('lastName', event.target.value)} className="mt-1.5 w-full rounded-xl bg-surface border border-white/10 px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors" />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-xs font-semibold text-on-surface-variant">Professional headline</span>
                <input value={profile.headline} onChange={(event) => updateProfileField('headline', event.target.value)} placeholder="Frontend developer, UI designer, data analyst..." className="mt-1.5 w-full rounded-xl bg-surface border border-white/10 px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors placeholder-on-surface-variant/50" />
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-on-surface-variant">Current job status</span>
                <select value={profile.currentJobStatus} onChange={(event) => updateProfileField('currentJobStatus', event.target.value)} className="mt-1.5 w-full rounded-xl bg-surface border border-white/10 px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors">
                  <option value="" className="bg-surface-dim">Select status</option>
                  <option value="OPEN_TO_WORK" className="bg-surface-dim">Open to work</option>
                  <option value="EMPLOYED" className="bg-surface-dim">Employed</option>
                  <option value="STUDENT" className="bg-surface-dim">Student</option>
                  <option value="FREELANCER" className="bg-surface-dim">Freelancer</option>
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-on-surface-variant">Study level</span>
                <select value={profile.studyLevel} onChange={(event) => updateProfileField('studyLevel', event.target.value)} className="mt-1.5 w-full rounded-xl bg-surface border border-white/10 px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors">
                  <option value="" className="bg-surface-dim">Select study level</option>
                  <option value="HIGH_SCHOOL" className="bg-surface-dim">High school</option>
                  <option value="DIPLOMA" className="bg-surface-dim">Diploma</option>
                  <option value="UNDERGRADUATE" className="bg-surface-dim">Undergraduate</option>
                  <option value="GRADUATE" className="bg-surface-dim">Graduate</option>
                  <option value="POSTGRADUATE" className="bg-surface-dim">Postgraduate</option>
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="text-xs font-semibold text-on-surface-variant">Skills</span>
                <input value={profile.skillsText} onChange={(event) => updateProfileField('skillsText', event.target.value)} placeholder="React, Java, Spring Boot, SQL" className="mt-1.5 w-full rounded-xl bg-surface border border-white/10 px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors placeholder-on-surface-variant/50" />
              </label>
            </div>

            <div className="mt-6 rounded-xl border border-white/10 bg-surface/50 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-on-surface flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> My CVs</h3>
                  <p className="text-xs text-on-surface-variant mt-1">Upload up to 7 resumes for different roles (e.g. Backend, Frontend).</p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 bg-surface-container rounded-lg">{profile.cvs.length} / 7</span>
              </div>
              
              <div className="space-y-2">
                {profile.cvs.map((cv) => (
                  <div key={cv.id} className="flex items-center justify-between p-3 rounded-xl bg-surface border border-white/5 group hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-4 h-4 text-primary/70 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-on-surface truncate">{cv.name}</p>
                        <p className="text-[10px] text-on-surface-variant mt-0.5">{new Date(cv.uploadedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button onClick={() => handleCvDelete(cv.id)} className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {profile.cvs.length < 7 && (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center mt-4">
                  <input value={newCvName} onChange={(e) => setNewCvName(e.target.value)} placeholder="e.g. Senior Java CV..." className="flex-1 rounded-xl bg-surface border border-white/10 px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors placeholder-on-surface-variant/50" />
                  <label className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-primary/20 text-primary bg-primary/10 text-sm font-semibold transition-colors shrink-0 ${cvUploading ? 'cursor-wait opacity-70' : 'cursor-pointer hover:bg-primary/20'}`}>
                    <Upload className="w-4 h-4" />
                    {cvUploading ? 'Uploading...' : 'Upload CV'}
                    <input type="file" accept=".pdf,.doc,.docx" className="sr-only" disabled={cvUploading} onChange={(event) => handleCvChange(event.target.files?.[0])} />
                  </label>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-white/10">
              <div className="flex flex-wrap gap-2">
                {completionItems.map((item, index) => {
                  const complete = [
                    profile.firstName.trim() && profile.lastName.trim() && profile.headline.trim(),
                    profile.currentJobStatus,
                    profile.studyLevel,
                    profile.skillsText.trim(),
                    profile.cvs.length > 0,
                  ][index];
                  return (
                    <span key={item.key} className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${complete ? 'border-green-400/20 bg-green-400/10 text-green-400' : 'border-error/20 bg-error/10 text-error'}`}>
                      {complete && <CheckCircle2 className="w-3 h-3" />}
                      {item.label}
                    </span>
                  );
                })}
              </div>
              <button onClick={saveProfileSetup} disabled={profileSaving} className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:scale-105 transition-transform text-on-primary text-sm font-semibold disabled:opacity-70 hover:shadow-[0_0_15px_rgba(137,206,255,0.4)]">
                <Save className="w-4 h-4" />
                {profileSaving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
            {profileNotice && <p className={`mt-3 text-sm ${profileNotice.includes('Could not') ? 'text-error' : 'text-green-400'}`}>{profileNotice}</p>}
          </section>

          <section className="glass-card rounded-3xl p-6">
            <h2 className="text-xl font-bold text-on-surface">Application Tracker</h2>
            <div className="mt-6 divide-y divide-white/10">
              {applications.length === 0 ? <p className="py-8 text-sm text-on-surface-variant text-center">No applications yet. Apply to jobs to see live status here.</p> : applications.map((app) => (
                <div key={app.id} className="py-5 group">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-surface border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                      {app.companyLogoUrl ? (
                        <img src={app.companyLogoUrl.startsWith('http') ? app.companyLogoUrl : `${API_BASE_URL.replace('/api/v1', '')}${app.companyLogoUrl}`} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-on-surface truncate">{app.jobTitle}</h3>
                      <p className="text-sm text-on-surface-variant truncate">{app.companyName}</p>
                      
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                          app.status === 'SELECTED' ? 'bg-green-400/20 text-green-400 border-green-400/30 shadow-[0_0_10px_rgba(74,222,128,0.2)]' :
                          app.status === 'SHORTLISTED' || app.status === 'INTERVIEW_SCHEDULED' ? 'bg-green-400/10 text-green-400 border-green-400/20' :
                          app.status === 'REJECTED' ? 'bg-error/10 text-error border-error/20' :
                          app.status === 'UNDER_REVIEW' ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20' :
                          app.status === 'WITHDRAWN' ? 'bg-surface-dim text-on-surface-variant border-white/10' :
                          'bg-primary/10 text-primary border-primary/20'
                        }`}>
                          {app.status?.replace('_', ' ')}
                        </span>
                        
                        <span className="text-xs text-on-surface-variant flex items-center gap-1">
                          <CalendarClock className="w-3.5 h-3.5" /> 
                          {new Date(app.appliedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 sm:flex-col sm:items-end sm:justify-center">
                    {app.status !== 'WITHDRAWN' && app.status !== 'REJECTED' && app.aiMatchScore != null && (
                      <div className="flex flex-col items-start sm:items-end w-full sm:w-auto">
                        <span className="text-xs font-semibold text-on-surface-variant mb-1.5 flex items-center gap-1">AI Match Prediction</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-surface-container rounded-full overflow-hidden">
                            <div className="h-full bg-tertiary rounded-full shadow-[0_0_8px_rgba(202,152,255,0.6)]" style={{ width: `${app.aiMatchScore}%` }} />
                          </div>
                          <span className="text-xs font-bold text-tertiary">{app.aiMatchScore}%</span>
                        </div>
                      </div>
                    )}
                    
                    {app.status !== 'WITHDRAWN' && (
                      <button onClick={() => withdraw(app.id)} className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-error/20 text-error hover:bg-error/10 text-xs font-medium transition-colors">
                        <XCircle className="w-3.5 h-3.5" /> Withdraw
                      </button>
                    )}
                  </div>
                </div>
                {/* Employer Instructions Box */}
                {app.employerInstructions && (
                  <div className="mt-4 px-5 py-4 bg-surface-container-low border border-white/5 rounded-xl">
                    <p className="text-xs font-semibold text-primary mb-1">Message from Employer</p>
                    <p className="text-sm text-on-surface-variant italic">"{app.employerInstructions}"</p>
                  </div>
                )}
                </div>
              ))}
            </div>
          </section>
        </main>

        <aside className="space-y-6">
          <section className="glass-card rounded-3xl p-6">
            <h2 className="font-bold text-on-surface flex items-center gap-2"><CalendarClock className="w-5 h-5 text-primary" /> Online Interview</h2>
            <button onClick={schedule} className="mt-6 w-full px-4 py-3 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 text-sm font-semibold transition-colors">Generate Meeting Link</button>
            {meeting && <a href={meeting.meetingLink} className="mt-4 block text-sm text-primary hover:text-primary-fixed break-all p-3 bg-surface rounded-xl border border-white/10">{meeting.meetingLink}</a>}
          </section>

          <section className="glass-card rounded-3xl p-6">
            <h2 className="font-bold text-on-surface flex items-center gap-2"><MessageSquare className="w-5 h-5 text-primary" /> Employer Chat</h2>
            <div className="mt-6 h-64 overflow-y-auto space-y-3 rounded-xl bg-surface/50 border border-white/5 p-4 custom-scrollbar">
              {messages.length === 0 ? <p className="text-sm text-on-surface-variant text-center mt-10">No messages yet.</p> : messages.map((item) => (
                <div key={item.id} className={`rounded-2xl p-3 text-sm max-w-[85%] ${item.senderId === user?.userId ? 'bg-primary text-on-primary ml-auto rounded-tr-sm' : 'bg-surface border border-white/10 text-on-surface mr-auto rounded-tl-sm'}`}>
                  {item.body}
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input value={message} onChange={(event) => setMessage(event.target.value)} className="min-w-0 flex-1 rounded-xl bg-surface border border-white/10 px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors placeholder-on-surface-variant/50" placeholder="Message employer..." />
              <button onClick={send} disabled={!message.trim()} className="p-3 rounded-xl bg-primary text-on-primary hover:scale-105 transition-transform disabled:opacity-50 hover:shadow-[0_0_15px_rgba(137,206,255,0.4)]"><Send className="w-5 h-5" /></button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default CandidateWorkspace;
