// src/pages/NuevoUsuario.tsx
import React, { useState } from 'react';
import { Save, ChevronLeft, Lock, User, Mail, Shield, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NuevoUsuario: React.FC = () => {
    const navigate = useNavigate();
    const [cargando, setCargando] = useState(false);
    // Recomendación: Estado para mensajes de error visibles
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        usuario: '',    
        contrasena: '', 
        nombre: '',
        apellido: '',
        correo: '',
        id_rol: '',     
        estado: 'A'     
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCargando(true);
        setError(null);

        // Validación básica antes de enviar (Recomendación UX)
        if (formData.contrasena.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            setCargando(false);
            return;
        }

        try {
            await axios.post('http://localhost:8000/api/usuarios/registrar', formData);
            alert("✅ Personal registrado correctamente en SIGEAN");
            navigate('/usuarios'); 
        } catch (error: any) {
            // Recomendación: Capturar errores específicos del servidor (como usuario duplicado)
            const mensajeError = error.response?.data?.message || "No se pudo conectar con el servidor.";
            setError("❌ " + mensajeError);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <header style={styles.header}>
                    <button onClick={() => navigate(-1)} style={styles.backBtn}><ChevronLeft /></button>
                    <h2 style={styles.title}>Registro de Personal</h2>
                </header>

                <form onSubmit={handleSubmit} style={styles.form}>
                    {/* Alerta de error visual (Recomendación UX) */}
                    {error && (
                        <div style={styles.errorAlert}>
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div style={styles.row}>
                        <div style={styles.group}>
                            <label style={styles.label}><User size={12}/> Nombre</label>
                            <input required style={styles.input} type="text" placeholder="Ej: Ana" onChange={(e)=>setFormData({...formData, nombre: e.target.value})} />
                        </div>
                        <div style={styles.group}>
                            <label style={styles.label}>Apellido</label>
                            <input required style={styles.input} type="text" placeholder="Ej: Pérez" onChange={(e)=>setFormData({...formData, apellido: e.target.value})} />
                        </div>
                    </div>

                    <div style={styles.group}>
                        <label style={styles.label}><Shield size={12}/> Usuario (Cédula)</label>
                        <input required style={styles.input} type="text" placeholder="V12345678" onChange={(e)=>setFormData({...formData, usuario: e.target.value})} />
                    </div>

                    <div style={styles.group}>
                        <label style={styles.label}><Lock size={12}/> Contraseña Temporal</label>
                        <input required style={styles.input} type="password" placeholder="••••••" onChange={(e)=>setFormData({...formData, contrasena: e.target.value})} />
                    </div>

                    {/* Recomendación: Añadir correo si tu tabla lo permite */}
                    <div style={styles.group}>
                        <label style={styles.label}><Mail size={12}/> Correo Electrónico (Opcional)</label>
                        <input style={styles.input} type="email" placeholder="correo@ejemplo.com" onChange={(e)=>setFormData({...formData, correo: e.target.value})} />
                    </div>

                    <div style={styles.group}>
                        <label style={styles.label}>Rol en el Plantel</label>
                        <select required style={styles.select} onChange={(e)=>setFormData({...formData, id_rol: e.target.value})}>
                            <option value="">Seleccione un cargo...</option>
                            <option value="1">Director / Administrador</option>
                            <option value="2">Docente</option>
                            <option value="3">Secretaria</option>
                        </select>
                    </div>

                    <button type="submit" disabled={cargando} style={styles.btnSave}>
                        {cargando ? "Guardando..." : <><Save size={18}/> Registrar Personal</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: { padding: '20px', display: 'flex', justifyContent: 'center', backgroundColor: '#f0fdf4', minHeight: '100vh' },
    card: { backgroundColor: '#fff', width: '100%', maxWidth: '450px', borderRadius: '20px', boxShadow: '0 10px 15px rgba(0,0,0,0.05)', overflow: 'hidden', alignSelf: 'flex-start' },
    header: { padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '10px' },
    backBtn: { border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' },
    title: { fontSize: '18px', fontWeight: 'bold', color: '#034c20', margin: 0 },
    form: { padding: '25px', display: 'flex', flexDirection: 'column', gap: '15px' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
    group: { display: 'flex', flexDirection: 'column', gap: '5px' },
    label: { fontSize: '12px', fontWeight: 'bold', color: '#475569', display: 'flex', alignItems: 'center', gap: '5px' },
    input: { padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '14px' },
    select: { padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#fff', fontSize: '14px' },
    btnSave: { marginTop: '10px', backgroundColor: '#00bf63', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
    // Estilo para la alerta de error
    errorAlert: { backgroundColor: '#fef2f2', color: '#b91c1c', padding: '10px', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #fee2e2' }
};

export default NuevoUsuario;