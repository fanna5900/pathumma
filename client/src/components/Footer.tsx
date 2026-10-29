import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  Github,
  Linkedin,
  Twitter,
  Heart,
  ArrowUp,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#01120f] border-t border-emerald-950/80 text-slate-400 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-900/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-forest-800 p-0.5 shadow-glow-emerald">
                <div className="w-full h-full bg-[#021814] rounded-[10px] flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <span className="font-display font-extrabold text-2xl tracking-wider text-white">
                NEX<span className="text-emerald-400">ORA</span>
              </span>
            </Link>

            <p className="text-slate-300 font-medium text-base">
              “Empowering Higher Education Through Verified Transparency & AI Guidance.”
            </p>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              NEXORA is a comprehensive education platform connecting students, faculty, and accredited institutions across Kerala and India. Verified fee matrices, transparent college discovery, and streamlined admission applications.
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950 border border-emerald-800/60 text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Verified Institutional Gazette
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/40 border border-amber-800/40 text-amber-300">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-gold-400" /> AI-Assisted Admissions
              </span>
            </div>
          </div>

          {/* Institutional Directory */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Universities & Colleges
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/universities" className="hover:text-emerald-400 transition-colors">
                  Kerala 6 Premier Universities
                </Link>
              </li>
              <li>
                <Link to="/colleges?type=Government" className="hover:text-emerald-400 transition-colors">
                  Government Engineering Colleges
                </Link>
              </li>
              <li>
                <Link to="/colleges?type=Government+Aided" className="hover:text-emerald-400 transition-colors">
                  Government Aided Institutions
                </Link>
              </li>
              <li>
                <Link to="/colleges?type=Autonomous" className="hover:text-emerald-400 transition-colors">
                  Autonomous Colleges
                </Link>
              </li>
              <li>
                <Link to="/colleges?type=Private+Self-Financing" className="hover:text-emerald-400 transition-colors">
                  Private Self-Financing Colleges
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic & Admission */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Academic & Admission
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/admission" className="hover:text-emerald-400 transition-colors">
                  Apply for Admission
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-emerald-400 transition-colors">
                  Course & Fee Explorer
                </Link>
              </li>
              <li>
                <Link to="/study-resources" className="hover:text-emerald-400 transition-colors">
                  Syllabus & Question Papers
                </Link>
              </li>
              <li>
                <Link to="/study-partners" className="hover:text-emerald-400 transition-colors">
                  Study Partner Matching
                </Link>
              </li>
              <li>
                <Link to="/ai-assistant" className="hover:text-emerald-400 transition-colors">
                  AI Academic Assistant
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Governance */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Liaison & Support
            </h4>
            <div className="space-y-3 text-xs leading-relaxed">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Technopark Phase II, Thiruvananthapuram, Kerala 695581</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>support@nexora.edu</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>+91 (0471) 259-8100</span>
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-emerald-950 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Back to Top</span>
              <button
                onClick={scrollToTop}
                className="p-2 rounded-lg bg-forest-900 hover:bg-forest-800 text-emerald-400 border border-emerald-900/50 transition-colors"
                title="Scroll back to top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-emerald-950/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} NEXORA Education Platform. All verified records retained.</p>
          <div className="flex items-center space-x-6">
            <Link to="/about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link to="/contact" className="hover:text-white transition-colors">
              Contact Helplines
            </Link>
            <Link to="/features" className="hover:text-white transition-colors">
              Features
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
