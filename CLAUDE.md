# CLAUDE.md — Radar de Candidatos (frontend)

App React + Vite (TS) del prototipo de reclutamiento. Marca visible: **"Radar de Candidatos"**
(NO renombrar archivos, repo ni identificadores internos — solo texto visible).

## Arquitectura rápida
- **Datos**: `useData()` (`src/store/DataProvider.tsx`) → `services/*` → `lib/apiClient.ts` → backend Express.
  El backend persiste en Supabase (JSONB). Config de URL en `src/config/api.ts`.
- **Rol/vista demo**: `contexts/DemoContext.tsx` (rol/formadorId/candId/tema, persistidos en localStorage;
  cambiar de perfil recarga la página para resetear el asistente IA).
- **Rutas**: `routes/AppRoutes.tsx` bajo `layout/AppShell` (Sidebar drawer en móvil + Topbar + Bot).
- **Fases del proceso**: `components/common/FasesBar.tsx` — modos `compact`, `timeline` (tarjetas home) y
  completo (tabs en el detalle). Catálogo `FASES` en `constants/catalogos.ts`.
- **Asistente IA**: `components/layout/BotSoporte.tsx` (FAQ + chat SSE con el agente del backend).
- **Responsive**: breakpoints 900px (tablet/drawer) y 560px (teléfono) en `styles/base.css`.

## Convenciones
- Español MX. Íconos: `lucide-react`. Sin CSS-in-JS pesado: clases en `styles/base.css` + estilos inline.
- Utilidades de presentación en `utils/format.ts` (`money`, `hoy`, `diasActiva`, `diasActivaLabel`).
- Gate de cada cambio: `npx tsc --noEmit` + `npx vite build --logLevel error`.

## Plan activo
Ver `PLAN-RADAR-CANDIDATOS.md`. **Batch 1 ✅** (rebranding, días activa, histórico completadas, timeline de fases).
