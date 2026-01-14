export type StanceValue = -3 | -2 | -1 | 0 | 1 | 2 | 3;

export type UserStance = "supporting" | "opposing" | "neutral";

export const STANCE_OPTIONS: Array<{ value: StanceValue; label: string }> = [
  { value: -3, label: "極度不支持" },
  { value: -2, label: "不支持" },
  { value: -1, label: "稍微不支持" },
  { value: 0, label: "中立" },
  { value: 1, label: "稍微支持" },
  { value: 2, label: "支持" },
  { value: 3, label: "極度支持" }
];

export function stanceValueToLabel(value: number): string {
  const found = STANCE_OPTIONS.find((option) => option.value === value);
  return found?.label ?? "中立";
}

export function stanceValueToScore(value: number): number {
  switch (value) {
    case -3:
      return 0;
    case -1:
      return 33;
    case -2:
      return 16;
    case 1:
      return 66;
    case 2:
      return 83;
    case 3:
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
