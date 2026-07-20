/** Service de notificaciones. */
import { apiClient } from "../lib/apiClient";
import type { Notificacion, RolNotificacion } from "../types/models/domain";

export const notificacionService = {
  listar(tipo: RolNotificacion, id: string | number): Promise<Notificacion[]> {
    return apiClient.get<Notificacion[]>(
      `/notificaciones?tipo=${tipo}&id=${encodeURIComponent(String(id))}`,
    );
  },
  listarTodas(): Promise<Notificacion[]> {
    return apiClient.get<Notificacion[]>("/notificaciones");
  },
  marcarLeida(id: string): Promise<void> {
    return apiClient.post<void>(`/notificaciones/${id}/leida`);
  },
};
