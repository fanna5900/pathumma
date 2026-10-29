import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Building2,
  BookOpen,
  DollarSign,
  FileCheck,
  Activity,
  Settings,
  LogOut,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  UserX,
  UserCheck,
  Sparkles,
  Lock,
  ArrowRight,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { User, Institution } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'METRICS' | 'USERS' | 'VERIFICATIONS' | 'ADMISSIONS' | 'AUDIT_LOGS' | 'SETTINGS'>('METRICS');
  const [metrics, setMetrics] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [verificationsList, setVerificationsList] = useState<Institution[]>([]);
  const [admissionsList, setAdmissionsList] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [settingsList, setSettingsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // User filters
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [userSearch, setUserSearch] = useState('');
  const [admissionStatusFilter, setAdmissionStatusFilter] = useState('All');

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [metricsRes, usersRes, verifRes, auditRes, settingsRes, admissionsRes] = await Promise.all([
        api.get('/admin/metrics'),
        api.get('/admin/users'),
        api.get('/admin/verifications'),
        api.get('/admin/audit-logs'),
        api.get('/admin/settings'),
        api.get('/admissions/my-applications'),
      ]);

      if (metricsRes.data.success) setMetrics(metricsRes.data.data);
      if (usersRes.data.success) setUsersList(usersRes.data.data);
      if (verifRes.data.success) setVerificationsList(verifRes.data.data);
      if (auditRes.data.success) setAuditLogs(auditRes.data.data);
      if (settingsRes.data.success) setSettingsList(settingsRes.data.data);
      if (admissionsRes.data.success) setAdmissionsList(admissionsRes.data.data);
    } catch (err) {
      console.error('Admin dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const res = await api.put(`/admin/users/${userId}/status`, {
        status: newStatus,
        reason: 'Administrative oversight action',
      });
      if (res.data.success) {
        setUsersList((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
        );
        loadAdminData(); // Refresh audit logs
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update user status.');
    }
  };

  const handleUpdateVerification = async (instId: string, status: string) => {
    try {
      const res = await api.put(`/admin/verifications/${instId}`, { status });
      if (res.data.success) {
        setVerificationsList((prev) =>
          prev.map((i) => (i.id === instId ? { ...i, verificationStatus: status as any } : i))
        );
        loadAdminData();
      }
    } catch (err) {
      alert('Failed to update verification status.');
    }
  };

  const handleUpdateApplicationStatus = async (appId: string, status: string) => {
    try {
      const res = await api.put(`/admissions/${appId}/status`, { status });
      if (res.data.success) {
        setAdmissionsList((prev) =>
          prev.map((app) => (app.id === appId ? { ...app, status } : app))
        );
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update application status.');
    }
  };

  const handleExportApplicationsCSV = () => {
    if (admissionsList.length === 0) {
      alert('No admission records to export.');
      return;
    }
    const headers = ['Application Number', 'Applicant Name', 'Email', 'Phone', 'Institution', 'Course', 'Status', 'Date'];
    const rows = admissionsList.map((app) => [
      app.applicationNumber,
      `"${app.applicantName || app.student?.studentProfile?.fullName || 'N/A'}"`,
      app.email || app.student?.email || 'N/A',
      app.phone || 'N/A',
      `"${app.institution?.name || 'N/A'}"`,
      `"${app.course?.title || 'N/A'}"`,
      app.status,
      app.submissionDate || app.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NEXORA_Admissions_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = usersList.filter((u) => {
    const roleMatch = userRoleFilter === 'All' || u.role === userRoleFilter;
    const searchMatch =
      !userSearch.trim() ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.username.toLowerCase().includes(userSearch.toLowerCase());
    return roleMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-[#021814] text-slate-100 pt-24 pb-16 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#011411] border-r border-emerald-950/80 p-5 hidden md:flex flex-col justify-between flex-shrink-0">
        <div className="space-y-6">
          <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-800/50 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/30 border border-amber-400/30 flex items-center justify-center font-bold text-amber-300 text-sm">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div className="truncate">
              <h4 className="text-xs font-bold text-white truncate">{user?.username}</h4>
              <span className="text-[10px] text-amber-300 font-semibold px-2 py-0.5 rounded-full bg-amber-950 border border-amber-800">
                PLATFORM ADMIN
              </span>
            </div>
          </div>

          <nav className="space-y-1 text-xs">
            <button
              onClick={() => setActiveTab('METRICS')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === 'METRICS'
                  ? 'bg-amber-600 text-slate-950 font-bold shadow-glow-gold'
                  : 'text-slate-400 hover:text-white hover:bg-forest-900/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Real-Time Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('USERS')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === 'USERS'
                  ? 'bg-amber-600 text-slate-950 font-bold shadow-glow-gold'
                  : 'text-slate-400 hover:text-white hover:bg-forest-900/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>User Directory & Status</span>
            </button>

            <button
              onClick={() => setActiveTab('VERIFICATIONS')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === 'VERIFICATIONS'
                  ? 'bg-amber-600 text-slate-950 font-bold shadow-glow-gold'
                  : 'text-slate-400 hover:text-white hover:bg-forest-900/60'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Institution Verification</span>
            </button>

            <button
              onClick={() => setActiveTab('ADMISSIONS')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === 'ADMISSIONS'
                  ? 'bg-amber-600 text-slate-950 font-bold shadow-glow-gold'
                  : 'text-slate-400 hover:text-white hover:bg-forest-900/60'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>Admission Registry ({admissionsList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('AUDIT_LOGS')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === 'AUDIT_LOGS'
                  ? 'bg-amber-600 text-slate-950 font-bold shadow-glow-gold'
                  : 'text-slate-400 hover:text-white hover:bg-forest-900/60'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Governance Audit Trail</span>
            </button>

            <button
              onClick={() => setActiveTab('SETTINGS')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === 'SETTINGS'
                  ? 'bg-amber-600 text-slate-950 font-bold shadow-glow-gold'
                  : 'text-slate-400 hover:text-white hover:bg-forest-900/60'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Platform Settings</span>
            </button>
          </nav>
        </div>

        <button
          onClick={logout}
          className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-rose-400 hover:bg-rose-950/40 transition-colors text-xs font-semibold"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-6xl mx-auto space-y-8">
        {/* Header Hero */}
        <div className="rounded-3xl glass-panel bg-gradient-to-r from-[#291e03] via-[#332404] to-[#021814] border border-amber-500/40 p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Enterprise Platform Administration
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1">
                Governance Control Center
              </h1>
              <p className="text-xs text-amber-200">
                Operating with zero mock metrics • Database-driven governance & security
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-amber-950/60 border border-amber-800/60 text-xs text-amber-300">
              <span className="font-bold block">Engine Health: ONLINE</span>
              <span className="text-[10px] text-amber-200/70">{metrics?.systemHealth?.aiProviderStatus || 'Active'}</span>
            </div>
          </div>
        </div>

        {/* Tab 1: Real-time Analytics & Metrics */}
        {activeTab === 'METRICS' && metrics && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl glass-panel border border-emerald-900/50 space-y-1">
                <span className="text-xs text-slate-400">Total Registered Users</span>
                <p className="text-3xl font-extrabold text-emerald-400 font-display">{metrics.totalUsers}</p>
                <span className="text-[10px] text-slate-500">Live PostgreSQL/SQLite rows</span>
              </div>

              <div className="p-5 rounded-2xl glass-panel border border-emerald-900/50 space-y-1">
                <span className="text-xs text-slate-400">Verified Institutions</span>
                <p className="text-3xl font-extrabold text-teal-400 font-display">{metrics.totalInstitutions}</p>
                <span className="text-[10px] text-slate-500">Kerala, Karnataka, TN, DL</span>
              </div>

              <div className="p-5 rounded-2xl glass-panel border border-emerald-900/50 space-y-1">
                <span className="text-xs text-slate-400">Academic Courses</span>
                <p className="text-3xl font-extrabold text-mint-400 font-display">{metrics.totalCourses}</p>
                <span className="text-[10px] text-slate-500">With verified fee schedules</span>
              </div>

              <div className="p-5 rounded-2xl glass-panel border border-emerald-900/50 space-y-1">
                <span className="text-xs text-slate-400">Audit Trail Events</span>
                <p className="text-3xl font-extrabold text-gold-400 font-display">{metrics.totalAuditLogs}</p>
                <span className="text-[10px] text-slate-500">Immutable governance records</span>
              </div>
            </div>

            {/* Role Breakdown & Recent Audit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-3xl glass-panel p-6 border border-emerald-900/60 space-y-4">
                <h3 className="text-base font-bold text-white">Role Distribution</h3>
                <div className="space-y-2 text-xs">
                  {metrics.roleDistribution?.map((r: any) => (
                    <div key={r.role} className="flex items-center justify-between p-3 rounded-xl bg-forest-950">
                      <span className="font-semibold text-white">{r.role}</span>
                      <span className="font-bold text-emerald-400">{r.count} Accounts</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl glass-panel p-6 border border-emerald-900/60 space-y-4">
                <h3 className="text-base font-bold text-white">Recent Governance Actions</h3>
                <div className="space-y-2 text-xs">
                  {metrics.recentAuditLogs?.slice(0, 4).map((log: any) => (
                    <div key={log.id} className="p-3 rounded-xl bg-forest-950 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-amber-300">{log.action}</span>
                        <p className="text-slate-400 text-[11px] truncate max-w-xs">{log.details}</p>
                      </div>
                      <span className="text-[10px] text-slate-500 flex-shrink-0">
                        {new Date(log.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: User Directory */}
        {activeTab === 'USERS' && (
          <div className="rounded-3xl glass-panel p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-display text-white">User Management & Status Controls</h2>
                <p className="text-xs text-slate-400">Search users, review permissions, activate or suspend accounts.</p>
              </div>

              <div className="flex items-center gap-2">
                {['All', 'STUDENT', 'FACULTY', 'UNIVERSITY', 'ADMIN'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setUserRoleFilter(r)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      userRoleFilter === r
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-forest-900 text-slate-300 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-emerald-900 text-slate-400 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Username / Identity</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Account Status</th>
                    <th className="py-3 px-4 text-right">Administrative Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-950">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-forest-950/40">
                      <td className="py-3 px-4 font-bold text-white">{u.username}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-forest-900 text-slate-300">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{u.email}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.status === 'ACTIVE'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {u.id !== user?.id && (
                          <button
                            onClick={() => handleToggleUserStatus(u.id, u.status)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                              u.status === 'ACTIVE'
                                ? 'bg-rose-950 text-rose-300 hover:bg-rose-900'
                                : 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900'
                            }`}
                          >
                            {u.status === 'ACTIVE' ? 'Suspend Account' : 'Restore Account'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Verifications */}
        {activeTab === 'VERIFICATIONS' && (
          <div className="rounded-3xl glass-panel p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold font-display text-white">Institution Verification Queues</h2>
            <div className="space-y-4">
              {verificationsList.map((inst) => (
                <div key={inst.id} className="p-5 rounded-2xl bg-forest-950 border border-emerald-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div>
                    <h4 className="text-sm font-bold text-white">{inst.name}</h4>
                    <p className="text-slate-400">{inst.city}, {inst.state} • {inst.institutionType}</p>
                    <p className="text-emerald-400 text-[11px] mt-1">Official Website: {inst.officialWebsite}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateVerification(inst.id, 'VERIFIED')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                    >
                      Approve (Verified Seal)
                    </button>
                    <button
                      onClick={() => handleUpdateVerification(inst.id, 'UNVERIFIED')}
                      className="px-3 py-1.5 rounded-lg bg-rose-950 text-rose-300 hover:bg-rose-900 font-bold"
                    >
                      Revoke Verification
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3.5: Admission Applications */}
        {activeTab === 'ADMISSIONS' && (
          <div className="rounded-3xl glass-panel p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-display text-white">Centralized Admission Applications</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage student application submissions, verify certificate uploads, and update status in real time.
                </p>
              </div>

              <button
                onClick={handleExportApplicationsCSV}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-glow-gold"
              >
                <span>Export Applications to CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-emerald-900 text-slate-400 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Ref Number</th>
                    <th className="py-3 px-4">Applicant</th>
                    <th className="py-3 px-4">Target Institution & Course</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Current Status</th>
                    <th className="py-3 px-4 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-950">
                  {admissionsList.map((app) => (
                    <tr key={app.id} className="hover:bg-forest-950/40">
                      <td className="py-3 px-4 font-mono font-bold text-emerald-300">
                        {app.applicationNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">
                          {app.applicantName || app.student?.studentProfile?.fullName || 'Direct Applicant'}
                        </div>
                        <div className="text-[11px] text-slate-400">{app.email || app.student?.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-white font-medium">{app.institution?.name}</div>
                        <div className="text-[11px] text-emerald-400">{app.course?.title}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(app.submissionDate || app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            app.status === 'ACCEPTED'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : app.status === 'REJECTED'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <select
                          value={app.status}
                          onChange={(e) => handleUpdateApplicationStatus(app.id, e.target.value)}
                          className="px-2.5 py-1 rounded-lg bg-forest-900 border border-emerald-800/60 text-xs text-white focus:outline-none"
                        >
                          <option value="SUBMITTED">SUBMITTED</option>
                          <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                          <option value="ACCEPTED">ACCEPTED</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {admissionsList.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No admission applications submitted yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Audit Logs */}
        {activeTab === 'AUDIT_LOGS' && (
          <div className="rounded-3xl glass-panel p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold font-display text-white">Governance Audit Trail</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-emerald-900 text-slate-400 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Target Entity</th>
                    <th className="py-3 px-4">Details</th>
                    <th className="py-3 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-950">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-forest-950/40">
                      <td className="py-3 px-4 font-bold text-amber-300">{log.action}</td>
                      <td className="py-3 px-4 text-slate-300">{log.actor?.username || 'SYSTEM'}</td>
                      <td className="py-3 px-4 text-slate-400">{log.targetType}</td>
                      <td className="py-3 px-4 text-slate-300 max-w-sm truncate">{log.details}</td>
                      <td className="py-3 px-4 text-slate-500">{new Date(log.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Settings */}
        {activeTab === 'SETTINGS' && (
          <div className="rounded-3xl glass-panel p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold font-display text-white">Platform Settings & Policies</h2>
            <div className="space-y-3">
              {settingsList.map((st) => (
                <div key={st.id} className="p-4 rounded-xl bg-forest-950 border border-emerald-900/50 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-white">{st.key}</h4>
                    <p className="text-slate-400">{st.description}</p>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold bg-forest-900 px-3 py-1 rounded-lg">
                    {st.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
