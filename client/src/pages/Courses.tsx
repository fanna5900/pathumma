import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Filter,
  Check,
  Plus,
  X,
  Building2,
  DollarSign,
  GraduationCap,
  Layers,
  ArrowRight,
} from 'lucide-react';
import api from '../services/api';
import { Course } from '../types';

export const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('All');
  const [selectedForCompare, setSelectedForCompare] = useState<Course[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params: any = {};
        if (level !== 'All') params.level = level;
        if (search.trim()) params.search = search.trim();

        const res = await api.get('/courses', { params });
        if (res.data.success) {
          setCourses(res.data.data);
        }
      } catch (err) {
        console.error('Fetch courses error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [level]);

  const toggleCompare = (course: Course) => {
    if (selectedForCompare.some((c) => c.id === course.id)) {
      setSelectedForCompare(selectedForCompare.filter((c) => c.id !== course.id));
    } else {
      if (selectedForCompare.length >= 3) {
        alert('You can compare a maximum of 3 courses at a time.');
        return;
      }
      setSelectedForCompare([...selectedForCompare, course]);
    }
  };

  return (
    <div className="min-h-screen bg-[#021814] text-slate-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-semibold mb-3">
              <BookOpen className="w-4 h-4" />
              <span>Academic Curriculum Explorer</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white">
              Course Catalog & Comparison Matrix
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
              Compare degrees, seat capacities, eligibility criteria, and transparent annual fee structures side-by-side.
            </p>
          </div>

          {selectedForCompare.length > 0 && (
            <button
              onClick={() => setCompareModalOpen(true)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-glow-emerald flex items-center gap-2 transition-all"
            >
              <Layers className="w-4 h-4" />
              <span>Compare Selected ({selectedForCompare.length})</span>
            </button>
          )}
        </div>

        {/* Filter bar */}
        <div className="rounded-3xl glass-panel bg-[#03241e]/90 border border-emerald-800/60 p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search course title, code, or specialization..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-forest-900 border border-emerald-800/60 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Level:</span>
            {['All', 'UNDERGRADUATE', 'POSTGRADUATE'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevel(lvl)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  level === lvl
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-forest-900 text-slate-300 hover:text-white'
                }`}
              >
                {lvl === 'All' ? 'All' : lvl === 'UNDERGRADUATE' ? 'Undergrad (UG)' : 'Postgrad (PG)'}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400 text-sm">Loading course matrices...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const isSelected = selectedForCompare.some((c) => c.id === course.id);
              const fee = course.fees?.[0];

              return (
                <div
                  key={course.id}
                  className="rounded-3xl glass-panel p-6 border border-emerald-900/60 flex flex-col justify-between hover:border-emerald-500/40 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                        {course.code}
                      </span>
                      <span className="text-xs text-slate-400">
                        {course.durationYears} Years • {course.totalSeats} Seats
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white line-clamp-1">{course.title}</h3>

                    <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                      <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{course.institution?.name}</span>
                    </p>

                    <p className="text-xs text-slate-400 line-clamp-2">{course.description}</p>

                    <div className="p-3 rounded-xl bg-forest-950/80 border border-emerald-900/50 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Annual Tuition:</span>
                      <span className="text-sm font-bold text-white">
                        {fee ? `₹${fee.tuitionFee.toLocaleString()}` : 'Contact Dept'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-emerald-950 flex items-center gap-2">
                    <button
                      onClick={() => toggleCompare(course)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-forest-900 hover:bg-forest-800 text-slate-300 hover:text-white border border-emerald-800/50'
                      }`}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{isSelected ? 'Selected' : 'Compare'}</span>
                    </button>

                    <Link
                      to={`/colleges/${course.institutionId}`}
                      className="p-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-semibold transition-colors"
                      title="View Institution Details"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Side-by-Side Comparison Matrix Modal */}
      {compareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="rounded-3xl glass-panel bg-[#02221b] border border-emerald-500/40 p-6 sm:p-8 max-w-5xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-emerald-900/60 pb-4">
              <div>
                <h3 className="text-xl font-bold font-display text-white">Side-by-Side Course Comparison</h3>
                <p className="text-xs text-slate-400">Detailed fee metrics and requirements comparison matrix.</p>
              </div>
              <button
                onClick={() => setCompareModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-forest-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedForCompare.map((c) => {
                const f = c.fees?.[0];
                return (
                  <div key={c.id} className="p-5 rounded-2xl bg-forest-950/80 border border-emerald-800/50 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-900 text-emerald-300">
                        {c.code}
                      </span>
                      <button
                        onClick={() => toggleCompare(c)}
                        className="text-slate-400 hover:text-rose-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="text-base font-bold text-white min-h-[48px]">{c.title}</h4>
                    <p className="text-xs text-emerald-400">{c.institution?.name}</p>

                    <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-emerald-900">
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-semibold text-white">{c.durationYears} Years</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Seats:</span>
                        <span className="font-semibold text-white">{c.totalSeats} Seats</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Annual Tuition:</span>
                        <span className="font-semibold text-white">
                          {f ? `₹${f.tuitionFee.toLocaleString()}` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hostel & Mess:</span>
                        <span className="font-semibold text-white">
                          {f && f.hostelFee > 0 ? `₹${f.hostelFee.toLocaleString()}` : 'Optional'}
                        </span>
                      </div>
                      <div className="flex justify-between text-emerald-400 font-bold pt-1 border-t border-emerald-950">
                        <span>Total Annual Package:</span>
                        <span>{f ? `₹${f.totalFee.toLocaleString()}` : 'Verified'}</span>
                      </div>
                    </div>

                    <div className="pt-2 text-xs text-slate-400 space-y-1">
                      <p className="font-semibold text-slate-300">Eligibility:</p>
                      <p className="text-[11px] leading-relaxed">{c.eligibility}</p>
                    </div>

                    <div className="pt-2 text-xs text-slate-400 space-y-1">
                      <p className="font-semibold text-slate-300">Admission Process:</p>
                      <p className="text-[11px] leading-relaxed">{c.admissionProcess}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
