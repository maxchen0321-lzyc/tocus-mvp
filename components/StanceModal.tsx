"use client";

import { useEffect, useState } from "react";
import { STANCE_OPTIONS, stanceValueToLabel } from "@/lib/stance";

type Props = {
  open: boolean;
  title: string;
  onConfirm: (value: number) => void;
  onClose: () => void;
  label?: string;
  confirmDisabled?: boolean;
  confirmHint?: string;
  initialValue?: number;
};

export default function StanceModal({
  open,
  title,
  onConfirm,
  onClose,
  label,
  confirmDisabled,
  confirmHint,
  initialValue
}: Props) {
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    if (open) setValue(initialValue ?? 0);
  }, [open, initialValue]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-text/60 p-4">
      <div className="glass w-full max-w-md rounded-2xl p-5">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button className="text-xs text-muted" onClick={onClose}>
            關閉
          </button>
        </div>
        <p className="mt-2 text-xs text-muted">{label ?? "請選擇你的立場"}</p>
        <div className="mt-4 space-y-4">
          <div role="radiogroup" aria-label="立場選擇">
            <div className="grid grid-cols-7 gap-2 text-center text-[11px] leading-tight text-muted">
              {STANCE_OPTIONS.map((option) => {
                const isSelected = option.value === value;
                const isExtreme = option.value === -3 || option.value === 3;
                const isSlight = option.value === -1 || option.value === 1;
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={`flex min-h-[28px] flex-col items-center justify-start ${
                      isSelected ? "font-semibold text-text" : undefined
                    }`}
                    onClick={() => setValue(option.value)}
                  >
                    {isExtreme ? (
                      <>
                        <span className="block">極度</span>
                        <span className="block whitespace-nowrap">
                          {option.value === -3 ? "不支持" : "支持"}
                        </span>
                      </>
                    ) : isSlight ? (
                      <>
                        <span className="block">稍微</span>
                        <span className="block whitespace-nowrap">
                          {option.value === -1 ? "不支持" : "支持"}
                        </span>
                      </>
                    ) : (
                      <span>{option.label}</span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-2 grid h-10 grid-cols-7 place-items-center gap-2">
              {STANCE_OPTIONS.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    className="flex w-full items-center justify-center"
                    onClick={() => setValue(option.value)}
                  >
                    <span
                      className={`h-4 w-4 rounded-full border ${
                        isSelected ? "border-text/80 bg-text/80" : "border-border/80"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
          <div className="text-center text-xs text-muted">
            目前選擇：{stanceValueToLabel(value)}
          </div>
          {confirmHint ? <p className="text-xs text-accent">{confirmHint}</p> : null}
          <button
            className="w-full rounded-xl bg-accent px-4 py-2 text-sm text-text transition hover:bg-accent-muted disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-accent-muted"
            onClick={() => onConfirm(value)}
            disabled={confirmDisabled}
          >
            {confirmDisabled ? "處理中" : "確定"}
          </button>
        </div>
      </div>
    </div>
  );
}
