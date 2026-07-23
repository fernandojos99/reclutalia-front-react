/**
 * Service del chat directo persona↔persona (candidato↔formador / admin↔formador).
 * El acceso lo controla el backend por participación; aquí solo se listan conversaciones,
 * se cargan mensajes y se envían.
 */
import { apiClient } from "../lib/apiClient";

export interface Participante { tipo: string; id: string; }

export interface ConversacionSrv {
  id: string;
  vacId: string | null;
  a: Participante;
  b: Participante;
  creadaTs: number;
  actualizadaTs: number;
  ultimo?: string | null;
  ultimoTs?: number | null;
}

export interface ConvMensaje {
  autorTipo: string;
  autorId: string;
  contenido: string;
  creadoTs: number;
}

export interface EnviarPayload {
  vacId: string;
  rol: string;
  id: string;
  para: Participante;
  contenido: string;
}

const q = (rol: string, id: string) => `rol=${encodeURIComponent(rol)}&id=${encodeURIComponent(id)}`;

export const directChatService = {
  listar: (rol: string, id: string) =>
    apiClient.get<ConversacionSrv[]>(`/chat-directo/conversaciones?${q(rol, id)}`),
  mensajes: (convId: string, rol: string, id: string) =>
    apiClient.get<ConvMensaje[]>(`/chat-directo/${encodeURIComponent(convId)}/mensajes?${q(rol, id)}`),
  enviar: (payload: EnviarPayload) =>
    apiClient.post<{ ok: boolean; convId: string }>("/chat-directo/mensajes", payload),
};
