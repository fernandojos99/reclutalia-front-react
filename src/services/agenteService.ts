/**
 * Cliente del agente IA. Se comunica con el backend por SSE (no websockets):
 * hace POST a /agente/chat y lee la respuesta como stream de eventos SSE con
 * fetch + ReadableStream (EventSource no permite POST, por eso parseamos a mano).
 */
import { API_BASE_URL } from "../config/api";

export type Rol = "admin" | "formador" | "candidato";

export interface AgentePayload {
  sessionId: string;
  mensaje: string;
  rol: Rol;
  formadorId?: string;
  candId?: number;
}

/** Eventos que emite el backend (ver runner.ts). */
export type AgenteEvent =
  | { type: "status"; text: string }
  | { type: "tool"; name: string; args: unknown }
  | { type: "token"; text: string }
  | { type: "error"; text: string }
  | { type: "done" };

const SESSION_KEY = "reclutalia_agent_session";

/** sessionId estable por navegador (memoria de sesión del lado servidor). */
export function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

/**
 * Olvida la sesión actual: el próximo getSessionId() creará una nueva, con lo que el
 * agente arranca sin memoria previa. Se usa al cambiar de perfil para resetear el asistente.
 */
export function resetSessionId(): void {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Envía un mensaje y consume el stream SSE. Llama a `onEvent` por cada evento.
 * Devuelve una promesa que resuelve al terminar el stream.
 */
export async function enviarMensaje(
  payload: AgentePayload,
  onEvent: (e: AgenteEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/agente/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
    body: JSON.stringify(payload),
    signal,
  });

  if (!res.ok || !res.body) {
    const detalle = await res.text().catch(() => "");
    throw new Error(`Error del agente (HTTP ${res.status}). ${detalle.slice(0, 200)}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  // Los eventos SSE llegan separados por línea en blanco (\n\n).
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let sep: number;
    while ((sep = buffer.indexOf("\n\n")) !== -1) {
      const bloque = buffer.slice(0, sep);
      buffer = buffer.slice(sep + 2);
      const linea = bloque.split("\n").find((l) => l.startsWith("data:"));
      if (!linea) continue;
      try {
        onEvent(JSON.parse(linea.slice(5).trim()) as AgenteEvent);
      } catch {
        /* ignora bloques no-JSON (p.ej. comentarios keep-alive) */
      }
    }
  }
}
