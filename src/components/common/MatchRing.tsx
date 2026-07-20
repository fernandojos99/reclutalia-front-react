/** Anillo de porcentaje de match con color por banda de ranking (portado del `MatchRing` base). */
import { bandCol } from "../../utils/format";

interface Props {
  v: number;
  size?: number;
}

export function MatchRing({ v, size = 52 }: Props) {
  const r = size / 2 - 4;
  const c = 2 * Math.PI * r;
  const col = bandCol(v);
  return (
    <div className="ring" style={{ width: size, height: size }} title={`Match ${v}%`}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--line)" strokeWidth="5" fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={col} strokeWidth="5" fill="none"
          strokeDasharray={c} strokeDashoffset={c * (1 - v / 100)} strokeLinecap="round" />
      </svg>
      <b style={{ color: col }}>{v}%</b>
    </div>
  );
}
