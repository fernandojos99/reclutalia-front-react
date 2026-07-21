# PLAN DE CAMBIOS — "Radar de Candidatos" (Formador v2)

Plan por batches. Un batch por turno, en orden. Marcar ✅ al terminar cada batch.

**Estado:** Batch 1 ✅ · Batch 2 ✅ · Batch 3 ✅ · Batch 4 ✅ · Batch 5 ✅ · Batch 6 ✅ — PLAN COMPLETO

> Batches con Opus (1, 2, 5) COMPLETOS. Faltan 3, 4 y 6 (para otro modelo).

> Ejecución actual (con Opus): Batch **1, 2 y 5**, uno a la vez, con commit+push al terminar cada uno.
> Batches 3, 4 y 6 quedan para después (otro modelo).

---

## Reglas generales

1. Ejecución directa; gate al final: `npx tsc --noEmit` + `npx vite build --logLevel error`.
2. Español MX; íconos lucide; defaults en semilla/`crearRequisito`; arrays y `PIPE_IDX` sanos.
3. **RESPONSIVE OBLIGATORIO (≤900px, y ≤560px teléfono):** nada de scroll horizontal; grids de 2+
   columnas colapsan (1 o 2x2); chips/filas de botones hacen wrap; modales a ancho completo con
   scroll interno; touch targets ≥44px; textos ≥14px. Confirmar móvil al cerrar cada batch.
4. Actualizar `CLAUDE.md` y este plan; cierre breve + commit/push.

### Decisiones ya tomadas (no re-decidir)

- **Rebranding (P1):** "Radar de Candidatos" en TODO texto visible. Logo: cuadro dorado con icono
  `Radar` de lucide (en vez de "R"). Wordmark sidebar: **Radar** / subtítulo "DE CANDIDATOS".
  NO renombrar archivos, repo ni identificadores internos.
- **Vacantes semilla (P4):** V-1042 → **Cajero Supervisor** (demo asignada) y V-1035 →
  **Desarrollador Frontend**. V-1038 se conserva.
- **Sueldo único (P6):** nuevo `req.sueldo` (mensual único, se MUESTRA). `salarioMin/Max` se conservan
  para la banda de la carta oferta. Default: punto medio del rango redondeado.
- **Días activa (P2):** `v.creadaTs` (timestamp) en semillas para "X días activa".
- **Killer questions (P6h):** se eliminan COMPLETAS (descriptivo, wizard admin, postulación, semillas,
  params `killersOk`). Batch 3.
- **Nuevo flujo de contratación (P18):** `ACT.aceptarOferta` ya NO cierra ni asigna nº de empleado →
  `oferta_aceptada`. Nueva `ACT.firmarContrato` (formador) → `contratado`, nº empleado, correo
  `{numEmpleado}@elektra.com.mx`, Okta, cierra y notifica. Batch 6.

---

## BATCH 1 — Rebranding y home del formador ✅

- **1.1 Rebranding.** "Reclutalia" → "Radar de Candidatos" en todo texto visible (front + systemPrompt
  backend). Logo sidebar con icono `Radar`, wordmark "Radar / DE CANDIDATOS". `<title>` actualizado.
- **1.2 Días activa.** `creadaTs` en tipo `Vacante` (front+back) y en semillas; `diasActiva`/
  `diasActivaLabel` en `utils/format.ts` (fallback: parsea el string `creada`). Chip `Clock`
  "{n} días activa" (0 = "Hoy") en tarjetas del home y en la caja de resumen de `VacanteDetail`.
- **1.3 Histórico de completadas.** Stat "Notificaciones sin leer" → "Vacantes completadas" (conteo
  `cerrada`); clic filtra el listado a solo cerradas (toggle + "Ver todas").
- **1.4 Timeline de 3 fases.** Nueva variante `timeline` en `FasesBar` (nodos unidos por línea; done
  verde, actual dorada); reemplaza la `compact` en las tarjetas del home; sin texto de etapa.
  Responsive: horizontal a ancho completo, labels compactas ≤560px.

**Commit:** `Radar de Candidatos: rebranding, días activa, histórico de completadas y timeline de fases`
**Móvil:** grid3 de stats colapsa (900→2col, 560→1col); timeline usa flex:1 (se mantiene horizontal);
chips hacen wrap. OK.

---

## BATCH 2 — Vacantes semilla nuevas + pool y perfil ✅

