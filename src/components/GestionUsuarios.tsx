import React, { useState, useEffect } from 'react';
import { 
  UserPlus, Search, Shield, Mail, User, 
  MoreVertical, Edit2, Key, Trash2, ArrowLeft, RefreshCw 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Usuario {
  id_usuario: number;
  usuario: string;
  nombre: string;
  apellido: string;
  correo: string;
  estado: string;
  role?: {
    desc_rol: string;
  };
}

const GestionUsuarios: React.FC = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);

  // Carga inicial de personal
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    setCargando(true);
    try {
      const res = await axios.get('http://localhost:8000/api/usuarios');
      setUsuarios(res.data);
    } catch (err) {
      console.error("Error al cargar personal", err);
    } finally {
      setCargando(false);
    }
  };

  const usuariosFiltrados = usuarios.filter(u => 
    u.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    u.usuario.includes(busqueda)
  );

  return (
    <div style={styles.container}>
      {/* Header Responsivo */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <button onClick={() => navigate(-1)} style={styles.backBtn}><ArrowLeft size={20} /></button>
          <div>
            <h1 style={styles.title}>Gestión de Personal</h1>
            <p style={styles.subtitle}>{usuarios.length} Usuarios registrados en SIGEAN</p>
          </div>
        </div>
        {/* BOTÓN VINCULADO AL FORMULARIO DE REGISTRO */}
        <button onClick={() => navigate('/usuarios/nuevo')} style={styles.addBtn}>
          <UserPlus size={18} /> <span style={styles.hideMobile}>Nuevo Usuario</span>
        </button>
      </header>

      {/* Buscador Inteligente */}
      <div style={styles.searchBox}>
        <Search size={20} color="#94a3b8" style={styles.searchIcon} />
        <input 
          type="text" 
          placeholder="Buscar por nombre o cédula..." 
          style={styles.searchInput}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* Lista de Tarjetas (Mobile First) */}
      <div style={styles.grid}>
        {cargando ? (
          <div style={styles.loader}><RefreshCw className="animate-spin" /> Cargando personal...</div>
        ) : (
          usuariosFiltrados.map((u) => (
            <div key={u.id_usuario} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.avatar}>
                  {u.nombre[0]}{u.apellido[0]}
                </div>
                <div style={styles.userInfo}>
                  <h3 style={styles.userName}>{u.nombre} {u.apellido}</h3>
                  <span style={styles.badgeRol}>
                    <Shield size={12} /> {u.role?.desc_rol || 'Sin Rol'}
                  </span>
                </div>
                <button style={styles.optionsBtn}><MoreVertical size={18} /></button>
              </div>
              
              <div style={styles.cardBody}>
                <div style={styles.infoRow}><User size={14} /> <span>ID: {u.usuario}</span></div>
                <div style={styles.infoRow}><Mail size={14} /> <span>{u.correo || 'No posee correo'}</span></div>
              </div>

              <div style={styles.cardActions}>
                <button style={styles.actionBtn} title="Editar"><Edit2 size={16} /></button>
                <button style={styles.actionBtn} title="Cambiar Clave"><Key size={16} /></button>
                <button style={{...styles.actionBtn, color: '#ef4444'}} title="Eliminar"><Trash2 size={16} /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { padding: '20px', backgroundColor: '#f0fdf4', minHeight: '100vh', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '15px' },
  backBtn: { backgroundColor: '#fff', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '12px', cursor: 'pointer' },
  title: { fontSize: '24px', fontWeight: '800', color: '#064e3b', margin: 0 },
  subtitle: { color: '#64748b', fontSize: '14px', margin: 0 },
  addBtn: { backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' },
  hideMobile: { display: window.innerWidth < 600 ? 'none' : 'inline' },
  searchBox: { position: 'relative', marginBottom: '25px' },
  searchIcon: { position: 'absolute', left: '15px', top: '12px' },
  searchInput: { width: '100%', padding: '12px 12px 12px 45px', borderRadius: '15px', border: '1px solid #e2e8f0', fontSize: '16px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  card: { backgroundColor: '#fff', borderRadius: '18px', padding: '20px', border: '1px solid #bbf7d0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' },
  avatar: { width: '45px', height: '45px', backgroundColor: '#dcfce7', color: '#059669', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' },
  userInfo: { flex: 1 },
  userName: { margin: 0, fontSize: '16px', color: '#1e293b', fontWeight: '700' },
  badgeRol: { display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '6px', color: '#475569', marginTop: '4px' },
  optionsBtn: { background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' },
  cardBody: { paddingBottom: '15px', borderBottom: '1px solid #f1f5f9', marginBottom: '15px' },
  infoRow: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#64748b', marginBottom: '8px' },
  cardActions: { display: 'flex', justifyContent: 'space-around' },
  actionBtn: { background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '5px' },
  loader: { textAlign: 'center', gridColumn: '1/-1', padding: '40px', color: '#059669' }
};

export default GestionUsuarios;