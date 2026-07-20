/** Service de candidatos: lecturas + guardar perfil + completar psicométrico. */
import { apiClient } from "../lib/apiClient";
import type { Candidato } from "../types/models/domain";

export const candidatoService = {
  listar(): Promise<Candidato[]> {
    return apiClient.get<Candidato[]>("/candidatos");
  },
  obtener(cid: number): Promise<Candidato> {
    return apiClient.get<Candidato>(`/candidatos/${cid}`);
  },
  guardar(candidato: Candidato): Promise<Candidato> {
    return apiClient.put<Candidato>(`/candidatos/${candidato.id}`, { candidato });
  },
  completarPsicometrico(cid: number): Promise<Candidato> {
    return apiClient.post<Candidato>(`/candidatos/${cid}/psicometrico`);
  },
  toggleFavVacante(cid: number, vacId: string): Promise<Candidato> {
    return apiClient.post<Candidato>(`/candidatos/${cid}/favoritos/${vacId}`);
  },
};
