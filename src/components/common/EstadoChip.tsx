/** Chip de estado del candidato en el pipeline (portado del `EstadoChip` base). */
import { Chip } from "./Chip";

const MAPA: Record<string, [string, string]> = {
  invitado: ["Invitado a postularse", ""],
  postulado: ["Postulado", "gold"],
  filtros_ok: ["Filtros aprobados", "ok"],
  video_ia: ["Video-IA en curso", "ai"],
  evaluado: ["Evaluado por IA", "ai"],
  slots_enviados: ["Esperando confirmación de horario", ""],
  agendado: ["Entrevista agendada", "gold"],
  entrevistado: ["Entrevistado", "gold"],
  seleccionado: ["Seleccionado", "ok"],
  docs_completos: ["Documentación completa", "ok"],
  oferta_enviada: ["Oferta enviada", "gold"],
  oferta_aceptada: ["Oferta aceptada", "ok"],
  contratado: ["Contratado", "ok"],
  descartado: ["Descartado", "bad"],
  filtrado: ["No pasó filtros", "bad"],
  rechazado: ["Invitación rechazada", "bad"],
};

interface Props {
  estado: string;
  candView?: boolean;
}

export function EstadoChip({ estado, candView }: Props) {
  const [texto, tone] = MAPA[estado] ?? [estado, ""];
  const t = candView && estado === "descartado" ? "Cerrada" : texto;
  return <Chip tone={tone}>{t}</Chip>;
}
