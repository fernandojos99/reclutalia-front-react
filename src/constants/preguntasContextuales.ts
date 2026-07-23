/**
 * Catálogo de PREGUNTAS SUGERIDAS por rol y etapa (chips del chat integrado).
 * Portado de `entrenar-ia.md`, con el wording alineado al app actual (Marketplace de talento,
 * evaluación, "Aceptar oferta", sin "nivel"/"terna") y añadida la etapa `cand_oferta_aceptada`.
 *
 * `getPreguntas(rol, stageKey)` devuelve las preguntas del set que coincida, o el set `default`.
 */
export interface SetPreguntas {
  role: "general" | "candidato" | "formador" | "admin";
  stageKey: string;
  stageLabel: string;
  questions: string[];
}

export const PREGUNTAS_CONTEXTUALES: SetPreguntas[] = [
  {
    role: "general", stageKey: "default", stageLabel: "General",
    questions: [
      "¿Qué es Radar de Candidatos?",
      "¿Qué puedes hacer por mí?",
    ],
  },

  // ── Candidato ──
  {
    role: "candidato", stageKey: "cand_sin", stageLabel: "Sin postulaciones activas",
    questions: [
      "¿Cómo empiezo a buscar oportunidades?",
      "¿Conviene completar mi perfil primero?",
      "¿Cómo mejoro mi compatibilidad?",
    ],
  },
  {
    role: "candidato", stageKey: "cand_buscar", stageLabel: "Buscando oportunidades",
    questions: [
      "¿Qué significa el porcentaje de compatibilidad?",
      "¿Cómo me postulo a una vacante?",
      "¿Para qué sirve guardar vacantes en favoritos?",
    ],
  },
  {
    role: "candidato", stageKey: "cand_invitado", stageLabel: "Invitado a un proceso",
    questions: [
      "Me invitaron a un proceso, ¿qué hago?",
      "¿Puedo rechazar la invitación?",
    ],
  },
  {
    role: "candidato", stageKey: "cand_postulado", stageLabel: "Postulado / filtros iniciales",
    questions: [
      "¿Qué documentos debo subir?",
      "¿La evaluación caduca?",
      "¿Cuándo puedo enviar mi documentación a validación?",
    ],
  },
  {
    role: "candidato", stageKey: "cand_filtros_ok", stageLabel: "Filtros superados",
    questions: [
      "Pasé los filtros, ¿qué sigue?",
      "¿Es obligatoria la video-entrevista?",
    ],
  },
  {
    role: "candidato", stageKey: "cand_evaluado", stageLabel: "Video-entrevista completada",
    questions: [
      "Terminé la video-entrevista, ¿ahora qué?",
      "¿Puedo ver mi avance en el proceso?",
    ],
  },
  {
    role: "candidato", stageKey: "cand_slots_enviados", stageLabel: "Horarios de entrevista recibidos",
    questions: [
      "El formador me envió horarios, ¿cómo elijo?",
      "¿Qué pasa si un horario ya no está disponible?",
    ],
  },
  {
    role: "candidato", stageKey: "cand_agendado", stageLabel: "Entrevista agendada",
    questions: [
      "Ya agendé mi entrevista, ¿dónde veo el enlace?",
      "¿Cómo me preparo para la entrevista?",
    ],
  },
  {
    role: "candidato", stageKey: "cand_entrevistado", stageLabel: "Entrevistado (esperando decisión)",
    questions: [
      "Ya me entrevisté, ¿cuándo sabré el resultado?",
    ],
  },
  {
    role: "candidato", stageKey: "cand_seleccionado", stageLabel: "Seleccionado / documentación",
    questions: [
      "¡Me seleccionaron! ¿Qué documentos debo presentar?",
      "¿Cómo agendo el examen médico, si aplica?",
      "¿Qué sigue después de subir mis documentos?",
    ],
  },
  {
    role: "candidato", stageKey: "cand_docs_completos", stageLabel: "Documentación completa",
    questions: [
      "Ya completé mi documentación, ¿qué sigue?",
    ],
  },
  {
    role: "candidato", stageKey: "cand_oferta_enviada", stageLabel: "Oferta recibida",
    questions: [
      "Recibí mi oferta, ¿qué incluye?",
      "¿Cómo acepto la oferta?",
    ],
  },
  {
    role: "candidato", stageKey: "cand_oferta_aceptada", stageLabel: "Oferta aceptada · cuenta de nómina",
    questions: [
      "Acepté la oferta, ¿qué sigue ahora?",
      "¿Cómo se genera mi cuenta de nómina?",
      "¿Puedo solicitar un cambio en mi fecha de ingreso?",
    ],
  },
  {
    role: "candidato", stageKey: "cand_contratado", stageLabel: "Contratado",
    questions: [
      "¡Ya estoy contratado! ¿Cuándo y dónde me presento?",
      "¿Qué debo llevar el primer día?",
      "¿En qué consiste mi inducción?",
    ],
  },
  {
    role: "candidato", stageKey: "cand_cerrado", stageLabel: "Proceso cerrado",
    questions: [
      "Mi proceso se cerró, ¿puedo aplicar a otras vacantes?",
      "¿Puedo ver la retroalimentación de mi proceso?",
    ],
  },

  // ── Formador ──
  {
    role: "formador", stageKey: "form_home", stageLabel: "Inicio / Mis vacantes",
    questions: [
      "¿Qué veo en mi panel de vacantes?",
      "Lista mis vacantes",
      "¿Cómo funciona el flujo de una vacante?",
      "¿Cómo apruebo un descriptivo para iniciar la búsqueda?",
    ],
  },
  {
    role: "formador", stageKey: "form_notif", stageLabel: "Notificaciones",
    questions: [
      "¿Qué notificaciones tengo pendientes?",
    ],
  },
];

/** Preguntas del set que coincida con (rol, stageKey); si no, el set general/default. */
export function getPreguntas(rol: string, stageKey: string): string[] {
  const set = PREGUNTAS_CONTEXTUALES.find((s) => s.role === rol && s.stageKey === stageKey);
  if (set) return set.questions;
  const def = PREGUNTAS_CONTEXTUALES.find((s) => s.role === "general" && s.stageKey === "default");
  return def?.questions ?? [];
}
