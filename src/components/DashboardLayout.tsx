import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, LogOut, Menu, X, Home } from 'lucide-react';

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║                LAYOUT PRINCIPAL (CÁSCARA) - SIGEAN                       ║
 * ║  Este componente envuelve todas las vistas y maneja el Header/Footer.    ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

interface LayoutProps {
  onLogout: () => void;
  children: React.ReactNode; // Aquí es donde se inyecta DashboardAdmin, Estudiantes, etc.
}

const DashboardLayout = ({ onLogout, children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  // Datos del usuario para personalizar el Header
  const currentUsername = localStorage.getItem('username') || 'Usuario';
  const currentRole = localStorage.getItem('userRole') || 'Invitado';

  // Detectamos si estamos en la raíz del Dashboard para ocultar el botón de "Inicio"
  const isDashboard = location.pathname === '/dashboard';

  return (
    <div style={styles.container}>
      {/* HEADER: Se mantiene fijo en la parte superior */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.menuButton} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          {/* Logo con función de retorno al inicio */}
          <div style={styles.logo} onClick={() => navigate('/dashboard')}>
            <div style={styles.logoIcon}>S</div>
            <div style={styles.logoText}>
              <div style={styles.logoTitle}>SIGEAN</div>
              <div style={styles.logoSubtitle}>Sistema Integral de Gestión Escolar</div>
            </div>
          </div>
        </div>

        <div style={styles.headerRight}>
          {/* Botón de Inicio: Solo aparece si el usuario NO está en el Dashboard principal */}
          {!isDashboard && (
            <button style={styles.homeButton} onClick={() => navigate('/dashboard')} title="Inicio">
              <Home size={20} />
              <span style={{marginLeft: '8px', fontSize: '14px', fontWeight: '500'}}>Inicio</span>
            </button>
          )}
          
          <button style={styles.notificationButton}>
            <Bell size={22} />
            <span style={styles.notificationBadge}>3</span>
          </button>
          
          {/* Información del perfil logueado */}
          <div style={styles.userInfo}>
            <div style={styles.avatar}>{currentUsername.charAt(0).toUpperCase()}</div>
            <div style={styles.userDetails}>
              <div style={styles.userName}>{currentUsername}</div>
              <div style={styles.userRole}>{currentRole}</div>
            </div>
          </div>
          
          <button onClick={onLogout} style={styles.logoutButton} title="Salir">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* CONTENIDO DINÁMICO: Aquí es donde React Router renderiza DashboardAdmin */}
      <main style={styles.main}>{children}</main>

      {/* FOOTER: Información institucional */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div>© 2026 SIGEAN - Escuela Municipal Rural "Aquiles Nazoa"</div>
          <div style={styles.footerRight}>
            <span style={styles.footerVersion}>v0.1.0</span>
            <span style={styles.footerSeparator}>|</span>
            <span>Soporte técnico</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

// ESTILOS: Manteniendo tus colores #008f39 y #034c20
const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', backgroundColor: '#f4f7f6', display: 'flex', flexDirection: 'column' },
  header: { backgroundColor: '#fff', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
  menuButton: { background: 'none', border: 'none', cursor: 'pointer', display: 'none' },
  logo: { display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' },
  logoIcon: { width: '42px', height: '42px', backgroundColor: '#008f39', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' },
  logoText: { display: 'flex', flexDirection: 'column' },
  logoTitle: { fontSize: '20px', fontWeight: 'bold', color: '#034c20' },
  logoSubtitle: { fontSize: '11px', color: '#888' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  homeButton: { background: 'none', border: 'none', cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center', padding: '10px' },
  notificationButton: { background: 'none', border: 'none', position: 'relative', cursor: 'pointer', color: '#666' },
  notificationBadge: { position: 'absolute', top: '-5px', right: '-5px', backgroundColor: '#ef4444', color: 'white', borderRadius: '50%', fontSize: '10px', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '12px', padding: '6px 12px', backgroundColor: '#f9fafb', borderRadius: '10px' },
  avatar: { width: '36px', height: '36px', backgroundColor: '#76bf00', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' },
  userDetails: { display: 'flex', flexDirection: 'column' },
  userName: { fontWeight: '600', fontSize: '14px' },
  userRole: { fontSize: '11px', color: '#888' },
  logoutButton: { background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' },
  main: { flex: 1, padding: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%' },
  footer: { backgroundColor: '#fff', borderTop: '1px solid rgba(0,0,0,0.05)', padding: '16px 24px' },
  footerContent: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666' },
  footerRight: { display: 'flex', gap: '12px', alignItems: 'center' },
  footerVersion: { backgroundColor: '#f0fdf4', color: '#008f39', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' },
  footerSeparator: { color: '#ccc' } 
};

export default DashboardLayout;