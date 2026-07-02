"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  GraduationCap,
  Users,
  CheckCircle,
  DollarSign,
  BookOpen,
  CalendarDays,
  FileText,
  MessageSquare,
  Menu,
  X,
  ArrowRight,
  Check,
  Star,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react"

// ---- hook: animate number counting up ----
function useCountUp(target: number, duration = 1500, start = false) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    function step(timestamp: number) {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return value
}

// ---- hook: trigger when element enters viewport ----
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])
  return { ref, inView }
}

// ---- Animated stat counter ----
function StatCounter({
  value,
  suffix = "",
  prefix = "",
  label,
  inView,
}: {
  value: number
  suffix?: string
  prefix?: string
  label: string
  inView: boolean
}) {
  const count = useCountUp(value, 1800, inView)
  return (
    <div className="text-center">
      <p className="text-4xl font-bold text-[#0f4c5c]">
        {prefix}{count.toLocaleString()}{suffix}
      </p>
      <p className="text-sm text-slate-500 mt-1">{label}</p>
    </div>
  )
}

// ---- Floating notification card ----
function FloatingCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <div
      className={`absolute bg-white rounded-2xl shadow-xl border border-slate-100 px-4 py-3 ${className}`}
      style={{
        animation: `float 3s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

const FEATURES = [
  { key: "student_management", name: "Student Management", description: "Manage students from ECD A to Form 6. Track profiles, grade levels, and parent contacts.", price: 10, icon: GraduationCap, color: "#0f4c5c", bg: "#e1f5f0", required: true },
  { key: "teacher_management", name: "Teacher Management", description: "Manage teacher profiles, assign subjects and classes across your school.", price: 8, icon: Users, color: "#185fa5", bg: "#e6f1fb", required: true },
  { key: "attendance", name: "Attendance Tracking", description: "Record and monitor daily student attendance. Get instant rates and reports.", price: 5, icon: CheckCircle, color: "#3b6d11", bg: "#eaf3de", required: false },
  { key: "exams_grading", name: "Exams & Grading", description: "Manage ZIMSEC-style exams, O-Level and A-Level results, and report cards.", price: 10, icon: BookOpen, color: "#6d3b11", bg: "#f5ede6", required: false },
  { key: "timetable", name: "Timetable", description: "Create weekly class timetables, detect conflicts, and assign subjects easily.", price: 5, icon: CalendarDays, color: "#5b1186", bg: "#f3e6fb", required: false },
  { key: "fees_billing", name: "Fees & Billing", description: "Generate invoices, record payments in USD and ZiG, track outstanding balances.", price: 12, icon: DollarSign, color: "#854f0b", bg: "#faeeda", required: false },
  { key: "parent_portal", name: "Parent Portal", description: "Give parents secure access to view attendance, results, and fee statements.", price: 8, icon: FileText, color: "#0f4c5c", bg: "#e1f5f0", required: false },
  { key: "sms_notifications", name: "SMS Notifications", description: "Automated SMS alerts to parents for attendance, fees, and exam results.", price: 15, icon: MessageSquare, color: "#185fa5", bg: "#e6f1fb", required: false },
]

const BUNDLES = [
  { name: "Starter", description: "Perfect for small schools just getting started.", features: ["student_management", "teacher_management", "attendance"], highlight: false },
  { name: "Advanced", description: "Everything you need to run a full school.", features: ["student_management", "teacher_management", "attendance", "exams_grading", "timetable", "fees_billing"], highlight: true },
  { name: "Complete", description: "The full Xul365 experience.", features: FEATURES.map((f) => f.key), highlight: false },
]

const TESTIMONIALS = [
  { name: "Mr. T. Moyo", role: "Headmaster, Harare High School", text: "Xul365 transformed how we manage our school. Fee collection alone saves us hours every week.", initials: "TM" },
  { name: "Mrs. N. Chikwanda", role: "Administrator, St. George's College", text: "The report card generation is brilliant. What used to take days now takes minutes.", initials: "NC" },
  { name: "Mr. B. Dube", role: "Principal, Chapel Hill High", text: "Parents love being able to check their children's attendance and fees online.", initials: "BD" },
]

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly")
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  const statsSection = useInView(0.3)

  // Navbar scroll effect
  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 20) }
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % FEATURES.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  function getBundlePrice(bundle: typeof BUNDLES[0]) {
    const monthly = FEATURES.filter((f) => bundle.features.includes(f.key)).reduce((sum, f) => sum + f.price, 0)
    return billingCycle === "annual" ? monthly * 12 * 0.8 : monthly
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 overflow-x-hidden">

      {/* Global CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce-dot {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        .animate-slide-left { animation: slideInLeft 0.7s ease forwards; }
        .animate-slide-right { animation: slideInRight 0.7s ease forwards; }
        .animate-slide-up { animation: slideInUp 0.6s ease forwards; }
        .animate-fade { animation: fadeIn 0.8s ease forwards; }
        .stagger-1 { animation-delay: 0.1s; opacity: 0; }
        .stagger-2 { animation-delay: 0.2s; opacity: 0; }
        .stagger-3 { animation-delay: 0.3s; opacity: 0; }
        .stagger-4 { animation-delay: 0.4s; opacity: 0; }
        .stagger-5 { animation-delay: 0.5s; opacity: 0; }
        .gradient-text {
          background: linear-gradient(135deg, #0f4c5c 0%, #0e7490 50%, #0f4c5c 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        .dot-1 { animation: bounce-dot 1.4s infinite ease-in-out; animation-delay: 0s; }
        .dot-2 { animation: bounce-dot 1.4s infinite ease-in-out; animation-delay: 0.2s; }
        .dot-3 { animation: bounce-dot 1.4s infinite ease-in-out; animation-delay: 0.4s; }
      `}</style>

      {/* ===== NAVBAR ===== */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md border-b border-slate-100"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl bg-[#0f4c5c] flex items-center justify-center text-white font-bold text-sm shadow-lg"
              style={{ boxShadow: "0 0 0 3px #0f4c5c20" }}
            >
              X
            </div>
            <span className="text-xl font-bold text-slate-800">Xul365</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {["Features", "Pricing", "Testimonials", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className="text-sm text-slate-600 hover:text-[#0f4c5c] transition-colors font-medium relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0f4c5c] transition-all duration-300 group-hover:w-full rounded-full" />
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login"
              className="text-sm font-medium text-slate-600 hover:text-[#0f4c5c] transition-colors px-4 py-2">
              Sign in
            </Link>
            <Link href="/register"
              className="text-sm font-medium bg-[#0f4c5c] text-white px-4 py-2 rounded-lg hover:bg-[#0d3f4d] transition-all duration-200 shadow-lg hover:shadow-[#0f4c5c]/30 hover:-translate-y-0.5">
              Get started free
            </Link>
          </div>

          <button type="button" className="md:hidden p-2 text-slate-600"
            onClick={() => setMobileMenuOpen((v) => !v)}>
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-3 shadow-lg animate-slide-up">
            {["Features", "Pricing", "Testimonials", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-slate-600 py-2 hover:text-[#0f4c5c]">
                {item}
              </a>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/login" className="text-center text-sm font-medium border border-slate-200 rounded-lg py-2.5 text-slate-700 hover:bg-slate-50">
                Sign in
              </Link>
              <Link href="/register" className="text-center text-sm font-medium bg-[#0f4c5c] text-white rounded-lg py-2.5 hover:bg-[#0d3f4d]">
                Get started free
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center pt-16 pb-20 px-6 overflow-hidden">

        {/* Animated background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 right-10 w-96 h-96 rounded-full opacity-30"
            style={{ background: "radial-gradient(circle, #0f4c5c40 0%, transparent 70%)", animation: "float 6s ease-in-out infinite" }} />
          <div className="absolute bottom-20 left-10 w-72 h-72 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #0e749040 0%, transparent 70%)", animation: "float 8s ease-in-out infinite", animationDelay: "2s" }} />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #0f4c5c60 0%, transparent 70%)", animation: "float 5s ease-in-out infinite", animationDelay: "1s" }} />

          {/* Grid pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0f4c5c" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left — text */}
            <div>
              <div className="animate-slide-left stagger-1 inline-flex items-center gap-2 bg-[#0f4c5c]/10 text-[#0f4c5c] px-3 py-1.5 rounded-full text-xs font-semibold mb-6 border border-[#0f4c5c]/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0f4c5c] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0f4c5c]" />
                </span>
                Built for Zimbabwean schools · Live now
              </div>

              <h1 className="animate-slide-left stagger-2 text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                Manage your school
                <br />
                <span className="gradient-text">smarter</span>, not harder.
              </h1>

              <p className="animate-slide-left stagger-3 text-lg text-slate-500 mb-8 max-w-lg leading-relaxed">
                Xul365 is a modern school management system built for Zimbabwe. From ECD to Form 6 — manage students, fees, attendance, exams and more in one place.
              </p>

              <div className="animate-slide-left stagger-4 flex items-center gap-4 flex-wrap">
                <Link href="/register"
                  className="group flex items-center gap-2 bg-[#0f4c5c] text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-[#0d3f4d] transition-all duration-200 shadow-xl shadow-[#0f4c5c]/25 hover:-translate-y-1">
                  Start free trial
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/login"
                  className="flex items-center gap-2 text-slate-600 hover:text-[#0f4c5c] transition-colors font-medium">
                  Sign in to your school
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="animate-slide-left stagger-5 flex items-center gap-6 mt-8 flex-wrap">
                {["No credit card required", "14-day free trial", "Cancel anytime"].map((item) => (
                  <div key={item} className="flex items-center gap-1.5 text-sm text-slate-400">
                    <Check size={14} className="text-teal-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — animated dashboard mockup */}
            <div className="relative animate-slide-right stagger-2 hidden lg:block">

              {/* Main mockup */}
              <div className="rounded-2xl border border-slate-200 shadow-2xl overflow-hidden"
                style={{ boxShadow: "0 25px 60px rgba(15,76,92,0.15)" }}>
                {/* Navbar */}
                <div className="bg-[#0f4c5c] h-12 flex items-center px-4 gap-3">
                  <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-white text-xs font-bold">X</div>
                  <span className="text-white text-sm font-semibold">Xul365</span>
                  <div className="flex-1" />
                  <div className="flex gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-white/10" />
                    <div className="w-6 h-6 rounded-full bg-white/20" />
                  </div>
                </div>
                {/* Content */}
                <div className="bg-[#eef1f6] flex" style={{ height: 340 }}>
                  {/* Sidebar */}
                  <div className="w-40 bg-white border-r border-slate-100 p-2.5 space-y-1 shrink-0">
                    {["Dashboard", "Students", "Teachers", "Attendance", "Fees", "Exams"].map((item, i) => (
                      <div key={item}
                        className={`h-8 rounded-lg flex items-center px-2.5 text-xs font-medium transition-all ${
                          i === 0 ? "bg-[#0f4c5c] text-white" : "text-slate-400 hover:bg-slate-50"
                        }`}>
                        {item}
                      </div>
                    ))}
                  </div>
                  {/* Dashboard */}
                  <div className="flex-1 p-4 space-y-3 overflow-hidden">
                    {/* Stat cards */}
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "Students", value: "842", color: "#e1f5f0", textColor: "#0f4c5c" },
                        { label: "Teachers", value: "38", color: "#e6f1fb", textColor: "#185fa5" },
                        { label: "Attendance", value: "94%", color: "#eaf3de", textColor: "#3b6d11" },
                        { label: "Collected", value: "$12.4k", color: "#faeeda", textColor: "#854f0b" },
                      ].map(({ label, value, color, textColor }) => (
                        <div key={label} className="rounded-xl p-3 bg-white shadow-sm">
                          <p className="text-xs text-slate-400 mb-1">{label}</p>
                          <p className="text-lg font-bold" style={{ color: textColor }}>{value}</p>
                        </div>
                      ))}
                    </div>
                    {/* Activity */}
                    <div className="bg-white rounded-xl p-3 shadow-sm">
                      <p className="text-xs font-semibold text-slate-500 mb-2">Recent activity</p>
                      <div className="space-y-2">
                        {[
                          { text: "Tendai Moyo enrolled — Form 3A", time: "2m ago", dot: "bg-green-400" },
                          { text: "Invoice $450 created", time: "15m ago", dot: "bg-blue-400" },
                          { text: "Attendance recorded — 96%", time: "1h ago", dot: "bg-teal-400" },
                        ].map(({ text, time, dot }) => (
                          <div key={text} className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${dot} shrink-0`} />
                            <p className="text-xs text-slate-400 flex-1 truncate">{text}</p>
                            <p className="text-xs text-slate-300 shrink-0">{time}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <FloatingCard className="-top-6 -left-8 flex items-center gap-3" delay={0}>
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <Check size={16} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">Payment received</p>
                  <p className="text-xs text-slate-400">$450 · Form 3A</p>
                </div>
              </FloatingCard>

              <FloatingCard className="-bottom-4 -left-6 flex items-center gap-3" delay={1}>
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <GraduationCap size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">Student enrolled</p>
                  <p className="text-xs text-slate-400">Chipo Dube · Form 1</p>
                </div>
              </FloatingCard>

              <FloatingCard className="-bottom-2 -right-6 flex items-center gap-3" delay={2}>
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                  <TrendingUp size={16} className="text-teal-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">Attendance</p>
                  <p className="text-xs text-slate-400">94% today</p>
                </div>
              </FloatingCard>

            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section ref={statsSection.ref} className="py-16 px-6 bg-[#0f4c5c]">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCounter value={50} suffix="+" label="Schools using Xul365" inView={statsSection.inView} />
          <StatCounter value={12000} suffix="+" label="Students managed" inView={statsSection.inView} />
          <StatCounter value={98} suffix="%" label="Customer satisfaction" inView={statsSection.inView} />
          <StatCounter value={14} suffix=" days" label="Free trial for every school" inView={statsSection.inView} />
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#0f4c5c] mb-3 uppercase tracking-wide">Features</p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Everything your school needs</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Pick only the features your school needs. Pay for what you use and add more as you grow.
            </p>
          </div>

          {/* Feature tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {FEATURES.map((f, i) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setActiveFeature(i)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  activeFeature === i
                    ? "bg-[#0f4c5c] text-white shadow-lg shadow-[#0f4c5c]/20"
                    : "bg-white text-slate-500 border border-slate-200 hover:border-[#0f4c5c]/30"
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>

          {/* Active feature highlight */}
          <div className="bg-white rounded-2xl border border-slate-100 p-8 mb-10 shadow-sm transition-all duration-500">
            {(() => {
              const f = FEATURES[activeFeature]!
              const Icon = f.icon
              return (
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300"
                    style={{ backgroundColor: f.bg }}>
                    <Icon size={28} style={{ color: f.color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-800">{f.name}</h3>
                      {f.required && (
                        <span className="text-xs bg-[#0f4c5c]/10 text-[#0f4c5c] px-2 py-0.5 rounded-full font-medium">Required</span>
                      )}
                      <span className="text-sm font-bold text-[#0f4c5c] ml-auto">
                        ${f.price}<span className="text-xs font-normal text-slate-400">/mo</span>
                      </span>
                    </div>
                    <p className="text-slate-500">{f.description}</p>
                  </div>
                </div>
              )
            })()}
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {FEATURES.map(({ name, icon: Icon, color, bg, price }, i) => (
              <button
                key={name}
                type="button"
                onClick={() => setActiveFeature(i)}
                className={`text-left p-4 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 ${
                  activeFeature === i
                    ? "border-[#0f4c5c] bg-[#0f4c5c]/5 shadow-md"
                    : "border-slate-100 bg-white hover:shadow-sm"
                }`}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: bg }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <p className="text-xs font-semibold text-slate-700 mb-0.5">{name}</p>
                <p className="text-xs text-[#0f4c5c] font-bold">${price}/mo</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY XUL365 ===== */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#0f4c5c] mb-3 uppercase tracking-wide">Why Xul365</p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Built different. Built for Zimbabwe.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Data privacy by design",
                description: "Each school has its own isolated database. No school can see another school's data. Your students' data is yours alone.",
                color: "#0f4c5c",
                bg: "#e1f5f0",
              },
              {
                icon: Zap,
                title: "ZIMSEC-ready",
                description: "Built with Zimbabwe's curriculum in mind. Supports ECD A through Form 6, ZIMSEC grading, USD and ZiG currencies.",
                color: "#185fa5",
                bg: "#e6f1fb",
              },
              {
                icon: TrendingUp,
                title: "Grows with your school",
                description: "Start with just student management and add features as you grow. You only ever pay for what you actually use.",
                color: "#854f0b",
                bg: "#faeeda",
              },
            ].map(({ icon: Icon, title, description, color, bg }) => (
              <div key={title}
                className="group p-6 rounded-2xl border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: bg }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[#0f4c5c] mb-3 uppercase tracking-wide">Pricing</p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-slate-500 max-w-xl mx-auto mb-8">All prices in USD. No hidden fees.</p>

            <div className="inline-flex items-center bg-white rounded-xl p-1 gap-1 border border-slate-200 shadow-sm">
              {(["monthly", "annual"] as const).map((cycle) => (
                <button key={cycle} type="button"
                  onClick={() => setBillingCycle(cycle)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
                    billingCycle === cycle
                      ? "bg-[#0f4c5c] text-white shadow-md"
                      : "text-slate-500 hover:text-slate-700"
                  }`}>
                  {cycle}
                  {cycle === "annual" && (
                    <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                      billingCycle === "annual" ? "bg-white/20 text-white" : "bg-green-100 text-green-700"
                    }`}>
                      Save 20%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {BUNDLES.map((bundle) => {
              const price = getBundlePrice(bundle)
              const featureList = FEATURES.filter((f) => bundle.features.includes(f.key))
              return (
                <div key={bundle.name}
                  className={`rounded-2xl border p-6 flex flex-col transition-all duration-300 ${
                    bundle.highlight
                      ? "border-[#0f4c5c] bg-[#0f4c5c] text-white shadow-2xl shadow-[#0f4c5c]/25 scale-105"
                      : "border-slate-200 bg-white hover:shadow-lg hover:-translate-y-1"
                  }`}>
                  {bundle.highlight && (
                    <div className="text-xs font-semibold bg-white/20 text-white w-fit px-3 py-1 rounded-full mb-4 flex items-center gap-1.5">
                      <Star size={11} className="fill-current" />
                      Most popular
                    </div>
                  )}
                  <h3 className={`text-xl font-bold mb-2 ${bundle.highlight ? "text-white" : "text-slate-800"}`}>
                    {bundle.name}
                  </h3>
                  <p className={`text-sm mb-5 ${bundle.highlight ? "text-white/70" : "text-slate-500"}`}>
                    {bundle.description}
                  </p>
                  <div className="mb-6">
                    <span className={`text-4xl font-bold ${bundle.highlight ? "text-white" : "text-slate-900"}`}>
                      ${price.toFixed(0)}
                    </span>
                    <span className={`text-sm ml-1 ${bundle.highlight ? "text-white/60" : "text-slate-400"}`}>
                      /{billingCycle === "annual" ? "year" : "month"}
                    </span>
                  </div>
                  <ul className="space-y-2.5 flex-1 mb-6">
                    {featureList.map((f) => (
                      <li key={f.key} className="flex items-center gap-2.5 text-sm">
                        <Check size={15} className={bundle.highlight ? "text-white/80 shrink-0" : "text-teal-500 shrink-0"} />
                        <span className={bundle.highlight ? "text-white/90" : "text-slate-600"}>{f.name}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/register"
                    className={`block text-center py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      bundle.highlight
                        ? "bg-white text-[#0f4c5c] hover:bg-slate-50 shadow-lg"
                        : "bg-[#0f4c5c] text-white hover:bg-[#0d3f4d] hover:shadow-lg hover:shadow-[#0f4c5c]/20"
                    }`}>
                    Get started
                  </Link>
                </div>
              )
            })}
          </div>

          <p className="text-center text-sm text-slate-400 mt-8">
            Need a custom plan?{" "}
            <a href="#contact" className="text-[#0f4c5c] font-medium hover:underline">Contact us</a>
          </p>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="testimonials" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-[#0f4c5c] mb-3 uppercase tracking-wide">Testimonials</p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Trusted by Zimbabwe schools</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, text, initials }, i) => (
              <div key={name}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex gap-0.5 mb-4">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-5 italic">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0f4c5c]/10 text-[#0f4c5c] flex items-center justify-center text-xs font-bold">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{name}</p>
                    <p className="text-xs text-slate-400">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[#0f4c5c] mb-3 uppercase tracking-wide">FAQ</p>
            <h2 className="text-4xl font-bold text-slate-900">Common questions</h2>
          </div>

          <div className="space-y-3">
            {[
              { q: "Is Xul365 built specifically for Zimbabwe?", a: "Yes. Xul365 supports ZIMSEC grading, Zimbabwe grade levels from ECD A to Form 6, USD and ZiG currencies, and Zimbabwe phone formats for SMS notifications." },
              { q: "Can I choose only the features I need?", a: "Absolutely. Xul365 is fully modular. You start with student and teacher management and add features like fees, attendance, exams, and SMS as your school grows." },
              { q: "Is there a free trial?", a: "Yes — every new school gets a 14-day free trial with full access to all features. No credit card required to start." },
              { q: "Can multiple teachers log in?", a: "Yes. You can add multiple user accounts for teachers and administrators, each with their own login credentials." },
              { q: "Is my school's data private?", a: "Yes. Each school has its own isolated database. No school can access another school's data. Your data is yours." },
            ].map(({ q, a }, i) => (
              <div key={i}
                className="border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-[#0f4c5c]/30 transition-colors">
                <button type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left">
                  <span className="text-sm font-medium text-slate-800">{q}</span>
                  <ChevronDown size={16}
                    className={`text-slate-400 shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-48" : "max-h-0"}`}>
                  <div className="px-5 pb-4">
                    <p className="text-sm text-slate-500 leading-relaxed">{a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-24 px-6 bg-[#0f4c5c] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, white 0%, transparent 70%)", animation: "float 6s ease-in-out infinite" }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-5"
            style={{ background: "radial-gradient(circle, white 0%, transparent 70%)", animation: "float 8s ease-in-out infinite", animationDelay: "3s" }} />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to modernise your school?
          </h2>
          <p className="text-white/70 mb-8 text-lg">
            Join schools across Zimbabwe already using Xul365. Start your free trial today.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/register"
              className="group flex items-center gap-2 bg-white text-[#0f4c5c] px-6 py-3.5 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-200 shadow-xl hover:-translate-y-0.5">
              Start free trial
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#contact"
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors font-medium">
              Talk to us first
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[#0f4c5c] mb-3 uppercase tracking-wide">Contact</p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Get in touch</h2>
            <p className="text-slate-500">Have questions? We are here to help.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Phone, label: "Phone", value: "+263 77 000 0000" },
              { icon: Mail, label: "Email", value: "hello@xul365.co.zw" },
              { icon: MapPin, label: "Location", value: "Harare, Zimbabwe" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label}
                className="group bg-white rounded-2xl p-6 border border-slate-100 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#0f4c5c]/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#0f4c5c]/20 transition-colors">
                  <Icon size={22} className="text-[#0f4c5c]" />
                </div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{label}</p>
                <p className="text-sm font-medium text-slate-700">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">
            <div className="max-w-xs">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#0f4c5c] flex items-center justify-center text-white font-bold text-xs">X</div>
                <span className="text-white font-bold">Xul365</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Modern school management for Zimbabwe. Built with love for African schools.
              </p>
              <p className="text-xs text-slate-600 mt-3">Made in Zimbabwe 🇿🇼</p>
            </div>

            <div className="grid grid-cols-2 gap-x-16 gap-y-2.5">
              {[
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "#pricing" },
                { label: "Testimonials", href: "#testimonials" },
                { label: "Contact", href: "#contact" },
                { label: "Sign in", href: "/login" },
                { label: "Register", href: "/register" },
              ].map(({ label, href }) =>
                href.startsWith("#") ? (
                  <a key={label} href={href} className="text-sm text-slate-500 hover:text-white transition-colors">
                    {label}
                  </a>
                ) : (
                  <Link key={label} href={href} className="text-sm text-slate-500 hover:text-white transition-colors">
                    {label}
                  </Link>
                )
              )}
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 flex items-center justify-between">
            <p className="text-xs text-slate-600">© {new Date().getFullYear()} Xul365. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  )
}