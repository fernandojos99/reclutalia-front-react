/** Mini pipeline del candidato (portado del `MiniPipe` base). */
import { XCircle } from "lucide-react";
import { PIPE, PIPE_IDX } from "../../constants/catalogos";
import { Chip } from "./Chip";

export function MiniPipe({ estado }: { estado: string }) {
  const idx = PIPE_IDX[estado] ?? 0;
  if (idx < 0) return <Chip tone="bad" icon={XCircle}>No continúa en el proceso</Chip>;
  return (
    <div>
      <div className="mini-pipe">
        {PIPE.map((_, i) => <i key={i} className={i <= idx ? "f" : ""} />)}
      </div>
      <div style={{ fontSize: 11, color: "var(--gold-dark)", fontWeight: 700, marginTop: 4 }}>
        {PIPE[idx]} · paso {idx + 1} de {PIPE.length}
      </div>
    </div>
  );
}
