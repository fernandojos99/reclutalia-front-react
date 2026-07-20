/** Raíz de la app: providers globales (demo + datos) + router. */
import { BrowserRouter } from "react-router-dom";
import { DemoProvider } from "./contexts/DemoContext";
import { DataProvider } from "./store/DataProvider";
import { AppRoutes } from "./routes/AppRoutes";
import "./styles/base.css";

export default function App() {
  return (
    <DemoProvider>
      <DataProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </DataProvider>
    </DemoProvider>
  );
}
