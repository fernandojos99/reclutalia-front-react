/** Resumen de cambios solicitados: objeto {campo:anotación} o string legado (portado de App.jsx). */
import { CAMPOS_DESC } from "../../constants/catalogos";
import type { Cambios } from "../../types/models/domain";

export function CambiosResumen({ cambios }: { cambios: Cambios }) {
  if (!cambios) return null;
  if (typeof cambios === "string") return <p style={{ fontSize: 13, marginTop: 6 }}>"{cambios}"</p>;
  return (
    <div style={{ marginTop: 6 }}>
      {Object.entries(cambios).map(([k, a]) => (
        <div key={k} style={{ fontSize: 13, marginTop: 3 }}>• <b>{CAMPOS_DESC[k] || k}:</b> {a}</div>
      ))}
    </div>
  );
}
