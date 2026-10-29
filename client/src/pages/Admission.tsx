import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  FileText,
  User,
  Phone,
  BookOpen,
  Building,
  Upload,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Printer,
  Home,
  Check,
  ChevronRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

interface InstitutionOption {
  id: string;
  name: string;
  city: string;
  state: string;
  institutionType: string;
  affiliation?: string;
}

interface CourseOption {
  id: string;
  title: string;
  code: string;
  level: string;
  institutionId: string;
  durationYears?: number;
  eligibility?: string;
  admissionProcess?: string;
  fees?: { totalFee: number; tuitionFee: number }[];
}

interface FormData {
  // Step 1: Personal
  fullName: string;
  dob: string;
  gender: string;
  nationality: string;
  profilePhotoName: string;

  // Step 2: Contact
  email: string;
  phone: string;
  address: string;
  place: string;
  district: string;
  state: string;
  pincode: string;

  // Step 3: Parents/Guardian
  fatherName: string;
  fatherPhone: string;
  motherName: string;
  motherPhone: string;
  guardianName: string;
  guardianPhone: string;

  // Step 4: Academic Details (Adaptive UG / PG)
  qualificationLevel: 'UG' | 'PG';
  sslcSchool: string;
  sslcBoard: string;
  sslcYear: string;
  sslcPercentage: string;
  plusTwoSchool: string;
  plusTwoBoard: string;
  plusTwoStream: string;
  plusTwoYear: string;
  plusTwoPercentage: string;
  entranceExamName: string;
  entranceRollOrRank: string;
  ugDegreeTitle: string;
  ugUniversity: string;
  ugPassingYear: string;
  ugCgpaOrPercentage: string;
  previousQualification: string;

  // Step 5: Preferences
  targetUniversity: string;
  institutionId: string;
  institutionName: string;
  courseId: string;
  courseTitle: string;
  academicYear: string;
  admissionType: string;
  additionalPreference: string;

  // Step 6: Documents
  documents: {
    photo?: string;
    sslc?: string;
    plusTwo?: string;
    tc?: string;
    conduct?: string;
    entranceScorecard?: string;
    categoryCert?: string;
  };

  // Step 7: Declaration
  declarationAgreed: boolean;
}

