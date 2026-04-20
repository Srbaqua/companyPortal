"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Shield,
  ArrowDown,
  CheckCircle2,
  XCircle,
  Inbox,
  Loader2,
  LayoutDashboard,
  FileSpreadsheet,
  Database,
} from "lucide-react";

type Suggestion = {
  _id: string;
  companyName: string;
  studentName: string;
  branch: string;
  reason: string;
  status: "new" | "duplicate" | "approved" | "rejected";
};

const statusMeta: Record<
  Suggestion["status"],
  { label: string; ring: string; text: string; bg: string; dot: string }
> = {
  new: {
    label: "New",
    ring: "ring-blue-500/30",
    text: "text-blue-300",
    bg: "bg-blue-500/10",
    dot: "bg-blue-400",
  },
  duplicate: {
    label: "Duplicate",
    ring: "ring-amber-500/30",
    text: "text-amber-300",
    bg: "bg-amber-500/10",
    dot: "bg-amber-400",
  },
  approved: {
    label: "Approved",
    ring: "ring-emerald-500/30",
    text: "text-emerald-300",
    bg: "bg-emerald-500/10",
    dot: "bg-emerald-400",
  },
  rejected: {
    label: "Rejected",
    ring: "ring-rose-500/30",
    text: "text-rose-300",
    bg: "bg-rose-500/10",
    dot: "bg-rose-400",
  },
};

export default function AdminPage() {
  const API = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  const [adminKey, setAdminKey] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeTab, setActiveTab] = useState<"new" | "approved" | "rejected">("new");
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const getApiOrToast = () => {
    if (!API) {
      showToast("NEXT_PUBLIC_API_URL is not set", "error");
      return null;
    }
    return API;
  };

  const loadSuggestions = async () => {
    const api = getApiOrToast();
    if (!api) return;

    setLoading(true);
    try {
      const res = await fetch(`${api}/api/admin/suggestions`, {
        headers: { "x-admin-key": adminKey },
      });
      const data = await res.json();
      if (!res.ok) {
        showToast("Invalid admin key", "error");
        setLoading(false);
        return;
      }
      setSuggestions(data);
      setIsAuth(true);
      showToast("Access granted");
    } catch {
      showToast("Server error", "error");
    }
    setLoading(false);
  };

  const handleAccept = async (id: string) => {
    const api = getApiOrToast();
    if (!api) return;

    const res = await fetch(`${api}/api/admin/accept/${id}`, {
      method: "POST",
      headers: { "x-admin-key": adminKey },
    });

    if (!res.ok) {
      showToast("Failed to accept suggestion", "error");
      return;
    }

    showToast("Suggestion accepted");
    loadSuggestions();
  };

  const handleReject = async (id: string) => {
    const api = getApiOrToast();
    if (!api) return;

    const res = await fetch(`${api}/api/admin/reject/${id}`, {
      method: "POST",
      headers: { "x-admin-key": adminKey },
    });

    if (!res.ok) {
      showToast("Failed to reject suggestion", "error");
      return;
    }

    showToast("Suggestion rejected", "error");
    loadSuggestions();
  };

  const downloadFile = async (url: string, filename: string) => {
    const res = await fetch(url, { headers: { "x-admin-key": adminKey } });
    if (!res.ok) {
      showToast("Unauthorized", "error");
      return;
    }
    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const filtered = suggestions.filter((s) => {
    if (activeTab === "new") return s.status === "new" || s.status === "duplicate";
    return s.status === activeTab;
  });

  const counts = {
    new: suggestions.filter(
      (s) => s.status === "new" || s.status === "duplicate",
    ).length,
    approved: suggestions.filter((s) => s.status === "approved").length,
    rejected: suggestions.filter((s) => s.status === "rejected").length,
  };

  /* ────────── Gate ────────── */
  if (!isAuth) {
    return (
      <main className="relative flex min-h-screen items-center justify-center px-6">
        <Toast toast={toast} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="glass w-full max-w-md rounded-2xl p-8 md:p-10"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/30 to-indigo-500/10 ring-1 ring-white/10">
            <Lock className="h-5 w-5 text-blue-300" />
          </div>
          <h1 className="mt-6 font-heading text-3xl font-semibold tracking-tight text-white">
            Admin Access
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Enter your key to continue into the dashboard.
          </p>

          <div className="mt-8 space-y-4">
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadSuggestions()}
              placeholder="Admin key"
              data-testid="admin-key-input"
              className="w-full rounded-lg border border-white/[0.1] bg-black/40 px-4 py-3 text-sm text-white placeholder-zinc-500 transition-all focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            />
            <button
              onClick={loadSuggestions}
              disabled={loading}
              data-testid="admin-enter-button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-medium text-white shadow-lg shadow-blue-900/30 transition-all hover:scale-[1.01] hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" /> Enter Dashboard
                </>
              )}
            </button>
          </div>
        </motion.div>
      </main>
    );
  }

  /* ────────── Dashboard ────────── */
  return (
    <main className="relative mx-auto min-h-screen max-w-6xl px-6 py-10 md:px-12 md:py-14">
      <Toast toast={toast} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.04] ring-1 ring-white/10">
            <LayoutDashboard className="h-4 w-4 text-blue-300" />
          </div>
          <div>
            <h1
              className="font-heading text-3xl font-semibold tracking-tight md:text-4xl"
              data-testid="admin-title"
            >
              Company Dashboard
            </h1>
            <p className="mt-1 text-xs uppercase tracking-[0.22em] text-zinc-500">
              NIT Hamirpur · Control Room
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ExportBtn
            testId="export-suggestions-button"
            icon={<FileSpreadsheet className="h-4 w-4" />}
            label="Suggestions"
            onClick={() =>
              downloadFile(
                `${API}/api/admin/export/suggestions`,
                "suggestions.xlsx",
              )
            }
          />
          <ExportBtn
            testId="export-database-button"
            icon={<Database className="h-4 w-4" />}
            label="Full Database"
            onClick={() =>
              downloadFile(
                `${API}/api/admin/export/companies`,
                "companies.xlsx",
              )
            }
          />
        </div>
      </motion.div>

      {/* Stat strip */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
        }}
        className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4"
      >
        <Stat label="Total" value={suggestions.length} />
        <Stat label="Pending" value={counts.new} tint="text-blue-300" />
        <Stat label="Approved" value={counts.approved} tint="text-emerald-300" />
        <Stat label="Rejected" value={counts.rejected} tint="text-rose-300" />
      </motion.div>

      {/* Tabs */}
      <div className="mt-10 flex items-center gap-2">
        <div className="glass inline-flex rounded-full p-1">
          {(["new", "approved", "rejected"] as const).map((tab) => {
            const label =
              tab === "new"
                ? "Pending"
                : tab === "approved"
                  ? "Approved"
                  : "Rejected";
            const active = activeTab === tab;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                data-testid={`tab-${tab}`}
                className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-white/[0.08] text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {label}
                <span
                  className={`rounded-full px-1.5 py-px text-[10px] ${
                    active
                      ? "bg-white/[0.12] text-white"
                      : "bg-white/[0.04] text-zinc-400"
                  }`}
                >
                  {counts[tab]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      <motion.div
        key={activeTab}
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.04 } },
        }}
        className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass col-span-full flex flex-col items-center justify-center rounded-2xl p-16 text-center"
              data-testid="empty-state"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/10">
                <Inbox className="h-6 w-6 text-zinc-400" />
              </div>
              <p className="mt-5 text-sm text-zinc-400">
                No {activeTab === "new" ? "pending" : activeTab} suggestions
              </p>
            </motion.div>
          ) : (
            filtered.map((item) => (
              <SuggestionCard
                key={item._id}
                item={item}
                onAccept={() => handleAccept(item._id)}
                onReject={() => handleReject(item._id)}
              />
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}

/* ─────────────────────────── SUB-COMPONENTS ─────────────────────────── */

function ExportBtn({
  onClick,
  icon,
  label,
  testId,
}: {
  onClick: () => void;
  icon: ReactNode;
  label: string;
  testId: string;
}) {
  return (
    <button
      onClick={onClick}
      data-testid={testId}
      className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-zinc-200 backdrop-blur-lg transition hover:border-white/20 hover:bg-white/[0.06]"
    >
      <ArrowDown className="h-3.5 w-3.5 opacity-70 transition group-hover:translate-y-0.5" />
      {icon}
      {label}
    </button>
  );
}

function Stat({
  label,
  value,
  tint,
}: {
  label: string;
  value: number;
  tint?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 },
      }}
      className="glass overflow-hidden rounded-2xl p-5"
      data-testid={`stat-${label.toLowerCase()}`}
    >
      <div className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
        {label}
      </div>
      <div
        className={`mt-2 font-heading text-3xl font-semibold tracking-tight md:text-4xl ${
          tint ?? "text-white"
        }`}
      >
        {value}
      </div>
    </motion.div>
  );
}

