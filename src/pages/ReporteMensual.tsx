import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw, Printer } from 'lucide-react';

const ReporteMensual = () => {
  const [loading, setLoading] = useState(false);
  const [datosEstudiantes, setDatosEstudiantes] = useState<any[]>([]);

  // Filtros
  const [mes, setMes] = useState("02");
  const [anio, setAnio] = useState("2026");
  const [grado, setGrado] = useState("3er Grado"); 
  const [anioEscolar, setAnioEscolar] = useState("2025-2026");

  // Generar array de días del mes
  const getDiasEnMes = (m: string, a: string) => new Date(parseInt(a), parseInt(m), 0).getDate();
  const diasArr = Array.from({ length: getDiasEnMes(mes, anio) }, (_, i) => i + 1);

  const consultarMensual = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/asistencias/acumulado`, {
        params: { 
          mes, 
          anio, 
          grado, 
          año_escolar: anioEscolar 
        }
      });
      setDatosEstudiantes(res.data.estudiantes);
    } catch (error) {
      console.error("Error al cargar reporte mensual", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    consultarMensual();
  }, [mes, anio, grado, anioEscolar]);

  const renderStatus = (status: string) => {
    switch (status) {
      case 'presente': return <b style={{ color: '#28a745' }}>P</b>;
      case 'ausente': return <b style={{ color: '#dc3545' }}>A</b>;
      case 'justificado': return <b style={{ color: '#007bff' }}>J</b>;
      default: return <span style={{ color: '#ccc' }}>-</span>;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @media print {
            .no-print { display: none !important; }
            body { background: white !important; padding: 0 !important; }
            table { font-size: 10px !important; width: 100% !important; }
            th, td { border: 1px solid #000 !important; padding: 4px !important; }
            .print-only { display: block !important; text-align: center; margin-bottom: 10px; }
          }
          .print-only { display: none; }
        `}
      </style>

      <div className="print-only">
        <h2 style={{ margin: 0 }}>U.E. "Aquiles Nazoa"</h2>
        <p style={{ margin: 0 }}>Control Mensual de Asistencia - {grado}</p>
        <p style={{ fontSize: '12px' }}>Año Escolar: {anioEscolar} | Mes: {mes} / Año: {anio}</p>
      </div>

      <section className="no-print" style={styles.filterCard}>
        <div style={styles.filterGrid}>
          <div style={styles.field}>
            <label style={styles.label}>Año Escolar</label>
            <select style={styles.select} value={anioEscolar} onChange={(e) => setAnioEscolar(e.target.value)}>
              <option value="2025-2026">2025-2026</option>
              <option value="2026-2027">2026-2027</option>
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Grado</label>
            <select style={styles.select} value={grado} onChange={(e) => setGrado(e.target.value)}>
              <option value="1er Grado">1er Grado</option>
              <option value="2do Grado">2do Grado</option>
              <option value="3er Grado">3er Grado</option>
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Mes</label>
            <select style={styles.select} value={mes} onChange={(e) => setMes(e.target.value)}>
              <option value="01">Enero</option>
              <option value="02">Febrero</option>
              <option value="03">Marzo</option>
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Acciones</label>
            <button onClick={handlePrint} style={styles.printBtn}>
              <Printer size={18} /> Imprimir Reporte
            </button>
          </div>
        </div>
      </section>

      <div style={styles.tableWrapper}>
        <table style={styles.tableAcumulada}>
          <thead>
            <tr>
              <th style={styles.thFixed}>Nómina del Estudiante</th>
              {diasArr.map(d => (
                <th key={d} style={styles.thDia}>{d}</th>
              ))}
              <th style={styles.thTotal}>Total Inas.</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={diasArr.length + 2} style={{ textAlign: 'center', padding: '40px' }}>
                  <RefreshCw className="animate-spin" size={24} color="#008f39" />
                  <p>Cargando datos acumulados...</p>
                </td>
              </tr>
            ) : datosEstudiantes.map((est, idx) => (
              <tr key={est.id || idx} style={styles.trRow}>
                <td style={styles.tdNombre}>{est.nombre}</td>
                {diasArr.map(d => (
                  <td key={d} style={styles.tdStatus}>
                    {renderStatus(est.asistencias[d])}
                  </td>
                ))}
                <td style={styles.tdTotalCount}>{est.total_inasistencias}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { marginTop: '10px', animation: 'fadeIn 0.4s ease' },
  filterCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '20px' },
  filterGrid: { display: 'flex', gap: '20px', alignItems: 'flex-end' },
  field: { display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 },
  label: { fontSize: '11px', fontWeight: 'bold', color: '#666', textTransform: 'uppercase' },
  select: { padding: '10px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#fff' },
  printBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#008f39', color: '#fff', cursor: 'pointer', fontWeight: 'bold' },
  tableWrapper: { overflowX: 'auto', backgroundColor: '#fff', borderRadius: '15px', border: '1px solid #eee' },
  tableAcumulada: { width: '100%', borderCollapse: 'collapse', minWidth: '1000px' },
  thFixed: { position: 'sticky', left: 0, backgroundColor: '#f8f9fa', padding: '15px', textAlign: 'left', zIndex: 10, borderRight: '2px solid #eee' },
  thDia: { padding: '8px', textAlign: 'center', fontSize: '11px', backgroundColor: '#f8f9fa', borderRight: '1px solid #eee' },
  thTotal: { backgroundColor: '#fff5f5', color: '#c53030', padding: '10px', fontSize: '12px' },
  trRow: { borderBottom: '1px solid #f0f0f0' },
  tdNombre: { position: 'sticky', left: 0, backgroundColor: '#fff', padding: '12px 15px', fontSize: '13px', borderRight: '2px solid #eee' },
  tdStatus: { textAlign: 'center', fontSize: '12px', color: '#444', borderRight: '1px solid #f9f9f9' },
  tdTotalCount: { textAlign: 'center', fontWeight: 'bold', color: '#c53030', backgroundColor: '#fffafb' },
};

export default ReporteMensual;