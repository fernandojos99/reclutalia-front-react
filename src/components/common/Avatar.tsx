/** Avatar circular con iniciales o foto (equiv. al `Avatar` base del App original). */
interface AvatarProps {
  nombre: string;
  foto?: string | null;
}

export function Avatar({ nombre, foto }: AvatarProps) {
  if (foto) return <img className="avatar" src={foto} alt={nombre} />;
  const iniciales = nombre
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
  return <div className="avatar">{iniciales}</div>;
}
