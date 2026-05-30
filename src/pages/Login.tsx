// src/pages/Login.tsx
import React, { useState } from "react";
import { Lock, User } from "lucide-react";

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    usuario: "",
    clave: ""
  });

  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const iniciarSesion = () => {
    if (!formData.usuario || !formData.clave) {
      setError("Debe completar todos los campos");
      return;
    }

    if (formData.usuario === "docente" && formData.clave === "1234") {
      localStorage.setItem("userRole", "Docente");
      localStorage.setItem("username", "Docente SIGEAN");
      onLogin();
      return;
    }

    if (formData.usuario === "admin" && formData.clave === "1234") {
      localStorage.setItem("userRole", "Administrador");
      localStorage.setItem("username", "Administrador SIGEAN");
      onLogin();
      return;
    }

    setError("Credenciales incorrectas");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Bienvenido a SIGEAN</h2>
        <p style={styles.subtitle}>Inicie sesión para continuar</p>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.field}>
          <label style={styles.label}>Usuario</label>
          <div style={styles.inputGroup}>
            <User size={18} color="#008f39" />
            <input
              type="text"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              style={styles.input}
              placeholder="Ingrese su usuario"
            />
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Contraseña</label>
          <div style={styles.inputGroup}>
            <Lock size={18} color="#008f39" />
            <input
              type="password"
              name="clave"
              value={formData.clave}
              onChange={handleChange}
              style={styles.input}
              placeholder="Ingrese su contraseña"
            />
          </div>
        </div>

        <button onClick={iniciarSesion} style={styles.loginBtn}>
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0"
  },
  card: {
    width: "100%",
    maxWidth: "380px",
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center" as const
  },
  title: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "bold",
    color: "#008f39",
    textAlign: "center" as const
  },
  subtitle: {
    marginTop: "5px",
    fontSize: "14px",
    color: "#555",
    marginBottom: "20px",
    textAlign: "center" as const
  },
  error: {
    backgroundColor: "#ffdddd",
    color: "#b00020",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "15px",
    fontSize: "14px",
    textAlign: "center" as const
  },
  field: {
    textAlign: "left" as const,
    marginBottom: "15px"
  },
  label: {
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "5px",
    display: "block",
    textAlign: "left" as const
  },
  inputGroup: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    padding: "8px 10px",
    backgroundColor: "#fafafa"
  },
  input: {
    border: "none",
    outline: "none",
    width: "100%",
    fontSize: "14px",
    backgroundColor: "transparent"
  },
  loginBtn: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#008f39",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
    fontSize: "15px"
  }
};

export default Login;