function SuggestionCard({
  item,
  onAccept,
  onReject,
}: {
  item: Suggestion;
  onAccept: () => void;
  onReject: () => void;
}) {
  const meta = statusMeta[item.status];
  const actionable = item.status === "new" || item.status === "duplicate";

  return (
    <motion.div
      layout
      variants={{
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0 },
      }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="glass group relative overflow-hidden rounded-2xl p-6"
      data-testid={`suggestion-card-${item._id}`}
    >
      {/* Status accent bar */}
      <div
        className={`absolute left-0 top-0 h-full w-[3px] ${meta.bg.replace("/10", "/60")}`}
      />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-heading text-xl font-semibold tracking-tight text-white">
            {item.companyName}
          </h3>
          <p className="mt-1 text-xs text-zinc-400">
            <span className="text-zinc-200">{item.studentName}</span>
            <span className="mx-2 text-zinc-600">·</span>
            {item.branch}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ${meta.ring} ${meta.bg} ${meta.text}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
          {meta.label}
        </span>
      </div>

      {item.reason && (
        <p className="mt-4 rounded-lg border border-white/[0.06] bg-black/20 p-3 text-sm leading-relaxed text-zinc-300">
          {item.reason}
        </p>
      )}

      {actionable && (
        <div className="mt-5 flex gap-2">
          <button
            onClick={onAccept}
            data-testid={`accept-button-${item._id}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-500/15 px-3 py-2 text-sm font-medium text-emerald-300 ring-1 ring-emerald-500/30 transition hover:bg-emerald-500/25"
          >
            <CheckCircle2 className="h-4 w-4" />
            Accept
          </button>
          <button
            onClick={onReject}
            data-testid={`reject-button-${item._id}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-rose-500/15 px-3 py-2 text-sm font-medium text-rose-300 ring-1 ring-rose-500/30 transition hover:bg-rose-500/25"
          >
            <XCircle className="h-4 w-4" />
            Reject
          </button>
        </div>
      )}
    </motion.div>
  );
}

/* ─────────────────────────── TOAST ─────────────────────────── */

function Toast({
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
              toast.type === "success" ? "text-emerald-300" : "text-rose-300"
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