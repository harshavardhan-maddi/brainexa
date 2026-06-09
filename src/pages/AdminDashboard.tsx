import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Shield, LogOut, Search, Filter, 
  Trash2, Unlock, Lock, RefreshCw, Download,
  Calendar, Clock, BookOpen, ChevronDown, FileText, CheckCircle, X,
  Plus, Building, Key
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/api-config";
import { supabase } from "@/lib/supabase";


interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  is_blocked: boolean;
  study_progress: number;
  study_start_date: string | null;
  study_end_date: string | null;
  status: 'Active' | 'At Risk' | 'Struggling' | 'High Performer' | 'Standard';
  subjects: string[];
  last_login: string | null;
  last_logout: string | null;
  institute: string | null;
  added_by?: string | null;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [subAdmins, setSubAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [instituteFilter, setInstituteFilter] = useState("");
  const [activeTab, setActiveTab] = useState<'students' | 'sub_admins'>('students');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const navigate = useNavigate();

  // Modals
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: "", email: "", password: "", institute: "" });
  
  const [showAddSubAdminModal, setShowAddSubAdminModal] = useState(false);
  const [newSubAdmin, setNewSubAdmin] = useState({ name: "", email: "", password: "", institute: "" });

  const admin = JSON.parse(sessionStorage.getItem("adminUser") || "null");

  useEffect(() => {
    if (!admin || (admin.role !== 'admin' && admin.role !== 'sub_admin') || !admin.id) {
      sessionStorage.removeItem("adminUser");
      navigate("/admin-login");
      return;
    }
    fetchUsers();
    if (admin.role === 'admin') {
      fetchSubAdmins();
    }
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    console.log("🚀 Admin: Fetching students...");
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: { "x-user-id": admin.id }
      });
      const data = await res.json();
      console.log("📊 Admin: Received data:", data);
      if (data.success) {
        setUsers(data.users);
      } else {
        console.error("❌ Admin: Fetch failed:", data.error);
        toast.error(data.error || "Failed to fetch students");
      }
    } catch (error) {
      console.error("🔥 Admin: Network error:", error);
      toast.error("Failed to fetch students. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubAdmins = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/sub-admins`, {
        headers: { "x-user-id": admin.id }
      });
      const data = await res.json();
      if (data.success) {
        setSubAdmins(data.subAdmins);
      }
    } catch (error) {
      console.error("Failed to fetch sub-admins:", error);
    }
  };

  const handleCreateSubAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubAdmin.name || !newSubAdmin.email || !newSubAdmin.password || !newSubAdmin.institute) {
      toast.error("All fields are required");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/create-sub-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": admin.id
        },
        body: JSON.stringify(newSubAdmin)
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Sub-admin created successfully!");
        setShowAddSubAdminModal(false);
        setNewSubAdmin({ name: "", email: "", password: "", institute: "" });
        fetchSubAdmins();
      } else {
        toast.error(data.error || "Failed to create sub-admin");
      }
    } catch (err) {
      toast.error("Error connecting to server");
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const inst = admin.role === 'sub_admin' ? admin.institute : newStudent.institute;
    if (!newStudent.name || !newStudent.email || !newStudent.password || !inst) {
      toast.error("All fields are required");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/create-student`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": admin.id
        },
        body: JSON.stringify({
          ...newStudent,
          institute: inst
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Premium student created successfully!");
        setShowAddStudentModal(false);
        setNewStudent({ name: "", email: "", password: "", institute: "" });
        fetchUsers();
      } else {
        toast.error(data.error || "Failed to create student");
      }
    } catch (err) {
      toast.error("Error connecting to server");
    }
  };

  const fetchUserReport = async (userId: string) => {
    try {
      const query = new URLSearchParams({
        start: dateRange.start,
        end: dateRange.end
      }).toString();
      
      const res = await fetch(`${API_BASE_URL}/api/admin/user/${userId}/report?${query}`, {
        headers: { "x-user-id": admin.id }
      });
      const data = await res.json();
      if (data.success) setReportData(data.report);
    } catch (error) {
      toast.error("Failed to fetch report");
    }
  };

  const downloadReport = (user: User) => {
    if (!reportData) return;
    
    const content = `
STUDENT PROGRESS REPORT
-----------------------
Name: ${user.name}
Email: ${user.email}
Account Created: ${new Date(user.created_at).toLocaleString()}
Generated At: ${new Date().toLocaleString()}

Current Progress: ${user.study_progress}%
Schedule: ${user.study_start_date ? new Date(user.study_start_date).toLocaleDateString() : 'N/A'} - ${user.study_end_date ? new Date(user.study_end_date).toLocaleDateString() : 'N/A'}
Status: ${user.study_progress >= 100 ? 'COMPLETED' : 'IN PROGRESS'}
Subjects: ${user.subjects.join(", ")}

ACTIVITY LOGS:
${reportData.activities.map((a: any) => `[${new Date(a.timestamp).toLocaleString()}] ${a.action}`).join("\n")}

QUIZ RESULTS:
${reportData.quizResults.map((q: any) => `[${new Date(q.date).toLocaleDateString()}] ${q.subject} - ${q.topic}: ${q.score}/${q.total}`).join("\n")}
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Report_${user.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report downloaded successfully");
  };

  const handleAction = async (action: string, userId: string, extra?: any) => {
    try {
      let endpoint = "";
      let method = "POST";
      let body = {};

      if (action === 'block') {
        endpoint = `${API_BASE_URL}/api/admin/user/${userId}/block`;
        body = { block: extra };
      } else if (action === 'reset') {
        endpoint = `${API_BASE_URL}/api/admin/user/${userId}/reset`;
      } else if (action === 'delete') {
        endpoint = `${API_BASE_URL}/api/admin/user/${userId}`;
        method = "DELETE";
      }

      const res = await fetch(endpoint, {
        method,
        headers: { 
          "x-user-id": admin.id,
          "Content-Type": "application/json"
        },
        body: method === "POST" ? JSON.stringify(body) : undefined
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Action successful`);
        fetchUsers();
      }
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const logout = () => {
    sessionStorage.removeItem("adminUser");
    navigate("/admin-login");
  };

  const filteredUsers = users.filter(u => 
    (u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     u.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (admin.role !== 'admin' || !instituteFilter || (u.institute && u.institute.toLowerCase().includes(instituteFilter.toLowerCase())))
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-20 border-b border-border bg-card/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shadow-inner">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl leading-none">
              Brainexa <span className="text-primary text-xs font-mono ml-1">{admin.role === 'admin' ? 'SYSTEM ADMIN' : 'INSTITUTE ADMIN'}</span>
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mt-1">
              {admin.role === 'admin' ? 'Unified Student Intelligence' : `Partner Institute: ${admin.institute}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 px-4 py-2 bg-muted/30 rounded-xl border border-border/50">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-xs text-primary">
              {admin.name?.[0]}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-foreground leading-none">{admin.name}</span>
              {admin.role === 'sub_admin' && <span className="text-[9px] text-muted-foreground">{admin.institute}</span>}
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors text-sm font-bold"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-full mx-auto w-full">
        {/* Tab Selection (Super Admin only) */}
        {admin.role === 'admin' && (
          <div className="flex gap-4 mb-8 border-b border-border pb-2">
            <button
              onClick={() => setActiveTab('students')}
              className={`pb-2 px-4 font-bold text-sm transition-all border-b-2 ${
                activeTab === 'students'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Manage Students
            </button>
            <button
              onClick={() => setActiveTab('sub_admins')}
              className={`pb-2 px-4 font-bold text-sm transition-all border-b-2 ${
                activeTab === 'sub_admins'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Manage Sub-Admins
            </button>
          </div>
        )}

        {activeTab === 'students' ? (
          <>
            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
               <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Students</p>
                  <h3 className="text-3xl font-black">{users.length}</h3>
               </div>
               <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">Active Now</p>
                  <h3 className="text-3xl font-black">{users.filter(u => u.last_login && (!u.last_logout || new Date(u.last_login) > new Date(u.last_logout))).length}</h3>
               </div>
               <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-1">Completed</p>
                  <h3 className="text-3xl font-black">{users.filter(u => u.study_progress >= 100).length}</h3>
               </div>
               <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Avg Progress</p>
                  <h3 className="text-3xl font-black">
                    {users.length > 0 ? Math.round(users.reduce((acc, u) => acc + (u.study_progress || 0), 0) / users.length) : 0}%
                  </h3>
               </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
              <div className="flex flex-1 gap-4 w-full md:w-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by name or email..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 rounded-2xl bg-card border-border/50 focus:ring-primary/30" 
                  />
                </div>
                {admin.role === 'admin' && (
                  <div className="relative w-64">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Filter by Institute..." 
                      value={instituteFilter}
                      onChange={(e) => setInstituteFilter(e.target.value)}
                      className="pl-12 h-12 rounded-2xl bg-card border-border/50 focus:ring-primary/30" 
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 w-full md:w-auto justify-end">
                <Button 
                  onClick={() => setShowAddStudentModal(true)}
                  className="h-12 px-6 rounded-2xl gap-2 font-bold bg-primary text-primary-foreground hover:opacity-90"
                >
                  <Plus className="w-4 h-4" /> Add Premium Student
                </Button>
                <Button variant="outline" onClick={fetchUsers} className="h-12 px-6 rounded-2xl gap-2 font-bold border-border/50">
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                </Button>
              </div>
            </div>

            {/* Student Table */}
            <div className="bg-card border border-border rounded-[2.5rem] shadow-premium overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/20">
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Student Identity</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Institute</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Scheduled Period</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Learning & Subjects</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Last Sessions</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-20 text-center text-muted-foreground">
                          <div className="flex flex-col items-center gap-4">
                            <Users className="w-12 h-12 opacity-20" />
                            <div>
                              <p className="font-bold text-lg">No students found</p>
                              <p className="text-sm">Try adjusting your search or refresh the page.</p>
                            </div>
                            <Button onClick={fetchUsers} variant="outline" className="rounded-xl">
                              <RefreshCw className="w-4 h-4 mr-2" /> Refresh Data
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-muted/10 transition-colors group">
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center font-black text-primary border border-primary/10">
                                {u.name[0]}
                              </div>
                              <div>
                                <p className="font-bold text-foreground leading-none mb-1">{u.name}</p>
                                <p className="text-xs text-muted-foreground font-mono">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                              <Building className="w-3.5 h-3.5 text-primary/70" />
                              <span>{u.institute || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="flex flex-col gap-1 text-[11px]">
                               {u.study_start_date ? (
                                 <>
                                   <div className="flex items-center gap-1.5 text-foreground font-bold">
                                     <Calendar className="w-3 h-3 text-primary" />
                                     {new Date(u.study_start_date).toLocaleDateString()} - {new Date(u.study_end_date || '').toLocaleDateString()}
                                   </div>
                                   <span className="text-[9px] text-muted-foreground">Total Period: {Math.ceil((new Date(u.study_end_date || '').getTime() - new Date(u.study_start_date).getTime()) / (1000 * 3600 * 24))} Days</span>
                                 </>
                               ) : (
                                 <span className="text-muted-foreground italic">No schedule set</span>
                               )}
                            </div>
                          </td>
                          <td className="p-6">
                             <div className="flex flex-col gap-2 max-w-[250px]">
                                <div className="flex flex-wrap gap-1">
                                   {u.subjects.length > 0 ? u.subjects.slice(0, 3).map((s, i) => (
                                     <span key={i} className="text-[9px] font-bold px-2 py-0.5 bg-secondary rounded-md border border-border/50 truncate max-w-[100px]">
                                       {s}
                                     </span>
                                   )) : <span className="text-[9px] text-muted-foreground italic">No subjects</span>}
                                   {u.subjects.length > 3 && <span className="text-[9px] font-bold px-2 py-0.5 bg-secondary rounded-md border border-border/50">+{u.subjects.length - 3}</span>}
                                </div>
                                <div className="flex items-center gap-2">
                                   <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                                      <div className="h-full bg-primary transition-all duration-500" style={{ width: `${u.study_progress}%` }} />
                                   </div>
                                   <div className="flex items-center gap-1">
                                      <span className="text-[10px] font-black text-primary">{u.study_progress}%</span>
                                      {u.study_progress >= 100 && <CheckCircle className="w-3 h-3 text-emerald-500" />}
                                   </div>
                                </div>
                             </div>
                          </td>
                          <td className="p-6">
                             <div className="flex flex-col gap-1.5 text-[10px]">
                                <div className="flex items-center gap-2 text-emerald-500 px-2 py-1 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                                   <Clock className="w-3 h-3" />
                                   <span className="font-bold">In: {u.last_login ? new Date(u.last_login).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Never'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-rose-500 px-2 py-1 bg-rose-500/5 rounded-lg border border-rose-500/10">
                                   <LogOut className="w-3 h-3" />
                                   <span className="font-bold">Out: {u.last_logout ? new Date(u.last_logout).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Active'}</span>
                                </div>
                             </div>
                          </td>
                          <td className="p-6 text-right">
                             <div className="flex items-center justify-end gap-2">
                               <Button 
                                 variant="ghost" 
                                 size="icon" 
                                 onClick={() => {
                                   setSelectedUser(u);
                                   fetchUserReport(u.id);
                                 }}
                                 className="hover:bg-primary/10 hover:text-primary rounded-xl"
                                 title="Report & Progress"
                               >
                                 <FileText className="w-4 h-4" />
                               </Button>
                               <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleAction('reset', u.id)}
                                    className="hover:bg-amber-500/10 hover:text-amber-500 rounded-xl"
                                    title="Reset Progress"
                                  >
                                    <RefreshCw className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleAction('block', u.id, !u.is_blocked)}
                                    className={`rounded-xl ${u.is_blocked ? 'text-emerald-500 hover:bg-emerald-500/10' : 'text-amber-500 hover:bg-amber-500/10'}`}
                                    title={u.is_blocked ? "Unblock" : "Block"}
                                  >
                                    {u.is_blocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleAction('delete', u.id)}
                                    className="text-rose-500 hover:bg-rose-500/10 rounded-xl"
                                    title="Delete Account"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                               </div>
                             </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Sub-Admin Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
               <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Sub-Admins</p>
                  <h3 className="text-3xl font-black">{subAdmins.length}</h3>
               </div>
               <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Active Partner Schools</p>
                  <h3 className="text-3xl font-black">{new Set(subAdmins.map(s => s.institute)).size}</h3>
               </div>
            </div>

            {/* Sub-Admin Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
              <div className="relative flex-1 w-full md:w-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search sub-admins by name or email..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 rounded-2xl bg-card border-border/50 focus:ring-primary/30" 
                />
              </div>

              <div className="flex gap-3 w-full md:w-auto justify-end">
                <Button 
                  onClick={() => setShowAddSubAdminModal(true)}
                  className="h-12 px-6 rounded-2xl gap-2 font-bold bg-primary text-primary-foreground hover:opacity-90"
                >
                  <Plus className="w-4 h-4" /> Add Sub-Admin
                </Button>
                <Button variant="outline" onClick={fetchSubAdmins} className="h-12 px-6 rounded-2xl gap-2 font-bold border-border/50">
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                </Button>
              </div>
            </div>

            {/* Sub-Admin Table */}
            <div className="bg-card border border-border rounded-[2.5rem] shadow-premium overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/20">
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sub-Admin Identity</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Institute</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Created Date</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {subAdmins.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-20 text-center text-muted-foreground">
                          <div className="flex flex-col items-center gap-4">
                            <Users className="w-12 h-12 opacity-20" />
                            <div>
                              <p className="font-bold text-lg">No sub-admins found</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      subAdmins.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase())).map((sub) => (
                        <tr key={sub.id} className="hover:bg-muted/10 transition-colors">
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center font-black text-primary border border-primary/10">
                                {sub.name[0]}
                              </div>
                              <div>
                                <p className="font-bold text-foreground leading-none mb-1">{sub.name}</p>
                                <p className="text-xs text-muted-foreground font-mono">{sub.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                              <Building className="w-3.5 h-3.5 text-primary/70" />
                              <span>{sub.institute}</span>
                            </div>
                          </td>
                          <td className="p-6">
                            <span className="text-xs text-foreground font-semibold">
                              {new Date(sub.created_at).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="p-6">
                            <span className="text-[10px] px-2 py-1 font-black bg-emerald-500/10 text-emerald-500 rounded-lg uppercase tracking-wider">
                              Active Admin
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Add Student Modal */}
      <AnimatePresence>
        {showAddStudentModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-xl p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Add Premium Student</h2>
                <button onClick={() => setShowAddStudentModal(false)} className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateStudent} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Student Name</label>
                  <Input 
                    type="text" 
                    placeholder="John Doe" 
                    value={newStudent.name}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                    className="rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
                  <Input 
                    type="email" 
                    placeholder="john@example.com" 
                    value={newStudent.email}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
                    className="rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</label>
                  <div className="relative">
                    <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      value={newStudent.password}
                      onChange={(e) => setNewStudent(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-10 rounded-xl"
                      required
                    />
                  </div>
                </div>
                {admin.role === 'admin' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Institute / School</label>
                    <div className="relative">
                      <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        placeholder="Greenwood High School" 
                        value={newStudent.institute}
                        onChange={(e) => setNewStudent(prev => ({ ...prev, institute: e.target.value }))}
                        className="pl-10 rounded-xl"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowAddStudentModal(false)} className="flex-1 rounded-xl">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 rounded-xl">
                    Create Student
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Sub-Admin Modal */}
      <AnimatePresence>
        {showAddSubAdminModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-xl p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Add Sub-Admin</h2>
                <button onClick={() => setShowAddSubAdminModal(false)} className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateSubAdmin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sub-Admin Name</label>
                  <Input 
                    type="text" 
                    placeholder="Prof. Sarah Jenkins" 
                    value={newSubAdmin.name}
                    onChange={(e) => setNewSubAdmin(prev => ({ ...prev, name: e.target.value }))}
                    className="rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
                  <Input 
                    type="email" 
                    placeholder="jenkins@school.edu" 
                    value={newSubAdmin.email}
                    onChange={(e) => setNewSubAdmin(prev => ({ ...prev, email: e.target.value }))}
                    className="rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</label>
                  <div className="relative">
                    <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      value={newSubAdmin.password}
                      onChange={(e) => setNewSubAdmin(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-10 rounded-xl"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Institute / School Name</label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Harvard University" 
                      value={newSubAdmin.institute}
                      onChange={(e) => setNewSubAdmin(prev => ({ ...prev, institute: e.target.value }))}
                      className="pl-10 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowAddSubAdminModal(false)} className="flex-1 rounded-xl">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 rounded-xl">
                    Create Sub-Admin
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Report Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-xl p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card border border-border w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col my-8"
            >
               <div className="p-8 border-b border-border flex justify-between items-center bg-muted/20">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center font-black text-2xl text-primary-foreground">
                        {selectedUser.name[0]}
                     </div>
                     <div>
                        <h2 className="text-2xl font-display font-bold leading-none">{selectedUser.name}</h2>
                        <p className="text-muted-foreground text-sm mt-1">Detailed Progress Report</p>
                     </div>
                  </div>
                  <button onClick={() => { setSelectedUser(null); setReportData(null); }} className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors">
                     <X className="w-5 h-5" />
                  </button>
               </div>

               <div className="p-8 space-y-8 flex-1">
                  {/* Date Picker */}
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Period Start</label>
                        <Input 
                          type="date" 
                          value={dateRange.start} 
                          onChange={(e) => {
                            setDateRange(prev => ({ ...prev, start: e.target.value }));
                            if (selectedUser) fetchUserReport(selectedUser.id);
                          }}
                          className="rounded-xl"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Period End</label>
                        <Input 
                          type="date" 
                          value={dateRange.end} 
                          onChange={(e) => {
                            setDateRange(prev => ({ ...prev, end: e.target.value }));
                            if (selectedUser) fetchUserReport(selectedUser.id);
                          }}
                          className="rounded-xl"
                        />
                     </div>
                  </div>

                  {reportData ? (
                    <div className="space-y-6">
                       <div className="grid grid-cols-2 gap-4">
                          <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Activities</p>
                             <p className="text-xl font-bold">{reportData.activities.length}</p>
                          </div>
                          <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Quizzes Completed</p>
                             <p className="text-xl font-bold">{reportData.quizResults.length}</p>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <h4 className="text-sm font-black uppercase tracking-widest text-foreground">Recent Activity History</h4>
                          <div className="max-h-[200px] overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                             {reportData.activities.map((a: any, i: number) => (
                               <div key={i} className="flex justify-between items-center text-xs p-3 bg-card border border-border rounded-xl">
                                  <span className="font-bold capitalize">{a.action}</span>
                                  <span className="text-muted-foreground">{new Date(a.timestamp).toLocaleString()}</span>
                               </div>
                             ))}
                             {reportData.activities.length === 0 && <p className="text-center text-xs text-muted-foreground py-4 italic">No activity logs found for this period.</p>}
                          </div>
                       </div>
                    </div>
                  ) : (
                    <div className="py-20 flex flex-col items-center gap-4 text-muted-foreground">
                       <RefreshCw className="w-8 h-8 animate-spin" />
                       <p className="font-bold">Analyzing student data...</p>
                    </div>
                  )}
               </div>

               <div className="p-8 bg-muted/20 border-t border-border flex gap-4">
                  <Button 
                    className="flex-1 h-12 rounded-2xl font-bold gap-2"
                    disabled={!reportData}
                    onClick={() => downloadReport(selectedUser!)}
                  >
                    <Download className="w-4 h-4" /> Download Full Data
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 h-12 rounded-2xl font-bold"
                    onClick={() => { setSelectedUser(null); setReportData(null); }}
                  >
                    Close
                  </Button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
