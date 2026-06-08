import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, Brain, GraduationCap, BarChart3, MessageSquare, 
  ArrowRight, Shield, X, Check, Zap, Crown, Coffee, Camera 
} from "lucide-react";

export default function Index() {
  const { user } = useStore();
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  if (user) {
    // Redirect logged-in users
    window.location.href = "/home";
    return null;
  }

  const features = [
    { icon: Brain, title: "AI-Powered Mentoring", desc: "Get personalized explanations from an intelligent tutor", color: "gradient-purple" },
    { icon: GraduationCap, title: "Smart Quizzes", desc: "Adaptive quizzes that identify your weak areas", color: "gradient-red" },
    { icon: BarChart3, title: "Progress Analytics", desc: "Track your learning journey with detailed insights", color: "gradient-purple" },
    { icon: MessageSquare, title: "Study Plans", desc: "AI-generated daily study schedules tailored to you", color: "gradient-red" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-custom {
          display: inline-flex;
          white-space: nowrap;
          animation: marquee 30s linear infinite;
        }
        .animate-marquee-custom:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Marquee Banner */}
      <div 
        onClick={() => setShowDetailsModal(true)} 
        className="w-full bg-primary/10 hover:bg-primary/20 border-b border-primary/20 py-2.5 overflow-hidden cursor-pointer relative z-50 select-none group transition-all"
      >
        <div className="animate-marquee-custom flex gap-16">
          <span className="text-xs lg:text-sm font-bold text-primary flex items-center gap-2">
            🔥 SPECIAL OFFER: Now the Brainexa subscription is ₹299/- for lifetime!
          </span>
          <span className="text-xs lg:text-sm font-bold text-primary flex items-center gap-2">
            🔥 SPECIAL OFFER: Now the Brainexa subscription is ₹299/- for lifetime!
          </span>
          <span className="text-xs lg:text-sm font-bold text-primary flex items-center gap-2">
            🔥 SPECIAL OFFER: Now the Brainexa subscription is ₹299/- for lifetime!
          </span>
          <span className="text-xs lg:text-sm font-bold text-primary flex items-center gap-2">
            🔥 SPECIAL OFFER: Now the Brainexa subscription is ₹299/- for lifetime!
          </span>
        </div>
      </div>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 lg:px-12 py-4 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src="/brainexalogo.png" alt="Brainexa Logo" className="w-14 h-14 object-contain rounded-lg" />
          <span className="font-display text-xl font-bold text-foreground">Brainexa</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors px-4 py-2">
            Log in
          </Link>
          <Link to="/signup" className="gradient-purple text-primary-foreground text-sm font-semibold px-5 py-2 rounded-lg hover:opacity-90 transition-opacity">
            Get Started
          </Link>
          <Link to="/admin-login" className="p-2 opacity-10 hover:opacity-100 transition-opacity absolute -top-1 -right-1">
            <Shield className="w-3 h-3" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 lg:px-12 py-20 lg:py-32 text-center max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 bg-primary-light text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Brain className="w-4 h-4" />
            AI-Powered Learning Platform
          </div>
          <h1 className="font-display text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Learn Smarter,{" "}
            <span className="text-gradient-purple">Not Harder</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Brainexa uses artificial intelligence to create personalized study plans, provide intelligent tutoring, and track your academic progress in real time.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/signup" className="gradient-purple text-primary-foreground px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-elevated">
              Start Learning Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="border border-border bg-card text-foreground px-8 py-3 rounded-xl font-semibold hover:bg-secondary transition-colors">
              I have an account
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 lg:px-12 py-20 bg-card border-t border-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-4">
            Everything you need to <span className="text-gradient-red">succeed</span>
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">
            Powerful tools designed to help students achieve better grades and deeper understanding.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-background rounded-xl p-6 border border-border shadow-card hover:shadow-elevated transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                  <f.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Features Section */}
      <section className="px-6 lg:px-12 py-20 bg-secondary/10 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary font-display">Deep Dive</span>
            <h2 className="font-display text-3xl font-bold text-foreground mt-1">
              Engineered for Academic Excellence
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
              Explore the advanced features that make Brainexa the ultimate personal study platform.
            </p>
          </div>

          <div className="space-y-24">
            {/* Feature 1: Study Planner */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-500 text-xs font-bold px-3 py-1 rounded-full">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Personalized Study Planner
                </div>
                <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
                  Your daily study roadmap, optimized by AI
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Brainexa automatically schedules your learning day-by-day based on your subjects, exam date, and preparation levels.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                    <span><strong>Flexible Breaks:</strong> Shift uncompleted tasks sequentially when you need time off.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                    <span><strong>Syllabus Subjects Tracker:</strong> Organizes subjects with real-time progress.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                    <span><span><strong>Automatic Rescheduling:</strong> Adapts future days when timeline dates change.</span></span>
                  </li>
                </ul>
              </div>
              <div className="bg-card rounded-3xl p-6 border border-border shadow-premium relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border/50 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl gradient-red flex items-center justify-center font-bold text-primary-foreground">1</div>
                      <div>
                        <h4 className="font-bold text-sm text-foreground">Day 1: Object Oriented Programming</h4>
                        <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-wider">Active Session</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-secondary/30 rounded-xl border border-border/50 space-y-2">
                    <p className="text-xs font-bold text-foreground">Today's Tasks:</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground"><Check className="w-3.5 h-3.5 text-yellow-500" /> Complete inheritance basics</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground"><Check className="w-3.5 h-3.5 text-yellow-500" /> Attempt polymorphism quiz</div>
                  </div>
                  <button className="w-full bg-yellow-600 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90">
                    <Coffee className="w-3.5 h-3.5" /> Take a Break / Reschedule
                  </button>
                </div>
              </div>
            </div>

            {/* Feature 2: Active Learning with Quizzes */}
            <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
              <div className="space-y-6 md:order-2">
                <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-500 text-xs font-bold px-3 py-1 rounded-full">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Anti-Cheat Mastery Checks
                </div>
                <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
                  Validate your skills with webcam-verified quizzes
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Brainexa doesn't just give you notes—it checks if you have mastered them. Our quizzes adapt to your skill levels to solidify your knowledge.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span><strong>Webcam Verification:</strong> Optional proctoring to help you stay honest and focused.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span><strong>Focus Guard:</strong> Detects if you change tabs or look away to maintain study integrity.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span><strong>Weakness Discovery:</strong> Pinpoints topics you need to review and feeds back to planner.</span>
                  </li>
                </ul>
              </div>
              <div className="bg-card rounded-3xl p-6 border border-border shadow-premium relative overflow-hidden group md:order-1">
                <div className="absolute top-0 left-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500" />
                <div className="space-y-4 relative">
                  <div className="flex items-center justify-between border-b border-border/50 pb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase text-red-500">Mastery Check</span>
                      <h4 className="font-bold text-sm text-foreground">OOP Inheritance Quiz</h4>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">Q 1/5</div>
                  </div>
                  <div className="p-4 bg-red-500/5 rounded-xl border border-red-500/10 text-xs font-semibold text-foreground">
                    What is the primary benefit of inheritance in OOP?
                  </div>
                  <div className="grid gap-2">
                    <div className="p-3 bg-secondary/30 rounded-xl border border-border text-xs font-bold flex items-center justify-between">
                      <span>Code Reusability</span>
                      <div className="w-4 h-4 rounded-full border border-primary" />
                    </div>
                    <div className="p-3 bg-secondary/30 rounded-xl border border-border text-xs font-bold flex items-center justify-between">
                      <span>Faster execution time</span>
                      <div className="w-4 h-4 rounded-full border border-border" />
                    </div>
                  </div>
                  <div className="absolute -top-1 -right-1 w-20 h-16 bg-card border border-border rounded-lg shadow-lg overflow-hidden flex items-center justify-center">
                    <Camera className="w-6 h-6 text-red-500 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3: Regional Language Audio TTS */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-500 text-xs font-bold px-3 py-1 rounded-full">
                  <Brain className="w-3.5 h-3.5" />
                  Regional Audio Text-to-Speech
                </div>
                <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
                  Learn on the go in your regional language
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Listen to comprehensive study notes synthesized dynamically. Perfect for audio-visual learners or reviewing notes while commuting.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                    <span><strong>Regional Synthesizer:</strong> Reads notes in Hindi, Telugu, Tamil, Marathi, and more.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                    <span><strong>Study Library Notes:</strong> Convert any document or syllabus topic to clear audio guides.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                    <span><strong>Natural Voices:</strong> High-quality text reading to ensure focus and clarity.</span>
                  </li>
                </ul>
              </div>
              <div className="bg-card rounded-3xl p-6 border border-border shadow-premium relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border/50 pb-4">
                    <div>
                      <h4 className="font-bold text-sm text-foreground">Audio Study Companion</h4>
                      <p className="text-[10px] font-bold text-purple-500 uppercase">Google Cloud TTS API integrated</p>
                    </div>
                  </div>
                  <div className="p-4 bg-secondary/30 rounded-xl border border-border space-y-3">
                    <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Select Voice Language</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="px-3 py-1.5 bg-primary/10 border border-primary text-xs font-bold text-primary rounded-lg text-center">English</div>
                      <div className="px-3 py-1.5 bg-secondary text-xs font-bold text-muted-foreground rounded-lg text-center">Hindi</div>
                      <div className="px-3 py-1.5 bg-secondary text-xs font-bold text-muted-foreground rounded-lg text-center">Telugu</div>
                      <div className="px-3 py-1.5 bg-secondary text-xs font-bold text-muted-foreground rounded-lg text-center">Tamil</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-primary/5 p-3 rounded-xl border border-primary/20">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">▶</div>
                    <div className="text-xs text-muted-foreground">Playing Polymorphism notes audio guide...</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 4: Web Search and Intelligent Mentoring */}
            <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
              <div className="space-y-6 md:order-2">
                <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-500 text-xs font-bold px-3 py-1 rounded-full">
                  <BookOpen className="w-3.5 h-3.5" />
                  Web-Enhanced AI Tutor
                </div>
                <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
                  Always-accurate answers with live search support
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Brainexa integrates with Bing Search API to verify facts and retrieve live information directly while tutoring you on complex topics.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <span><strong>Live Search:</strong> Pulls real-time academic sources and reference links.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <span><strong>Custom Materials:</strong> Generate learning content, cheat sheets, and summaries instantly.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <span><strong>Contextual Memories:</strong> Remembers your weak topics to provide hyper-focused explanations.</span>
                  </li>
                </ul>
              </div>
              <div className="bg-card rounded-3xl p-6 border border-border shadow-premium relative overflow-hidden group md:order-1">
                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500" />
                <div className="space-y-4">
                  <div className="p-3 bg-secondary/50 rounded-xl border border-border text-xs text-muted-foreground flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] text-primary-foreground font-bold shrink-0">U</div>
                    <div>Explain polymorphism with real-world examples.</div>
                  </div>
                  <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 text-xs text-foreground space-y-2">
                    <div className="font-bold flex items-center gap-1.5 text-blue-500"><Brain className="w-3.5 h-3.5" /> Brainexa Mentor</div>
                    <p className="leading-relaxed">Polymorphism means 'many forms'. Think of a button in a UI: clicking it plays different sounds or triggers different actions depending on the button context.</p>
                    <div className="text-[10px] bg-secondary px-2 py-1 rounded inline-block font-mono text-muted-foreground">Sources: Wikipedia, Microsoft Learn</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Feature 5: Centralized Study Library */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-500 text-xs font-bold px-3 py-1 rounded-full">
                  <BookOpen className="w-3.5 h-3.5" />
                  Study Materials Library
                </div>
                <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
                  A centralized vault for all your learning content
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Bring all your textbooks, study links, and lecture notes together. Brainexa lets you organize materials by subject and processes them using advanced reading models.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span><strong>AI-Generated Notes:</strong> Instant detailed summaries for any syllabus topic.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span><strong>Syllabus Upload:</strong> Extract subjects and topics directly from your school's PDF documents.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span><strong>Multi-Format Support:</strong> Keep generated notes, uploaded PDFs, and study web links together.</span>
                  </li>
                </ul>
              </div>
              <div className="bg-card rounded-3xl p-6 border border-border shadow-premium relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500" />
                <div className="space-y-3">
                  <div className="text-[10px] font-black uppercase text-green-500 tracking-wider">Your Materials Library</div>
                  <div className="p-3 bg-secondary/30 rounded-xl border border-border flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="text-xl">📄</div>
                      <div className="text-xs text-foreground font-bold">Physics_Midterm_Syllabus.pdf</div>
                    </div>
                    <span className="text-[9px] bg-green-500/20 text-green-600 px-2 py-0.5 rounded font-black">ACTIVE</span>
                  </div>
                  <div className="p-3 bg-secondary/30 rounded-xl border border-border flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="text-xl">📚</div>
                      <div className="text-xs text-foreground font-bold">Generated Book: Polymorphism Basics</div>
                    </div>
                    <span className="text-[9px] bg-primary/20 text-primary px-2 py-0.5 rounded font-black">AI NOTE</span>
                  </div>
                  <div className="p-3 bg-secondary/30 rounded-xl border border-border flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="text-xl">🔗</div>
                      <div className="text-xs text-foreground font-bold">Web Link: OOP Core Paradigms</div>
                    </div>
                    <span className="text-[9px] bg-secondary text-muted-foreground px-2 py-0.5 rounded font-black">LINK</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 6: Visual Progress and Analytics */}
            <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
              <div className="space-y-6 md:order-2">
                <div className="inline-flex items-center gap-2 bg-pink-500/10 text-pink-500 text-xs font-bold px-3 py-1 rounded-full">
                  <BarChart3 className="w-3.5 h-3.5" />
                  Detailed Progress Analytics
                </div>
                <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
                  Understand your strengths and weaknesses visually
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Track your syllabus progress in real-time. Visual reports monitor completion metrics, quiz attempts, and flag weak sections to keep your studies on target.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                    <span><strong>Syllabus Completeness:</strong> Interactive progress bars showing complete subject completion.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                    <span><strong>Quiz Performance:</strong> Track score trends and pass/fail metrics.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                    <span><strong>Weak Topics Warnings:</strong> System flags problematic areas automatically so you can retake mastery checks.</span>
                  </li>
                </ul>
              </div>
              <div className="bg-card rounded-3xl p-6 border border-border shadow-premium relative overflow-hidden group md:order-1">
                <div className="absolute top-0 left-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500" />
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-border/50 pb-3">
                    <div>
                      <h4 className="font-bold text-xs text-foreground">Performance Dashboard</h4>
                      <p className="text-[10px] text-muted-foreground">Overall syllabus overview</p>
                    </div>
                    <span className="text-lg font-black text-pink-500">72% Completed</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground font-bold">
                      <span>Computer Science</span>
                      <span>85%</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-pink-500 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>
                  <div className="p-3 bg-red-500/5 rounded-xl border border-red-500/15 flex items-center gap-3">
                    <div className="text-xl">⚠️</div>
                    <div>
                      <p className="text-xs font-bold text-red-500">Flagged Weak Area</p>
                      <p className="text-[10px] text-muted-foreground">Polymorphism (OOP) • Last Score: 40%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Comparison Section */}
      <section className="px-6 lg:px-12 py-20 bg-background border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary font-display">Plan Comparison</span>
            <h2 className="font-display text-3xl font-bold text-foreground mt-1">
              Choose your path to <span className="text-gradient-purple">success</span>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
              Start for free or upgrade to Brainexa Lifetime to unlock all premium AI tools.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
            {/* Free Card */}
            <div className="bg-card rounded-3xl p-8 border border-border shadow-sm flex flex-col justify-between hover:shadow-premium transition-shadow">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
                    <Zap className="w-6 h-6 text-foreground/60" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg">Foundation</h3>
                    <p className="text-sm text-muted-foreground">Try Brainexa with basic tools</p>
                  </div>
                </div>

                <div className="my-6">
                  <span className="text-3xl font-black text-foreground">Free</span>
                  <span className="text-sm text-muted-foreground"> forever</span>
                </div>

                <ul className="space-y-4 text-sm text-muted-foreground border-t border-border/50 pt-6">
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-border mt-0.5 shrink-0" />
                    <span>Basic AI tutoring (Limited Q&A)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-border mt-0.5 shrink-0" />
                    <span>Limited quiz attempts (5/day)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-border mt-0.5 shrink-0" />
                    <span>Basic study plan template</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-border mt-0.5 shrink-0" />
                    <span>No regional language read-aloud notes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-border mt-0.5 shrink-0" />
                    <span>No custom PDF study note generation</span>
                  </li>
                </ul>
              </div>

              <Link 
                to="/signup" 
                className="w-full bg-secondary text-foreground py-4 rounded-xl font-bold hover:bg-secondary/80 transition-all text-sm mt-8 block text-center"
              >
                Start Free
              </Link>
            </div>

            {/* Lifetime Card */}
            <div className="bg-card rounded-3xl p-8 border-2 border-primary shadow-premium flex flex-col justify-between relative hover:scale-[1.01] transition-transform">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-black px-6 py-2 rounded-bl-2xl tracking-widest uppercase">
                Special Offer
              </div>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl gradient-purple flex items-center justify-center shadow-lg shadow-primary/20">
                    <Crown className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-primary">Excellence</h3>
                    <p className="text-sm text-muted-foreground">Unlock Brainexa's full potential</p>
                  </div>
                </div>

                <div className="my-6">
                  <span className="text-3xl font-black text-foreground">₹299</span>
                  <span className="text-xs font-bold text-primary"> lifetime value</span>
                </div>

                <ul className="space-y-4 text-sm text-foreground/85 border-t border-primary/20 pt-6">
                  <li className="flex items-start gap-3 font-semibold">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>Unlimited AI tutoring & chat mentoring</span>
                  </li>
                  <li className="flex items-start gap-3 font-semibold">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>Unlimited customized quiz attempts</span>
                  </li>
                  <li className="flex items-start gap-3 font-semibold">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>Webcam-linked anti-cheat mastery verification</span>
                  </li>
                  <li className="flex items-start gap-3 font-semibold">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>AI Study Material Library (Notes, PDFs, web links)</span>
                  </li>
                  <li className="flex items-start gap-3 font-semibold">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>Regional Audio TTS (Hindi, Telugu, Tamil, Marathi, etc.)</span>
                  </li>
                  <li className="flex items-start gap-3 font-semibold">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>Advanced personalized scheduling with Breaks</span>
                  </li>
                  <li className="flex items-start gap-3 font-semibold">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>Visual dashboard progress tracking</span>
                  </li>
                </ul>
              </div>

              <Link 
                to="/signup" 
                className="w-full gradient-purple text-primary-foreground py-4 rounded-xl font-bold hover:opacity-90 shadow-xl shadow-primary/20 transition-all text-sm mt-8 block text-center"
              >
                Upgrade to Lifetime Now
              </Link>
            </div>
          </div>
        </div>
      </section>
{/* Why Brainexa Section */}
<section className="px-6 lg:px-12 py-20 bg-gradient-to-b from-primary/5 to-background">
  <div className="max-w-5xl mx-auto text-center mb-12">
    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary font-display">Why Brainexa</span>
    <h2 className="font-display text-3xl font-bold text-foreground mt-1">Boost Your Learning Experience</h2>
    <p className="text-muted-foreground mt-2 max-w-lg mx-auto">Explore the core benefits that make Brainexa the ultimate AI study mentor.</p>
        {/* Additional Brainexa Info */}
        <section className="px-6 lg:px-12 py-20 bg-background">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">Discover Brainexa</h2>
            <p className="text-muted-foreground mb-8">Empowering students with AI-driven insights, interactive quizzes, and personalized study plans.</p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <img src="/images/points.png" alt="Points" className="w-24 h-24 mb-4" />
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">Earn Points</h3>
                <p className="text-sm text-muted-foreground">Collect points for completing quizzes and challenges.</p>
              </div>
              <div className="flex flex-col items-center">
                <img src="/images/insights.png" alt="Insights" className="w-24 h-24 mb-4" />
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">Smart Insights</h3>
                <p className="text-sm text-muted-foreground">AI analyzes your performance to suggest focus areas.</p>
              </div>
              <div className="flex flex-col items-center">
                <img src="/images/community.png" alt="Community" className="w-24 h-24 mb-4" />
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">Community</h3>
                <p className="text-sm text-muted-foreground">Join study groups and share resources.</p>
              </div>
            </div>
          </div>
        </section>
  </div>
  <div className="grid md:grid-cols-3 gap-8">
    <div className="flex flex-col items-center p-6 bg-card rounded-2xl border border-border">
      <Brain className="w-12 h-12 text-primary mb-4" />
      <h3 className="font-display font-semibold text-lg text-foreground mb-2">AI-Powered Mentoring</h3>
      <p className="text-sm text-muted-foreground text-center">Personalized guidance and instant answers to any question.</p>
    </div>
    <div className="flex flex-col items-center p-6 bg-card rounded-2xl border border-border">
      <BarChart3 className="w-12 h-12 text-primary mb-4" />
      <h3 className="font-display font-semibold text-lg text-foreground mb-2">Progress Analytics</h3>
      <p className="text-sm text-muted-foreground text-center">Detailed insights to track your study journey.</p>
    </div>
    <div className="flex flex-col items-center p-6 bg-card rounded-2xl border border-border">
      <GraduationCap className="w-12 h-12 text-primary mb-4" />
      <h3 className="font-display font-semibold text-lg text-foreground mb-2">Smart Quizzes</h3>
      <p className="text-sm text-muted-foreground text-center">Adaptive quizzes that focus on your weak areas.</p>
    </div>
  </div>
