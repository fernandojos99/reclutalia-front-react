import { defineConfig } from "vite";

// Vite/esbuild transpila .tsx con el runtime JSX automático (según tsconfig `jsx: react-jsx`),
// igual que el proyecto original (que no usaba @vitejs/plugin-react). Sin Fast Refresh dedicado,
// pero suficiente para el scaffold; se puede añadir el plugin cuando soporte Vite 8.
// El dev server proxya /api al backend Express (evita CORS en desarrollo).
export default defineConfig({
  esbuild: { jsx: "automatic" },
  server: {
    port: 5173,
    proxy: {
      "/api": { target: "http://localhost:4000", changeOrigin: true },
    },
  },
});
