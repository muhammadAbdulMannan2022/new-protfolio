'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import OverlayUI from '@/components/ui/OverlayUI';
import { ProjectData } from '@/components/3d/ProjectsDimension';
import { 
  Mail, 
  Phone, 
  ExternalLink, 
  Briefcase, 
  Code, 
  Server, 
  Wrench, 
  User, 
  GraduationCap, 
  Send,
  Layers
} from 'lucide-react';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// Dynamically load WebGL background canvas with SSR disabled
const PortfolioCanvas = dynamic(() => import('@/components/3d/PortfolioCanvas'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex items-center justify-center bg-[#030303] text-white z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium tracking-wider text-indigo-400">INITIALIZING SYSTEMS...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  // Track scroll progress percentage (0 to 1)
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const progress = window.scrollY / total;
      setScrollProgress(progress);

      // Determine active section based on progress ranges
      if (progress < 0.10) {
        setActiveSection('hero');
      } else if (progress < 0.25) {
        setActiveSection('about');
      } else if (progress < 0.45) {
        setActiveSection('skills');
      } else if (progress < 0.65) {
        setActiveSection('experience');
      } else if (progress < 0.85) {
        setActiveSection('projects');
      } else {
        setActiveSection('contact');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to target sections via scrollProgress offsets
  const handleNavClick = (id: string) => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (total <= 0) return;

    let targetProgress = 0;
    switch (id) {
      case 'hero': targetProgress = 0.0; break;
      case 'about': targetProgress = 0.18; break;
      case 'skills': targetProgress = 0.35; break;
      case 'experience': targetProgress = 0.55; break;
      case 'projects': targetProgress = 0.75; break;
      case 'contact': targetProgress = 0.95; break;
    }

    window.scrollTo({
      top: targetProgress * total,
      behavior: 'smooth',
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Transmission packet sent successfully! Md. Abdul Mannan will respond shortly.');
  };

  return (
    <main className="relative w-full text-white bg-[#030303]">
      {/* 3D WebGL Background Layer */}
      <PortfolioCanvas onSelectProject={setSelectedProject} />

      {/* Navigation HUD Overlay */}
      <OverlayUI 
        activeSection={activeSection} 
        scrollProgress={scrollProgress} 
        onNavClick={handleNavClick} 
      />

      {/* Fixed HTML Content Overlay (spatially designed overlays) */}
      <div className="fixed inset-0 z-10 pointer-events-none flex items-center justify-center select-none">
        <div className="relative w-full h-full flex items-center justify-center">
          
          {/* ================= HERO CARD (Centered) ================= */}
          <div 
            className={`transition-all duration-700 ease-in-out absolute inset-0 flex flex-col items-center justify-center p-6 text-center ${
              activeSection === 'hero' 
                ? 'opacity-100 scale-100 pointer-events-auto' 
                : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <div className="max-w-xl flex flex-col items-center gap-5">
              <div className="relative inline-block w-20 h-20 rounded-full group">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 opacity-40 blur-sm group-hover:opacity-75 transition duration-500 animate-pulse"></div>
                <img 
                  src="/avatar.png" 
                  alt="Md. Abdul Mannan Profile" 
                  className="relative w-20 h-20 rounded-full object-cover border border-white/10"
                />
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-400 uppercase">
                  TRANSMITTING FROM DHAKA, BD
                </span>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-none">
                  MD. ABDUL MANNAN
                </h1>
                <p className="text-lg md:text-xl font-bold tracking-wide text-purple-400">
                  Full-Stack / Frontend Developer
                </p>
              </div>

              <p className="text-xs md:text-sm text-zinc-400 leading-relaxed max-w-md">
                Versatile developer specializing in high-performance web and mobile systems. Deeply skilled in crafting intuitive UI/UX with React and React Native while robustly handling API engineering and server deployment.
              </p>

              <div className="flex gap-3 mt-1 w-full max-w-xs">
                <button 
                  onClick={() => handleNavClick('projects')}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] py-3 rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5" />
                  VIEW PROJECTS
                </button>
                <button 
                  onClick={() => handleNavClick('contact')}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white font-semibold text-[10px] py-3 rounded-xl border border-white/10 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  CONTACT ME
                </button>
              </div>

              {/* Social Profiles Row */}
              <div className="flex gap-4 mt-2 text-zinc-400 pointer-events-auto">
                <a href="https://github.com/muhammadAbdulMannan2022" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  <GithubIcon className="w-4.5 h-4.5" />
                </a>
                <a href="https://www.linkedin.com/in/muhammad-abdul-mannan-625299280/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  <LinkedinIcon className="w-4.5 h-4.5" />
                </a>
                
              </div>
            </div>
          </div>

          {/* ================= ABOUT CARD (Centered) ================= */}
          <div 
            className={`transition-all duration-700 ease-in-out absolute inset-0 flex flex-col items-center justify-center p-6 text-center ${
              activeSection === 'about' 
                ? 'opacity-100 scale-100 pointer-events-auto' 
                : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <div className="max-w-xl flex flex-col items-center gap-4">
              <div className="flex items-center gap-2.5 border-b border-white/5 pb-2.5">
                <User className="w-4.5 h-4.5 text-indigo-400" />
                <h2 className="text-lg font-bold text-white uppercase tracking-wider">Profile Summary</h2>
              </div>
              
              <p className="text-xs md:text-sm text-zinc-300 leading-relaxed max-w-md">
                Detail-oriented developer skilled in crafting high-performance full-stack web and cross-platform mobile environments. I specialize in bridging the gap between complex client business requirements and scalable, optimized architectures. From designing pixel-perfect dashboards with React to constructing Django backend servers and deploying apps on Linux VPS instances, I build cohesive, reliable end-to-end digital solutions.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 text-[10px] font-mono text-zinc-400 w-full max-w-md pointer-events-auto">
                <div className="bg-white/[0.02] border border-white/5 p-2.5 rounded-lg flex justify-between">
                  <span>ROLE STATUS</span>
                  <span className="text-emerald-400 font-bold">AVAILABLE FOR CONTRACTS</span>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-2.5 rounded-lg flex justify-between">
                  <span>CURRENT ENGAGEMENT</span>
                  <span className="text-indigo-400 font-bold">JVAI FULL-STACK DEVELOPER</span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= SKILLS CARD (Floating at Bottom) ================= */}
          <div 
            className={`transition-all duration-700 ease-in-out absolute inset-0 flex flex-col items-center justify-end pb-20 md:pb-24 p-6 text-center ${
              activeSection === 'skills' 
                ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' 
                : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
            }`}
          >
            <div className="max-w-2xl flex flex-col items-center gap-3">
              <div className="flex items-center gap-2.5">
                <Code className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />
                <h2 className="text-base font-bold text-white uppercase tracking-wider">Technical Arsenal</h2>
              </div>
              
              <p className="text-[11px] text-zinc-400 max-w-md leading-relaxed mb-1">
                A structured overview of core technologies. Hover over the rotating planetary spheres in the WebGL Skills Nebula above to interact with specific skills.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-2xl text-[9px] font-mono text-left">
                <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl flex flex-col gap-1">
                  <span className="text-indigo-400 font-bold border-b border-white/5 pb-1 uppercase tracking-wider">Frontend & Mobile</span>
                  <span className="text-zinc-400">React.js • Next.js • React Native • Expo • TypeScript • Tailwind CSS • Redux • Zustand</span>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl flex flex-col gap-1">
                  <span className="text-purple-400 font-bold border-b border-white/5 pb-1 uppercase tracking-wider">Backend & DB</span>
                  <span className="text-zinc-400">Node.js • Express • Rust • REST APIs • WebSockets • PostgreSQL • MongoDB • Prisma</span>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl flex flex-col gap-1">
                  <span className="text-emerald-400 font-bold border-b border-white/5 pb-1 uppercase tracking-wider">Tools & Infra</span>
                  <span className="text-zinc-400">Git & GitHub • Docker • Linux Server • VPS Hosting • Android Studio • Xcode • Figma</span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= EXPERIENCE CARD (Centered Sheet) ================= */}
          <div 
            className={`transition-all duration-700 ease-in-out absolute inset-0 flex flex-col items-center justify-center p-6 ${
              activeSection === 'experience' 
                ? 'opacity-100 scale-100 pointer-events-auto' 
                : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <div className="max-w-3xl w-full bg-[#050508]/85 border border-white/5 backdrop-blur-md p-6 md:p-8 rounded-2xl flex flex-col gap-5 mx-4 shadow-2xl pointer-events-auto">
              <div className="flex items-center gap-2.5 border-b border-white/5 pb-2.5">
                <Briefcase className="w-4.5 h-4.5 text-indigo-400" />
                <h2 className="text-lg font-bold text-white uppercase tracking-wider">Professional Journey</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {/* Timeline info (left 3 cols) */}
                <div className="md:col-span-3 relative border-l border-white/10 pl-4 ml-1 flex flex-col gap-3">
                  <div>
                    <div className="flex justify-between items-start flex-wrap gap-1 mb-1">
                      <h4 className="text-xs font-bold text-white leading-tight">Full-Stack / Frontend Dev</h4>
                      <span className="text-[8px] font-mono bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-bold">
                        MAY 2025 - PRES
                      </span>
                    </div>
                    <span className="text-[10px] text-indigo-400 font-bold block mb-1.5 font-mono">JVAI (International Contracts)</span>
                    <ul className="text-[10px] text-zinc-400 space-y-1 list-disc pl-3 leading-relaxed">
                      <li>Designed Next.js layouts, Node.js REST / Socket.io architectures, and tablet UI frameworks.</li>
                      <li>Represented the engineering team in daily Zoom consultations with international client networks.</li>
                      <li>Optimized real-time dashboards mapping streaming JSON telemetry via WebSockets and secure REST APIs.</li>
                    </ul>
                  </div>
                </div>

                {/* Education (right 2 cols) */}
                <div className="md:col-span-2 flex flex-col gap-3 bg-white/[0.01] border border-white/5 p-3 rounded-xl">
                  <div className="flex gap-2 items-start">
                    <GraduationCap className="w-4 h-4 text-purple-400 mt-0.5" />
                    <div>
                      <h5 className="text-[8px] font-mono text-purple-400 font-bold uppercase tracking-wider">Ongoing Degree</h5>
                      <h4 className="text-[11px] font-bold text-white">BA (Honours) in Islamic Studies</h4>
                      <span className="text-[9px] text-zinc-500 block leading-tight">Hamdard University Bangladesh</span>
                    </div>
                  </div>
                  <div className="border-t border-white/5 pt-2.5 flex gap-2 items-start">
                    <GraduationCap className="w-4 h-4 text-purple-400 mt-0.5" />
                    <div>
                      <h5 className="text-[8px] font-mono text-purple-400 font-bold uppercase tracking-wider">Prior Studies</h5>
                      <h4 className="text-[11px] font-bold text-white">Alim (HSC)</h4>
                      <span className="text-[9px] text-zinc-500 block leading-tight">Darunnazat Siddkia Kamil Madrasah (GPA 5.00)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= PROJECTS CARD (Floating at Bottom) ================= */}
          <div 
            className={`transition-all duration-700 ease-in-out absolute inset-0 flex flex-col items-center justify-end pb-20 md:pb-24 p-6 text-center ${
              activeSection === 'projects' 
                ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' 
                : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
            }`}
          >
            <div className="max-w-2xl flex flex-col items-center gap-3">
              <div className="flex items-center gap-2.5">
                <Layers className="w-4.5 h-4.5 text-indigo-400" />
                <h2 className="text-base font-bold text-white uppercase tracking-wider">Completed Deployments</h2>
              </div>
              
              <p className="text-[11px] text-zinc-400 max-w-md leading-relaxed mb-1">
                Explore the 3D space corridor. Hover and click the project planes in WebGL above to view full metadata, or use the quick video links below:
              </p>

              <div className="flex flex-wrap gap-2.5 justify-center text-[9px] font-mono pointer-events-auto">
                <a href="https://drive.google.com/file/d/1HgY7zspeZM05IgtBCi_PThGgUByWJ599/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg border border-white/5 bg-[#050508]/85 hover:border-indigo-500/30 transition-all flex items-center gap-1.5 font-bold text-indigo-400">
                  BI DASHBOARD <ExternalLink className="w-3 h-3" />
                </a>
                <a href="https://drive.google.com/file/d/1KX7-xiyxmOTFoC1EbAWWzMxdV-IhxIxa/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg border border-white/5 bg-[#050508]/85 hover:border-purple-500/30 transition-all flex items-center gap-1.5 font-bold text-purple-400">
                  RENTAL PLATFORM <ExternalLink className="w-3 h-3" />
                </a>
                <a href="https://drive.google.com/file/d/1v73jetF5sXyiQpU8u3ogTizVDoL7hUzU/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg border border-white/5 bg-[#050508]/85 hover:border-emerald-500/30 transition-all flex items-center gap-1.5 font-bold text-emerald-400">
                  COACH ASSISTANT <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* ================= CONTACT CARD (Centered Sheet) ================= */}
          <div 
            className={`transition-all duration-700 ease-in-out absolute inset-0 flex flex-col items-center justify-center p-6 ${
              activeSection === 'contact' 
                ? 'opacity-100 scale-100 pointer-events-auto' 
                : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <div className="max-w-md w-full bg-[#050508]/85 border border-white/5 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-2xl flex flex-col gap-4 mx-4 pointer-events-auto">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-mono tracking-widest text-indigo-400 uppercase font-bold">GET IN TOUCH</span>
                <h2 className="text-lg font-bold text-white uppercase tracking-wider">Connect Dimensions</h2>
              </div>
              
              <div className="flex flex-col gap-1.5 text-[10px] font-mono text-zinc-300">
                <a href="mailto:muhammadabdulmannan21@gmail.com" className="flex items-center gap-2 hover:text-indigo-400 transition-colors">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  muhammadabdulmannan21@gmail.com
                </a>
                <span className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-purple-400" />
                  +880 1581263462
                </span>
              </div>

              <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
                <div>
                  <label className="text-[8px] font-mono tracking-widest text-zinc-500 block mb-0.5">ORIGIN (NAME)</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Major Tom"
                  />
                </div>

                <div>
                  <label className="text-[8px] font-mono tracking-widest text-zinc-500 block mb-0.5">CHANNEL (EMAIL)</label>
                  <input 
                    required
                    type="email" 
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="tom@control.com"
                  />
                </div>

                <div>
                  <label className="text-[8px] font-mono tracking-widest text-zinc-500 block mb-0.5">PAYLOAD (MESSAGE)</label>
                  <textarea 
                    required
                    rows={3}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                    placeholder="Payload signal..."
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/10"
                >
                  <Send className="w-3 h-3" />
                  TRANSMIT SIGNAL
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* ================= 3D CARD SELECT MODAL OVERLAY ================= */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 md:p-8 rounded-2xl glass border border-white/10 flex flex-col gap-5 relative animate-in fade-in zoom-in-95 duration-300">
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors text-[10px] font-bold bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/5 cursor-pointer"
            >
              CLOSE
            </button>
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase" style={{ color: selectedProject.color }}>
              {selectedProject.category}
            </span>
            <h3 className="text-xl md:text-2xl font-black text-white leading-tight">
              {selectedProject.title}
            </h3>
            <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
              {selectedProject.description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {selectedProject.tech.map((t) => (
                <span key={t} className="text-[9px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-zinc-300">
                  {t}
                </span>
              ))}
            </div>
            <a 
              href={selectedProject.demoUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full py-3.5 text-center rounded-xl font-bold text-xs text-white shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              style={{ backgroundColor: selectedProject.color }}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              LAUNCH DEMO VIDEO
            </a>
          </div>
        </div>
      )}

      {/* Scrollable Spacer to create physical scrolling height */}
      <div className="relative w-full h-[700vh] pointer-events-none" />
    </main>
  );
}
