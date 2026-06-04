import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Printer, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReportesImpresion = () => {
  const navigate = useNavigate();
  const [grados] = useState(['1er Grado', '2do Grado', '3er Grado', '4to Grado', '5to Grado', '6to Grado']);
  const [secciones] = useState(['A', 'B', 'C', 'U']);
  const [seleccion, setSeleccion] = useState({ grado: '1er Grado', seccion: 'A' });
  const [alumnosAprobados, setAlumnosAprobados] = useState<any[]>([]);

  useEffect(() => {
    const cargarAprobados = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/boletas/aprobadas`, {
          params: { grado: seleccion.grado, seccion: seleccion.seccion }
        });
        setAlumnosAprobados(res.data);
      } catch (err) {
        console.error("Error al cargar alumnos aprobados", err);
      }
    };
    cargarAprobados();
  }, [seleccion]);

  const ejecutarImpresionMasiva = () => {
    if (alumnosAprobados.length === 0) return;
    window.print();
  };

  return (
    <div style={styles.container}>
      <div className="no-print">
        <button onClick={() => navigate('/boletas')} style={styles.btnVolver}>
          <ArrowLeft size={16} /> Volver al Módulo
        </button>
        
        <h2 style={styles.titulo}>Módulo de Impresión Masiva (Secretaría)</h2>
        
        <div style={styles.filtrosCard}>
          <div style={styles.grupoFiltro}>
            <label>Seleccione Grado:</label>
            <select 
              value={seleccion.grado} 
              onChange={(e) => setSeleccion({...seleccion, grado: e.target.value})}
              style={styles.select}
            >
              {grados.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div style={styles.grupoFiltro}>
            <label>Seleccione Sección:</label>
            <select 
              value={seleccion.seccion} 
              onChange={(e) => setSeleccion({...seleccion, seccion: e.target.value})}
              style={styles.select}
            >
              {secciones.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <button 
            onClick={ejecutarImpresionMasiva} 
            style={alumnosAprobados.length > 0 ? styles.btnImprimir : styles.btnDeshabilitado}
            disabled={alumnosAprobados.length === 0}
          >
            <Printer size={20} /> Imprimir {alumnosAprobados.length} Boletas Aprobadas
          </button>
        </div>
      </div>

      <div className="print-only">
        {alumnosAprobados.map((boleta) => (
          <div key={boleta.id_boleta} style={styles.boletaIndividual}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', textAlign: 'center' }}>
              <img src="/logo-baruta.png" alt="Baruta" style={{ width: '50px', height: '50px' }} />
              <div style={{ fontSize: '9px', lineHeight: '1.2' }}>
                <p>República Bolivariana de Venezuela | Ministerio del Poder Popular para la Educación</p>
                <p>Estado Bolivariano de Miranda - Municipio Baruta</p>
                <p><strong>Escuela Municipal Rural "Aquiles Nazoa"</strong> | Código DEA: OD19581503</p>
              </div>
              <img src="/logo-escuela.png" alt="Sigean" style={{ width: '50px', height: '50px' }} />
            </div>

            <div style={{ borderTop: '1.5px solid #000', borderBottom: '1.5px solid #000', padding: '5px', textAlign: 'center', margin: '10px 0' }}>
              <h3 style={{ margin: 0 }}>BOLETÍN INFORMATIVO</h3>
              <p style={{ fontSize: '10px', margin: 0 }}>Año Escolar 2025-2026</p>
            </div>

            <div style={{ marginBottom: '20px', fontSize: '11px' }}>
              <p><strong>Alumno:</strong> {boleta.primer_nombre} {boleta.primer_apellido}</p>
              <p><strong>Cédula Escolar:</strong> {boleta.cedula_escolar}</p>
              <p><strong>Grado/Sección:</strong> {boleta.id_grado}° "{boleta.id_seccion}"</p>
            </div>

            <div style={{ border: '1px solid #000', padding: '10px', minHeight: '400px', fontSize: '11px' }}>
              <p><strong>INFORME DEL DOCENTE:</strong></p>
              <p style={{ fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>{boleta.obs_docente}</p>
              <hr style={{ margin: '15px 0' }} />
              <p><strong>OBSERVACIONES DEL DIRECTIVO:</strong></p>
              <p>{boleta.obs_directivo || 'Sin observaciones adicionales.'}</p>
            </div>

            <div style={styles.firmaContainer}>
              <div style={styles.firmaBox}><div style={styles.lineaFirma}></div><p><strong>Docente</strong></p></div>
              <div style={styles.firmaBox}><div style={styles.lineaFirma}></div><p><strong>Directivo</strong></p></div>
              <div style={styles.firmaBox}><div style={styles.lineaFirma}></div><p><strong>Representante</strong></p></div>
            </div>

            <div style={{ pageBreakAfter: 'always' }}></div>
          </div>
        ))}
      </div>

      <style>{`
        @media screen { .print-only { display: none; } }
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white; margin: 0; }
          @page { margin: 1.5cm; }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: { padding: '20px', backgroundColor: '#f4f7f6', minHeight: '90vh' },
  titulo: { color: '#034c20', marginBottom: '20px' },
  btnVolver: { background: 'none', border: 'none', color: '#008f39', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '15px' },
  filtrosCard: { backgroundColor: '#fff', padding: '25px', borderRadius: '12px', display: 'flex', gap: '20px', alignItems: 'flex-end', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  grupoFiltro: { display: 'flex', flexDirection: 'column' as const, gap: '8px', flex: 1 },
  select: { padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' },
  btnImprimir: { padding: '12px 25px', backgroundColor: '#008f39', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' },
  btnDeshabilitado: { padding: '12px 25px', backgroundColor: '#ccc', color: '#666', border: 'none', borderRadius: '6px', cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: '10px' },
  boletaIndividual: { padding: '0', color: 'black', backgroundColor: 'white' },
  firmaContainer: { display: 'flex', justifyContent: 'space-between', marginTop: '60px', padding: '0 40px' },
  firmaBox: { textAlign: 'center' as const, width: '150px' },
  lineaFirma: { borderTop: '1px solid #000', marginBottom: '5px' }
};

export default ReportesImpresion;