import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Clock,
  CheckCircle,
  HelpCircle,
  Building,
  GraduationCap,
} from 'lucide-react';

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Admission Inquiry',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#021814] text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto pt-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <MessageSquare className="w-4 h-4 text-emerald-400" /> Student & Institutional Helplines
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Connect with NEXORA
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            Have questions regarding university affiliations, college fees, online admission applications, or technical support? Our academic advisory team is here to assist.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-forest-900/80 border border-emerald-900/40 shadow-xl flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/30">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Email Support</h3>
            <p className="text-xs text-slate-400 mb-3">For counseling, admission tracking & portal inquiries</p>
            <a
              href="mailto:support@nexora.edu"
              className="text-xs font-semibold text-emerald-300 hover:underline"
            >
              support@nexora.edu
            </a>
            <a
              href="mailto:admissions@nexora.edu"
              className="text-xs text-slate-400 hover:text-white mt-1"
            >
              admissions@nexora.edu
            </a>
          </div>

          <div className="p-6 rounded-3xl bg-forest-900/80 border border-emerald-900/40 shadow-xl flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/20 flex items-center justify-center text-gold-400 mb-4 border border-gold-500/30">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Telephone Helplines</h3>
            <p className="text-xs text-slate-400 mb-3">Mon-Sat 9:00 AM - 6:00 PM IST</p>
            <span className="text-xs font-semibold text-white">+91 (0471) 259-8100</span>
            <span className="text-xs text-slate-400 mt-1">Toll Free: 1800-425-NEXORA</span>
          </div>

          <div className="p-6 rounded-3xl bg-forest-900/80 border border-emerald-900/40 shadow-xl flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/30">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Kerala Academic Hub</h3>
            <p className="text-xs text-slate-400 mb-3">Institutional Liaison Office</p>
            <span className="text-xs text-slate-300 text-center">
              Technopark Campus, Phase II, Trivandrum, Kerala 695581, India
            </span>
          </div>
        </div>

        {/* Form and FAQ Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Inquiry Form */}
          <div className="p-8 rounded-3xl bg-forest-900/90 border border-emerald-900/50 shadow-2xl backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Send className="w-5 h-5 text-emerald-400" /> Send an Academic Inquiry
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Fill out the form below and an academic advisor will respond within 24 business hours.
            </p>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-3">
                <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Inquiry Received</h4>
                <p className="text-xs text-slate-300">
                  Thank you! Your message has been routed to our Kerala academic counseling desk. A response will be delivered to your email.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-3 px-4 py-2 rounded-xl bg-forest-800 text-xs text-emerald-300 font-semibold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Nair"
                    className="w-full px-4 py-3 rounded-xl bg-[#021814] border border-emerald-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="student@gmail.com"
                      className="w-full px-4 py-3 rounded-xl bg-[#021814] border border-emerald-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="10-digit mobile"
                      maxLength={10}
                      className="w-full px-4 py-3 rounded-xl bg-[#021814] border border-emerald-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Subject / Category
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#021814] border border-emerald-900/50 text-white focus:outline-none focus:border-emerald-400 text-sm"
                  >
                    <option value="Admission Inquiry">Admission & Application Tracking</option>
                    <option value="Fee Structure">Fee Structure Verification</option>
                    <option value="University Affiliation">University Affiliation Query</option>
                    <option value="College Registration">Institutional Listing / Verification</option>
                    <option value="Technical Support">Technical Portal Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Message / Question
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Please describe your question or issue in detail..."
                    className="w-full px-4 py-3 rounded-xl bg-[#021814] border border-emerald-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-forest-700 hover:from-emerald-400 hover:to-forest-600 text-[#021814] font-extrabold text-sm shadow-glow-emerald transition-all"
                >
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>

          {/* Quick FAQ summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-gold-400" /> Frequently Asked Questions
            </h3>

            {[
              {
                q: 'How are colleges verified on NEXORA?',
                a: 'All college affiliations, course offerings, and fee structures are verified directly against official State University gazettes, DTE Kerala orders, UGC directories, and NIRF disclosures.',
              },
              {
                q: 'How does the online admission application work?',
                a: 'Students can fill out the centralized 7-step application on NEXORA to submit verified profiles, academic records, and certificates directly to accredited institutions, receiving a traceable reference ID.',
              },
              {
                q: 'Are government fee concession schemes supported?',
                a: 'Yes. The portal includes details on Kerala E-Grantz, merit scholarships, and category fee waivers published by the Department of Higher Education.',
              },
              {
                q: 'Can colleges update their own academic catalog?',
                a: 'Authorized college and university representatives have dedicated institutional dashboard access to update seat matrix and syllabus data subject to admin verification.',
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-forest-900/60 border border-emerald-900/40 space-y-2"
              >
                <h4 className="text-sm font-bold text-emerald-300">{faq.q}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
