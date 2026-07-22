# PLAN DE CAMBIOS — Radar de Candidatos (ronda 3)

Cambios del archivo `1_5118459062337406808.txt` (se usa la versión más completa de cada punto duplicado).
Un batch por turno; commit+push al cerrar cada uno (front y back juntos si aplica).

**Estado:** Batch 1 ✅ · Batch 2 ✅ · Batch 3 ✅ · Batch 4 ✅ · Batch 5 ✅ · Batch 6 ⬜

## Reglas
- Ortografía corregida donde aplique; búsquedas fuzzy/regex (el texto pedido puede tener erratas).
- Gate: `npx tsc --noEmit` + `npx vite build --logLevel error`. Responsive (≤900 / ≤560).

---

## BATCH 1 — Textos y tipos de vacante ✅ (frontend)
- **#2 (parcial):** Tipo de vacante en el editor del formador (`VistaDescriptivo`) usa `TIPOS_VACANTE`
  (Estándar / Preventiva / Proactiva / Confidencial), cada una en su chip. (El wizard admin ya los tenía.)
- **#8:** `SolicitarMasModal` — nuevo texto "Al continuar iniciará la búsqueda de candidatos internos y
  externos para «{título}» y se te habilitarán perfiles viables en un plazo de 5 a 10 días hábiles."
  y **eliminada** la caja/checkbox "Habilitar Multiposting" (ahora `onConfirmar(false)`).
- **#16:** "Video-entrevista completada · Te notificaremos de los siguientes pasos." (vista candidato).
- **#23:** Modal de confirmación de selección — aviso de **72 horas** (los no seleccionados
  permanecen 72 h y luego se descartan automáticamente y se sugieren a vacantes similares).
- **#25:** eliminada la card "Información de Compensalia" del `OfertaTool`; botón "Descargar carta (demo)" → "Descargar carta oferta".
- **#27:** en "Tu carta oferta" (candidato) se quitaron **Sueldo mensual bruto** y **Firma e ingreso**
  (quedan en la siguiente vista, Apertura de cuenta).

---

## Pendientes
## BATCH 2 — Vista candidato sin "formador" ✅ (#15)
- "Documentos para filtros iniciales" → **"Valida que tus datos estén correctos."** + botón
  **"Editar mi perfil"** que abre `PerfilEditor` inline (el candidato edita y confirma sus datos).
- Eliminado el **nº de vacante** (chip `{v.id}`) y **todas las referencias al formador** en la vista
  del candidato: chip "Formador: …", "Mensaje del formador"→"Mensaje para ti", bloque "Tu formador de
  equipo" de la bienvenida, y todas las frases ("el formador te invitó/validará/notificó…") reescritas
  en 1.ª persona de la empresa. También en `procesoModals` (rechazar) y `buscarModals` (aplicar).
## BATCH 3 — Entrevistas ✅
- **#18:** evaluación con **emoji** (👍 Positiva / 😐 Regular / 👎 Negativa; guardada como 5/3/1) en la
  captura (`EntrevistaModal`), en la caja de resumen (`VerEntrevistaModal`) y en el historial del
  detalle de vacante. Helpers `evalEmoji`/`evalLabel`. CSS `.eval-btn`.
- **#19:** botón de **micrófono "Dictar"** (simulado) junto a "¿Qué se preguntó…?" y al feedback,
  editables manualmente. En la entrevista **virtual** se quitó la caja de notas: la 1.ª vista muestra
  solo las preguntas sugeridas por la IA a ancho completo.
- **#17:** entrevista **presencial** — en vez del enlace de Teams se muestra la **dirección de la sede**
  (`v.req.sede`), enlace a **Google Maps** (simulado) y un **folio de acceso de 4 dígitos**
  (`folioCita`, determinista) con recordatorio de identificación. Aplica en vista candidato y formador.
## BATCH 4 — Barra de progreso + capacitación ✅ (#14)
- `MiniPipe` reescrito a **3 etapas conectadas** (Postulación / Entrevista / Contratación) con el
  estilo timeline `.ftl` (nodos unidos, done verde, actual dorado). Mapa por PIPE_IDX: Postulación ✓
  al pasar la video-IA (≥4), Entrevista ✓ al entrevistarse (≥6), Contratación ✓ al contratarse (=11).
  Solo cambia lo visual; el flujo interno se conserva.
- Nuevo componente compartido `CapacitacionModulo` (videos de inducción con barras animadas + check).
  Se usa en el cierre del formador (`Celebracion`) y se añadió a la vista del **candidato contratado**
  ("Tu módulo de capacitación").
## BATCH 5 — Pipeline + reset ✅ (backend + frontend)
- **#10:** un candidato con proceso ACTIVO (no terminal) en otra vacante no puede ser invitado ni
  postularse a otra. Backend: helper `tieneProcesoActivo` + validación en `invitar`/`postularDirecto`
  (`ValidationError`). Frontend: helper `procesoActivoEnOtra`; en el inventario del formador el botón
  "Invitar" se sustituye por chip "En otro proceso"; en Buscar vacantes, banner + aplicar bloqueado.
- **#22:** acción `retrocederEtapa(vacId)` (backend: service + `POST /vacantes/:id/reset-etapa` +
  controller + tool `retroceder_etapa`) que baja un paso el pipeline de cada candidato activo,
  limpia los datos de los pasos deshechos y reabre la vacante si estaba cerrada. Frontend: acción
  `resetearEtapa` + botón **"Resetear etapa actual"** en el sidebar del formador (detecta la vacante
  por la URL). Verificado con smoke test (bloqueo + retroceso entrevistado→agendado→slots_enviados).
- **BATCH 6 — Bugs:** #28 (carta oferta "Primero selecciona…" — falta `oferta_aceptada` en el filtro
  `seleccionado`; flujo carta→contratación→capacitación), #2 (guardar Descripción del puesto).
