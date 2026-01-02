"use client";

import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  title: string;
  onConfirm: (value: number) => void;
  onClose: () => void;
  label?: string;
};

export default function StanceModal({ open, title, onConfirm, onClose, label }: Props) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (open) setValue(0);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="glass w-full max-w-md rounded-2xl p-5">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button className="text-xs text-white/60" onClick={onClose}>
            關閉
          </button>
        </div>
        <p className="mt-2 text-xs text-white/60">
          {label ?? "往右代表支持，往左代表反對"}
        </p>
        <div className="mt-4 space-y-3">
          <input
            type="range"
            min={-100}
            max={100}
            value={value}
            onChange={(event) => setValue(Number(event.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-white/60">
            <span>反對</span>
            <span>{value}</span>
            <span>支持</span>
          </div>
          <button
            className="w-full rounded-xl bg-white/10 px-4 py-2 text-sm"
            onClick={() => onConfirm(value)}
          >
            確定
          </button>
        </div>
      </div>
    </div>
  );
}
