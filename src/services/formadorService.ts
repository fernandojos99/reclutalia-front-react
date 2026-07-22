/** Service de formadores + Marketplace de talento (favoritos y categorías, globales por formador). */
import { apiClient } from "../lib/apiClient";
import type { Formador } from "../types/models/domain";

export const formadorService = {
  listar(): Promise<Formador[]> {
    return apiClient.get<Formador[]>("/formadores");
  },
  toggleFavorito(formadorId: string, cid: number): Promise<Formador> {
    return apiClient.post<Formador>(`/formadores/${formadorId}/favoritos/${cid}`);
  },
  crearCategoria(formadorId: string, nombre: string): Promise<Formador> {
    return apiClient.post<Formador>(`/formadores/${formadorId}/categorias`, { nombre });
  },
  toggleCategoria(formadorId: string, nombre: string, cid: number): Promise<Formador> {
    return apiClient.post<Formador>(
      `/formadores/${formadorId}/categorias/${encodeURIComponent(nombre)}/${cid}`,
    );
  },
};