</section>
      {/* CTA */}
      <section className="px-6 lg:px-12 py-20">
        <div className="max-w-3xl mx-auto gradient-red rounded-2xl p-10 lg:p-14 text-center shadow-red">
          <h2 className="font-display text-3xl font-bold text-accent-foreground mb-4">
            Ready to transform your learning?
          </h2>
          <p className="text-accent-foreground/80 mb-8 max-w-lg mx-auto">
            Join students who are already learning smarter with Brainexa's AI-powered platform.
          </p>
          <p className="text-sm text-muted-foreground">
            2026 Brainexa. All rights reserved.
          </p>
        </div>
      </section>

      {/* Plans comparison modal */}
      <AnimatePresence>
        {showDetailsModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/90 backdrop-blur-xl p-4 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card w-full max-w-4xl rounded-3xl p-6 lg:p-8 shadow-2xl border border-border relative my-8"
            >
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-8">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Plan Comparison</span>
                <h2 className="font-display text-3xl font-black text-foreground mt-1">Free vs Lifetime Membership</h2>
                <p className="text-sm text-muted-foreground mt-2 max-w-lg mx-auto">
                  Compare plan options to see how Brainexa Premium can supercharge your study routine.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 items-stretch">
                {/* Free Card */}
                <div className="bg-background rounded-2xl p-6 border border-border flex flex-col justify-between relative">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                        <Zap className="w-5 h-5 text-foreground/60" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-lg text-foreground">Foundation Plan</h4>
                        <p className="text-xs text-muted-foreground">Try Brainexa with basic utilities</p>
                      </div>
                    </div>

                    <div className="my-4">
                      <span className="text-2xl font-black text-foreground">Free</span>
                      <span className="text-xs text-muted-foreground"> forever</span>
                    </div>

                    <ul className="space-y-3 text-sm text-muted-foreground border-t border-border/50 pt-4">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-border mt-0.5 shrink-0" />
                        <span>Basic AI mentoring (Limited Q&A)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-border mt-0.5 shrink-0" />
                        <span>Limited quiz attempts (5 quizzes/day)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-border mt-0.5 shrink-0" />
                        <span>Basic study plan template</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-border mt-0.5 shrink-0" />
                        <span>No regional language read-aloud notes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-border mt-0.5 shrink-0" />
                        <span>No custom PDF study note generation</span>
                      </li>
                    </ul>
                  </div>

                  <Link 
                    to="/signup" 
                    onClick={() => setShowDetailsModal(false)}
                    className="w-full bg-secondary text-foreground py-3.5 rounded-xl font-bold hover:bg-secondary/80 transition-all text-sm mt-8 block text-center"
                  >
                    Start Free
                  </Link>
                </div>

                {/* Premium Card */}
                <div className="bg-secondary/20 rounded-2xl p-6 border-2 border-primary flex flex-col justify-between relative">
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[9px] font-black px-4 py-1.5 rounded-bl-xl tracking-widest uppercase">
                    Offer
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl gradient-purple flex items-center justify-center shadow-lg shadow-primary/20">
                        <Crown className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-lg text-primary">Excellence Plan</h4>
                        <p className="text-xs text-muted-foreground">Unlock Brainexa's full power</p>
                      </div>
                    </div>

                    <div className="my-4">
                      <span className="text-2xl font-black text-foreground">₹299</span>
                      <span className="text-xs font-bold text-primary"> lifetime value</span>
                    </div>

                    <ul className="space-y-3 text-sm text-foreground/80 border-t border-primary/20 pt-4">
                      <li className="flex items-start gap-2 font-semibold">
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span>Unlimited AI tutoring & chat mentoring</span>
                      </li>
                      <li className="flex items-start gap-2 font-semibold">
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span>Unlimited customized quiz attempts</span>
                      </li>
                      <li className="flex items-start gap-2 font-semibold">
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span>Webcam-linked anti-cheat mastery verification</span>
                      </li>
                      <li className="flex items-start gap-2 font-semibold">
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span>AI Study Material Library (Notes, PDFs, web links)</span>
                      </li>
                      <li className="flex items-start gap-2 font-semibold">
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span>Regional Audio TTS (Hindi, Telugu, Tamil, Marathi, etc.)</span>
                      </li>
                      <li className="flex items-start gap-2 font-semibold">
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span>Advanced personalized scheduling with Breaks</span>
                      </li>
                      <li className="flex items-start gap-2 font-semibold">
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span>Visual dashboard progress tracking</span>
                      </li>
                    </ul>
                  </div>

                  <Link 
                    to="/signup" 
                    onClick={() => setShowDetailsModal(false)}
                    className="w-full gradient-purple text-primary-foreground py-3.5 rounded-xl font-bold hover:opacity-90 shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all text-sm mt-8 block text-center"
                  >
                    Upgrade to Lifetime Now
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
