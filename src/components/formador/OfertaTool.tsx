/** Carta oferta: calculadora de compensación (sueldo fijo por tabulador) + fecha e ubicación. */
import { useState } from "react";
import { Send, Calculator } from "lucide-react";
import { money, fechasQuincena } from "../../utils/format";
import { DIRECCION_CORP } from "../../constants/catalogos";
import type { Candidato, Vacante } from "../../types/models/domain";

interface Props {
  v: Vacante;
  cand: Candidato;
  onSend: (monto: number, fecha: string, ubicacion: string) => void;
}

const pct = (t: string) => <span style={{ color: "var(--gray)", fontWeight: 400, fontSize: 11.5 }}>{t}</span>;

export function OfertaTool({ v, cand, onSend }: Props) {
  // Sueldo fijo (tabulador). Desglose determinista para la calculadora de compensación.
  const sueldo = v.req.sueldo ?? Math.round((v.req.salarioMin + v.req.salarioMax) / 2 / 500) * 500;
  const bono = Math.round(sueldo * 0.18);
  const prestaciones = Math.round(sueldo * 0.12);
  const total = sueldo + bono + prestaciones;

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

  return (
    <div className="grid2">
      <div>
        {/* Calculadora de compensación */}
        <div className="card" style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Calculator size={16} color="var(--gold-dark)" />
            <b style={{ fontSize: 14 }}>Paquete de compensación</b>
          </div>
          <div style={{ marginBottom: 10 }}><span className="chip gold">Salario fijo · tabulador autorizado</span></div>
          <div className="comp-row"><span>Sueldo base</span><b>{money(sueldo)}</b></div>
          <div className="comp-row"><span>Bono variable est. {pct("(≈18%)")}</span><b>{money(bono)}</b></div>
          <div className="comp-row"><span>Prestaciones grupo {pct("(≈12%)")}</span><b>{money(prestaciones)}</b></div>
          <div className="comp-total"><span>Valor total mensual</span><b>{money(total)}</b></div>
        </div>
      </div>

      <div>
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
        <button className="btn gold" disabled={!ubicacion.trim() || !fechaFinal} onClick={() => onSend(sueldo, fechaFinal, ubicacion.trim())}>
          <Send size={15} /> Enviar carta oferta a {cand.nombre.split(" ")[0]}
        </button>
      </div>
    </div>
  );
}
