/** Configuración del cliente HTTP. En dev, Vite proxya /api al backend Express. */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";
