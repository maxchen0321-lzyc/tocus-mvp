export type StanceValue = -2 | -1 | 0 | 1 | 2;

export type UserStance = "supporting" | "opposing" | "neutral";

export const STANCE_OPTIONS: Array<{ value: StanceValue; label: string }> = [
  { value: -2, label: "極度不認同" },
  { value: -1, label: "不認同" },
  { value: 0, label: "中立" },
  { value: 1, label: "認同" },
  { value: 2, label: "極度認同" }
];

export function stanceValueToLabel(value: number): string {
  const found = STANCE_OPTIONS.find((option) => option.value === value);
  return found?.label ?? "中立";
}

export function stanceValueToScore(value: number): number {
  switch (value) {
    case -2:
      return 0;
    case -1:
      return 25;
    case 1:
      return 75;
    case 2:
      return 100;
    case 0:
    default:
      return 50;
  }
}

export function stanceValueToUserStance(value: number): UserStance {
  if (value <= -1) return "opposing";
  if (value >= 1) return "supporting";
  return "neutral";
}

