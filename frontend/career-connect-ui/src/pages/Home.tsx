import { Link } from 'react-router-dom';
import ParticleCanvas from '../components/ParticleCanvas';

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-margin-mobile overflow-hidden">
        <ParticleCanvas />
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/20 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest">Powered by Kinetic Intelligence</span>
          </div>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-6 leading-tight">
            Land Your Dream Job with <br />
            <span className="gradient-text">Kinetic Intelligence.</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-10">
            The next evolution of the workforce. Our neural matching engine pairs your unique velocity with the world's most innovative roles.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link to="/register" className="group relative px-8 py-4 bg-primary text-on-primary font-bold rounded-xl overflow-hidden shadow-lg shadow-primary/20 transition-all hover:scale-105">
              <span className="relative z-10">Start Your Journey</span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </Link>
            <Link to="/jobs" className="px-8 py-4 glass border border-white/10 text-on-surface font-bold rounded-xl hover:bg-white/5 transition-colors">
              Explore Jobs
            </Link>
          </div>
        </div>
        {/* Abstract Visual */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-64 bg-gradient-to-t from-primary/10 to-transparent blur-3xl -z-10"></div>
      </section>

      {/* Social Proof Ticker */}
      <section className="py-12 border-y border-white/5 bg-surface-container-low/30 overflow-hidden">
        <div className="ticker-track">
          {/* Repeated logos for continuous scroll */}
          <div className="flex items-center justify-around w-[1280px] shrink-0 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 font-headline-md text-on-surface font-bold italic">QUANTUM</div>
            <div className="flex items-center gap-2 font-headline-md text-on-surface font-bold">NEURAL_NET</div>
            <div className="flex items-center gap-2 font-headline-md text-on-surface font-bold tracking-tighter">DATASTREAM</div>
            <div className="flex items-center gap-2 font-headline-md text-on-surface font-bold uppercase">Synthetix</div>
            <div className="flex items-center gap-2 font-headline-md text-on-surface font-bold">AXON</div>
          </div>
          <div className="flex items-center justify-around w-[1280px] shrink-0 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 font-headline-md text-on-surface font-bold italic">QUANTUM</div>
            <div className="flex items-center gap-2 font-headline-md text-on-surface font-bold">NEURAL_NET</div>
            <div className="flex items-center gap-2 font-headline-md text-on-surface font-bold tracking-tighter">DATASTREAM</div>
            <div className="flex items-center gap-2 font-headline-md text-on-surface font-bold uppercase">Synthetix</div>
            <div className="flex items-center gap-2 font-headline-md text-on-surface font-bold">AXON</div>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="py-32 px-margin-desktop max-w-container-max mx-auto overflow-visible">
        <div className="text-center mb-20 scroll-reveal">
          <h2 className="font-display-lg text-display-lg-mobile md:text-headline-md mb-4">The Future of Job Hunting</h2>
          <p className="text-on-surface-variant font-body-lg">Precision engineering meets career development.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {/* Card 1 */}
          <div className="glass-card p-base md:p-10 rounded-3xl scroll-reveal" style={{ transitionDelay: '100ms' }}>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 border border-primary/20">
              <span className="material-symbols-outlined text-primary text-3xl">psychology</span>
            </div>
            <h3 className="font-headline-md text-headline-md mb-4">AI Match</h3>
            <p className="text-on-surface-variant font-body-md leading-relaxed mb-6">
              Our neural matching engine analyzes 400+ data points to find roles where you don't just fit—you thrive.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-label-sm font-label-sm text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                98% ACCURACY RATE
              </li>
              <li className="flex items-center gap-2 text-label-sm font-label-sm text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                NEURAL FILTERING
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-base md:p-10 rounded-3xl scroll-reveal" style={{ transitionDelay: '200ms' }}>
            <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-8 border border-secondary/20">
              <span className="material-symbols-outlined text-secondary text-3xl">description</span>
            </div>
            <h3 className="font-headline-md text-headline-md mb-4">CV Analyzer</h3>
            <p className="text-on-surface-variant font-body-md leading-relaxed mb-6">
              Instant structural and semantic analysis of your resume. Optimize for both ATS and human decision-makers.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-label-sm font-label-sm text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                REAL-TIME FEEDBACK
              </li>
              <li className="flex items-center gap-2 text-label-sm font-label-sm text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                ATS BENCHMARKING
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-base md:p-10 rounded-3xl scroll-reveal" style={{ transitionDelay: '300ms' }}>
            <div className="w-14 h-14 rounded-2xl bg-tertiary/10 flex items-center justify-center mb-8 border border-tertiary/20">
              <span className="material-symbols-outlined text-tertiary text-3xl">bolt</span>
            </div>
            <h3 className="font-headline-md text-headline-md mb-4">Smart Apply</h3>
            <p className="text-on-surface-variant font-body-md leading-relaxed mb-6">
              One-click applications powered by automated profiling. We handle the paperwork, you handle the interview.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-label-sm font-label-sm text-tertiary">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                ZERO-FORM FILING
              </li>
              <li className="flex items-center gap-2 text-label-sm font-label-sm text-tertiary">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                PRIORITY ROUTING
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-32 bg-surface-container-low relative overflow-hidden">
        <div className="max-w-container-max mx-auto px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="scroll-reveal">
            <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-8 leading-tight">
              Watch the <br /><span className="text-primary">Intelligence</span> <br />In Action.
            </h2>
            <p className="text-on-surface-variant font-body-lg mb-8">
              Our AI doesn't just read your resume; it understands your trajectory. By analyzing historical career data and market trends, we predict your next best move.
            </p>
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="mt-1 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                </div>
                <div>
                  <h4 className="font-bold text-lg">Semantic Deep Parsing</h4>
                  <p className="text-on-surface-variant">We extract latent skills that others miss.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="mt-1 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                </div>
                <div>
                  <h4 className="font-bold text-lg">Market Sentiment Analysis</h4>
                  <p className="text-on-surface-variant">Matching you with companies on an upward trajectory.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative scroll-reveal">
            <div className="aspect-[4/5] glass border border-white/10 rounded-3xl overflow-hidden relative p-8 animate-float shadow-2xl">
              {/* CV Mockup */}
              <div className="space-y-6 opacity-40">
                <div className="h-12 w-32 bg-white/10 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-white/5 rounded"></div>
                  <div className="h-4 w-5/6 bg-white/5 rounded"></div>
                </div>
                <div className="h-40 w-full bg-white/5 rounded-2xl"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-white/5 rounded"></div>
                  <div className="h-4 w-3/4 bg-white/5 rounded"></div>
                </div>
              </div>
              {/* Analysis Overlays */}
              <div className="absolute inset-x-8 top-1/4 group">
                <div className="bg-primary/20 border border-primary/40 p-4 rounded-xl backdrop-blur-md mb-2 translate-x-12 translate-y-4">
                  <span className="font-label-sm text-primary">SKILL_DETECTED: Distributed Systems</span>
                  <div className="h-1 bg-primary/30 w-full mt-2 rounded overflow-hidden">
                    <div className="h-full bg-primary w-4/5"></div>
                  </div>
                </div>
                <div className="bg-secondary/20 border border-secondary/40 p-4 rounded-xl backdrop-blur-md translate-x-[-24px] translate-y-8">
                  <span className="font-label-sm text-secondary">OPTIMIZATION: Action Verbs +12%</span>
                </div>
              </div>
              {/* Scanning Light */}
              <div className="ai-scan-line absolute left-0 right-0 z-20"></div>
            </div>
            {/* Background Decoration */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-secondary/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-lowest w-full py-12 border-t border-white/5">
        <div className="max-w-container-max mx-auto px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-gutter">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <span className="font-headline-md text-headline-md text-primary font-bold">CareerConnect AI</span>
            </div>
            <p className="text-on-surface-variant font-body-md mb-6 max-w-xs">
              Engineered for the future of work. Empowering the global workforce through AI.
            </p>
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">language</span>
              <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">public</span>
              <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">alternate_email</span>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-on-surface mb-6 uppercase tracking-wider text-sm">Product</h4>
            <ul className="space-y-4 text-on-surface-variant font-body-md">
              <li><Link to="/ai-studio" className="hover:text-primary transition-colors">AI Match Engine</Link></li>
              <li><Link to="/ai-studio" className="hover:text-primary transition-colors">CV Optimization</Link></li>
              <li><Link to="/jobs" className="hover:text-primary transition-colors">Market Insights</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-on-surface mb-6 uppercase tracking-wider text-sm">Company</h4>
            <ul className="space-y-4 text-on-surface-variant font-body-md">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">AI Ethics</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-on-surface mb-6 uppercase tracking-wider text-sm">Join Our Pulse</h4>
            <p className="text-on-surface-variant text-sm mb-4">Stay updated with AI career trends.</p>
            <div className="flex gap-2">
              <input className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-primary transition-colors text-on-surface" placeholder="Email" type="email" />
              <button className="bg-primary text-on-primary p-2 rounded-lg material-symbols-outlined hover:bg-primary-fixed transition-colors">chevron_right</button>
            </div>
          </div>
        </div>
        <div className="max-w-container-max mx-auto px-margin-desktop mt-12 pt-8 border-t border-white/5">
          <p className="text-on-surface-variant/60 font-body-md text-center">
            © 2026 CareerConnect AI. Engineered for the future of work.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Home;
