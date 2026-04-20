"use client";

import { useState } from "react";
import type { ReactNode, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Shield,
  ArrowUpRight,
  ArrowLeft,
  Building2,
  CheckCircle2,
  XCircle,
  Sparkles,
  Loader2,
  Send,
} from "lucide-react";

export default function Home() {
  const [mode, setMode] = useState<"home" | "form">("home");

  return (
    <main className="relative min-h-screen">
      <AnimatePresence mode="wait">
        {mode === "home" ? (
          <HomeView key="home" onOpenForm={() => setMode("form")} />
        ) : (
          <FormView key="form" goBack={() => setMode("home")} />
        )}
      </AnimatePresence>
    </main>
  );
}

/* ─────────────────────────── HOME ─────────────────────────── */

function HomeView({ onOpenForm }: { onOpenForm: () => void }) {
  const router = useRouter();

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10 md:px-12 md:py-16"
    >
      {/* Top bar */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/30 to-indigo-500/10 ring-1 ring-white/10">
            <GraduationCap className="h-4 w-4 text-blue-300" />
          </div>
          <span
            className="text-sm tracking-[0.22em] text-zinc-400 uppercase"
            data-testid="brand-tag"
          >
            NIT Hamirpur · Placements
          </span>
        </div>
        <div className="hidden items-center gap-2 text-xs text-zinc-500 md:flex">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Confidential recommendations</span>
        </div>
      </header>

      {/* Hero */}
      <div className="mt-20 md:mt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-widest text-zinc-300 backdrop-blur-md"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live · Academic Year 2025-26
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="mt-6 font-heading text-5xl font-semibold leading-[1.02] tracking-tight text-white md:text-7xl"
          data-testid="home-headline"
        >
          Company{" "}
          <span className="bg-gradient-to-r from-blue-300 via-indigo-200 to-white bg-clip-text text-transparent">
            Suggestion
          </span>{" "}
          Portal.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7 }}
          className="mt-6 max-w-xl text-lg text-zinc-400"
        >
          Submit your placement recommendations or manage the admin dashboard —
          built for the students and team behind NIT Hamirpur Placements.
        </motion.p>
      </div>

      {/* Bento CTAs */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08, delayChildren: 0.35 } },
        }}
        className="mt-16 grid grid-cols-1 gap-6 md:mt-24 md:grid-cols-2 md:gap-8"
      >
        <BentoCard
          testId="cta-suggest-company"
          onClick={onOpenForm}
          accent="from-blue-500/25 via-blue-500/5 to-transparent"
          icon={<GraduationCap className="h-5 w-5 text-blue-300" />}
          label="For Students"
          title="Suggest a Company"
          desc="Recommend companies for upcoming campus placement drives."
          cta="Open suggestion form"
        />
        <BentoCard
          testId="cta-admin-panel"
          onClick={() => router.push("/admin")}
          accent="from-indigo-500/25 via-indigo-500/5 to-transparent"
          icon={<Shield className="h-5 w-5 text-indigo-300" />}
          label="For Admins"
          title="Admin Panel"
          desc="Review, approve & export suggestions securely."
          cta="Enter dashboard"
        />
      </motion.div>

      <footer className="mt-auto pt-16 text-xs text-zinc-600">
        <div className="hairline mb-6 h-px w-full" />
        © {new Date().getFullYear()} NIT Hamirpur · Training & Placement Cell
      </footer>
    </motion.section>
  );
}

function BentoCard({
  onClick,
  icon,
  label,
  title,
  desc,
  cta,
  accent,
  testId,
}: {
  onClick: () => void;
  icon: ReactNode;
  label: string;
  title: string;
  desc: string;
  cta: string;
  accent: string;
  testId: string;
}) {
  return (
    <motion.button
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
      }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      onClick={onClick}
      data-testid={testId}
      className="group glass relative overflow-hidden rounded-2xl p-8 text-left md:p-10"
    >
      {/* Accent glow */}
      <div
        className={`pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-gradient-to-br ${accent} blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-70`}
      />

      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-white/10">
          {icon}
        </div>
        <span className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
          {label}
        </span>
      </div>

      <h3 className="mt-10 font-heading text-3xl font-semibold tracking-tight text-white md:text-4xl">
        {title}
      </h3>
      <p className="mt-3 max-w-md text-sm text-zinc-400">{desc}</p>

      <div className="mt-10 flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-300">{cta}</span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.04] ring-1 ring-white/10 transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-[-2px] group-hover:bg-white/[0.08]">
          <ArrowUpRight className="h-4 w-4 text-white" />
        </span>
      </div>
    </motion.button>
  );
}