export const Admission: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedApp, setSubmittedApp] = useState<{
    applicationNumber: string;
    applicantName: string;
    institutionName: string;
    courseTitle: string;
    submissionDate: string;
  } | null>(null);

  const [institutions, setInstitutions] = useState<InstitutionOption[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);

  const [formData, setFormData] = useState<FormData>({
    fullName: user?.username ? user.username.toUpperCase() : '',
    dob: '',
    gender: 'Male',
    nationality: 'Indian',
    profilePhotoName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    place: '',
    district: 'Thiruvananthapuram',
    state: 'Kerala',
    pincode: '',
    fatherName: '',
    fatherPhone: '',
    motherName: '',
    motherPhone: '',
    guardianName: '',
    guardianPhone: '',
    sslcSchool: '',
    sslcBoard: 'Kerala State Board (SSLC)',
    sslcYear: '2022',
    sslcPercentage: '',
    plusTwoSchool: '',
    plusTwoBoard: 'Kerala Higher Secondary Examination (DHSE)',
    plusTwoStream: 'Computer Science',
    plusTwoYear: '2024',
    plusTwoPercentage: '',
    qualificationLevel: 'UG',
    entranceExamName: 'KEAM (Kerala Engineering Entrance)',
    entranceRollOrRank: '',
    ugDegreeTitle: '',
    ugUniversity: '',
    ugPassingYear: '',
    ugCgpaOrPercentage: '',
    previousQualification: '',
    targetUniversity: 'All',
    institutionId: searchParams.get('institutionId') || '',
    institutionName: '',
    courseId: searchParams.get('courseId') || '',
    courseTitle: '',
    academicYear: '2026-2027',
    admissionType: 'Merit',
    additionalPreference: '',
    documents: {},
    declarationAgreed: false,
  });

  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  // Load institutions & courses from backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const instRes = await api.get('/institutions?limit=100');
        if (instRes.data?.data) {
          setInstitutions(instRes.data.data);
          const preselectedInstId = searchParams.get('institutionId');
          if (preselectedInstId) {
            const found = instRes.data.data.find((i: any) => i.id === preselectedInstId);
            if (found) {
              setFormData((prev) => ({
                ...prev,
                institutionId: found.id,
                institutionName: found.name,
              }));
            }
          }
        }

        const courseRes = await api.get('/courses?limit=100');
        if (courseRes.data?.data) {
          setCourses(courseRes.data.data);
          const preselectedCourseId = searchParams.get('courseId');
          if (preselectedCourseId) {
            const found = courseRes.data.data.find((c: any) => c.id === preselectedCourseId);
            if (found) {
              setFormData((prev) => ({
                ...prev,
                courseId: found.id,
                courseTitle: found.title,
                institutionId: prev.institutionId || found.institutionId,
              }));
            }
          }
        }
      } catch (e) {
        console.error('Failed to load institution/course options:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  // Update selected institution name when institutionId changes
  useEffect(() => {
    if (formData.institutionId && institutions.length > 0) {
      const match = institutions.find((i) => i.id === formData.institutionId);
      if (match) {
        setFormData((prev) => ({ ...prev, institutionName: match.name }));
      }
    }
  }, [formData.institutionId, institutions]);

  // Update selected course title when courseId changes
  useEffect(() => {
    if (formData.courseId && courses.length > 0) {
      const match = courses.find((c) => c.id === formData.courseId);
      if (match) {
        setFormData((prev) => ({ ...prev, courseTitle: match.title }));
      }
    }
  }, [formData.courseId, courses]);

  const filteredColleges = institutions.filter((inst) => {
    if (!formData.targetUniversity || formData.targetUniversity === 'All') return true;
    const aff = (inst.affiliation || '').toLowerCase();
    const uni = formData.targetUniversity.toLowerCase();
    if (uni.includes('ktu') || uni.includes('technological')) return aff.includes('ktu') || aff.includes('technological');
    if (uni.includes('calicut')) return aff.includes('calicut');
    if (uni.includes('mahatma gandhi') || uni.includes('mg')) return aff.includes('mahatma') || aff.includes('mg');
    if (uni.includes('kerala') && !uni.includes('technological')) return aff.includes('kerala') && !aff.includes('technological');
    if (uni.includes('cusat') || uni.includes('cochin')) return aff.includes('cochin') || aff.includes('cusat');
    if (uni.includes('kannur')) return aff.includes('kannur');
    return true;
  });

  const filteredCourses = formData.institutionId
    ? courses.filter((c) => c.institutionId === formData.institutionId)
    : courses;

  const selectedCourseDetails = courses.find((c) => c.id === formData.courseId);

  const steps = [
    { number: 1, title: 'Personal', icon: User },
    { number: 2, title: 'Contact', icon: Phone },
    { number: 3, title: 'Guardian', icon: ShieldCheck },
    { number: 4, title: 'Education', icon: BookOpen },
    { number: 5, title: 'Preferences', icon: Building },
    { number: 6, title: 'Documents', icon: Upload },
    { number: 7, title: 'Review', icon: CheckCircle },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileUpload = (docKey: keyof FormData['documents'], e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert(`File size exceeds 5MB limit. Please upload a smaller file.`);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docKey]: file.name,
      },
    }));
  };

  // Step Validation logic
  const validateStep = (step: number): boolean => {
    const errors: { [key: string]: string } = {};

    if (step === 1) {
      if (!formData.fullName.trim()) {
        errors.fullName = 'Please enter a valid full name using letters only.';
      } else if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(formData.fullName.trim())) {
        errors.fullName = 'Please enter a valid full name using letters only.';
      }

      if (!formData.dob) {
        errors.dob = 'Date of birth is required';
      }
    } else if (step === 2) {
      if (!formData.email.trim()) {
        errors.email = 'Email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        errors.email = 'Please enter a valid email address (e.g., student@gmail.com)';
      }

      const cleanPhone = formData.phone.replace(/\D/g, '');
      if (!formData.phone.trim()) {
        errors.phone = 'Contact number must contain exactly 10 digits.';
      } else if (cleanPhone.length !== 10) {
        errors.phone = 'Contact number must contain exactly 10 digits.';
      }

      if (!formData.address.trim()) {
        errors.address = 'House address is required';
      }

      if (!formData.district.trim()) {
        errors.district = 'District is required';
      }

      if (formData.pincode.trim()) {
        const cleanPin = formData.pincode.replace(/\D/g, '');
        if (cleanPin.length !== 6) {
          errors.pincode = 'PIN code must contain exactly 6 digits';
        }
      }
    } else if (step === 3) {
      if (!formData.fatherName.trim() && !formData.motherName.trim() && !formData.guardianName.trim()) {
        errors.fatherName = 'At least one parent or guardian name is required';
      }
      if (formData.fatherPhone.trim()) {
        const clean = formData.fatherPhone.replace(/\D/g, '');
        if (clean.length !== 10) errors.fatherPhone = 'Must be a 10-digit phone number';
      }
      if (formData.motherPhone.trim()) {
        const clean = formData.motherPhone.replace(/\D/g, '');
        if (clean.length !== 10) errors.motherPhone = 'Must be a 10-digit phone number';
      }
    } else if (step === 4) {
      if (!formData.sslcSchool.trim()) errors.sslcSchool = '10th / SSLC institution name is required';
      if (!formData.sslcPercentage.trim()) errors.sslcPercentage = '10th percentage or CGPA is required';
      if (!formData.plusTwoSchool.trim()) errors.plusTwoSchool = '12th / Plus Two institution name is required';
      if (!formData.plusTwoPercentage.trim()) errors.plusTwoPercentage = '12th percentage or marks is required';
    } else if (step === 5) {
      if (!formData.institutionId) errors.institutionId = 'Please select your preferred Institution / University';
      if (!formData.courseId) errors.courseId = 'Please select your desired Course';
    } else if (step === 6) {
      // Documents step - optional or recommend photo
    } else if (step === 7) {
      if (!formData.declarationAgreed) {
        errors.declarationAgreed = 'You must review and agree to the formal truthfulness declaration';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setErrorMessage(null);
      setCurrentStep((prev) => Math.min(prev + 1, 7));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setErrorMessage('Please fix the highlighted fields to continue.');
    }
  };

  const handlePrev = () => {
    setErrorMessage(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(7)) {
      setErrorMessage('Please accept the declaration before final submission.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        fullName: formData.fullName,
        dob: formData.dob,
        gender: formData.gender,
        nationality: formData.nationality,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        place: formData.place,
        district: formData.district,
        state: formData.state,
        pincode: formData.pincode,
        fatherName: formData.fatherName,
        fatherPhone: formData.fatherPhone,
        motherName: formData.motherName,
        motherPhone: formData.motherPhone,
        guardianName: formData.guardianName,
        guardianPhone: formData.guardianPhone,
        sslcSchool: formData.sslcSchool,
        sslcBoard: formData.sslcBoard,
        sslcYear: formData.sslcYear,
        sslcPercentage: formData.sslcPercentage,
        plusTwoSchool: formData.plusTwoSchool,
        plusTwoBoard: formData.plusTwoBoard,
        plusTwoStream: formData.plusTwoStream,
        plusTwoYear: formData.plusTwoYear,
        plusTwoPercentage: formData.plusTwoPercentage,
        previousQualification: formData.previousQualification,
        institutionId: formData.institutionId,
        courseId: formData.courseId,
        academicYear: formData.academicYear,
        admissionType: formData.admissionType,
        additionalPreference: formData.additionalPreference,
        documents: formData.documents,
        declarationAgreed: formData.declarationAgreed,
        notes: `Application via NEXORA Admission Portal for ${formData.courseTitle || 'Undergraduate'}`,
      };

      const res = await api.post('/admissions/submit', payload);

      if (res.data?.success) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10b981', '#34d399', '#fbbf24', '#059669', '#ffffff'],
        });

        setSubmittedApp({
          applicationNumber: res.data.data.applicationNumber,
          applicantName: res.data.data.applicantName,
          institutionName: res.data.data.institutionName || formData.institutionName,
          courseTitle: res.data.data.courseTitle || formData.courseTitle,
          submissionDate: new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
        });
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setErrorMessage(
        err.response?.data?.message || 'Failed to submit admission application. Please check your data and retry.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // If application has been submitted, render the Success Confirmation screen
  if (submittedApp) {
    return (
      <div className="min-h-screen bg-[#021814] text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-forest-900/90 border border-emerald-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          {/* Subtle glow background */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-forest-800 p-0.5 mx-auto mb-6 shadow-glow-emerald">
              <div className="w-full h-full bg-[#021814] rounded-[14px] flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" /> Application Verified & Submitted
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
              Admission Application Recorded
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8">
              Congratulations, <span className="text-white font-semibold">{submittedApp.applicantName}</span>! Your formal application has been securely registered in the NEXORA Academic Admission Registry.
            </p>

            {/* Reference Badge Card */}
            <div className="bg-[#021814]/80 border border-emerald-500/40 rounded-2xl p-6 mb-8 text-left max-w-lg mx-auto shadow-inner">
              <div className="flex items-center justify-between pb-4 border-b border-emerald-900/50">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Application Reference</span>
                <span className="font-mono text-lg sm:text-xl font-bold text-emerald-300 tracking-wider">
                  {submittedApp.applicationNumber}
                </span>
              </div>

              <div className="pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Institution:</span>
                  <span className="text-white font-medium text-right max-w-[240px] truncate">
                    {submittedApp.institutionName || 'Selected University'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Chosen Course:</span>
                  <span className="text-emerald-300 font-medium text-right max-w-[240px] truncate">
                    {submittedApp.courseTitle || 'Selected Program'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Registration Date:</span>
                  <span className="text-slate-200">{submittedApp.submissionDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Official Status:</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    SUBMITTED (IN VERIFICATION)
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-forest-800 hover:bg-forest-700 text-white font-medium border border-emerald-500/30 transition-all shadow-md"
              >
                <Printer className="w-4 h-4 text-emerald-400" /> Print Acknowledgement
              </button>

              <Link
                to="/student"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-forest-700 hover:from-emerald-400 hover:to-forest-600 text-[#021814] font-bold shadow-glow-emerald transition-all"
              >
                Track in Student Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-emerald-900/40 text-xs text-slate-400">
              <p>
                An official confirmation summary has been logged. You may track this anytime using your Reference ID in the admissions portal.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#021814] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <GraduationCap className="w-4 h-4 text-emerald-400" /> NEXORA Centralized Admission Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Comprehensive Admission Application
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Apply seamlessly for verified undergraduate, postgraduate, and professional degree programs across Kerala universities and accredited institutions.
          </p>
        </div>

        {/* Multi-step progress bar */}
        <div className="bg-forest-900/80 border border-emerald-900/40 rounded-2xl p-4 sm:p-6 mb-8 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between overflow-x-auto pb-2 scrollbar-none">
            {steps.map((s, idx) => {
              const StepIcon = s.icon;
              const isCompleted = currentStep > s.number;
              const isCurrent = currentStep === s.number;

              return (
                <React.Fragment key={s.number}>
                  <div className="flex flex-col items-center min-w-[70px]">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? 'bg-emerald-500 text-[#021814] font-bold shadow-glow-emerald'
                          : isCurrent
                          ? 'bg-gradient-to-br from-emerald-400 to-forest-800 text-white border-2 border-emerald-400 shadow-glow-emerald scale-110'
                          : 'bg-forest-950/80 text-slate-400 border border-emerald-900/40'
                      }`}
                    >
                      {isCompleted ? <Check className="w-5 h-5 stroke-[3]" /> : <StepIcon className="w-4 h-4" />}
                    </div>
                    <span
                      className={`text-[11px] mt-1.5 font-medium whitespace-nowrap ${
                        isCurrent ? 'text-emerald-300 font-bold' : isCompleted ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {s.number}. {s.title}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 min-w-[20px] transition-all duration-300 ${
                        currentStep > idx + 1 ? 'bg-emerald-500' : 'bg-forest-850'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/70 border border-red-500/50 flex items-center gap-3 text-red-200 text-sm">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Main Form Container */}
        <form onSubmit={handleSubmit} className="bg-forest-900/90 border border-emerald-900/40 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          {/* STEP 1: PERSONAL DETAILS */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-emerald-900/40 pb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-400" /> Step 1: Personal Details
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Please provide your identity information exactly as printed on your SSLC / Secondary school record.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Applicant Full Name <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Anu Thomas"
                    className="w-full px-4 py-3 rounded-xl bg-[#021814] border border-emerald-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                  {fieldErrors.fullName && (
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {fieldErrors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Date of Birth <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-xl bg-[#021814] border border-emerald-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                  {fieldErrors.dob && (
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {fieldErrors.dob}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Gender <span className="text-emerald-400">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#021814] border border-emerald-900/50 text-white focus:outline-none focus:border-emerald-400 transition-colors"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Transgender">Transgender</option>
                    <option value="Other">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Nationality <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#021814] border border-emerald-900/50 text-white focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: CONTACT & ADDRESS */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-emerald-900/40 pb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Phone className="w-5 h-5 text-emerald-400" /> Step 2: Contact & Address
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Active mobile and email are used for admission counseling notifications and allotment letters.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Email Address <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="student@gmail.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#021814] border border-emerald-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                  {fieldErrors.email && (
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {fieldErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Mobile Number (10 Digits) <span className="text-emerald-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 text-xs text-emerald-400 font-semibold">+91</span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="9876543210"
                      maxLength={10}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#021814] border border-emerald-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                    />
                  </div>
                  {fieldErrors.phone && (
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {fieldErrors.phone}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    House Name / Street Address <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="House name, Door number, Street/Locality"
                    className="w-full px-4 py-3 rounded-xl bg-[#021814] border border-emerald-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                  {fieldErrors.address && (
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {fieldErrors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Place / Village / Town
                  </label>
                  <input
                    type="text"
                    name="place"
                    value={formData.place}
                    onChange={handleInputChange}
                    placeholder="e.g. Kazhakkoottam"
                    className="w-full px-4 py-3 rounded-xl bg-[#021814] border border-emerald-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    District <span className="text-emerald-400">*</span>
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#021814] border border-emerald-900/50 text-white focus:outline-none focus:border-emerald-400 transition-colors"
                  >
                    {[
                      'Alappuzha',
                      'Ernakulam',
                      'Idukki',
                      'Kannur',
                      'Kasaragod',
                      'Kollam',
                      'Kottayam',
                      'Kozhikode',
                      'Malappuram',
                      'Palakkad',
                      'Pathanamthitta',
                      'Thiruvananthapuram',
                      'Thrissur',
                      'Wayanad',
                    ].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#021814] border border-emerald-900/50 text-white focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    PIN Code (6 Digits)
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="695016"
                    maxLength={6}
                    className="w-full px-4 py-3 rounded-xl bg-[#021814] border border-emerald-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                  {fieldErrors.pincode && (
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {fieldErrors.pincode}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PARENT / GUARDIAN DETAILS */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-emerald-900/40 pb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" /> Step 3: Parent or Guardian Details
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Required for emergency contacts, verification, and state fee concession records.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Father's Full Name
                  </label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    placeholder="e.g. Thomas K."
                    className="w-full px-4 py-3 rounded-xl bg-[#021814] border border-emerald-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                  {fieldErrors.fatherName && (
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {fieldErrors.fatherName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Father's Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="fatherPhone"
                    value={formData.fatherPhone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile"
                    maxLength={10}
                    className="w-full px-4 py-3 rounded-xl bg-[#021814] border border-emerald-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                  {fieldErrors.fatherPhone && (
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {fieldErrors.fatherPhone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Mother's Full Name
                  </label>
                  <input
                    type="text"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleInputChange}
                    placeholder="e.g. Mariam Thomas"
                    className="w-full px-4 py-3 rounded-xl bg-[#021814] border border-emerald-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Mother's Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="motherPhone"
                    value={formData.motherPhone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile"
                    maxLength={10}
                    className="w-full px-4 py-3 rounded-xl bg-[#021814] border border-emerald-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                  {fieldErrors.motherPhone && (
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {fieldErrors.motherPhone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Guardian Name (if applicable)
                  </label>
                  <input
                    type="text"
                    name="guardianName"
                    value={formData.guardianName}
                    onChange={handleInputChange}
                    placeholder="Optional guardian name"
                    className="w-full px-4 py-3 rounded-xl bg-[#021814] border border-emerald-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Guardian Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="guardianPhone"
                    value={formData.guardianPhone}
                    onChange={handleInputChange}
                    placeholder="Optional 10-digit mobile"
                    maxLength={10}
                    className="w-full px-4 py-3 rounded-xl bg-[#021814] border border-emerald-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: EDUCATIONAL DETAILS */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-emerald-900/40 pb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-400" /> Step 4: Academic Records & Adaptive Qualifications
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Select your application level to adapt qualifying academic examination details.
                </p>
              </div>

              {/* Adaptive Mode Selector (UG vs PG) */}
              <div className="flex flex-col sm:flex-row gap-2 p-1.5 bg-[#021814] border border-emerald-900/60 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, qualificationLevel: 'UG' }))}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                    formData.qualificationLevel === 'UG'
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-glow-emerald'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Undergraduate / Engineering (10th + 12th + KEAM/JEE)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, qualificationLevel: 'PG' }))}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                    formData.qualificationLevel === 'PG'
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-glow-emerald'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Postgraduate / Master's (Bachelor's Degree + GATE/CAT)</span>
                </button>
              </div>

              {/* 10th Standard / SSLC Box */}
              <div className="p-5 rounded-2xl bg-[#021814]/70 border border-emerald-900/40 space-y-4">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Secondary School Leaving Certificate (SSLC / 10th Standard)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-300 mb-1">
                      School / Institution Name <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="sslcSchool"
                      value={formData.sslcSchool}
                      onChange={handleInputChange}
                      placeholder="e.g. St. Joseph's Higher Secondary School"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-forest-950 border border-emerald-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 text-sm"
                    />
                    {fieldErrors.sslcSchool && (
                      <p className="text-xs text-red-400 mt-1">{fieldErrors.sslcSchool}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Board of Examination</label>
                    <input
                      type="text"
                      name="sslcBoard"
                      value={formData.sslcBoard}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-forest-950 border border-emerald-900/50 text-white text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Passing Year</label>
                      <input
                        type="text"
                        name="sslcYear"
                        value={formData.sslcYear}
                        onChange={handleInputChange}
                        maxLength={4}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-forest-950 border border-emerald-900/50 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">
                        % or CGPA <span className="text-emerald-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="sslcPercentage"
                        value={formData.sslcPercentage}
                        onChange={handleInputChange}
                        placeholder="94.5%"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-forest-950 border border-emerald-900/50 text-white text-sm"
                      />
                      {fieldErrors.sslcPercentage && (
                        <p className="text-xs text-red-400 mt-1">{fieldErrors.sslcPercentage}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 12th Standard / Plus Two Box */}
              <div className="p-5 rounded-2xl bg-[#021814]/70 border border-emerald-900/40 space-y-4">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Higher Secondary / Plus Two (12th Standard)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-300 mb-1">
                      School / College Name <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="plusTwoSchool"
                      value={formData.plusTwoSchool}
                      onChange={handleInputChange}
                      placeholder="e.g. Model Higher Secondary School"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-forest-950 border border-emerald-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 text-sm"
                    />
                    {fieldErrors.plusTwoSchool && (
                      <p className="text-xs text-red-400 mt-1">{fieldErrors.plusTwoSchool}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Stream / Subjects</label>
                    <select
                      name="plusTwoStream"
                      value={formData.plusTwoStream}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-forest-950 border border-emerald-900/50 text-white text-sm"
                    >
                      <option value="Computer Science">Science with Computer Science</option>
                      <option value="Biology Science">Science with Biology (PCMB)</option>
                      <option value="Commerce">Commerce with Computer Application / Maths</option>
                      <option value="Humanities">Humanities / Arts</option>
                      <option value="Diploma">Polytechnic Diploma</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Board of Examination</label>
                    <input
                      type="text"
                      name="plusTwoBoard"
                      value={formData.plusTwoBoard}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-forest-950 border border-emerald-900/50 text-white text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:col-span-2">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Passing Year</label>
                      <input
                        type="text"
                        name="plusTwoYear"
                        value={formData.plusTwoYear}
                        onChange={handleInputChange}
                        maxLength={4}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-forest-950 border border-emerald-900/50 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">
                        % or Marks <span className="text-emerald-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="plusTwoPercentage"
                        value={formData.plusTwoPercentage}
                        onChange={handleInputChange}
                        placeholder="92.0%"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-forest-950 border border-emerald-900/50 text-white text-sm"
                      />
                      {fieldErrors.plusTwoPercentage && (
                        <p className="text-xs text-red-400 mt-1">{fieldErrors.plusTwoPercentage}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Adaptive PG Details Box when PG is chosen */}
              {formData.qualificationLevel === 'PG' && (
                <div className="p-5 rounded-2xl bg-[#021814]/70 border border-emerald-500/40 space-y-4 animate-fadeIn">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" /> Bachelor's Qualifying Degree (Undergraduate)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-slate-300 mb-1">
                        Degree Program & Branch (e.g. B.Tech CSE, B.Sc Physics, BCA, B.Com)
                      </label>
                      <input
                        type="text"
                        name="ugDegreeTitle"
                        value={formData.ugDegreeTitle}
                        onChange={handleInputChange}
                        placeholder="e.g. B.Tech Computer Science & Engineering"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-forest-950 border border-emerald-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Graduating University / Institute</label>
                      <input
                        type="text"
                        name="ugUniversity"
                        value={formData.ugUniversity}
                        onChange={handleInputChange}
                        placeholder="e.g. APJ Abdul Kalam Technological University"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-forest-950 border border-emerald-900/50 text-white text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Year of Graduation</label>
                        <input
                          type="text"
                          name="ugPassingYear"
                          value={formData.ugPassingYear}
                          onChange={handleInputChange}
                          placeholder="2025"
                          maxLength={4}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-forest-950 border border-emerald-900/50 text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Degree CGPA / %</label>
                        <input
                          type="text"
                          name="ugCgpaOrPercentage"
                          value={formData.ugCgpaOrPercentage}
                          onChange={handleInputChange}
                          placeholder="8.75 CGPA"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-forest-950 border border-emerald-900/50 text-white text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Entrance Exam Details Box */}
              <div className="p-5 rounded-2xl bg-[#021814]/70 border border-emerald-900/40 space-y-4">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  State / National Entrance Examination
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Entrance Examination</label>
                    <select
                      name="entranceExamName"
                      value={formData.entranceExamName}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-forest-950 border border-emerald-900/50 text-white text-sm"
                    >
                      <option value="KEAM (Kerala Engineering Entrance)">KEAM (Kerala Engineering Entrance)</option>
                      <option value="JEE Main">JEE Main / JEE Advanced</option>
                      <option value="CUSAT CAT">CUSAT CAT (Common Admission Test)</option>
                      <option value="GATE">GATE (Graduate Aptitude Test in Engineering)</option>
                      <option value="CAT / CMAT / KMAT">CAT / CMAT / KMAT (Management)</option>
                      <option value="University CAP Merit">Centralized Allotment Process (CAP Merit)</option>
                      <option value="Direct / Non-Entrance">Direct Qualifying Examination Merit</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Entrance Roll No. / State Rank</label>
                    <input
                      type="text"
                      name="entranceRollOrRank"
                      value={formData.entranceRollOrRank}
                      onChange={handleInputChange}
                      placeholder="e.g. KEAM Rank 3450 or JEE 94.2 %ile"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-forest-950 border border-emerald-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: ADMISSION PREFERENCES */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-emerald-900/40 pb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Building className="w-5 h-5 text-emerald-400" /> Step 5: Admission Preferences & Course Selection
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Cascading selection: Select your target University, affiliated College, and Degree Program.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* 1. Target University */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    1. Target University Affiliation <span className="text-emerald-400">*</span>
                  </label>
                  <select
                    name="targetUniversity"
                    value={formData.targetUniversity}
                    onChange={(e) => {
                      const newUni = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        targetUniversity: newUni,
                        institutionId: '',
                        institutionName: '',
                        courseId: '',
                        courseTitle: '',
                      }));
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-[#021814] border border-emerald-900/50 text-white focus:outline-none focus:border-emerald-400 transition-colors"
                  >
                    <option value="All">-- All Kerala Universities --</option>
                    <option value="APJ Abdul Kalam Technological University (KTU)">APJ Abdul Kalam Technological University (KTU)</option>
                    <option value="University of Calicut">University of Calicut</option>
                    <option value="Mahatma Gandhi University">Mahatma Gandhi University (MGU)</option>
                    <option value="University of Kerala">University of Kerala</option>
                    <option value="Cochin University of Science and Technology (CUSAT)">Cochin University of Science and Technology (CUSAT)</option>
                    <option value="Kannur University">Kannur University</option>
                  </select>
                </div>

                {/* 2. Target College */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    2. Select Affiliated College / Institution <span className="text-emerald-400">*</span>
                  </label>
                  <select
                    name="institutionId"
                    value={formData.institutionId}
                    onChange={(e) => {
                      const newInstId = e.target.value;
                      const foundInst = institutions.find((i) => i.id === newInstId);
                      setFormData((prev) => ({
                        ...prev,
                        institutionId: newInstId,
                        institutionName: foundInst ? foundInst.name : '',
                        courseId: '',
                        courseTitle: '',
                      }));
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-[#021814] border border-emerald-900/50 text-white focus:outline-none focus:border-emerald-400 transition-colors"
                  >
                    <option value="">-- Choose from Verified Institution Directory ({filteredColleges.length} institutions available) --</option>
                    {filteredColleges.map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.name} ({inst.city}, {inst.institutionType})
                      </option>
                    ))}
                  </select>
                  {fieldErrors.institutionId && (
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {fieldErrors.institutionId}
                    </p>
                  )}
                </div>

                {/* 3. Target Course */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    3. Degree Course / Program <span className="text-emerald-400">*</span>
                  </label>
                  <select
                    name="courseId"
                    value={formData.courseId}
                    onChange={handleInputChange}
                    disabled={!formData.institutionId}
                    className={`w-full px-4 py-3 rounded-xl bg-[#021814] border border-emerald-900/50 text-white focus:outline-none focus:border-emerald-400 transition-colors ${
                      !formData.institutionId ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="">
                      {!formData.institutionId
                        ? '-- Please select an institution first --'
                        : `-- Select Course (${filteredCourses.length} available) --`}
                    </option>
                    {filteredCourses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({c.level}) - {c.code}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.courseId && (
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {fieldErrors.courseId}
                    </p>
                  )}
                </div>

                {/* 4. Course Details Preview Banner when course selected */}
                {selectedCourseDetails && (
                  <div className="sm:col-span-2 p-5 rounded-2xl bg-[#011410] border border-emerald-500/40 space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-emerald-900/60 pb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                          Verified Course Information & Eligibility
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {selectedCourseDetails.level} • {selectedCourseDetails.code}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-[#021814] border border-emerald-900/40">
                        <p className="text-slate-400 text-[11px]">Duration & Semesters</p>
                        <p className="text-white font-bold mt-0.5">
                          {selectedCourseDetails.durationYears || (selectedCourseDetails.level === 'POSTGRADUATE' ? 2 : 4)} Years ({((selectedCourseDetails.durationYears || (selectedCourseDetails.level === 'POSTGRADUATE' ? 2 : 4)) * 2)} Semesters)
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-[#021814] border border-emerald-900/40">
                        <p className="text-slate-400 text-[11px]">Admission Method</p>
                        <p className="text-white font-bold mt-0.5">
                          {selectedCourseDetails.admissionProcess || 'Merit / State Allotment'}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-[#021814] border border-emerald-900/40">
                        <p className="text-slate-400 text-[11px]">Fee Verification</p>
                        <p className="text-emerald-400 font-bold mt-0.5">
                          {selectedCourseDetails.fees && selectedCourseDetails.fees[0]
                            ? `₹${selectedCourseDetails.fees[0].totalFee.toLocaleString()} / Year`
                            : 'Government Regulated Fee'}
                        </p>
                      </div>
                    </div>

                    {selectedCourseDetails.eligibility && (
                      <div className="pt-2 text-xs">
                        <span className="text-slate-400 font-semibold">Eligibility Requirement: </span>
                        <span className="text-slate-200">{selectedCourseDetails.eligibility}</span>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    name="academicYear"
                    value={formData.academicYear}
                    readOnly
                    className="w-full px-4 py-3 rounded-xl bg-[#021814] border border-emerald-900/50 text-emerald-300 font-semibold cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Admission Category / Quota
                  </label>
                  <select
                    name="admissionType"
                    value={formData.admissionType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#021814] border border-emerald-900/50 text-white focus:outline-none focus:border-emerald-400 transition-colors"
                  >
                    <option value="Merit">State Centralized Merit (KEAM / CAP)</option>
                    <option value="Management">Management Quota</option>
                    <option value="NRI">NRI / OCI Quota</option>
                    <option value="Lateral Entry">Lateral Entry (Direct 2nd Year)</option>
                    <option value="Sports/Cultural">Sports / Cultural Quota</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Second Preference Course (Optional)
                  </label>
                  <input
                    type="text"
                    name="additionalPreference"
                    value={formData.additionalPreference}
                    onChange={handleInputChange}
                    placeholder="e.g. B.Tech Electronics & Communication or B.Sc Data Analytics"
                    className="w-full px-4 py-3 rounded-xl bg-[#021814] border border-emerald-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: DOCUMENTS UPLOAD */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-emerald-900/40 pb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Upload className="w-5 h-5 text-emerald-400" /> Step 6: Certificate & Document Attachments
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Upload PDF or clear image files (Max 5MB each). Uploading now speeds up institution verification.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'photo', label: 'Passport Size Photograph', req: true },
                  { key: 'sslc', label: 'SSLC / 10th Certificate', req: true },
                  { key: 'plusTwo', label: 'Plus Two / 12th Marksheet', req: true },
                  { key: 'tc', label: 'Transfer Certificate (TC)', req: false },
                  { key: 'conduct', label: 'Conduct Certificate', req: false },
                  { key: 'entranceScorecard', label: 'Entrance Scorecard (KEAM/JEE)', req: false },
                  { key: 'categoryCert', label: 'Caste / Community Certificate', req: false },
                ].map((doc) => {
                  const docKey = doc.key as keyof FormData['documents'];
                  const uploadedName = formData.documents[docKey];

                  return (
                    <div
                      key={doc.key}
                      className="p-4 rounded-xl bg-[#021814]/70 border border-emerald-900/40 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-white">
                            {doc.label} {doc.req && <span className="text-emerald-400">*</span>}
                          </span>
                          {uploadedName && (
                            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Attached
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mb-3">
                          {uploadedName || 'PDF or JPG/PNG (Up to 5MB)'}
                        </p>
                      </div>

                      <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-forest-850 hover:bg-forest-800 border border-emerald-500/20 text-xs font-medium text-emerald-300 transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        {uploadedName ? 'Change File' : 'Choose File'}
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(docKey, e)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 7: REVIEW AND SUBMIT */}
          {currentStep === 7 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-emerald-900/40 pb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" /> Step 7: Application Summary & Declaration
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Please review all entered details carefully. You may click 'Edit' to make changes before final submission.
                </p>
              </div>

              {/* Review Section 1: Candidate & Contact */}
              <div className="p-5 rounded-2xl bg-[#021814]/70 border border-emerald-900/40">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-900/30 mb-3">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-4 h-4" /> Personal & Contact Details
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs text-emerald-300 hover:underline font-medium"
                  >
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4 text-xs">
                  <div>
                    <span className="text-slate-400 block">Full Name:</span>
                    <span className="text-white font-semibold">{formData.fullName || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Date of Birth:</span>
                    <span className="text-white font-semibold">{formData.dob || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Gender:</span>
                    <span className="text-white font-semibold">{formData.gender}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Email:</span>
                    <span className="text-white font-semibold">{formData.email || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Mobile:</span>
                    <span className="text-white font-semibold">+91 {formData.phone || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">District & State:</span>
                    <span className="text-white font-semibold">
                      {formData.district}, {formData.state}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block">Permanent Address:</span>
                    <span className="text-white font-semibold">
                      {formData.address}
                      {formData.place ? `, ${formData.place}` : ''}
                      {formData.pincode ? ` - ${formData.pincode}` : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Review Section 2: Academic Record */}
              <div className="p-5 rounded-2xl bg-[#021814]/70 border border-emerald-900/40">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-900/30 mb-3">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" /> Academic Records
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="text-xs text-emerald-300 hover:underline font-medium"
                  >
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-forest-950/70 border border-emerald-900/30">
                    <span className="font-semibold text-emerald-300 block mb-1">10th / SSLC</span>
                    <p className="text-slate-300 truncate">{formData.sslcSchool || 'Not provided'}</p>
                    <p className="text-slate-400 mt-1">
                      {formData.sslcBoard} • {formData.sslcYear} • Score: {formData.sslcPercentage}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-forest-950/70 border border-emerald-900/30">
                    <span className="font-semibold text-emerald-300 block mb-1">12th / Plus Two</span>
                    <p className="text-slate-300 truncate">{formData.plusTwoSchool || 'Not provided'}</p>
                    <p className="text-slate-400 mt-1">
                      {formData.plusTwoStream} • {formData.plusTwoYear} • Score: {formData.plusTwoPercentage}
                    </p>
                  </div>
                </div>
              </div>

              {/* Review Section 3: Preference Choice */}
              <div className="p-5 rounded-2xl bg-[#021814]/70 border border-emerald-900/40">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-900/30 mb-3">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Building className="w-4 h-4" /> Admission Program Preference
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(5)}
                    className="text-xs text-emerald-300 hover:underline font-medium"
                  >
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 text-xs">
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block">Chosen Institution:</span>
                    <span className="text-white font-bold text-sm">
                      {formData.institutionName || 'Target Institution Selected'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Degree Course:</span>
                    <span className="text-emerald-300 font-bold text-sm">
                      {formData.courseTitle || 'Selected Program'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Academic Intake:</span>
                    <span className="text-white font-semibold">{formData.academicYear} ({formData.admissionType})</span>
                  </div>
                  {formData.additionalPreference && (
                    <div className="sm:col-span-2">
                      <span className="text-slate-400 block">Second Preference:</span>
                      <span className="text-slate-200">{formData.additionalPreference}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Review Section 4: Documents Summary */}
              <div className="p-4 rounded-xl bg-[#021814]/70 border border-emerald-900/40">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">
                  Uploaded Certificates
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  {Object.entries(formData.documents).map(([key, val]) => (
                    <span
                      key={key}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-forest-800 text-slate-200 border border-emerald-500/20"
                    >
                      <CheckCircle className="w-3 h-3 text-emerald-400" /> {key}: {val}
                    </span>
                  ))}
                  {Object.keys(formData.documents).length === 0 && (
                    <span className="text-slate-400 text-xs">No digital files attached (may be submitted physically during counseling).</span>
                  )}
                </div>
              </div>

              {/* Formal Declaration Checkbox */}
              <div className="p-5 rounded-2xl bg-forest-950 border border-emerald-500/30 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="declarationAgreed"
                    checked={formData.declarationAgreed}
                    onChange={handleCheckboxChange}
                    className="mt-1 w-4 h-4 text-emerald-500 rounded border-emerald-900 bg-[#021814] focus:ring-emerald-400"
                  />
                  <span className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-white">Applicant Declaration:</strong> I hereby declare that all statements made in this application are true, complete, and correct to the best of my knowledge and belief. I understand that any false statement or suppression of material facts will lead to disqualification from the admission process or cancellation of admission at any stage without notice.
                  </span>
                </label>
                {fieldErrors.declarationAgreed && (
                  <p className="text-xs text-red-400 pl-7 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {fieldErrors.declarationAgreed}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Navigation & Submission Controls */}
          <div className="mt-8 pt-6 border-t border-emerald-900/40 flex items-center justify-between gap-4">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-950 hover:bg-forest-850 text-slate-300 hover:text-white font-medium border border-emerald-900/50 transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>
            ) : (
              <div />
            )}

            {currentStep < 7 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-forest-700 hover:from-emerald-400 hover:to-forest-600 text-[#021814] font-bold shadow-glow-emerald transition-all text-sm"
              >
                Save & Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-300 hover:to-emerald-500 text-[#021814] font-extrabold shadow-glow-emerald transition-all text-base disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#021814] border-t-transparent rounded-full animate-spin"></span>
                    Recording in Registry...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" /> Submit Application
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Admission;
