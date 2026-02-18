import { Mic, BarChart3, Shield, Eye, Store, GraduationCap, HeartPulse, Building2, Upload, Search, FileText, Zap, Lock, TrendingUp } from "lucide-react";

// Zig-zag feature rows (alternating image/text layout)
export const features = [
  {
    title: "Intelligent Voice Capture",
    description: "VOIX passively captures every in-person interaction with military-grade audio processing. Our proprietary AI filters background noise, identifies speakers, and delivers crystal-clear transcriptions in real time — no manual input required.",
    imageLabel: "Voice Capture Dashboard",
  },
  {
    title: "Automated Performance Auditing",
    description: "Go beyond subjective reviews. VOIX scores every interaction against your custom benchmarks — tracking compliance, sentiment, talk ratios, and key phrase usage. Managers get objective, data-backed performance reports delivered automatically.",
    imageLabel: "Audit Analytics View",
  },
  {
    title: "Actionable Intelligence at Scale",
    description: "Surface trends across thousands of interactions instantly. VOIX's analytics engine identifies coaching opportunities, compliance risks, and top-performer patterns — turning raw voice data into strategic business decisions.",
    imageLabel: "Intelligence Overview",
  },
  {
    title: "Real-Time Monitoring & Alerts",
    description: "Stay informed the moment it matters. Configure custom triggers for compliance keywords, escalation signals, or sentiment shifts — and receive instant notifications so your team can act before issues grow.",
    imageLabel: "Live Monitoring Panel",
  },
];

// "Why VOIX" — 3 minimalist value-prop cards
export const whyVoix = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Deploy in minutes, not months. VOIX integrates seamlessly with your existing infrastructure.",
  },
  {
    icon: Lock,
    title: "Enterprise Secure",
    description: "SOC 2 compliant with end-to-end encryption. Your data never leaves your control.",
  },
  {
    icon: TrendingUp,
    title: "Proven ROI",
    description: "Customers see a 40% improvement in compliance scores within the first 90 days.",
  },
];

export const howItWorks = [
  {
    step: 1,
    icon: Upload,
    title: "Capture",
    description: "Deploy VOIX in your environment to passively capture voice interactions.",
  },
  {
    step: 2,
    icon: Search,
    title: "Analyze",
    description: "Our AI engine transcribes, scores, and surfaces actionable insights automatically.",
  },
  {
    step: 3,
    icon: FileText,
    title: "Act",
    description: "Review dashboards, coach your team, and drive measurable performance improvements.",
  },
];

export const useCases = [
  {
    icon: Store,
    title: "Retail",
    description: "Monitor in-store customer interactions to improve sales conversion and service quality.",
    imageLabel: "Retail Environment",
  },
  {
    icon: HeartPulse,
    title: "Healthcare",
    description: "Ensure patient-provider communication meets compliance and quality standards.",
    imageLabel: "Healthcare Setting",
  },
  {
    icon: GraduationCap,
    title: "Education",
    description: "Evaluate teaching quality and student engagement through objective voice analysis.",
    imageLabel: "Education Campus",
  },
  {
    icon: Building2,
    title: "Enterprise",
    description: "Scale voice intelligence across departments to drive consistency and operational excellence.",
    imageLabel: "Enterprise Office",
  },
];

export const teamSection = {
  heading: "Meet the Team",
  bannerLabel: "Team Banner",
  barText: "The people building the future of voice intelligence — united by a mission to make every conversation count.",
};

export const teamMembers = [
  {
    name: "Sarah Chen",
    role: "CEO & Co-Founder",
    initials: "SC",
  },
  {
    name: "Marcus Williams",
    role: "CTO & Co-Founder",
    initials: "MW",
  },
  {
    name: "Elena Rodriguez",
    role: "VP of Product",
    initials: "ER",
  },
  {
    name: "David Kim",
    role: "Head of AI Research",
    initials: "DK",
  },
];
