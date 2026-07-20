/** Chip con tono y opcional ícono lucide (portado del `Chip` base). */
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface ChipProps {
  tone?: string;
  icon?: LucideIcon;
  children: ReactNode;
}

export function Chip({ tone = "", icon: Icon, children }: ChipProps) {
  return (
    <span className={"chip " + tone}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
}
