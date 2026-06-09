import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "@/lib/store";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/api-config";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, login, fetchUserData } = useStore();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate(user.plan === "free" ? "/subscription" : "/home");
    }
  }, [user, navigate]);

  // ── Manual email/password login via Supabase Auth ──────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      let userObj: any = null;
      let userData: any = null;

      try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;

        const userId = authData.user?.id;
        const { data: profile } = await supabase.from("students").select("*").eq("id", userId).single();

        userObj = {
          id: userId!,
          name: profile?.name || authData.user?.email?.split("@")[0] || "Student",
          email: authData.user!.email!,
          phone: profile?.phone || "",
          plan: (profile?.plan as "free" | "premium") || "free",
          createdAt: profile?.created_at || new Date().toISOString(),
          profilePicture: profile?.profile_picture || "",
          studyStartDate: profile?.study_start_date,
          studyEndDate: profile?.study_end_date,
          syllabusUpdateCount: profile?.syllabus_update_count || 0,
          syllabusUpdateAllowance: profile?.syllabus_update_allowance || 5,
          rulesAccepted: profile?.rules_accepted || false,
        };
      } catch (supabaseErr) {
        console.warn("Supabase Auth failed, trying local DB fallback:", supabaseErr);
        
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const localRes = await response.json();
        if (!localRes.success) {
          throw new Error(localRes.error || "Invalid email or password.");
        }

        userObj = localRes.user;
        userData = localRes.data;
        
        localStorage.setItem("localStudentUser", JSON.stringify({ user: userObj, data: userData }));
      }

      await login(userObj, userData);
      toast.success("Welcome back!");
      navigate(userObj.plan === "free" ? "/subscription" : "/home");
    } catch (err: any) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  // ── Google OAuth via Supabase ───────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/home`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
    if (error) {
      setError("Google login failed. Please try again.");
      setLoading(false);
    }
    // Supabase will redirect the user; no further action needed here.
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 gradient-purple items-center justify-center p-12">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <img src="/brainexalogo.png" alt="Brainexa Logo" className="w-14 h-14 object-contain rounded-lg" />
            <span className="font-display text-3xl font-bold text-primary-foreground">Brainexa</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-primary-foreground mb-4">
            Learn smarter with AI-powered education
          </h1>
          <p className="text-primary-foreground/80 text-lg leading-relaxed">
            Personalized study plans, intelligent tutoring, and adaptive quizzes designed to help you succeed.
          </p>
        </motion.div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <img src="/brainexalogo.png" alt="Brainexa Logo" className="w-14 h-14 object-contain rounded-lg" />
            <span className="font-display text-2xl font-bold text-foreground">Brainexa</span>
          </div>

          <h2 className="font-display text-2xl font-bold text-foreground mb-1">Welcome back</h2>
          <p className="text-muted-foreground mb-8">Log in to continue your learning journey</p>

          {error && (
            <div className="bg-accent-light text-accent rounded-lg px-4 py-3 text-sm mb-6">{error}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter password"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="mt-1 flex justify-end">
                <Link to="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full gradient-purple text-primary-foreground py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? "Signing in..." : "Log in"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-background px-3 text-muted-foreground">or continue with</span></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border border-border rounded-lg py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors disabled:opacity-60"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-semibold hover:underline">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

