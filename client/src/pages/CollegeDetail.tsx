import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Star,
  Bookmark,
  BookmarkCheck,
  GraduationCap,
  BookOpen,
  Calendar,
  Layers,
  FileText,
  DollarSign,
  CheckCircle,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import api from '../services/api';
import { Institution, Course } from '../types';
import { useAuth } from '../context/AuthContext';

export const CollegeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [institution, setInstitution] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'COURSES' | 'FEES' | 'ADMISSION' | 'MATERIALS'>('FEES');
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedCourseForApply, setSelectedCourseForApply] = useState<string>('');
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    const fetchInstitution = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/institutions/${id}`);
        if (res.data.success) {
          setInstitution(res.data.data);
          if (res.data.data.courses && res.data.data.courses.length > 0) {
            setSelectedCourseForApply(res.data.data.courses[0].id);
          }
        }
      } catch (err) {
        console.error('Fetch college detail error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstitution();
  }, [id]);

  const toggleSave = async () => {
    if (!user) {
      alert('Please log in as a student to save colleges.');
      return;
    }
    if (!institution) return;

    try {
      const res = await api.post(`/institutions/${institution.id}/save`);
      if (res.data.success) {
        setIsSaved(res.data.saved);
      }
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const handleApplyTracker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const res = await api.post('/admissions/apply', {
        institutionId: institution!.id,
        courseId: selectedCourseForApply,
        status: 'INTERESTED',
        notes: 'Tracked from college directory view',
        isOfficial: false,
      });

      if (res.data.success) {
        setApplySuccess(true);
        setTimeout(() => {
          setApplyModalOpen(false);
          setApplySuccess(false);
          navigate('/student');
        }, 1500);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to record admission tracker entry.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#021814] text-slate-100 flex items-center justify-center pt-28">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!institution) {
    return (
      <div className="min-h-screen bg-[#021814] text-slate-100 pt-32 text-center px-4">
        <h2 className="text-2xl font-bold">Institution Not Found</h2>
        <Link to="/colleges" className="text-emerald-400 mt-4 inline-block underline">
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#021814] text-slate-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Back Link */}
        <Link
          to="/colleges"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to College Directory</span>
        </Link>

        {/* Institution Hero Header Card */}
        <div className="rounded-3xl glass-panel bg-[#03241e]/90 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-forest-800 p-0.5 shadow-glow-emerald flex-shrink-0">
                <div className="w-full h-full bg-[#021814] rounded-[14px] flex items-center justify-center text-emerald-400">
                  <Building2 className="w-10 h-10" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                    {institution.institutionType}
                  </span>
                  {institution.nirfRank && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800/60">
                      NIRF Rank #{institution.nirfRank}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-amber-300 font-semibold bg-amber-950/40 px-2 py-0.5 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {institution.rating} Rating
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-white">
                  {institution.name}
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{institution.address}</span>
                </p>

                <p className="text-xs text-emerald-400 flex items-center gap-1.5 pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verified Source: {institution.officialSource}</span>
                </p>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={toggleSave}
                className="px-4 py-2.5 rounded-xl glass-panel bg-forest-900 hover:bg-forest-800 border border-emerald-800 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-2 transition-all"
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>Save College</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setApplyModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-glow-emerald transition-all"
              >
                Track in Admission Tracker
              </button>

              {institution.officialWebsite && (
                <a
                  href={institution.officialWebsite}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-forest-900 border border-emerald-800/60 text-slate-400 hover:text-white"
                  title="Official Website"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 border-b border-emerald-950 pb-2">
          {[
            { id: 'FEES', label: 'Verified Course Fees' },
            { id: 'COURSES', label: 'Programs & Seats' },
            { id: 'OVERVIEW', label: 'Facilities & Campus' },
            { id: 'ADMISSION', label: 'Eligibility & Process' },
            { id: 'MATERIALS', label: 'Study Resources' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-glow-emerald'
                  : 'text-slate-400 hover:text-white hover:bg-forest-900/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Course Fee Breakdown Table */}
        {activeTab === 'FEES' && (
          <div className="rounded-3xl glass-panel p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold font-display text-white">
                Itemized Course Fee Structure
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Official gazette verified fees for Academic Year 2026–2027. Values exclude one-time refundable caution deposits.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-emerald-900 text-slate-400 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Course Title</th>
                    <th className="py-3 px-4">Level</th>
                    <th className="py-3 px-4">Annual Tuition</th>
                    <th className="py-3 px-4">Exam & Lab</th>
                    <th className="py-3 px-4">Hostel Charges</th>
                    <th className="py-3 px-4 text-emerald-400 font-bold">Total Annual Package</th>
                    <th className="py-3 px-4">Verification Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-950">
                  {institution.courses?.map((course) => {
                    const fee = course.fees?.[0];
                    return (
                      <tr key={course.id} className="hover:bg-emerald-950/20 transition-colors">
                        <td className="py-4 px-4 font-semibold text-white">
                          {course.title}
                          <span className="block text-[11px] text-slate-400 font-normal">
                            Duration: {course.durationYears} Years • {course.totalSeats} Seats
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-300">{course.level}</td>
                        <td className="py-4 px-4 font-medium text-slate-200">
                          {fee ? `₹${fee.tuitionFee.toLocaleString()}` : 'N/A'}
                        </td>
                        <td className="py-4 px-4 text-slate-300">
                          {fee ? `₹${(fee.examFee + fee.labFee).toLocaleString()}` : 'N/A'}
                        </td>
                        <td className="py-4 px-4 text-slate-300">
                          {fee && fee.hostelFee > 0 ? `₹${fee.hostelFee.toLocaleString()}` : 'Optional'}
                        </td>
                        <td className="py-4 px-4 font-bold text-emerald-400">
                          {fee ? `₹${fee.totalFee.toLocaleString()} / yr` : 'Verified Fee'}
                        </td>
                        <td className="py-4 px-4 text-[11px] text-slate-400">
                          {fee?.officialSource || institution.officialSource}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Courses & Departments */}
        {activeTab === 'COURSES' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold font-display text-white">
              Academic Departments & Programs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {institution.courses?.map((course) => {
                const fee = course.fees?.[0];
                const semesterCount = (course.durationYears || (course.level === 'POSTGRADUATE' ? 2 : 4)) * 2;
                return (
                  <div key={course.id} className="rounded-2xl glass-panel p-6 space-y-4 border border-emerald-800/40 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                          {course.code} • {course.level}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {course.durationYears} Years • {semesterCount} Semesters
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white">{course.title}</h3>
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{course.description}</p>

                      <div className="pt-3 border-t border-emerald-950 text-xs space-y-2">
                        <div className="p-2.5 rounded-xl bg-forest-950/70 border border-emerald-900/40 space-y-1">
                          <p><span className="text-emerald-400 font-semibold">Semester Structure:</span> {semesterCount} Semesters (Semester Grade System)</p>
                          <p><span className="text-emerald-400 font-semibold">Eligibility:</span> {course.eligibility}</p>
                          <p><span className="text-emerald-400 font-semibold">Admission / Entrance:</span> {course.admissionProcess}</p>
                          {fee && (
                            <p><span className="text-emerald-400 font-semibold">Annual Verified Fee:</span> ₹{fee.totalFee.toLocaleString()} / Year ({fee.officialSource})</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-emerald-950 flex items-center justify-between gap-3">
                      <span className="text-xs text-emerald-300 font-semibold">
                        {course.totalSeats ? `${course.totalSeats} Approved Seats` : 'Approved Seats'}
                      </span>
                      <Link
                        to={`/admission?institutionId=${institution.id}&courseId=${course.id}`}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-glow-emerald transition-all"
                      >
                        Apply for Course
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Facilities & Campus */}
        {activeTab === 'OVERVIEW' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-3xl glass-panel p-6 space-y-4">
              <h3 className="text-lg font-bold text-white">Campus Facilities & Infrastructure</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{institution.facilities}</p>
              <div className="pt-4 border-t border-emerald-950">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Institutional Affiliation
                </h4>
                <p className="text-sm text-slate-200">{institution.affiliation || 'Autonomous / UGC Recognized'}</p>
              </div>
            </div>

            <div className="rounded-3xl glass-panel p-6 space-y-4">
              <h3 className="text-lg font-bold text-white">Scholarships & Financial Aid</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {institution.scholarships || 'Merit-cum-Means Scholarships, State Post-Matric Waivers, Central Sector Scheme.'}
              </p>
              <div className="pt-4 border-t border-emerald-950">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Admissions Office Contact
                </h4>
                <p className="text-sm text-slate-200">Email: {institution.contactEmail}</p>
                <p className="text-sm text-slate-200">Phone: {institution.contactPhone}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Admission & Eligibility */}
        {activeTab === 'ADMISSION' && (
          <div className="rounded-3xl glass-panel p-8 space-y-6">
            <h2 className="text-xl font-bold font-display text-white">Admission Process & Eligibility</h2>
            <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
              <p>
                Admissions to {institution.name} are conducted strictly through accredited centralized merit lists and entrance score counseling portals (such as JoSAA, CSAB, KEAM, or TNEA).
              </p>
              <div className="p-4 rounded-xl bg-forest-950/80 border border-emerald-800/40 space-y-2">
                <h4 className="font-semibold text-emerald-400">Standard Counseling Guidelines:</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-300">
                  <li>Mandatory qualification in prescribed state or national entrance exam.</li>
                  <li>Document verification: 10th & 12th mark sheets, Transfer Certificate, Category Certificate (if applicable).</li>
                  <li>Online seat allotment acceptance fee payment to secure seat confirmation.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Study Resources */}
        {activeTab === 'MATERIALS' && (
          <div className="rounded-3xl glass-panel p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-display text-white">Verified Academic Materials</h2>
                <p className="text-xs text-slate-400 mt-1">Uploaded and authenticated by departmental faculty.</p>
              </div>
              <Link
                to="/study-resources"
                className="text-xs text-emerald-400 font-semibold hover:underline"
              >
                Browse Full Repository →
              </Link>
            </div>

            <div className="space-y-3">
              {institution.learningMaterials && institution.learningMaterials.length > 0 ? (
                institution.learningMaterials.map((mat) => (
                  <div
                    key={mat.id}
                    className="p-4 rounded-2xl bg-forest-950/60 border border-emerald-900/40 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-white">{mat.title}</h4>
                        <p className="text-xs text-slate-400">{mat.resourceType} • {mat.sourceInfo}</p>
                      </div>
                    </div>
                    <Link
                      to="/study-resources"
                      className="px-3 py-1.5 rounded-lg bg-emerald-600/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-600 hover:text-white transition-colors"
                    >
                      View
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">No resources publicly indexed for this institution yet.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Track in Admission Tracker Modal */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="rounded-3xl glass-panel bg-[#02221b] border border-emerald-500/40 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <h3 className="text-lg font-bold text-white">Add to Admission Tracker</h3>
            <p className="text-xs text-slate-300">
              Track this course in your personal student dashboard across all preparation and application stages.
            </p>

            {applySuccess ? (
              <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-800 text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-sm font-bold text-white">Successfully Added to Tracker!</p>
                <p className="text-xs text-emerald-300">Redirecting to your student dashboard...</p>
              </div>
            ) : (
              <form onSubmit={handleApplyTracker} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Select Program
                  </label>
                  <select
                    value={selectedCourseForApply}
                    onChange={(e) => setSelectedCourseForApply(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-forest-900 border border-emerald-800/60 text-sm text-white focus:outline-none focus:border-emerald-500"
                    required
                  >
                    {institution.courses?.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setApplyModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-glow-emerald"
                  >
                    Confirm & Track
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeDetail;
