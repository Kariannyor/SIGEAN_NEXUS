import { useState, useEffect } from 'react'; // Eliminamos 'React' para quitar la advertencia 6133
import axios from 'axios';

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║             MÓDULO: CONTROL DE ASISTENCIA ACUMULADA                      ║
 * ║       Resumen por Género y Totales Generales - Diseño SIGEAN             ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

const ReporteAsistencia = () => {
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [grado, setGrado] = useState('3er Grado');
  const [datos, setDatos] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const obtenerReporte = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/asistencias/reporte`, {
        params: { fecha, grado }
      });
      setDatos(res.data.resumen);
    } catch (error) {
      console.error("Error al obtener el reporte", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerReporte();
  }, [fecha, grado]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      {/* Contenedor Principal con Borde Verde Grueso */}
      <div style={{
        border: '5px solid #00c853',
        borderRadius: '30px',
        padding: '30px',
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#fff',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '10px', color: '#1b5e20' }}>Control Asistencia Acumulada</h2>
        <h3 style={{ textAlign: 'center', color: '#666', fontSize: '16px' }}>Resumen por Grado</h3>

        {/* Filtros rápidos corregidos */}
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '30px', gap: '10px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#888' }}>Fecha:</label>
            <input 
              type="date" 
              value={fecha} 
              onChange={(e) => setFecha(e.target.value)} 
              style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#888' }}>Grado / Año:</label>
            <select 
              value={grado} 
              onChange={(e) => setGrado(e.target.value)}
              style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#fff' }}
            >
              <option value="2do Nivel">2do Nivel</option>
              <option value="3er Nivel">3er Nivel</option>
              <option value="1er Grado">1er Grado</option>
              <option value="2do Grado">2do Grado</option>
              <option value="3er Grado">3er Grado</option>
              <option value="4to Grado">4to Grado</option>
              <option value="5to Grado">5to Grado</option>
              <option value="6to Grado">6to Grado</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#00c853', fontWeight: 'bold' }}>Cargando datos del servidor...</p>
        ) : datos && (
          <table style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ color: '#666', borderBottom: '2px solid #eee' }}>
                <th style={{ padding: '10px' }}>Descripción</th>
                <th>Asistencia Esperada</th>
                <th>Total Asistencia</th>
                <th>Total Inasistencia</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ textAlign: 'left', fontWeight: 'bold', padding: '15px 0' }}>Hembras:</td>
                <td style={{ color: '#00c853', fontWeight: 'bold', fontSize: '18px' }}>{datos.hembras.total}</td>
                <td style={{ color: '#00c853', fontWeight: 'bold', fontSize: '18px' }}>{datos.hembras.presentes}</td>
                <td style={{ color: '#00c853', fontWeight: 'bold', fontSize: '18px' }}>{datos.hembras.ausentes}</td>
              </tr>
              <tr>
                <td style={{ textAlign: 'left', fontWeight: 'bold', padding: '15px 0' }}>Varones:</td>
                <td style={{ color: '#00c853', fontWeight: 'bold', fontSize: '18px' }}>{datos.varones.total}</td>
                <td style={{ color: '#00c853', fontWeight: 'bold', fontSize: '18px' }}>{datos.varones.presentes}</td>
                <td style={{ color: '#00c853', fontWeight: 'bold', fontSize: '18px' }}>{datos.varones.ausentes}</td>
              </tr>
              {/* Fila de Totales con fondo verde claro */}
              <tr style={{ backgroundColor: '#ccff90', fontWeight: 'bold', color: '#1b5e20' }}>
                <td style={{ textAlign: 'left', padding: '15px', borderRadius: '10px 0 0 10px' }}>Total Gral.:</td>
                <td>{datos.total_general.matricula}</td>
                <td>{datos.total_general.presentes}</td>
                <td style={{ borderRadius: '0 10px 10px 0' }}>{datos.total_general.ausentes}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReporteAsistencia;