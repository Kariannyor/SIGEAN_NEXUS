import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Asegúrate de que estas rutas sean correctas y los archivos existan
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Estudiantes from "./pages/Estudiantes";
import Calificaciones from "./pages/Calificaciones";
import CrearBoleta from "./pages/CrearBoleta";
import Asistencia from "./pages/Asistencia";
import Configuracion from "./pages/Configuracion";
import Layout from "./components/Layout";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("sigean_token");
    if (token) setIsAuthenticated(true);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("sigean_token", "activo");
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  // Si no está autenticado, mostramos Login
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Si está autenticado, mostramos el layout con las rutas
  return (
    <Router>
      <Layout onLogout={handleLogout}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/estudiantes" element={<Estudiantes />} />
          <Route path="/calificaciones" element={<Calificaciones />} />
          <Route path="/crear-boleta" element={<CrearBoleta />} />
          <Route path="/asistencia" element={<Asistencia />} />
          <Route path="/configuracion" element={<Configuracion />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;