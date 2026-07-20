/** Herramienta de carta oferta con sugerencia de sueldo de IA y ubicación (portado de `OfertaTool`). */
import { useState } from "react";
import { Sparkles, AlertCircle, Send } from "lucide-react";
import { money, fechasQuincena } from "../../utils/format";
import { DIRECCION_CORP } from "../../constants/catalogos";
import type { Candidato, Vacante } from "../../types/models/domain";

interface Props {
  v: Vacante;
  cand: Candidato;
  onSend: (monto: number, fecha: string, ubicacion: string) => void;
}

export function OfertaTool({ v, cand, onSend }: Props) {
  const sugerido = Math.min(
    v.req.salarioMax,
    Math.max(v.req.salarioMin, Math.round((Number(cand.salario ?? 0) * 0.6 + ((v.req.salarioMin + v.req.salarioMax) / 2) * 0.4) / 500) * 500),
  );
  const [monto, setMonto] = useState(sugerido);
  const fechas = fechasQuincena();
  const [fecha, setFecha] = useState(fechas[0]);
  const [fechaLibre, setFechaLibre] = useState("");
  const otra = fecha === "otra";
  const fmtLibre = (s: string) => {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  };
  const fechaFinal = otra ? (fechaLibre ? fmtLibre(fechaLibre) : "") : fecha;
  const [ubicacion, setUbicacion] = useState(DIRECCION_CORP);
  const fuera = monto < v.req.salarioMin || monto > v.req.salarioMax;

  return (
    <div className="grid2">
      <div className="aibox">
        <div className="hd"><Sparkles size={15} /> Sugerencia de sueldo de la IA (simulada)</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "var(--ai)" }}>{money(sugerido)}<span style={{ fontSize: 13, fontWeight: 500 }}> /mes bruto</span></div>
        <div style={{ fontSize: 12.5, marginTop: 8, lineHeight: 1.6 }}>
          Rúbrica: tabulador autorizado <b>{money(v.req.salarioMin)} – {money(v.req.salarioMax)}</b> · expectativa del candidato {money(Number(cand.salario ?? 0))} · equidad interna del área · mercado {v.req.area}.
        </div>
        <div className="mini-pipe" style={{ marginTop: 10 }}>
          {[...Array(10)].map((_, i) => <i key={i} className={(v.req.salarioMin + ((v.req.salarioMax - v.req.salarioMin) / 10) * i) <= monto ? "f" : ""} />)}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "var(--gray)", marginTop: 3 }}>
          <span>{money(v.req.salarioMin)} mín.</span><span>{money(v.req.salarioMax)} máx.</span>
        </div>
      </div>
      <div>
        <div className="field">
          <label>Monto final del sueldo mensual *</label>
          <input type="number" value={monto} onChange={(e) => setMonto(+e.target.value)} />
          {fuera && <div style={{ fontSize: 12, color: "var(--bad)", marginTop: 4 }}><AlertCircle size={12} style={{ verticalAlign: -2 }} /> Fuera del tabulador autorizado. Ajusta el monto para poder enviar.</div>}
          <button className="btn ghost sm" style={{ marginTop: 6 }} onClick={() => setMonto(sugerido)}><Sparkles size={12} /> Usar sugerido</button>
        </div>
        <div className="field">
          <label>Fecha de firma e ingreso (mismo día)</label>
          <select value={fecha} onChange={(e) => setFecha(e.target.value)}>
            {fechas.map((f) => <option key={f} value={f}>{f}</option>)}
            <option value="otra">Otra fecha…</option>
          </select>
          {otra && <input type="date" style={{ marginTop: 8 }} value={fechaLibre} onChange={(e) => setFechaLibre(e.target.value)} />}
          <div className="help">{otra ? "Elige libremente la fecha de ingreso del candidato." : 'Inicios de quincena (día 1 o 16), o elige "Otra fecha" para una fecha libre.'}</div>
        </div>
        <div className="field">
          <label>Ubicación donde el candidato debe presentarse</label>
          <textarea rows={2} value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} placeholder="Dirección completa de presentación el primer día…" />
          <div className="help">Se incluirá en la carta oferta y en la pantalla de bienvenida (con enlace a Google Maps).</div>
        </div>
        <button className="btn gold" disabled={fuera || !ubicacion.trim() || !fechaFinal} onClick={() => onSend(monto, fechaFinal, ubicacion.trim())}>
          <Send size={15} /> Enviar carta oferta a {cand.nombre.split(" ")[0]}
        </button>
      </div>
    </div>
  );
}
