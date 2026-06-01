import { useEffect, useState } from 'react';
import { CalendarClock, MessageSquare, Send, XCircle } from 'lucide-react';
import { fetchChatMessages, getUserApplications, scheduleInterview, sendChatMessage, withdrawApplication } from '../api';
import { useAuth } from '../context/AuthContext';

const CandidateWorkspace = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [meeting, setMeeting] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    getUserApplications(user.userId, user.token).then(setApplications).catch(() => setApplications([]));
    fetchChatMessages(user.userId, user.token).then(setMessages).catch(() => setMessages([]));
  }, [user]);

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
    const updated = await withdrawApplication(id, user.token);
    setApplications((items) => items.map((item) => item.id === id ? updated : item));
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-[1fr_380px] gap-6">
        <section className="bg-white border border-slate-200 rounded-lg p-5">
          <h1 className="text-xl font-bold text-slate-900">Application Tracker</h1>
          <div className="mt-4 divide-y divide-slate-100">
            {applications.length === 0 ? <p className="py-8 text-sm text-slate-500">No applications yet. Apply to jobs to see live status here.</p> : applications.map((app) => (
              <div key={app.id} className="py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-800">{app.jobId}</p>
                  <p className="text-sm text-slate-500">{app.status?.replace('_', ' ')}</p>
                </div>
                {app.status !== 'WITHDRAWN' && (
                  <button onClick={() => withdraw(app.id)} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 text-red-600 text-sm">
                    <XCircle className="w-4 h-4" /> Withdraw
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="bg-white border border-slate-200 rounded-lg p-5">
            <h2 className="font-bold text-slate-900 flex items-center gap-2"><CalendarClock className="w-4 h-4 text-blue-600" /> Online Interview</h2>
            <button onClick={schedule} className="mt-4 w-full px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold">Generate Meeting Link</button>
            {meeting && <a href={meeting.meetingLink} className="mt-3 block text-sm text-blue-700 break-all">{meeting.meetingLink}</a>}
          </section>

          <section className="bg-white border border-slate-200 rounded-lg p-5">
            <h2 className="font-bold text-slate-900 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-blue-600" /> Employer Chat</h2>
            <div className="mt-4 h-48 overflow-y-auto space-y-2 rounded-lg bg-slate-50 p-3">
              {messages.length === 0 ? <p className="text-sm text-slate-400">No messages yet.</p> : messages.map((item) => (
                <div key={item.id} className="rounded-lg bg-white border border-slate-100 p-2 text-sm text-slate-700">{item.body}</div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input value={message} onChange={(event) => setMessage(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Message employer" />
              <button onClick={send} className="p-2.5 rounded-lg bg-blue-600 text-white"><Send className="w-4 h-4" /></button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default CandidateWorkspace;
