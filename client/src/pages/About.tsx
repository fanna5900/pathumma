import React from 'react';
import {
  GraduationCap,
  ShieldCheck,
  Target,
  Eye,
  Sparkles,
  Users,
  Compass,
  Code,
  CheckCircle,
  Mail,
  Heart,
  Lightbulb,
} from 'lucide-react';

export const About: React.FC = () => {
  const teamMembers = [
    {
      name: 'Fana Jathin',
      role: 'Project Lead & Lead Full-Stack Developer',
      initials: 'FJ',
      color: 'from-emerald-500 to-teal-400',
      responsibilities: [
        'Overall project coordination',
        'Core architecture',
        'Feature implementation',
        'Integration & code review',
        'Technical planning',
      ],
    },
    {
      name: 'Mohammed Safwan',
      role: 'UI/UX Designer & Frontend Developer',
      initials: 'MS',
      color: 'from-teal-500 to-mint-400',
      responsibilities: [
        'Interface design & design system',
        'Homepage design & micro-interactions',
        'Animations & Framer Motion workflows',
        'Responsive component architecture',
        'User experience optimization',
      ],
    },
    {
      name: 'Shibil',
      role: 'Backend & Database Developer',
      initials: 'SH',
      color: 'from-emerald-600 to-forest-800',
      responsibilities: [
        'Backend REST APIs',
        'Database architecture & migrations',
        'Authentication & role-based authorization',
        'Data validation & server-side security',
        'Referential integrity controls',
      ],
    },
    {
      name: 'Anwar',
      role: 'QA & Integration Developer',
      initials: 'AN',
      color: 'from-amber-500 to-gold-400',
      responsibilities: [
        'Comprehensive testing & QA',
        'System integration verification',
        'Bug fixing & exception handling',
        'Workflow verification',
        'Technical documentation',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#021814] text-slate-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800/60 text-emerald-400 text-xs font-semibold">
            <GraduationCap className="w-4 h-4" />
            <span>About EDUNEXA</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-white">
            Transforming Indian Higher Education with{' '}
            <span className="text-gradient-emerald">Intelligent Integration</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            EDUNEXA connects students, faculty members, colleges, and administrators into one synchronized academic ecosystem.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-3xl glass-panel p-8 space-y-4 border border-emerald-800/50 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold font-display text-white">Our Mission</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              To democratize access to verified educational opportunities across India by delivering total fee transparency, reliable admission pathways, curated syllabus resources, and peer-to-peer study collaboration supported by role-aware artificial intelligence.
            </p>
          </div>

          <div className="rounded-3xl glass-panel p-8 space-y-4 border border-emerald-800/50 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold font-display text-white">Our Vision</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              To be the benchmark higher education operating system in India — removing informational friction between aspirants and institutions, cultivating collaborative peer learning, and empowering faculty with advanced pedagogical AI assistance.
            </p>
          </div>
        </div>

        {/* Educational Problems Addressed */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold font-display text-white">
              Educational Challenges We Solve
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Modern students face fragmented platforms, hidden fees, and isolated study environments. EDUNEXA addresses each directly:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl glass-panel p-6 space-y-3 border border-emerald-900/40">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                ₹
              </div>
              <h4 className="text-base font-bold text-white">Fee Disparity & Hidden Costs</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Many platforms list vague estimates. EDUNEXA provides itemized tuition, lab, exam, and hostel fees derived from official gazettes.
              </p>
            </div>

            <div className="rounded-2xl glass-panel p-6 space-y-3 border border-emerald-900/40">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                📂
              </div>
              <h4 className="text-base font-bold text-white">Fragmented Study Materials</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Course notes and past papers are scattered. Our hierarchical repository links notes from Institution → Department → Course → Semester → Subject.
              </p>
            </div>

            <div className="rounded-2xl glass-panel p-6 space-y-3 border border-emerald-900/40">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                🤝
              </div>
              <h4 className="text-base font-bold text-white">Isolated Exam Preparation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Students preparing for GATE or semester finals struggle to find peers. Our compatibility algorithm matches study partners based on mutual subjects.
              </p>
            </div>

            <div className="rounded-2xl glass-panel p-6 space-y-3 border border-emerald-900/40">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                🤖
              </div>
              <h4 className="text-base font-bold text-white">Generic, Untailored AI</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generic chatbots lack academic context. EDUNEXA’s AI operates with strict role constraints for students, teachers, institutions, and administrators.
              </p>
            </div>
          </div>
        </div>

        {/* Development Journey */}
        <div className="rounded-3xl glass-panel p-8 sm:p-12 border border-emerald-800/40 space-y-6">
          <div className="flex items-center space-x-3 text-gold-400 font-bold text-sm tracking-wide">
            <Sparkles className="w-5 h-5" />
            <span>DEVELOPMENT JOURNEY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Built from the Ground Up as an Enterprise Full-Stack System
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            EDUNEXA was engineered to demonstrate a complete, production-grade educational technology ecosystem. Rather than delivering a mockup or static design, the project integrates real PostgreSQL/Prisma relational modeling, JWT authentication with strict username validation (English letters only), role-based middleware, and intelligent matching algorithms.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-forest-900/80 border border-emerald-800/40 text-xs text-slate-300">
              <span className="font-bold text-emerald-400 block mb-1">Architecture</span>
              React + TypeScript, Tailwind CSS, Framer Motion, Express, Node.js, and Prisma ORM.
            </div>
            <div className="p-4 rounded-xl bg-forest-900/80 border border-emerald-800/40 text-xs text-slate-300">
              <span className="font-bold text-emerald-400 block mb-1">Data Modeling</span>
              Normalized relational schema spanning 32 entities including institutions, courses, fees, and audit logs.
            </div>
            <div className="p-4 rounded-xl bg-forest-900/80 border border-emerald-800/40 text-xs text-slate-300">
              <span className="font-bold text-emerald-400 block mb-1">Security & Governance</span>
              Strict role-based isolation, protected admin provisioning, audit trails, and privacy controls.
            </div>
          </div>
        </div>

        {/* Meet the Developers */}
        <div className="space-y-8" id="team">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800/60">
              The Engineering Team
            </span>
            <h2 className="text-3xl font-extrabold font-display text-white mt-3">
              Meet the Developers
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Proposed roles and core responsibilities of the EDUNEXA development architects:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, i) => (
              <div
                key={i}
                className="rounded-3xl glass-panel p-6 border border-emerald-800/40 hover:border-emerald-500/50 transition-all hover:-translate-y-1"
              >
                <div
                  className={`w-20 h-20 rounded-2xl mx-auto bg-gradient-to-tr ${member.color} p-0.5 mb-4 shadow-lg`}
                >
                  <div className="w-full h-full bg-[#021814] rounded-[14px] flex items-center justify-center text-xl font-extrabold text-white">
                    {member.initials}
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-bold text-white">{member.name}</h3>
                  <p className="text-xs font-semibold text-emerald-400 mt-1 min-h-[32px]">
                    {member.role}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-emerald-950 space-y-1.5 text-xs text-slate-300">
                  <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                    Responsibilities:
                  </p>
                  {member.responsibilities.map((resp, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-slate-300">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{resp}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact and Collaboration */}
        <div className="rounded-3xl glass-panel p-8 sm:p-12 border border-emerald-800/40 text-center space-y-4 max-w-3xl mx-auto">
          <Mail className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="text-2xl font-bold font-display text-white">Contact & Collaboration</h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            Interested in connecting your institution or partnering with EDUNEXA? Our engineering and academic integration team is available for institutional onboarding and academic research inquiries.
          </p>
          <p className="text-emerald-400 font-semibold text-sm">
            official@edunexa.org • admissions@edunexa.org
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
