import { useState } from 'react';
import { Sparkles, UploadCloud, Target, CheckCircle2, AlertTriangle, FileUp, Loader2 } from 'lucide-react';
import { analyzeCv, analyzeCvFile, getRecommendations } from '../api';
import { useAuth } from '../context/AuthContext';

const sampleCv = 'Java Spring Boot MySQL Git React project experience. Built REST APIs and dashboards.';

const AiCareerStudio = () => {
  const { user } = useAuth();
  const [cvText, setCvText] = useState(sampleCv);
  const [loading, setLoading] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      let result;
      if (cvFile) {
        result = await analyzeCvFile(cvFile);
      } else {
        result = await analyzeCv(cvText);
      }
      setAnalysis(result);
      
      try {
        const jobs = await getRecommendations(user?.userId || 'demo-user', result.extractedSkills?.join(',') || '');
        setRecommendations(jobs);
      } catch (recError) {
        console.error('Failed to fetch recommendations:', recError);
        setRecommendations([]);
      }
    } catch (error) {
      console.error('Failed to analyze CV:', error);
      alert('Failed to analyze CV. Please ensure the backend services are running and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-10 px-4 relative overflow-hidden">
      {loading && (
        <div className="fixed inset-0 bg-surface-dim/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center">
          <Loader2 className="w-16 h-16 text-primary animate-spin mb-6 drop-shadow-[0_0_15px_rgba(137,206,255,0.8)]" />
          <h2 className="text-2xl font-bold text-on-surface">Gemini AI is analyzing your CV...</h2>
          <p className="text-on-surface-variant mt-2">Extracting skills and calculating ATS Score.</p>
        </div>
      )}
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3.5 rounded-2xl bg-surface border border-white/10 text-primary shadow-[0_0_15px_rgba(137,206,255,0.2)]"><Sparkles className="w-6 h-6" /></div>
          <div>
            <h1 className="text-3xl font-bold text-on-surface">AI Career Studio</h1>
            <p className="text-sm text-on-surface-variant mt-1">Analyze CV strength, ATS fit, missing skills, and job recommendations.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          <section className="glass-card rounded-3xl p-6">
            <label className="text-sm font-semibold text-on-surface">CV text or extracted PDF content</label>
            <textarea
              value={cvText}
              onChange={(event) => setCvText(event.target.value)}
              disabled={!!cvFile}
              className={`mt-3 w-full min-h-[260px] rounded-xl bg-surface border border-white/10 p-4 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors placeholder-on-surface-variant/50 custom-scrollbar ${cvFile ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="Paste your CV content here, or upload a PDF below..."
            />
            
            {cvFile && (
              <div className="mt-4 p-3 bg-surface-container rounded-xl flex items-center justify-between border border-primary/20">
                <div className="flex items-center gap-2 min-w-0">
                  <FileUp className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm font-medium text-on-surface truncate">{cvFile.name}</span>
                </div>
                <button onClick={() => setCvFile(null)} className="text-error hover:text-error/80 text-sm font-semibold px-2 py-1">Remove</button>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <label className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-container border border-white/10 hover:border-primary/50 transition-colors text-on-surface text-sm font-semibold cursor-pointer">
                <FileUp className="w-5 h-5" /> Upload PDF
                <input type="file" accept=".pdf" className="sr-only" onChange={(e) => { if (e.target.files) setCvFile(e.target.files[0]) }} />
              </label>
              <button onClick={runAnalysis} disabled={loading || (!cvFile && !cvText.trim())} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:scale-105 transition-transform text-on-primary text-sm font-semibold disabled:opacity-60 hover:shadow-[0_0_15px_rgba(137,206,255,0.4)]">
                <UploadCloud className="w-5 h-5" /> {loading ? 'Analyzing...' : 'Analyze CV'}
              </button>
            </div>
          </section>

          <aside className="glass-card rounded-3xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-sm font-semibold text-on-surface">ATS Score</span>
              <span className="text-4xl font-bold text-primary">{analysis?.atsScore ?? '--'}</span>
            </div>
            {analysis && (
              <div className="mt-6 space-y-6">
                <div>
                  <h2 className="text-sm font-semibold text-on-surface flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> Extracted Skills</h2>
                  <div className="mt-3 flex flex-wrap gap-2">{analysis.extractedSkills?.map((skill: string) => <span key={skill} className="px-3 py-1.5 rounded-lg bg-green-400/10 border border-green-400/20 text-green-400 text-xs font-medium">{skill}</span>)}</div>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-on-surface flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-400" /> Missing Skills</h2>
                  <div className="mt-3 flex flex-wrap gap-2">{analysis.missingSkillsForTargetRole?.map((skill: string) => <span key={skill} className="px-3 py-1.5 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-medium">{skill}</span>)}</div>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed p-4 bg-surface/50 rounded-xl border border-white/5">{analysis.feedback}</p>
              </div>
            )}
          </aside>
        </div>

        {recommendations.length > 0 && (
          <section className="mt-8 grid md:grid-cols-3 gap-6">
            {recommendations.map((item) => (
              <div key={item.jobTitle} className="glass-card rounded-2xl p-5 hover:bg-surface-container transition-colors cursor-pointer group">
                <div className="flex items-center gap-2 text-primary font-semibold"><Target className="w-4 h-4 group-hover:scale-110 transition-transform" /> {item.matchScore}% match</div>
                <h3 className="mt-3 font-bold text-on-surface text-lg">{item.jobTitle}</h3>
                <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">{item.reason}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default AiCareerStudio;
