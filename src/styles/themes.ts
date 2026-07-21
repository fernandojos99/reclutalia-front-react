/**
 * Variantes de estilo (temas) — portadas 1:1 de `App.jsx` (const THEMES).
 * Cada tema redefine tokens del :root vía [data-theme]. Los semánticos de estado
 * (--ai, --ok, --bad, --warn) se mantienen iguales a propósito en todos los temas.
 */
export interface Theme {
  id: string;
  nombre: string;
  vars: Record<string, string>;
}

export const THEMES: Record<string, Theme> = {
  clasico: { id: "clasico", nombre: "Clásico Radar de Candidatos", vars: {} },
  talentoActivo: { id: "talentoActivo", nombre: "Talento en Acción", vars: {
    "font-body": "'Inter',system-ui,-apple-system,'Helvetica Neue',Arial,sans-serif",
    ink: "#0C4A6E", ink2: "#0369A1", paper: "#FFFFFF", bg: "#F0F9FF",
    gold: "#16A34A", "gold-soft": "#DCFCE7", "gold-dark": "#15803D",
    line: "#BAE6FD", gray: "#5B7A94", "input-bg": "#FFFFFF",
    "side-bg": "#0369A1", "side-text": "#FFFFFF", "side-text-dim": "#BAE6FD", "side-hover-bg": "#0EA5E9",
    "side-active-bg": "#FFFFFF", "side-active-text": "#16A34A", "side-logo-bg": "#16A34A", "side-logo-text": "#FFFFFF",
    "side-box-bg": "#0284C7", "side-select-bg": "#0369A1", "side-select-border": "#0EA5E9", "side-border": "transparent",
    "accent-dark-bg": "#0C4A6E", "accent-dark-text": "#FFFFFF",
    "r-1": "8px", "r-2": "10px", "r-3": "14px", "r-4": "22px", "r-pill": "99px",
    "shadow-card": "0 4px 14px rgba(3,105,161,0.10)", "shadow-modal": "0 20px 50px rgba(3,105,161,0.25)",
    overlay: "rgba(3,42,66,0.55)", "celebrate-1": "#0369A1", "celebrate-2": "#16A34A",
  } },
  corporativo: { id: "corporativo", nombre: "LinkedIn0", vars: {
    "font-body": "'Inter',system-ui,-apple-system,'Helvetica Neue',Arial,sans-serif",
    ink: "#212121", ink2: "#666666", paper: "#FFFFFF", bg: "#F3F2EF",
    gold: "#0A66C2", "gold-soft": "#E8F0FE", "gold-dark": "#004182",
    line: "#E0DFDC", gray: "#666666", "input-bg": "#FFFFFF",
    "side-bg": "#FFFFFF", "side-text": "#313335", "side-text-dim": "#666666", "side-hover-bg": "#F3F2EF",
    "side-active-bg": "#E8F0FE", "side-active-text": "#0A66C2", "side-logo-bg": "#0A66C2", "side-logo-text": "#FFFFFF",
    "side-box-bg": "#F3F2EF", "side-select-bg": "#FFFFFF", "side-select-border": "#E0DFDC", "side-border": "#E0DFDC",
    "accent-dark-bg": "#212121", "accent-dark-text": "#FFFFFF",
    "r-1": "6px", "r-2": "8px", "r-3": "8px", "r-4": "12px", "r-pill": "8px",
    "shadow-card": "none", "shadow-modal": "0 8px 24px rgba(0,0,0,0.12)",
    overlay: "rgba(20,20,20,0.5)", "celebrate-1": "#212121", "celebrate-2": "#0A66C2",
  } },
  conexionAgil: { id: "conexionAgil", nombre: "OCC0", vars: {
    "font-body": "'Poppins',system-ui,-apple-system,'Helvetica Neue',Arial,sans-serif",
    ink: "#2F3640", ink2: "#525A63", paper: "#FFFFFF", bg: "#F5F7FA",
    gold: "#0057B8", "gold-soft": "#EAF2FE", "gold-dark": "#003E82",
    line: "#DDE3EA", gray: "#AEB4BC", "input-bg": "#FFFFFF",
    "side-bg": "#0057B8", "side-text": "#FFFFFF", "side-text-dim": "#BFDBFE", "side-hover-bg": "#2F80ED",
    "side-active-bg": "#FFFFFF", "side-active-text": "#0057B8", "side-logo-bg": "#FFFFFF", "side-logo-text": "#0057B8",
    "side-box-bg": "#0057B8", "side-select-bg": "#2F80ED", "side-select-border": "#2F80ED", "side-border": "transparent",
    "accent-dark-bg": "#2F3640", "accent-dark-text": "#FFFFFF",
    "r-1": "10px", "r-2": "12px", "r-3": "16px", "r-4": "20px", "r-pill": "99px",
    "shadow-card": "0 2px 10px rgba(0,87,184,0.08)", "shadow-modal": "0 16px 40px rgba(0,0,0,0.18)",
    overlay: "rgba(15,32,54,0.55)", "celebrate-1": "#0057B8", "celebrate-2": "#2F80ED",
  } },
  elegancia: { id: "elegancia", nombre: "Apple0", vars: {
    "font-body": "-apple-system,BlinkMacSystemFont,'SF Pro Display','Helvetica Neue',Arial,sans-serif",
    ink: "#1D1D1F", ink2: "#424245", paper: "#FFFFFF", bg: "#F5F5F7",
    gold: "#007AFF", "gold-soft": "#EAF3FF", "gold-dark": "#0040DD",
    line: "#E5E5E7", gray: "#86868B", "input-bg": "#FFFFFF",
    "side-bg": "#FFFFFF", "side-text": "#1D1D1F", "side-text-dim": "#86868B", "side-hover-bg": "#F5F5F7",
    "side-active-bg": "#F5F5F7", "side-active-text": "#007AFF", "side-logo-bg": "#1D1D1F", "side-logo-text": "#FFFFFF",
    "side-box-bg": "#F5F5F7", "side-select-bg": "#FFFFFF", "side-select-border": "#E5E5E7", "side-border": "#E5E5E7",
    "accent-dark-bg": "#1D1D1F", "accent-dark-text": "#FFFFFF",
    "r-1": "10px", "r-2": "12px", "r-3": "18px", "r-4": "24px", "r-pill": "99px",
    "shadow-card": "none", "shadow-modal": "0 20px 60px rgba(0,0,0,0.15)",
    overlay: "rgba(0,0,0,0.45)", "celebrate-1": "#1D1D1F", "celebrate-2": "#000000",
  } },
  ingenieria: { id: "ingenieria", nombre: "SpaceX0", vars: {
    "font-body": "'Space Grotesk',system-ui,-apple-system,'Helvetica Neue',Arial,sans-serif",
    ink: "#FFFFFF", ink2: "#B9C0C6", paper: "#181C1F", bg: "#0F1112",
    gold: "#2F8FD1", "gold-soft": "#132635", "gold-dark": "#84C1EE",
    line: "#22272B", gray: "#6B7378", "input-bg": "#181C1F",
    "side-bg": "#000000", "side-text": "#FFFFFF", "side-text-dim": "#6B7378", "side-hover-bg": "#181C1F",
    "side-active-bg": "#132635", "side-active-text": "#2F8FD1", "side-logo-bg": "#2F8FD1", "side-logo-text": "#000000",
    "side-box-bg": "#0F1112", "side-select-bg": "#000000", "side-select-border": "#22272B", "side-border": "#22272B",
    "accent-dark-bg": "#FFFFFF", "accent-dark-text": "#0F1112",
    "r-1": "2px", "r-2": "4px", "r-3": "6px", "r-4": "8px", "r-pill": "4px",
    "shadow-card": "none", "shadow-modal": "0 24px 70px rgba(0,0,0,0.6)",
    overlay: "rgba(0,0,0,0.7)", "celebrate-1": "#0F1112", "celebrate-2": "#132635",
  } },
  linkedin: { id: "linkedin", nombre: "LinkedIn", vars: {
    "font-body": "'Lexend',system-ui,-apple-system,'Helvetica Neue',Arial,sans-serif",
    ink: "#020617", ink2: "#334155", paper: "#FFFFFF", bg: "#F8FAFC",
    gold: "#0369A1", "gold-soft": "#E0F2FE", "gold-dark": "#075985",
    line: "#E2E8F0", gray: "#64748B", "input-bg": "#FFFFFF",
    "side-bg": "#0F172A", "side-text": "#FFFFFF", "side-text-dim": "#94A3B8", "side-hover-bg": "#1E293B",
    "side-active-bg": "#0369A1", "side-active-text": "#FFFFFF", "side-logo-bg": "#0369A1", "side-logo-text": "#FFFFFF",
    "side-box-bg": "#1E293B", "side-select-bg": "#0F172A", "side-select-border": "#334155", "side-border": "transparent",
    "accent-dark-bg": "#0F172A", "accent-dark-text": "#FFFFFF",
    "r-1": "6px", "r-2": "8px", "r-3": "10px", "r-4": "14px", "r-pill": "8px",
    "shadow-card": "0 1px 3px rgba(15,23,42,0.08)", "shadow-modal": "0 10px 30px rgba(15,23,42,0.18)",
    overlay: "rgba(2,6,23,0.55)", "celebrate-1": "#0F172A", "celebrate-2": "#0369A1",
  } },
  occ: { id: "occ", nombre: "OCC", vars: {
    "font-body": "'Rubik',system-ui,-apple-system,'Helvetica Neue',Arial,sans-serif",
    ink: "#0C4A6E", ink2: "#0369A1", paper: "#FFFFFF", bg: "#F0F9FF",
    gold: "#16A34A", "gold-soft": "#DCFCE7", "gold-dark": "#15803D",
    line: "#BAE6FD", gray: "#5B7A94", "input-bg": "#FFFFFF",
    "side-bg": "#FFFFFF", "side-text": "#0C4A6E", "side-text-dim": "#5B7A94", "side-hover-bg": "#F0F9FF",
    "side-active-bg": "#0369A1", "side-active-text": "#FFFFFF", "side-logo-bg": "#16A34A", "side-logo-text": "#FFFFFF",
    "side-box-bg": "#F0F9FF", "side-select-bg": "#FFFFFF", "side-select-border": "#BAE6FD", "side-border": "#BAE6FD",
    "accent-dark-bg": "#0C4A6E", "accent-dark-text": "#FFFFFF",
    "r-1": "8px", "r-2": "10px", "r-3": "14px", "r-4": "18px", "r-pill": "99px",
    "shadow-card": "none", "shadow-modal": "0 16px 40px rgba(3,105,161,0.2)",
    overlay: "rgba(12,74,110,0.5)", "celebrate-1": "#0369A1", "celebrate-2": "#16A34A",
  } },
  apple: { id: "apple", nombre: "Apple", vars: {
    "font-body": "'Inter',system-ui,-apple-system,'Helvetica Neue',Arial,sans-serif",
    ink: "#09090B", ink2: "#3F3F46", paper: "#FFFFFF", bg: "#FAFAFA",
    gold: "#EC4899", "gold-soft": "#FCE7F3", "gold-dark": "#9D174D",
    line: "#E4E4E7", gray: "#71717A", "input-bg": "#FFFFFF",
    "side-bg": "#18181B", "side-text": "#FFFFFF", "side-text-dim": "#A1A1AA", "side-hover-bg": "#27272A",
    "side-active-bg": "#EC4899", "side-active-text": "#FFFFFF", "side-logo-bg": "#EC4899", "side-logo-text": "#FFFFFF",
    "side-box-bg": "#27272A", "side-select-bg": "#18181B", "side-select-border": "#3F3F46", "side-border": "transparent",
    "accent-dark-bg": "#18181B", "accent-dark-text": "#FFFFFF",
    "r-1": "10px", "r-2": "14px", "r-3": "20px", "r-4": "28px", "r-pill": "99px",
    "shadow-card": "0 8px 30px rgba(0,0,0,0.10)", "shadow-modal": "0 30px 80px rgba(0,0,0,0.25)",
    overlay: "rgba(9,9,11,0.5)", "celebrate-1": "#18181B", "celebrate-2": "#EC4899",
  } },
  spacex: { id: "spacex", nombre: "SpaceX", vars: {
    "font-body": "'Inter',system-ui,-apple-system,'Helvetica Neue',Arial,sans-serif",
    ink: "#F8FAFC", ink2: "#94A3B8", paper: "#151A21", bg: "#0B0F14",
    gold: "#0369A1", "gold-soft": "#0F2A3D", "gold-dark": "#38BDF8",
    line: "#1E293B", gray: "#64748B", "input-bg": "#151A21",
    "side-bg": "#000000", "side-text": "#F8FAFC", "side-text-dim": "#64748B", "side-hover-bg": "#151A21",
    "side-active-bg": "#0F2A3D", "side-active-text": "#38BDF8", "side-logo-bg": "#0369A1", "side-logo-text": "#FFFFFF",
    "side-box-bg": "#0B0F14", "side-select-bg": "#000000", "side-select-border": "#1E293B", "side-border": "#1E293B",
    "accent-dark-bg": "#F8FAFC", "accent-dark-text": "#0B0F14",
    "r-1": "2px", "r-2": "4px", "r-3": "6px", "r-4": "10px", "r-pill": "4px",
    "shadow-card": "none", "shadow-modal": "0 24px 70px rgba(0,0,0,0.6)",
    overlay: "rgba(0,0,0,0.75)", "celebrate-1": "#0B0F14", "celebrate-2": "#0F2A3D",
  } },
};

/** Genera el CSS `[data-theme="..."]{...}` de todos los temas con variables (equiv. THEME_CSS). */
export function buildThemeCss(): string {
  return Object.values(THEMES)
    .filter((t) => Object.keys(t.vars).length > 0)
    .map((t) => `.rk[data-theme="${t.id}"]{${Object.entries(t.vars).map(([k, v]) => `--${k}:${v};`).join("")}}`)
    .join("\n");
}
