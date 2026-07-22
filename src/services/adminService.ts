/**
 * Acciones administrativas de la demo. `resetSeed` reinicia la BD al estado de `seed.ts`
 * (endpoint destructivo protegido por token). El token va en el front por ser una DEMO.
 */
import { API_BASE_URL } from "../config/api";

const RESET_TOKEN = "reclutalia-reset-2026";

export const adminService = {
  async resetSeed(): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/admin/reset-seed`, {
      method: "POST",
      headers: { "x-reset-token": RESET_TOKEN },
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error((data && (data.message as string)) || `Error HTTP ${res.status}`);
    }
  },
};
