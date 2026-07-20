/** QR decorativo estático (simulado, no escaneable) — portado del `QRDemo` base. */
export function QRDemo({ size = 180 }: { size?: number }) {
  const N = 21;
  const cell = size / N;
  const isFinder = (r: number, c: number) => {
    const inBox = (br: number, bc: number) => r >= br && r < br + 7 && c >= bc && c < bc + 7;
    const ring = (br: number, bc: number) =>
      inBox(br, bc) && (r === br || r === br + 6 || c === bc || c === bc + 6 || (r >= br + 2 && r <= br + 4 && c >= bc + 2 && c <= bc + 4));
    return ring(0, 0) || ring(0, N - 7) || ring(N - 7, 0);
  };
  const inFinderZone = (r: number, c: number) =>
    (r < 8 && c < 8) || (r < 8 && c >= N - 8) || (r >= N - 8 && c < 8);
  const cells: [number, number][] = [];
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    if (isFinder(r, c)) { cells.push([r, c]); continue; }
    if (inFinderZone(r, c)) continue;
    if ((r * 7 + c * 13 + r * c * 3) % 5 === 0 || ((r + c) % 3 === 0 && (r * c) % 2 === 0)) cells.push([r, c]);
  }
  return (
    <svg width={size} height={size} role="img" aria-label="Código QR (simulado)"
      style={{ background: "#fff", borderRadius: 10, border: "1px solid var(--line)" }}>
      {cells.map(([r, c], i) => (
        <rect key={i} x={c * cell} y={r * cell} width={cell} height={cell} fill="#1A1A1A" />
      ))}
    </svg>
  );
}
