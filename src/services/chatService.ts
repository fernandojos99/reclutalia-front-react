/**
 * Service de sesiones de chat del agente (persistentes en BD). El "usuario" es la identidad de
 * demo (rol + formadorId/candId). El streaming de mensajes lo hace agenteService (SSE); aquí solo
 * el CRUD de sesiones y la carga del historial de una sesión.
 */
import { apiClient } from "../lib/apiClient";
import type { Rol } from "./agenteService";

export interface ChatSesion {
  id: string;
  ownerTipo: string;
  ownerId: string;
  titulo: string;
  estado: string;
  creadaTs: number;
  actualizadaTs: number;
}

export interface Identidad {
  rol: Rol;
  formadorId?: string;
  candId?: number;
}

/** Mensaje tal como lo muestra la UI (subconjunto del Mensaje de AgentChat). */
export interface MensajeUI {
  de: "yo" | "bot";
  t: string;
}

function qs(id: Identidad): string {
  const p = new URLSearchParams({ rol: id.rol });
  if (id.formadorId) p.set("formadorId", id.formadorId);
  if (id.candId != null) p.set("candId", String(id.candId));
  return p.toString();
}

export const chatService = {
  listar: (id: Identidad) => apiClient.get<ChatSesion[]>(`/agente/sesiones?${qs(id)}`),
  crear: (id: Identidad, titulo?: string) =>
    apiClient.post<ChatSesion>("/agente/sesiones", { ...id, titulo }),
  renombrar: (sid: string, titulo: string) =>
    apiClient.patch<{ ok: boolean }>(`/agente/sesiones/${encodeURIComponent(sid)}`, { titulo }),
  eliminar: (sid: string) =>
    apiClient.delete<{ ok: boolean }>(`/agente/sesiones/${encodeURIComponent(sid)}`),
  mensajes: (sid: string) =>
    apiClient.get<MensajeUI[]>(`/agente/sesiones/${encodeURIComponent(sid)}/mensajes`),
};