/* ─────────────────────────── FORM ─────────────────────────── */

function FormView({ goBack }: { goBack: () => void }) {
  const [form, setForm] = useState({
    companyName: "",
    studentName: "",
    branch: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.companyName || !form.studentName || !form.branch) {
      showToast("Please fill all required fields", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/suggestions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const data = await res.json();
      showToast(data.message || "Submitted successfully");
      setForm({ companyName: "", studentName: "", branch: "", reason: "" });
    } catch {
      showToast("Server error", "error");
    }
    setLoading(false);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-10 md:px-12 md:py-16"
    >
      <Toast toast={toast} />

      <button
        onClick={goBack}
        data-testid="form-back-button"
        className="group inline-flex w-fit items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Back to portal
      </button>

      <div className="mt-10 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/30 to-indigo-500/10 ring-1 ring-white/10">
          <Building2 className="h-5 w-5 text-blue-300" />
        </div>
        <div>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Suggest a Company
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            All fields marked <span className="text-rose-400">*</span> are
            required
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        data-testid="suggestion-form"
        className="glass mt-10 space-y-6 rounded-2xl p-6 md:p-10"
      >
        <Field
          label="Company Name"
          name="companyName"
          required
          value={form.companyName}
          onChange={handleChange}
          placeholder="e.g. Goldman Sachs"
          testId="input-company-name"
        />
        <Field
          label="Your Name"
          name="studentName"
          required
          value={form.studentName}
          onChange={handleChange}
          placeholder="e.g. Rahul Sharma"
          testId="input-student-name"
        />
        <Field
          label="Branch"
          name="branch"
          required
          value={form.branch}
          onChange={handleChange}
          placeholder="e.g. Computer Science"
          testId="input-branch"
        />

        <div className="space-y-2">
          <label className="flex items-center justify-between text-sm text-zinc-300">
            <span>Reason</span>
            <span className="text-[11px] uppercase tracking-widest text-zinc-500">
              Optional
            </span>
          </label>
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            data-testid="input-reason"
            rows={4}
            placeholder="Why should this company be invited?"
            className="w-full resize-none rounded-lg border border-white/[0.1] bg-black/40 px-4 py-3 text-sm text-white placeholder-zinc-500 transition-all focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          data-testid="submit-suggestion-button"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 font-medium text-white shadow-lg shadow-blue-900/30 transition-all hover:scale-[1.01] hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-900/50 focus:ring-2 focus:ring-blue-500/50 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Submit suggestion
            </>
          )}
        </button>
      </form>
    </motion.section>
  );
}

function Field({
  label,
  name,
  required,
  value,
  onChange,
  placeholder,
  testId,
}: {
  label: string;
  name: string;
  required?: boolean;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  testId: string;
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-1 text-sm text-zinc-300">
        {label}
        {required && <span className="text-rose-400">*</span>}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        data-testid={testId}
        className="w-full rounded-lg border border-white/[0.1] bg-black/40 px-4 py-3 text-sm text-white placeholder-zinc-500 transition-all focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
      />
    </div>
  );
}

/* ─────────────────────────── TOAST ─────────────────────────── */

export function Toast({
  toast,
}: {
  toast: { msg: string; type: "success" | "error" } | null;
}) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="fixed left-1/2 top-6 z-50 -translate-x-1/2"
          data-testid="toast"
        >
          <div
            className={`glass flex items-center gap-2 rounded-full px-4 py-2 text-sm ${
              toast.type === "success"
                ? "text-emerald-300"
                : "text-rose-300"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            {toast.msg}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}