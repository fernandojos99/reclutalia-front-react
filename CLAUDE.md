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

## Motor de match (backend)
`matchService.ts` (determinista, DUPLICADO en front `utils/match.ts` — mantener en sincronía):
espRequeridas 40 (fusionadas, máx 5) · hardSkills 24 · softSkills 8 · nivel 12/7/1 · exp 8 ·
ubicación 7 · modalidad +3 · variación (id) ±3. Cap 98. Pool ≥28. Sin espOpcionales ni killers.
Al cambiar semillas, verificar la distribución con un script `tsx` que llame `matchScore`.

## Plan activo
Ver `PLAN-RADAR-CANDIDATOS.md`. **PLAN COMPLETO (Batches 1-6 ✅)**. Pipeline de 12 pasos: la
oferta aceptada pasa por "Apertura de cuenta" y el formador firma (`firmarContrato`) para cerrar.
Semillas demo: V-1042 "Cajero Supervisor" (F1) y V-1035 "Desarrollador Frontend" (F2).
`req.sueldo` (sueldo único, default midpoint) ya existe; `OfertaTool` lo usa fijo con calculadora
de compensación. Cambios de semilla requieren `npm run db:reset` para reflejarse en la BD.
