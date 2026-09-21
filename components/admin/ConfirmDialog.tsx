"use client";

import React from "react";
import { AlertCircle, ShieldCheck, AlertTriangle, Loader2, X } from "lucide-react";

type ConfirmTone = "amber" | "emerald" | "red";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: ConfirmTone;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const TONE_STYLES: Record<ConfirmTone, {
  iconContainer: string;
  text: string;
  confirmButton: string;
}> = {
  amber: {
    iconContainer: "p-2.5 bg-amber-50 rounded-xl",
    text: "text-amber-600",
    confirmButton: "bg-amber-600 hover:bg-amber-700",
  },
  emerald: {
    iconContainer: "p-2.5 bg-emerald-50 rounded-xl",
    text: "text-emerald-600",
    confirmButton: "bg-emerald-600 hover:bg-emerald-700",
  },
  red: {
    iconContainer: "p-2.5 bg-red-50 rounded-xl",
    text: "text-red-600",
    confirmButton: "bg-red-600 hover:bg-red-700",
  },
};

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel = "Cancel",
  tone = "amber",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const styles = TONE_STYLES[tone];
  const Icon = tone === "emerald" ? ShieldCheck : tone === "red" ? AlertTriangle : AlertCircle;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={loading ? undefined : onCancel} />
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-zinc-100 space-y-4 relative">
        <button
          onClick={onCancel}
          disabled={loading}
          className="absolute top-4 right-4 p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all cursor-pointer disabled:opacity-50"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-3">
          <div className={styles.iconContainer}>
            <Icon size={22} className={styles.text} />
          </div>
          <h3 className="text-lg font-bold text-zinc-900">{title}</h3>
        </div>

        <p className="text-sm text-zinc-600">{message}</p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer ${styles.confirmButton}`}
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}