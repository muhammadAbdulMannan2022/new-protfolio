'use client';

import { Sparkles } from 'lucide-react';

interface OverlayUIProps {
  activeSection: string;
  scrollProgress: number;
  onNavClick: (id: string) => void;
}

export default function OverlayUI({ activeSection, scrollProgress, onNavClick }: OverlayUIProps) {
  const sections = [
    { id: 'hero', label: 'HERO' },
    { id: 'about', label: 'ABOUT' },
    { id: 'skills', label: 'SKILLS' },
    { id: 'experience', label: 'EXPERIENCE' },
    { id: 'projects', label: 'PROJECTS' },
    { id: 'contact', label: 'CONTACT' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-20 select-none">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 w-full flex justify-between items-center px-6 md:px-12 py-5 pointer-events-auto bg-gradient-to-b from-[#030303]/90 to-transparent backdrop-blur-sm z-30">
        <div onClick={() => onNavClick('hero')} className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/30">
            M
          </div>
          <span className="font-sans font-bold tracking-widest text-base md:text-lg text-white">MANNAN.DEV</span>
        </div>
        
        <nav className="hidden lg:flex gap-8 text-xs font-semibold tracking-wider text-zinc-400">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => onNavClick(s.id)}
              className={`hover:text-white transition-colors cursor-pointer uppercase ${activeSection === s.id ? 'text-indigo-400 font-bold' : ''}`}
            >
              {s.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => onNavClick('contact')}
          className="pointer-events-auto bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold px-4 py-2 rounded-full shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          CONNECT
        </button>
      </header>

      {/* Right Sidebar Dot Navigation */}
      <div className="fixed right-6 md:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20 pointer-events-auto">
        {sections.map((s) => (
          <div
            key={s.id}
            onClick={() => onNavClick(s.id)}
            className="group flex items-center justify-end gap-3 cursor-pointer"
          >
            <span className="text-[9px] tracking-wider text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150 select-none pr-1 uppercase">
              {s.label}
            </span>
            <div
              className={`w-2 h-2 rounded-full border border-white/20 transition-all duration-200 ${
                activeSection === s.id
                  ? 'bg-indigo-500 border-indigo-400 scale-125 shadow-lg shadow-indigo-500/50'
                  : 'bg-zinc-800 hover:bg-zinc-400'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Bottom HUD bar */}
      <div className="fixed bottom-5 left-6 md:left-8 z-20 flex items-center gap-4 text-[10px] text-zinc-500 font-mono select-none">
        <div>
          ACTIVE LAYER: <span className="text-white font-bold uppercase">{activeSection}</span>
        </div>
        <div className="w-[1px] h-3 bg-zinc-800" />
        <div>
          DEPTH PROGRESS: <span className="text-white font-bold">{Math.round(scrollProgress * 100)}%</span>
        </div>
      </div>
    </div>
  );
}
