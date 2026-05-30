import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, CheckCircle, MessageSquare, ArrowLeft, User } from 'lucide-react';

/**
 * COMPONENTE: REVISIÓN DE BOLETAS (VISTA DIRECTIVO / SECRETARÍA)
 * Este módulo permite supervisar la redacción docente, añadir observaciones
 * y cambiar el estatus a "Aprobado" para permitir la impresión en el rol docente.
 */
const RevisionDirectivo = () => {
  const [boletas, setBoletas] = useState<any[]>([]);
  const [filtroSeccion, setFiltroSeccion] = useState('');
  const [seleccionada, setSeleccionada] = useState<any>(null);
  const [sugerencia, setSugerencia] = useState('');
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  // Recuperamos el rol para limitar acciones (Secretaría solo ve, Directivo aprueba)
  const currentRole = localStorage.getItem('userRole') || 'Invitado';

  useEffect(() => {
    cargarBoletas();
  }, []);

  const cargarBoletas = async () => {
    try {
      // El endpoint trae todas las boletas enviadas (estatus: 'En Revisión')
      const res = await axios.get('http://localhost:8000/api/boletas/revision');
      setBoletas(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error al obtener boletas para revisión:", err);
    }
  };

  const manejarAprobacion = async (nuevoEstatus: 'Aprobado' | 'Observado') => {
    if (!seleccionada) return;

    try {
      await axios.put(`http://localhost:8000/api/boletas/estatus/${seleccionada.id_boleta}`, {
        obs_directivo: sugerencia,
        estatus: nuevoEstatus,
        apro_directivo: nuevoEstatus === 'Aprobado'
      });
      
      setMensaje({ 
        tipo: 'exito', 
        texto: nuevoEstatus === 'Aprobado' 
          ? `✅ Boleta de ${seleccionada.primer_nombre} aprobada. Docente ya puede imprimir.` 
          : `⚠️ Boleta enviada a corrección.` 
      });
      
      setSeleccionada(null);
      cargarBoletas(); // Recargar lista actualizada
    } catch (err) {
      setMensaje({ tipo: 'error', texto: "❌ Error al procesar la revisión." });
    }
  };

  // Filtrado dinámico por sección para facilitar auditoría
  const boletasFiltradas = boletas.filter(b => 
    b.id_seccion.toLowerCase().includes(filtroSeccion.toLowerCase()) ||
    b.primer_nombre.toLowerCase().includes(filtroSeccion.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <header style={styles.headerFlex}>
        <h2 style={styles.titulo}>Panel de Supervisión Institucional</h2>
        <div style={styles.searchBox}>
          <Search size={18} color="#666" />
          <input 
            type="text" 
            placeholder="Buscar por alumno o sección..." 
            style={styles.searchInput}
            onChange={(e) => setFiltroSeccion(e.target.value)}
          />
        </div>
      </header>

      {mensaje.texto && (
        <div style={{...styles.alerta, backgroundColor: mensaje.tipo === 'exito' ? '#e8f5e9' : '#ffebee'}}>
          {mensaje.texto}
        </div>
      )}

      {!seleccionada ? (
        <div style={styles.tablaContainer}>
          <table style={styles.tabla}>
            <thead>
              <tr style={styles.th}>
                <th style={styles.tdPad}>Estudiante</th>
                <th style={styles.tdPad}>Sección</th>
                <th style={styles.tdPad}>Docente</th>
                <th style={styles.tdPad}>Estatus</th>
                <th style={styles.tdPad}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {boletasFiltradas.length > 0 ? boletasFiltradas.map((b) => (
                <tr key={b.id_boleta} style={styles.tr}>
                  <td style={styles.tdPad}><strong>{b.primer_nombre} {b.primer_apellido}</strong></td>
                  <td style={styles.tdPad}>{b.id_grado}° "{b.id_seccion}"</td>
                  <td style={styles.tdPad}><User size={14} /> {b.nombre_docente || 'Docente Asignado'}</td>
                  <td style={styles.tdPad}>
                    <span style={styles.badgeRevision}>En Revisión</span>
                  </td>
                  <td style={styles.tdPad}>
                    <button onClick={() => {setSeleccionada(b); setSugerencia(b.obs_directivo || '');}} style={styles.btnVer}>
                      Abrir Boleta
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} style={{textAlign: 'center', padding: '20px'}}>No hay boletas pendientes de revisión.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={styles.detalle}>
          <button onClick={() => setSeleccionada(null)} style={styles.btnVolver}>
            <ArrowLeft size={16} /> Volver al listado
          </button>
          
          <div style={styles.infoAlumno}>
            <h3>Revision Pedagógica: {seleccionada.primer_nombre} {seleccionada.primer_apellido}</h3>
            <p>Grado: {seleccionada.id_grado}° - Sección: {seleccionada.id_seccion}</p>
          </div>

          <div style={styles.gridRevision}>
            <div style={styles.card}>
              <div style={styles.cardHeader}><MessageSquare size={18} /> Contenido Cualitativo (Docente)</div>
              <div style={styles.textoDocente}>
                {/* Aquí el Directivo ve el JSON de competencias formateado */}
                <p><strong>Proyecto:</strong> {seleccionada.nombre_proyecto || 'Sin proyecto asignado'}</p>
                <hr />
                <p>{seleccionada.obs_docente || 'Sin observaciones detalladas.'}</p>
              </div>
            </div>

            <div style={styles.cardDirectivo}>
              <div style={styles.cardHeader}><CheckCircle size={18} /> Acciones de Supervisión</div>
              <label style={styles.label}>Sugerencias para el Docente:</label>
              <textarea 
                style={styles.textarea}
                value={sugerencia}
                onChange={(e) => setSugerencia(e.target.value)}
                placeholder="Ej: Favor mejorar la redacción del indicador de matemáticas..."
              />
              
              {currentRole !== 'Secretaria' ? (
                <div style={styles.btnGroup}>
                  <button onClick={() => manejarAprobacion('Observado')} style={styles.btnObservar}>
                    Devolver con Observación
                  </button>
                  <button onClick={() => manejarAprobacion('Aprobado')} style={styles.btnAprobar}>
                    Aprobar y Firmar Boleta
                  </button>
                </div>
              ) : (
                <p style={styles.notaSecretaria}>* Su rol de Secretaría permite visualizar, pero solo el Directivo puede aprobar.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f7f6', minHeight: '80vh' },
  headerFlex: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  titulo: { color: '#1b5e20', margin: 0, fontSize: '24px' },
  searchBox: { display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '5px 15px', borderRadius: '25px', border: '1px solid #ddd' },
  searchInput: { border: 'none', padding: '8px', outline: 'none', width: '250px' },
  alerta: { padding: '12px', marginBottom: '20px', borderRadius: '6px', borderLeft: '5px solid #2e7d32', fontWeight: 'bold' as const },
  tablaContainer: { backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflow: 'hidden' },
  tabla: { width: '100%', borderCollapse: 'collapse' as const },
  th: { backgroundColor: '#034c20', color: '#fff', textAlign: 'left' as const },
  tdPad: { padding: '15px' },
  tr: { borderBottom: '1px solid #eee', transition: 'background 0.2s' },
  badgeRevision: { backgroundColor: '#fff3e0', color: '#e65100', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' as const },
  btnVer: { padding: '8px 16px', cursor: 'pointer', backgroundColor: '#2196f3', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' as const },
  detalle: { marginTop: '10px' },
  btnVolver: { display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#034c20', cursor: 'pointer', fontWeight: 'bold' as const, marginBottom: '20px' },
  infoAlumno: { marginBottom: '20px' },
  gridRevision: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  card: { backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' },
  cardHeader: { backgroundColor: '#f8f9fa', padding: '12px 15px', borderBottom: '1px solid #eee', fontWeight: 'bold' as const, display: 'flex', alignItems: 'center', gap: '10px' },
  textoDocente: { padding: '20px', color: '#444', lineHeight: '1.6' },
  cardDirectivo: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  label: { fontWeight: 'bold' as const, display: 'block', marginBottom: '10px' },
  textarea: { width: '100%', height: '150px', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '20px', outlineColor: '#008f39' },
  btnGroup: { display: 'flex', gap: '10px' },
  btnAprobar: { flex: 1, padding: '12px', backgroundColor: '#008f39', color: 'white', fontWeight: 'bold' as const, border: 'none', borderRadius: '6px', cursor: 'pointer' },
  btnObservar: { flex: 1, padding: '12px', backgroundColor: '#f44336', color: 'white', fontWeight: 'bold' as const, border: 'none', borderRadius: '6px', cursor: 'pointer' },
  notaSecretaria: { fontStyle: 'italic', color: '#666', fontSize: '13px' }
};

export default RevisionDirectivo;