import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { useStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Crown, Zap, ShieldCheck, Loader2, CreditCard, Smartphone, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/api-config";


declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Subscription() {
  const { user, updatePlan, acceptRules } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(true);
  const [showUpiInput, setShowUpiInput] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [showRulesOverlay, setShowRulesOverlay] = useState(false);

  const createdTime = user?.createdAt ? new Date(user.createdAt).getTime() : 0;
  const isTrialActive = user?.plan === "free" && createdTime && (new Date().getTime() - createdTime < 3 * 24 * 60 * 60 * 1000);
  const isTrialExpired = user?.plan === "free" && createdTime && (new Date().getTime() - createdTime >= 3 * 24 * 60 * 60 * 1000);

  // Time remaining calculation
  let timeRemainingText = "";
  if (isTrialActive && createdTime) {
    const msDiff = 3 * 24 * 60 * 60 * 1000 - (new Date().getTime() - createdTime);
    const hoursDiff = Math.max(0, Math.floor(msDiff / (1000 * 60 * 60)));
    if (hoursDiff > 24) {
      timeRemainingText = `${Math.floor(hoursDiff / 24)} days left`;
    } else {
      timeRemainingText = `${hoursDiff} hours left`;
    }
  }

  const handleStandardPayment = async () => {
    initiateRazorpay();
  };
  const initiateRazorpay = async (method?: string, vpa?: string) => {
    setIsLoading(true);
    try {
      window.open("https://rzp.io/rzp/h28mAD3", "_blank");
      toast.success("Opening Razorpay Payment Page...");
      
      // Notify user about verification
      setTimeout(() => {
        toast.info("Once payment is completed, the admin will verify and activate your Premium account shortly.", {
          duration: 8000,
        });
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to open payment link.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpiCollect = () => {
    if (!upiId || !upiId.includes("@")) {
      toast.error("Please enter a valid UPI ID (e.g. harsha@okaxis)");
      return;
    }
    initiateRazorpay('upi', upiId);
  };

  const isPremium = user?.plan === "premium";

  if (isPremium) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto text-center py-20 px-6">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-24 h-24 rounded-3xl gradient-red flex items-center justify-center mx-auto mb-8 shadow-premium">
            <Crown className="w-12 h-12 text-accent-foreground" />
          </motion.div>
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">Mastery Awaits!</h1>
          <p className="text-xl text-muted-foreground mb-12">You are officially a Brainexa Premium Member.</p>
          <button 
            onClick={() => navigate("/study-plan")}
            className="gradient-purple text-primary-foreground px-10 py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all shadow-lg hover:scale-105 active:scale-95"
          >
            Go to Study Planner
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto pb-20 px-4">
        {/* Trial Alerts */}
        {isTrialActive && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-2xl border border-primary/20 bg-primary/5 flex items-center gap-3 text-sm text-foreground"
          >
            <span className="text-xl">✨</span>
            <div>
              <p className="font-bold">Active 3-Day Trial</p>
              <p className="text-muted-foreground text-xs mt-0.5">
                You currently have complete access to experience the Brainexa platform ({timeRemainingText} remaining). Subscribe below to keep your premium features forever!
              </p>
            </div>
          </motion.div>
        )}

        {isTrialExpired && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-2xl border border-red-500/20 bg-red-500/5 flex items-center gap-3 text-sm text-foreground"
          >
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-bold text-red-600 dark:text-red-400">Trial Expired</p>
              <p className="text-muted-foreground text-xs mt-0.5">
                Your 3-day complete access trial has ended. To continue using Brainexa, please make a payment of ₹299/- for lifetime access.
              </p>
            </div>
          </motion.div>
        )}

        <div className="text-center mb-12 mt-6">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Elevate your learning</h1>
          <p className="text-muted-foreground">Premium features for students who aim for excellence</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Free Plan */}
          <div className="bg-card rounded-3xl p-8 border border-border shadow-sm opacity-80 h-full flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
                <Zap className="w-6 h-6 text-foreground/60" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg">Foundation</h3>
                <p className="text-2xl font-bold text-foreground">Free</p>
              </div>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-3 text-sm text-muted-foreground"><Check className="w-4 h-4 text-border" /> Basic AI mentoring</li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground"><Check className="w-4 h-4 text-border" /> Limited quiz attempts (5/day)</li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground"><Check className="w-4 h-4 text-border" /> Basic study plan</li>
            </ul>
            <button disabled className="w-full py-4 rounded-xl border border-border text-muted-foreground font-semibold text-sm">
              Current Plan
            </button>
          </div>

          {/* Premium Plan */}
          <motion.div 
            layout
            whileHover={{ y: -5 }}
            className="bg-card rounded-3xl p-8 border-2 border-accent shadow-premium relative overflow-hidden h-full flex flex-col"
          >
            <div className="absolute top-0 right-0 gradient-red text-accent-foreground text-xs font-black px-6 py-2 rounded-bl-2xl tracking-widest uppercase">
              Best Value
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl gradient-red flex items-center justify-center shadow-lg shadow-accent/20">
                <Crown className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg text-accent">Excellence</h3>
                <p className="text-3xl font-bold text-foreground">₹299 <span className="text-sm font-normal text-muted-foreground">lifetime</span></p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!showUpiInput ? (
                <motion.div
                  key="options"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col flex-grow"
                >
                  <ul className="space-y-3 mb-10 flex-grow">
                    <li className="flex items-start gap-3 text-sm font-medium text-foreground"><Check className="w-4 h-4 text-accent mt-0.5 shrink-0" /> <span><strong>AI-Optimized Study Planner:</strong> Generate customized daily task schedules</span></li>
                    <li className="flex items-start gap-3 text-sm font-medium text-foreground"><Check className="w-4 h-4 text-accent mt-0.5 shrink-0" /> <span><strong>Interactive AI Study Mentor:</strong> Unlimited educational chat & instant answers</span></li>
                    <li className="flex items-start gap-3 text-sm font-medium text-foreground"><Check className="w-4 h-4 text-accent mt-0.5 shrink-0" /> <span><strong>Syllabus Subjects & Topics:</strong> Structured progress mapping</span></li>
                    <li className="flex items-start gap-3 text-sm font-medium text-foreground"><Check className="w-4 h-4 text-accent mt-0.5 shrink-0" /> <span><strong>Adaptive Quiz & Mastery Checks:</strong> Webcam anti-cheat validation</span></li>
                    <li className="flex items-start gap-3 text-sm font-medium text-foreground"><Check className="w-4 h-4 text-accent mt-0.5 shrink-0" /> <span><strong>Learning Materials Library:</strong> Generate custom notes or upload PDFs</span></li>
                    <li className="flex items-start gap-3 text-sm font-medium text-foreground"><Check className="w-4 h-4 text-accent mt-0.5 shrink-0" /> <span><strong>Regional Audio TTS:</strong> Read-aloud notes in Hindi, Telugu, Tamil, Marathi, and more</span></li>
                    <li className="flex items-start gap-3 text-sm font-medium text-foreground"><Check className="w-4 h-4 text-accent mt-0.5 shrink-0" /> <span><strong>Web-Enhanced Answers:</strong> Real-time web retrieval via Bing search integration</span></li>
                    <li className="flex items-start gap-3 text-sm font-medium text-foreground"><Check className="w-4 h-4 text-accent mt-0.5 shrink-0" /> <span><strong>Dashboard & Progress Reports:</strong> Visual stats of subject completion & quiz metrics</span></li>
                  </ul>
                  
                  <div className="space-y-3">
                    <button
                      onClick={handleStandardPayment}
                      disabled={isLoading || !isScriptLoaded}
                      className="w-full gradient-purple text-primary-foreground py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Join Premium <ArrowRight className="w-4 h-4" /></>}
                    </button>
                    
                    <button
                      onClick={() => setShowUpiInput(true)}
                      className="w-full bg-secondary text-foreground py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-secondary/80 transition-all"
                    >
                      <Smartphone className="w-5 h-5 text-accent" /> Send Payment Request to Phone
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="upi-input"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col flex-grow"
                >
                  <div className="mb-6">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Enter Your UPI ID</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="example@okaxis"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full bg-secondary rounded-xl px-5 py-4 font-medium border-2 border-transparent focus:border-accent outline-none transition-all placeholder:opacity-50"
                      />
                      <Smartphone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2 px-1 text-center">We will send a payment request directly to your PhonePe/GPay app.</p>
                  </div>

                  <div className="mt-auto space-y-3">
                    <button
                      onClick={handleUpiCollect}
                      disabled={isLoading}
                      className="w-full gradient-red text-accent-foreground py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send ₹299 Request</>}
                    </button>
                    <button
                      onClick={() => setShowUpiInput(false)}
                      className="w-full text-muted-foreground text-sm font-semibold flex items-center justify-center gap-2 py-2"
                    >
                      <ArrowLeft className="w-4 h-4" /> Other Payment Methods
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="flex items-center gap-6 opacity-30 grayscale grayscale-100">
             <div className="flex items-center gap-2">
               <CreditCard className="w-5 h-5" />
               <span className="text-[10px] font-bold uppercase tracking-widest">Cards</span>
             </div>
             <div className="flex items-center gap-2">
               <Smartphone className="w-5 h-5" />
               <span className="text-[10px] font-bold uppercase tracking-widest">UPI ID</span>
             </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <p className="text-xs font-medium">Secured by Razorpay. Official Merchant Gateway.</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showRulesOverlay && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card w-full max-w-2xl rounded-2xl p-8 shadow-2xl border border-border overflow-y-auto max-h-[90vh]"
            >
              <h2 className="font-display text-2xl font-bold mb-4">Terms of Service & Usage Policy</h2>
              <div className="prose prose-sm text-muted-foreground space-y-4 mb-8">
                <p>Welcome to Brainexa Premium. To continue, you must acknowledge and agree to the following rules and functionalities:</p>
                
                <div className="bg-muted/50 p-4 rounded-lg space-y-2 border border-border">
                  <h3 className="font-semibold text-foreground">1. Subscription & Payments</h3>
                  <p>All payments for premium plans and syllabus updates are processed securely via Razorpay. Payments are non-refundable once the service (syllabus generation) is initiated.</p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg space-y-2 border border-border">
                  <h3 className="font-semibold text-foreground">2. Syllabus Update Rules</h3>
                  <p>Your subscription includes 5 free syllabus updates. Beyond this, a tiered payment rule applies:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>₹50 for the first set of additional updates (6 updates).</li>
                    <li>₹101 for the second set of additional updates (10 updates).</li>
                  </ul>
                  <p>Updates are only counted if you modify subjects, topics, or dates.</p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg space-y-2 border border-border">
                  <h3 className="font-semibold text-foreground">3. Academic Integrity</h3>
                  <p>Brainexa is an AI learning assistant. Users are responsible for the academic integrity of their own learning. Any illegal or unauthorized redistribution of our content is prohibited.</p>
                </div>

                <p>By clicking "Accept and Continue", you agree to these terms and authorize Brainexa to process your data for generating personalized plans.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowRulesOverlay(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-border hover:bg-muted transition-all"
                >
                  Read Later
                </button>
                <button
                  onClick={async () => {
                    setIsAccepting(true);
                    await acceptRules();
                    setShowRulesOverlay(false);
                    setIsAccepting(false);
                    toast.success("Rules accepted!");
                    navigate("/study-plan");
                  }}
                  disabled={isAccepting}
                  className="flex-1 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50"
                >
                  {isAccepting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Accept and Continue'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
