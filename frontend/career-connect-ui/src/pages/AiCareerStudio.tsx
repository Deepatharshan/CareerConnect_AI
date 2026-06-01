import { useState } from 'react';
import { Sparkles, UploadCloud, Target, CheckCircle2, AlertTriangle } from 'lucide-react';
import { analyzeCv, getRecommendations } from '../api';
import { useAuth } from '../context/AuthContext';

const sampleCv = 'Java Spring Boot MySQL Git React project experience. Built REST APIs and dashboards.';

const AiCareerStudio = () => {
  const { user } = useAuth();
  const [cvText, setCvText] = useState(sampleCv);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const result = await analyzeCv(cvText);
      setAnalysis(result);
      const jobs = await getRecommendations(user?.userId || 'demo-user', result.extractedSkills?.join(',') || '');
      setRecommendations(jobs);
    } catch {
      setAnalysis({
        atsScore: 65,
        extractedSkills: ['Java', 'Spring Boot', 'MySQL', 'Git'],
        missingSkillsForTargetRole: ['Docker', 'Kubernetes', 'Kafka'],
        feedback: 'Your CV lacks Java Spring Boot deployment proof, Docker, and Kafka skills for backend roles.',
        improvements: ['Add measurable impact.', 'Add cloud-native project links.', 'Mention ATS-friendly role keywords.'],
        recommendedRoles: ['Backend Engineer', 'Cloud-Native Java Developer']
      });
      setRecommendations([
        { jobTitle: 'Cloud-Native Java Engineer', matchScore: 92, reason: 'Strong Java/Spring alignment.' },
        { jobTitle: 'Platform Backend Developer', matchScore: 86, reason: 'Microservices path is a good fit.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg bg-blue-600 text-white"><Sparkles className="w-5 h-5" /></div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">AI Career Studio</h1>
            <p className="text-sm text-slate-500">Analyze CV strength, ATS fit, missing skills, and job recommendations.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          <section className="bg-white border border-slate-200 rounded-lg p-5">
            <label className="text-sm font-semibold text-slate-700">CV text or extracted PDF content</label>
            <textarea
              value={cvText}
              onChange={(event) => setCvText(event.target.value)}
              className="mt-3 w-full min-h-[260px] rounded-lg border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-4 flex flex-wrap gap-3">
              <button onClick={runAnalysis} disabled={loading} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold disabled:opacity-60">
                <UploadCloud className="w-4 h-4" /> {loading ? 'Analyzing...' : 'Analyze CV'}
              </button>
            </div>
          </section>

          <aside className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">ATS Score</span>
              <span className="text-3xl font-bold text-blue-700">{analysis?.atsScore ?? '--'}</span>
            </div>
            {analysis && (
              <div className="mt-5 space-y-4">
                <div>
                  <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Extracted Skills</h2>
                  <div className="mt-2 flex flex-wrap gap-2">{analysis.extractedSkills?.map((skill: string) => <span key={skill} className="px-2 py-1 rounded bg-green-50 text-green-700 text-xs">{skill}</span>)}</div>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-600" /> Missing Skills</h2>
                  <div className="mt-2 flex flex-wrap gap-2">{analysis.missingSkillsForTargetRole?.map((skill: string) => <span key={skill} className="px-2 py-1 rounded bg-amber-50 text-amber-700 text-xs">{skill}</span>)}</div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{analysis.feedback}</p>
              </div>
            )}
          </aside>
        </div>

        {recommendations.length > 0 && (
          <section className="mt-6 grid md:grid-cols-3 gap-4">
            {recommendations.map((item) => (
              <div key={item.jobTitle} className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-700 font-semibold"><Target className="w-4 h-4" /> {item.matchScore}% match</div>
                <h3 className="mt-2 font-bold text-slate-900">{item.jobTitle}</h3>
                <p className="mt-1 text-sm text-slate-500">{item.reason}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default AiCareerStudio;
