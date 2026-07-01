import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquare, ArrowRight, ArrowLeft, Loader2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/api-config";
import { useStore } from "@/lib/store";

interface ExperienceFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Phase = "choice" | "rating";

export default function ExperienceFeedbackModal({ isOpen, onClose }: ExperienceFeedbackModalProps) {
  const { user } = useStore();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("choice");
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !user) return null;

  const handleSubscriptionClick = () => {
    onClose();
    navigate("/subscription");
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          rating,
          comment,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Thank you for your feedback! We appreciate your support.");
        onClose();
      } else {
        throw new Error(data.error || "Failed to submit feedback.");
      }
    } catch (err: any) {
      console.error(err);
      // Fallback: close modal and toast success to prevent user friction
      toast.success("Thank you for your feedback!");
      onClose();
    } finally {
      setSubmitting(false);
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
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1.5 rounded-full hover:bg-secondary/80 text-muted-foreground transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/10 blur-3xl rounded-full pointer-events-none" />

        <AnimatePresence mode="wait">
          {phase === "choice" ? (
            <motion.div
              key="choice"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-black font-display tracking-tight text-foreground">How is your experience?</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  We hope you are enjoying your 3 days complete access. Please let us know how Brainexa is helping you.
                </p>
              </div>

              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPhase("rating")}
                  className="w-full text-left p-5 rounded-2xl border border-border bg-secondary/30 hover:bg-secondary/50 hover:border-primary/50 transition-all flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Star className="w-5 h-5 text-primary fill-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block font-bold text-sm text-foreground">Give Brainexa Rating & Feedback</span>
                    <span className="block text-xs text-muted-foreground mt-1">
                      Rate us in stars out of 5 and share comments about your experience.
                    </span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 self-center" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubscriptionClick}
                  className="w-full text-left p-5 rounded-2xl border-2 border-accent bg-card hover:bg-secondary/20 shadow-premium transition-all flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl gradient-red flex items-center justify-center shrink-0 mt-0.5">
                    <Star className="w-5 h-5 text-accent-foreground fill-accent-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block font-bold text-sm text-accent">Move to Take Subscription</span>
                    <span className="block text-xs text-muted-foreground mt-1">
                      Subscribe to the lifetime membership for ₹299/- to lock in access permanently.
                    </span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-accent shrink-0 self-center" />
                </motion.button>
              </div>

              <button
                onClick={onClose}
                className="mt-6 text-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Maybe Later
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="rating"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col"
            >
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => setPhase("choice")}
                  className="p-1 rounded-lg hover:bg-secondary text-muted-foreground"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold text-muted-foreground">Back to choices</span>
              </div>

              <h3 className="text-xl font-bold text-foreground mb-1">Tell us your feedback</h3>
              <p className="text-xs text-muted-foreground mb-6">Rate Brainexa from 1 to 5 stars.</p>

              <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                {/* Stars selection */}
                <div className="flex items-center justify-center gap-2 py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-10 h-10 transition-colors ${
                          star <= (hoverRating || rating)
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Comment box */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                    Write Feedback (Optional)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    placeholder="Tell us what you like or how we can improve..."
                    className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-sm font-medium border border-border focus:border-primary outline-none transition-all placeholder:opacity-50 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full gradient-purple text-primary-foreground py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:opacity-95 transition-all disabled:opacity-60"
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Submit Feedback"
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
