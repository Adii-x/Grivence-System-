import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Zap, BarChart3, ArrowRight, MessageSquare } from 'lucide-react';

const features = [
  { icon: MessageSquare, title: 'Submit Complaints',   desc: 'Raise grievances with files, priority, and real-time tracking.' },
  { icon: ShieldCheck,   title: 'Transparent Process', desc: 'Every complaint is logged, assigned, and timestamped.' },
  { icon: Zap,           title: 'Fast Resolution',     desc: 'Auto-escalation kicks in for overdue cases instantly.' },
  { icon: BarChart3,     title: 'Admin Insights',      desc: 'Live stats, department performance, and resolution trends.' },
];

const stats = [
  { value: '98%',  label: 'Resolution Rate' },
  { value: '<48h', label: 'Avg Response' },
  { value: '3',    label: 'User Roles' },
  { value: '8+',   label: 'Departments' },
];

const Landing: React.FC = () => {
  const navigate  = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const gap = 44;
      for (let r = 0; r <= Math.ceil(canvas.height / gap); r++) {
        for (let c = 0; c <= Math.ceil(canvas.width / gap); c++) {
          const x = c * gap, y = r * gap;
          const dist = Math.sqrt((x - canvas.width / 2) ** 2 + (y - canvas.height / 2) ** 2);
          const a = Math.sin(dist / 80 - t) * 0.5 + 0.5;
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(59,130,246,${a * 0.12 + 0.03})`;
          ctx.fill();
        }
      }
      t += 0.012;
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <div className="min-h-screen min-h-[100dvh] w-full flex flex-col overflow-x-hidden overflow-y-auto" style={{ background: 'hsl(0 0% 5%)' }}>
      {/* Animated canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
      {/* Center glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 70% at 25% 50%, rgba(59,130,246,0.09) 0%, transparent 70%)' }} />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between gap-4 px-4 py-4 pt-[max(1rem,env(safe-area-inset-top))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:px-8 md:px-10 md:py-5 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <img src="/logo.png" alt="Nexus" className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg object-contain shrink-0" />
          <span className="text-white font-bold text-lg sm:text-[22px] tracking-tight truncate">Nexus</span>
        </div>
        <button type="button" onClick={() => navigate('/login')}
          className="text-sm sm:text-base font-medium text-white/60 hover:text-white transition-colors shrink-0">
          Sign in →
        </button>
      </header>

      {/* Hero + panels */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row lg:items-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:px-8 md:px-10 gap-10 lg:gap-16 max-w-6xl mx-auto w-full py-8 lg:py-0">

        {/* ── LEFT: Hero ── */}
        <div className="flex flex-col gap-5 sm:gap-6 flex-1 min-w-0">
          {/* Badge */}
          <div className="inline-flex w-fit max-w-full items-center gap-2 px-3 py-1.5 sm:px-4 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs sm:text-sm font-medium tracking-wide">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Student Grievance Management
          </div>

          {/* Title */}
          <h1 className="text-[clamp(3rem,18vw,6.25rem)] md:text-[clamp(4rem,12vw,6.25rem)] font-bold text-white leading-[0.95] break-words"
            style={{ letterSpacing: '-0.05em' }}>
            Nexus
          </h1>

          {/* Tagline */}
          <p className="text-white/50 text-base sm:text-lg leading-relaxed max-w-sm">
            The bridge between students and administration.
            Submit, track, and resolve grievances — transparently.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
            <button type="button" onClick={() => navigate('/register')}
              className="group flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm sm:text-base transition-all shadow-lg shadow-blue-500/20 w-full sm:w-auto">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button type="button" onClick={() => navigate('/login')}
              className="px-6 sm:px-7 py-3 rounded-lg border border-white/10 hover:border-white/25 text-white/60 hover:text-white font-semibold text-sm sm:text-base transition-all bg-white/5 hover:bg-white/10 w-full sm:w-auto">
              Sign In
            </button>
          </div>
        </div>

        {/* ── RIGHT: Stats + Features ── */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px rounded-xl overflow-hidden border border-white/6 bg-white/5">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center py-3 sm:py-4 px-1 bg-white/[0.025]">
                <span className="text-lg sm:text-xl font-bold text-white">{s.value}</span>
                <span className="text-[10px] sm:text-[11px] text-white/35 mt-0.5 text-center leading-tight">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Feature cards — 2×2 grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((f) => (
              <div key={f.title}
                className="group p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-300">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3 group-hover:bg-blue-500/20 transition-colors">
                  <f.icon className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="text-white font-medium text-sm mb-1">{f.title}</h3>
                <p className="text-white/35 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center text-white/20 text-[10px] sm:text-[11px] py-3 px-4 shrink-0">
        © {new Date().getFullYear()} Nexus — Student Grievance Management
      </footer>
    </div>
  );
};

export default Landing;
