/**
 * Barra de proceso en 3 fases con sub-pasos palomeados (portado del `FasesBar` base).
 * Completa: con onSub/activo se vuelve interactiva (tabs). Compacta (compact): pills + etapa actual.
 */
import { Check, CheckCircle2 } from "lucide-react";
import { FASES } from "../../constants/catalogos";
import { faseVacante } from "../../utils/fases";
import type { Vacante } from "../../types/models/domain";

interface Props {
  v: Vacante;
  compact?: boolean;
  /** Línea de tiempo conectada de las 3 fases (para las tarjetas del home). */
  timeline?: boolean;
  activo?: number | null;
  onSub?: (i: number) => void;
}

export function FasesBar({ v, compact, timeline, activo = null, onSub }: Props) {
  const { fase, subpaso, completados } = faseVacante(v);
  const done = completados.every(Boolean);

  if (timeline) {
    return (
      <div className="ftl">
        {FASES.map((f, i) => {
          const isDone = done || i + 1 < fase;
          const isNow = !done && i + 1 === fase;
          return (
            <div key={f.nombre} className={"ftl-step" + (isDone ? " done" : "") + (isNow ? " now" : "")}>
              <div className="ftl-node">{isDone ? <Check size={14} /> : i + 1}</div>
              <div className="ftl-label">{f.nombre}</div>
            </div>
          );
        })}
      </div>
    );
  }

  if (compact) {
    const SUBS = FASES.flatMap((f) => f.subs);
    return (
      <div className="fases-c">
        {FASES.map((f, i) => {
          const st = done || i + 1 < fase ? " done" : i + 1 === fase ? " now" : "";
          return (
            <span key={f.nombre} className={"fase-pill" + st}>
              {done || i + 1 < fase ? <Check size={11} /> : <span className="fase-n">{i + 1}</span>}
              {f.nombre}
            </span>
          );
        })}
        <span className="fase-txt">{done ? "Proceso completado ✓" : `Etapa ${fase} · ${SUBS[subpaso]}`}</span>
      </div>
    );
  }

  const habilitado = (i: number) => i === 0 || v.estado === "abierta" || v.estado === "cerrada";
  return (
    <div className="fases">
      {FASES.map((f, gi) => {
        const base = FASES.slice(0, gi).reduce((a, x) => a + x.subs.length, 0);
        const faseDone = done || gi + 1 < fase;
        const actual = !done && gi + 1 === fase;
        return (
          <div key={f.nombre} className={"fase-box" + (actual ? " now" : faseDone ? " done" : "")}>
            <div className="fase-hd">
              {faseDone ? <CheckCircle2 size={14} /> : <span className="fase-n">{gi + 1}</span>} Fase {gi + 1} · {f.nombre}
            </div>
            <div className="fase-subs">
              {f.subs.map((s, k) => {
                const i = base + k;
                const ok = completados[i];
                return onSub != null ? (
                  <button key={s} disabled={!habilitado(i)}
                    className={"fase-sub" + (ok ? " ok" : "") + (activo === i ? " on" : "")}
                    onClick={() => onSub(i)}>
                    {ok && <Check size={12} />}{s}
                  </button>
                ) : (
                  <span key={s} className={"fase-sub" + (ok ? " ok" : !done && i === subpaso ? " cur" : "")}>
                    {ok && <Check size={12} />}{s}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
