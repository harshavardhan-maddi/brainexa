import React from "react";
import { motion } from "framer-motion";
import { Crown, Sparkles, Rocket, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface LoginChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginChoiceModal({ isOpen, onClose }: LoginChoiceModalProps) {
  if (!isOpen) return null;

  const handleFreeTrial = () => {
    onClose();
    toast.success("Welcome! Enjoy 3 days of complete access to Brainexa Premium.");
  };

  const handleSubscribe = () => {
    try {
      window.open("https://rzp.io/rzp/h28mAD3", "_blank");
      toast.success("Opening Razorpay Payment Page...");
      
      setTimeout(() => {
        toast.info("Once payment is completed, the admin will verify and activate your Premium account shortly.", {
          duration: 8000,
        });
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to open payment link.");
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-card w-full max-w-lg rounded-[2rem] border border-border shadow-2xl overflow-hidden relative flex flex-col p-8"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-accent/10 blur-3xl rounded-full pointer-events-none" />

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-purple flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
            <Rocket className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-black font-display tracking-tight text-foreground">Welcome to Brainexa!</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Let's start your personalized learning journey. Choose how you want to experience the platform today.
          </p>
        </div>

        <div className="space-y-4">
          {/* Option 1: 3 Days Trial */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleFreeTrial}
            className="w-full text-left p-5 rounded-2xl border border-border bg-secondary/30 hover:bg-secondary/50 hover:border-primary/50 transition-all flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="block font-bold text-sm text-foreground">3 Days Full Experience Trial</span>
              <span className="block text-xs text-muted-foreground mt-1 leading-relaxed">
                Continue with 3 days full access to experience the complete Brainexa platform for free.
              </span>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 self-center" />
          </motion.button>

          {/* Option 2: Subscription */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubscribe}
            className="w-full text-left p-5 rounded-2xl border-2 border-accent bg-card hover:bg-secondary/20 shadow-premium transition-all flex items-start gap-4 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 gradient-red text-accent-foreground text-[8px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              Lifetime
            </div>
            <div className="w-10 h-10 rounded-xl gradient-red flex items-center justify-center shrink-0 mt-0.5 shadow-md">
              <Crown className="w-5 h-5 text-accent-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="block font-bold text-sm text-accent">Lifetime Premium Access</span>
              <span className="block text-xs text-muted-foreground mt-1 leading-relaxed">
                Unlock complete lifetime access to all study materials, AI tutoring, and quizzes for just ₹299/-.
              </span>
            </div>
            <ArrowRight className="w-5 h-5 text-accent shrink-0 self-center" />
          </motion.button>
        </div>

        <p className="text-[10px] text-center text-muted-foreground mt-6 uppercase font-bold tracking-widest">
          Secure payment gateway powered by Razorpay
        </p>
      </motion.div>
    </div>
  );
}
