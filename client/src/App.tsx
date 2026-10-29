import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingAIAssistant from './components/FloatingAIAssistant';
import ProtectedRoute from './components/ProtectedRoute';

// Public & Discovery Pages
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import Login from './pages/Login';
import Register from './pages/Register';
import Universities from './pages/Universities';
import Colleges from './pages/Colleges';
import Schools from './pages/Schools';
import CollegeDetail from './pages/CollegeDetail';
import Courses from './pages/Courses';
import Admission from './pages/Admission';
import Contact from './pages/Contact';
import StudyResources from './pages/StudyResources';
import StudyPartners from './pages/StudyPartners';
import AIAssistantPage from './pages/AIAssistantPage';
import Community from './pages/Community';

// Role Dashboards
import StudentDashboard from './pages/dashboard/StudentDashboard';
import FacultyDashboard from './pages/dashboard/FacultyDashboard';
import UniversityDashboard from './pages/dashboard/UniversityDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isDashboard =
    location.pathname.startsWith('/student') ||
    location.pathname.startsWith('/faculty') ||
    location.pathname.startsWith('/university') ||
    location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#021814] text-slate-100">
      <Navbar />

      <div className="flex-1">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/universities" element={<Universities />} />
          <Route path="/colleges" element={<Colleges />} />
          <Route path="/schools" element={<Schools />} />
          <Route path="/schools/:id" element={<CollegeDetail />} />
          <Route path="/colleges/:id" element={<CollegeDetail />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/admission" element={<Admission />} />
          <Route path="/admissions" element={<Admission />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/study-resources" element={<StudyResources />} />
          <Route path="/study-partners" element={<StudyPartners />} />
          <Route path="/ai-assistant" element={<AIAssistantPage />} />
          <Route path="/community" element={<Community />} />

          {/* Protected Role-Specific Dashboards */}
          <Route
            path="/student/*"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/faculty/*"
            element={
              <ProtectedRoute allowedRoles={['FACULTY']}>
                <FacultyDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/university/*"
            element={
              <ProtectedRoute allowedRoles={['UNIVERSITY']}>
                <UniversityDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>

      {/* Floating Global AI Assistant */}
      <FloatingAIAssistant />

      {/* Render Footer only on non-dashboard views */}
      {!isDashboard && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
};

export default App;