> Hecho: V-1042→Cajero Supervisor y V-1035→Desarrollador Frontend con match verificado
> (V-1042: 3 en ≥90% [Valeria 98, Regina 97, Iván 95] + 3 en 70-89%; V-1035: 2 en ≥90%
> [Lucía 98, Julieta 98] + 2 en 70-89% [Emilio 87, Paola 73]). Ajustados candidatos ids
> 2,10,11,26,27,31 + notificación N1. CNA en `SolicitarMasModal` + botón dorado. `InvitarModal`
> sin tabs, textarea editable + botón IA "Generar mensaje" (determinista por perfil). `PerfilModal`
> con fila unificada: "Descargar CV" (dorado) + favorito/categorizar/compartir/archivar solo icono.
> **Requiere `npm run db:reset` (o POST /api/admin/reset-seed) para cargar la nueva semilla en la BD.**
> Móvil: modales a ancho completo con scroll interno; fila de acciones y botón IA hacen wrap. OK.

- **2.1 Nuevas vacantes semilla (P4).** V-1042 → **"Cajero Supervisor"** (Operaciones/Atención) y
  V-1035 → **"Desarrollador Frontend"** (Tecnología): descripción, especialidades, skills, aptitudes,
  sueldo y condiciones coherentes. Garantizar candidatos MUY aptos (≥90% y varios 70–89%) ajustando/
  reutilizando perfiles semilla (verificar contra `matchScore`). Valeria y Jorge Luis siguen aptos
  para la demo principal (ahora Cajero Supervisor).
- **2.2 Texto/color "Solicitar más candidatos" (P7).** Popup: "Al continuar, el **Centro Nacional de
  Atracción** iniciará la búsqueda de candidatos para «{título}» y te propondrá perfiles viables en 5
  a 10 días hábiles." Botón a `btn gold`.
- **2.3 Mensaje de invitación con IA (P8).** En `InvitarModal`: quitar tabs predefinido/personalizar;
  textarea siempre editable, precargado. Botón IA (índigo, `Sparkles`) **"Generar mensaje"** → delay +
  variante determinista con nombre, puesto y 1–2 skills del candidato (SIMULADO).
- **2.4 Acciones en la ficha del candidato (P9).** En `PerfilModal`: "Descargar CV" a la fila de
  favorito/categorizar/archivar (esos 3 solo icono + tooltip); agregar **Compartir** (icono, reusa
  `CompartirModal`); "Descargar CV" en `btn gold`.

**Commit:** `Semilla Cajero Supervisor y Dev Frontend, CNA en popup, mensaje IA y ficha con acciones compactas`

---

## BATCH 5 — Carta oferta y documentación ✅

> Hecho: introducido `req.sueldo` (opcional, default = punto medio del rango redondeado a 500,
> en `crearRequisito`; fallback en `OfertaTool`). `OfertaTool` sin input editable: sueldo fijo;
> **Calculadora de compensación** (Sueldo base / Bono ≈18% / Prestaciones ≈12% / Valor total
> mensual) determinista; card **"Información de Compensalia"** + botón "Solicitar ajuste a sueldo"
> (toast). Chip **"Auto recordatorios cada 24 horas — activado"** en la documentación post-selección.
> DB reseteada (sueldo embebido: V-1042 16500, V-1035 36000). Móvil: grid2 colapsa a 1 col; filas
> label/monto de la calculadora con `justify-between` + nowrap en montos. OK.
> Nota: "Solicitar ajuste" y "solicitud de ajuste" son toasts simulados (sin escribir historial en BD).

- **5.1 Sueldo no editable + Compensalia (P16).** En `OfertaTool`: quitar input editable de monto (fijo
  = `req.sueldo`). Caja de sugerencia deja el estilo IA → card blanca "Información de Compensalia".
  Se sigue viendo la banda salarial; botón **"Solicitar ajuste a sueldo"** (toast + historial).
- **5.2 Calculadora de compensación (P17).** Card blanca "Calculadora de compensación", chip dorado
  "Salario fijo · tabulador autorizado". Filas: Sueldo base ${base} · Bono variable est. ${bono}
  (~18%) · Prestaciones grupo ${prestaciones} (~12%); total en negritas **"Valor total mensual"**
  ${total} (dorado, mayor). Derivar de `req.sueldo` determinista. Integrar aquí Compensalia + botón.
- **5.3 Auto recordatorios (P20).** En documentación post-selección (formador): chip informativo
  **"Auto recordatorios cada 24 horas — activado"** (icono campana/reloj, tono ok).

**Commit:** `Carta oferta: calculadora de compensación, Compensalia, solicitar ajuste y auto recordatorios`

---

## BATCH 3 — Descriptivo (2 secciones) y adiós killers ✅

