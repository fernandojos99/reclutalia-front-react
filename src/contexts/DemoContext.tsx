/**
 * Estado "demo" transversal (equivale a los useState del App original): rol activo,
 * formador/candidato seleccionados, tema y toast. La app real luego lo sustituirá por auth.
 */
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Rol = "formador" | "admin" | "candidato";

interface DemoState {
  rol: Rol;
  setRol: (r: Rol) => void;
  formadorId: string;
  setFormadorId: (id: string) => void;
  candId: number;
  setCandId: (id: number) => void;
  tema: string;
  setTema: (t: string) => void;
  toastMsg: string;
  toast: (m: string) => void;
}

const DemoContext = createContext<DemoState | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [rol, setRol] = useState<Rol>("formador");
  const [formadorId, setFormadorId] = useState<string>("F1");
  const [candId, setCandId] = useState<number>(1);
  const [tema, setTema] = useState<string>("clasico");
  const [toastMsg, setToastMsg] = useState<string>("");

  const toast = useCallback((m: string) => {
    setToastMsg(m);
    window.setTimeout(() => setToastMsg(""), 2600);
  }, []);

  return (
    <DemoContext.Provider
      value={{ rol, setRol, formadorId, setFormadorId, candId, setCandId, tema, setTema, toastMsg, toast }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo(): DemoState {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo debe usarse dentro de <DemoProvider>");
  return ctx;
}
