import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  Building2,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  MapPin,
  BookOpen,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  Calendar,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Register: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'STUDENT' | 'FACULTY' | 'UNIVERSITY'>('STUDENT');
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Student Form State
  const [studentForm, setStudentForm] = useState({
    fullName: '',
    username: '',
    email: '',
    dob: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: 'Male',
    country: 'India',
    state: 'Kerala',
    district: 'Thiruvananthapuram',
    admissionOption: 'LOOKING_FOR_ADMISSION' as 'ALREADY_ADMITTED' | 'LOOKING_FOR_ADMISSION',
    // Fields for Already Admitted
    currentUniversity: '',
    currentCollege: '',
    currentDepartment: '',
    currentCourse: '',
    currentAcademicYear: '2026-2027',
    currentSemester: 'Semester 1',
    // Fields for Looking for Admission
    preferredUniversity: '',
    preferredDistrict: 'Thiruvananthapuram',
    preferredCourse: '',
    preferredCategory: 'Government',
    admissionYear: '2026',
  });

  // Inline Field Errors State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validation functions according to Section 10
  const validateFullName = (name: string): string => {
    const trimmed = name.trim();
    if (!trimmed) return 'Please enter a valid full name using letters only.';
    // Specification: English letters and spaces only, no numbers or symbols
    if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(trimmed)) {
      return 'Please enter a valid full name using letters only.';
    }
    return '';
  };

  const validateUsername = (uname: string): string => {
    if (!uname) return 'Username is required.';
    // Specification: English letters only, no numbers, spaces, or special characters
    if (!/^[A-Za-z]+$/.test(uname)) {
      return 'Username must contain English letters only. Numbers, spaces, and symbols are not allowed.';
    }
    return '';
  };

  const validateEmail = (mail: string): string => {
    if (!mail.trim()) return 'Email address is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail.trim())) {
      return 'Please enter a valid email address, such as name@gmail.com.';
    }
    return '';
  };

  const validateMobile = (mob: string): string => {
    if (!mob.trim()) return 'Contact number must contain exactly 10 digits.';
    const clean = mob.replace(/\D/g, '');
    if (clean.length !== 10) {
      return 'Contact number must contain exactly 10 digits.';
    }
    return '';
  };

  const validatePassword = (pwd: string): string => {
    if (!pwd) return 'Password is required.';
    if (pwd.length < 8 || pwd.length > 13) {
      return 'Password must be between 8 and 13 characters for this initial requirement.';
    }
    return '';
  };

  const validateDob = (d: string): string => {
    if (!d) return 'Date of birth is required.';
    const dateObj = new Date(d);
    const now = new Date();
    if (dateObj > now) {
      return 'Date of birth cannot be a future date.';
    }
    return '';
  };

  // Handle Input Changes with real-time error removal
  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStudentForm((prev) => ({ ...prev, [name]: value }));

    // Real-time validation & error clearing
    let err = '';
    if (name === 'fullName') err = validateFullName(value);
    if (name === 'username') err = validateUsername(value);
    if (name === 'email') err = validateEmail(value);
    if (name === 'phone') err = validateMobile(value);
    if (name === 'password') err = validatePassword(value);
    if (name === 'dob') err = validateDob(value);
    if (name === 'confirmPassword') {
      if (value !== studentForm.password) err = 'Password and Confirm Password do not match.';
    }

    setErrors((prev) => ({ ...prev, [name]: err }));
    if (serverError) setServerError(null);
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Validate all fields
    const nameErr = validateFullName(studentForm.fullName);
    const unameErr = validateUsername(studentForm.username);
    const emailErr = validateEmail(studentForm.email);
    const phoneErr = validateMobile(studentForm.phone);
    const pwdErr = validatePassword(studentForm.password);
    const dobErr = validateDob(studentForm.dob);
    let matchErr = '';
    if (studentForm.password !== studentForm.confirmPassword) {
      matchErr = 'Password and Confirm Password do not match.';
    }

    const allErrors = {
      fullName: nameErr,
      username: unameErr,
      email: emailErr,
      phone: phoneErr,
      password: pwdErr,
      dob: dobErr,
      confirmPassword: matchErr,
    };

    setErrors(allErrors);

    const hasErrors = Object.values(allErrors).some((msg) => msg !== '');
    if (hasErrors) {
      setServerError('Please fix the highlighted errors before submitting.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullName: studentForm.fullName.trim(),
        username: studentForm.username.toLowerCase().trim(),
        email: studentForm.email.toLowerCase().trim(),
        password: studentForm.password,
        phone: studentForm.phone.replace(/\D/g, ''),
        dob: studentForm.dob,
        gender: studentForm.gender,
        country: studentForm.country,
        state: studentForm.state,
        district: studentForm.district,
        admissionStatus: studentForm.admissionOption,
        educationLevel: 'Undergraduate',
        preferredCourse:
          studentForm.admissionOption === 'ALREADY_ADMITTED'
            ? studentForm.currentCourse
            : studentForm.preferredCourse,
        preferredInstitution:
          studentForm.admissionOption === 'ALREADY_ADMITTED'
            ? studentForm.currentCollege || studentForm.currentUniversity
            : studentForm.preferredUniversity,
      };

      const res = await api.post('/auth/register/student', payload);
      if (res.data.success) {
        login(res.data.token, res.data.user);
        navigate('/student');
      }
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Registration failed. Please check your data and retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#021814] text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-forest-800 p-0.5 shadow-glow-emerald">
              <div className="w-full h-full bg-[#021814] rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <span className="font-display font-extrabold text-2xl tracking-wider text-white">
              NEX<span className="text-emerald-400">ORA</span>
            </span>
          </Link>
          <h1 className="text-3xl font-extrabold text-white">Create Your Student Account</h1>
          <p className="mt-1 text-sm text-slate-300">
            Join Kerala's premier unified higher education and admission ecosystem
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-forest-900/90 border border-emerald-900/50 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          {serverError && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/70 border border-red-500/50 flex items-center gap-3 text-red-200 text-sm">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleStudentSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  name="fullName"
                  value={studentForm.fullName}
                  onChange={handleStudentChange}
                  placeholder="e.g. Anu Thomas"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#021814] border ${
                    errors.fullName ? 'border-red-500' : 'border-emerald-900/50'
                  } text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors text-sm`}
                />
              </div>
              {errors.fullName ? (
                <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errors.fullName}
                </p>
              ) : (
                <p className="text-[11px] text-slate-400 mt-1">Letters and spaces only (e.g. "Anu Thomas").</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Username <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={studentForm.username}
                onChange={handleStudentChange}
                placeholder="e.g. anuthomas"
                className={`w-full px-4 py-3 rounded-xl bg-[#021814] border ${
                  errors.username ? 'border-red-500' : 'border-emerald-900/50'
                } text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors text-sm`}
              />
              {errors.username ? (
                <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errors.username}
                </p>
              ) : (
                <p className="text-[11px] text-slate-400 mt-1">
                  English letters only (no numbers, spaces, or symbols).
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={studentForm.email}
                  onChange={handleStudentChange}
                  placeholder="student@gmail.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#021814] border ${
                    errors.email ? 'border-red-500' : 'border-emerald-900/50'
                  } text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors text-sm`}
                />
              </div>
              {errors.email ? (
                <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errors.email}
                </p>
              ) : (
                <p className="text-[11px] text-slate-400 mt-1">
                  Please enter a valid email address, such as name@gmail.com.
                </p>
              )}
            </div>

            {/* Mobile Number & DOB Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Mobile Number (10 Digits) <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-xs font-bold text-emerald-400">+91</span>
                  <input
                    type="tel"
                    name="phone"
                    value={studentForm.phone}
                    onChange={handleStudentChange}
                    placeholder="9876543210"
                    maxLength={10}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl bg-[#021814] border ${
                      errors.phone ? 'border-red-500' : 'border-emerald-900/50'
                    } text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors text-sm`}
                  />
                </div>
                {errors.phone ? (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errors.phone}
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-400 mt-1">Mobile number must contain exactly 10 digits.</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Date of Birth <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="dob"
                    value={studentForm.dob}
                    onChange={handleStudentChange}
                    max={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 rounded-xl bg-[#021814] border ${
                      errors.dob ? 'border-red-500' : 'border-emerald-900/50'
                    } text-white focus:outline-none focus:border-emerald-400 transition-colors text-sm`}
                  />
                </div>
                {errors.dob && (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errors.dob}
                  </p>
                )}
              </div>
            </div>

            {/* Password & Confirm Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Password (8-13 Chars) <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={studentForm.password}
                    onChange={handleStudentChange}
                    maxLength={13}
                    placeholder="8 to 13 characters"
                    className={`w-full pl-10 pr-10 py-3 rounded-xl bg-[#021814] border ${
                      errors.password ? 'border-red-500' : 'border-emerald-900/50'
                    } text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors text-sm`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Confirm Password <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={studentForm.confirmPassword}
                    onChange={handleStudentChange}
                    maxLength={13}
                    placeholder="Confirm password"
                    className={`w-full pl-10 pr-10 py-3 rounded-xl bg-[#021814] border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-emerald-900/50'
                    } text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors text-sm`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* SECTION 11: STUDENT REGISTRATION OPTIONS */}
            <div className="p-5 rounded-2xl bg-[#021814]/70 border border-emerald-900/50 space-y-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                Admission Status Options
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setStudentForm((prev) => ({ ...prev, admissionOption: 'LOOKING_FOR_ADMISSION' }))
                  }
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    studentForm.admissionOption === 'LOOKING_FOR_ADMISSION'
                      ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-glow-emerald'
                      : 'bg-forest-950/60 border-emerald-900/40 text-slate-300 hover:bg-forest-900'
                  }`}
                >
                  <span className="block text-xs font-bold">1. Looking for Admission</span>
                  <span className="block text-[11px] text-slate-400 mt-0.5">
                    Exploring universities, comparing courses & tracking cutoffs
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setStudentForm((prev) => ({ ...prev, admissionOption: 'ALREADY_ADMITTED' }))
                  }
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    studentForm.admissionOption === 'ALREADY_ADMITTED'
                      ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-glow-emerald'
                      : 'bg-forest-950/60 border-emerald-900/40 text-slate-300 hover:bg-forest-900'
                  }`}
                >
                  <span className="block text-xs font-bold">2. Admission Already Taken</span>
                  <span className="block text-[11px] text-slate-400 mt-0.5">
                    Enrolled student accessing syllabus, question papers & peers
                  </span>
                </button>
              </div>

              {/* Conditional Sub-fields for Already Admitted */}
              {studentForm.admissionOption === 'ALREADY_ADMITTED' && (
                <div className="space-y-4 pt-3 border-t border-emerald-900/40 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">University Name</label>
                      <input
                        type="text"
                        name="currentUniversity"
                        value={studentForm.currentUniversity}
                        onChange={handleStudentChange}
                        placeholder="e.g. KTU or Calicut University"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-forest-950 border border-emerald-900/50 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">College Name</label>
                      <input
                        type="text"
                        name="currentCollege"
                        value={studentForm.currentCollege}
                        onChange={handleStudentChange}
                        placeholder="e.g. College of Engineering Trivandrum"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-forest-950 border border-emerald-900/50 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Department & Course</label>
                      <input
                        type="text"
                        name="currentCourse"
                        value={studentForm.currentCourse}
                        onChange={handleStudentChange}
                        placeholder="e.g. B.Tech Computer Science"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-forest-950 border border-emerald-900/50 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Semester / Year</label>
                      <select
                        name="currentSemester"
                        value={studentForm.currentSemester}
                        onChange={handleStudentChange}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-forest-950 border border-emerald-900/50 text-white text-xs"
                      >
                        <option value="Semester 1">Semester 1</option>
                        <option value="Semester 2">Semester 2</option>
                        <option value="Semester 3">Semester 3</option>
                        <option value="Semester 4">Semester 4</option>
                        <option value="Semester 5">Semester 5</option>
                        <option value="Semester 6">Semester 6</option>
                        <option value="Semester 7">Semester 7</option>
                        <option value="Semester 8">Semester 8</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Conditional Sub-fields for Looking for Admission */}
              {studentForm.admissionOption === 'LOOKING_FOR_ADMISSION' && (
                <div className="space-y-4 pt-3 border-t border-emerald-900/40 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Preferred University</label>
                      <input
                        type="text"
                        name="preferredUniversity"
                        value={studentForm.preferredUniversity}
                        onChange={handleStudentChange}
                        placeholder="e.g. KTU, CUSAT, or MGU"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-forest-950 border border-emerald-900/50 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Preferred Course</label>
                      <input
                        type="text"
                        name="preferredCourse"
                        value={studentForm.preferredCourse}
                        onChange={handleStudentChange}
                        placeholder="e.g. B.Tech CSE, MCA, or MBA"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-forest-950 border border-emerald-900/50 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Preferred Institution Category</label>
                      <select
                        name="preferredCategory"
                        value={studentForm.preferredCategory}
                        onChange={handleStudentChange}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-forest-950 border border-emerald-900/50 text-white text-xs"
                      >
                        <option value="Government">Government</option>
                        <option value="Government Aided">Government Aided</option>
                        <option value="Autonomous">Autonomous</option>
                        <option value="Private Self-Financing">Private Self-Financing</option>
                        <option value="University Department">University Department</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Intended Admission Year</label>
                      <input
                        type="text"
                        name="admissionYear"
                        value={studentForm.admissionYear}
                        onChange={handleStudentChange}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-forest-950 border border-emerald-900/50 text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-forest-700 hover:from-emerald-400 hover:to-forest-600 text-[#021814] font-extrabold text-sm shadow-glow-emerald transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#021814] border-t-transparent rounded-full animate-spin"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  <span>Create Account & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-6 text-center text-xs text-slate-400">
            Already have a NEXORA account?{' '}
            <Link to="/login" className="text-emerald-400 hover:underline font-semibold">
              Log in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