> Hecho: `VistaDescriptivo` en 2 cards ("El puesto" / "Perfil del candidato") con edición directa
> por sección (guarda vía `editarVacante` + nota en historial; el flujo de cambios al admin se
> conserva para lo no editable). "Simular con IA" (2.2s, set determinista por área). Catálogo
> EDUCACION: Secundaria…Licenciatura (fusionada); nuevos `PROFESIONES` (25) y `TURNOS`; campos
> `req.areasConocimiento` (máx 3) y `req.turno`. Especialidades fusionadas en `espRequeridas`
> (máx 5); `matchScore` re-ponderado (40 en requeridas, front+back). Killer questions eliminadas
> COMPLETAS (tipo, wizard admin → 3 secciones, PostulacionForm/AplicarModal directos, schemas,
> tools del agente, `aplicar`/`postularDirecto` sin `killersOk`). Sueldo único mostrado en
> descriptivo, header, buscar vacantes y modal del candidato. Bandas verificadas: V-1042 3×≥90 +
> 3×70-89 · V-1035 3×≥90 + 1×70-89. DB reseteada.
> Móvil: cards de sección apilan (grid2→1), tagpickers hacen wrap, edición a ancho completo. OK.
## BATCH 4 — Ranking, terna y entrevistas ✅

> Hecho: **4.1** mini-chips de filtros por tipo en tarjetas de ranking (interno: Comportamiento/
> Antigüedad/Desempeño ✓; externo: PLD/Listas azules/Círculo de crédito/Reingreso; Jorge Luis id 2
> con ⚠ ámbar + botón "Pedir liberación" → toast, simulado sin historial persistido — criterio
> simple); se quitaron los chips de skills de esa vista. **4.2** "Ver perfil" y "Ver entrevista"
> (nuevo `VerEntrevistaModal`: reproductor simulado + resumen + feedback + estrellas) en Selección.
> **4.3** `VideoIAResumenModal` rediseñado como Ficha IA: header con score grande, Viabilidad
> Alta/Media, Descargar PDF, resumen general, 2 columnas de habilidades con barras doradas
> (`.skillbar`, deterministas por id/match), fortalezas (3) / áreas de mejora (2), resumen
> antifraude (4 filas Verificado ✓) y footer legal. **4.4** calificación a 5 estrellas (captura,
> displays con conversión `califa5` para datos legados, schema backend max 5, tool del agente).
> **4.5** agendados: Presencial → solo "Registrar entrevista presencial"; Virtual → solo "Iniciar
> entrevista". **4.6** botón `Mic` "Grabar notas" (2 s "Escuchando…" + texto de ejemplo, simulado).
> Móvil: ficha IA colapsa a 1 columna (grid2), chips de filtros hacen wrap, botones wrap. OK.
## BATCH 6 — Contratación extendida y cierre ✅

> Hecho: nuevo estado **`oferta_aceptada`** ("Apertura de cuenta") en PIPE/PIPE_IDX (front+back,
> ahora 12 pasos). `aceptarOferta` ya NO cierra ni asigna nº de empleado; nueva
> **`firmarContrato`** (ruta POST /pipeline/:cid/firmar + service + action + tool del agente
> `firmar_contrato`): → contratado, nº empleado, correo `{num}@elektra.com.mx`, Okta ✓, cierra y
> notifica a ambos. `simular` en oferta_aceptada captura la cuenta. **Candidato:** el bloque de
> cuenta bancaria salió del checklist de selección (validación sin cuenta) y vive en el paso
> "Apertura de cuenta" (QR/enlace/captura + resumen aceptado con desglose de compensación, fecha
> y ubicación); bienvenida final con correo corporativo y Okta ✓. **Formador:** en Carta oferta,
> sección de firma (Descargar kit, estado de cuenta con simulador, firma por nombre completo,
> botón Firmar contrato → tab Contratación); tarjetas con nº/correo/Okta. **Cierre (6.3):**
> `Celebracion` rediseñada — inducción (3 videos con barras animadas CSS + check), "Proceso
> completado" con 4 métricas grandes (días de cobertura reales via `diasActiva` · 3 decisiones ·
> 100% digital · descartados que regresan al pool, conteo real) y rating 5 estrellas con
> agradecimiento; confetti conservado. Flujo verificado con smoke test tsx (aceptar → cuenta →
> firmar → cerrada). Móvil: métricas en grid 2x2 (≤700px), firma y chips hacen wrap. OK.

(Detalle completo de 3, 4 y 6: ver mensaje original del plan; conservan las Decisiones de arriba.)
