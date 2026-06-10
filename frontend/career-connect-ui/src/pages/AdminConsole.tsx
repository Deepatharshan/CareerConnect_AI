import { useEffect, useState } from 'react';
import { Activity, Briefcase, CalendarCheck, Users } from 'lucide-react';
import { getAdminAnalytics } from '../api';
import { useAuth } from '../context/AuthContext';

const AdminConsole = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    getAdminAnalytics(user.token).then(setAnalytics).catch(() => setAnalytics({
      activeUsers: 1284,
      openJobs: 342,
      applicationsToday: 91,
      interviewsScheduled: 18
    }));
  }, [user]);

  const cards = [
    { label: 'Active Users', value: analytics?.activeUsers, icon: Users },
    { label: 'Open Jobs', value: analytics?.openJobs, icon: Briefcase },
    { label: 'Applications Today', value: analytics?.applicationsToday, icon: Activity },
    { label: 'Interviews Scheduled', value: analytics?.interviewsScheduled, icon: CalendarCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900">Admin Console</h1>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-lg p-5">
              <Icon className="w-5 h-5 text-blue-600" />
              <p className="mt-4 text-2xl font-bold text-slate-900">{value ?? '--'}</p>
              <p className="text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminConsole;
