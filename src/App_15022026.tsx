import React, { useState } from 'react';
import { ArrowLeft, Save, CheckCircle, XCircle } from 'lucide-react';

interface Props { onBack: () => void; }

const Asistencia: React.FC<Props> = ({ onBack }) => {
    const docentes = ["Laura Seijas", "Ana Pérez", "Carmen sánchez", "Luisa Gómez", "María Rodríguez"];
    const [docente, setDocente] = useState("");
    const [fecha, setFecha] = useState("2026-02-06");
    const [anoEscolar, setAnoEscolar] = useState("2025-2026");
    const [turno, setTurno] = useState("Mañana");
    const [seccion, setSeccion] = useState("U");

    // Generamos 30 alumnos basados en tu lista real de Asistencia
    const [alumnos, setAlumnos] = useState([
        { id: 1, nombre: "ARAUJO BASTIDAS, FRANYELIS VALERIA", est: true },
        { id: 2, nombre: "ARIAS GONZALEZ, TONY ALEXANDER", est: true },
        { id: 3, nombre: "BELISARIO JUSTINIANI, LUIS ASDRUBAL", est: true },
        { id: 4, nombre: "CHIRINOS BASTIDAS, LISANDRO XAVIER", est: true },
        { id: 5, nombre: "COLINA REBOLLEDO, ANGEL SEBASTIAN", est: true },
        { id: 6, nombre: "ECHANDIA MORALES, HEISSLER ALEXANDER", est: true },
        { id: 7, nombre: "ESCALONA CASAREZ, EMMANUEL ANTONIO", est: true },
        { id: 8, nombre: "FIGUERA CONTRERAS, RAYMOND ALEXI JOSE", est: true },
        { id: 9, nombre: "FLORES CHACON, ELYAN JEAN FRANCO", est: true },
        { id: 10, nombre: "FLORES MUJICA, FREDERIK YASMANY", est: true },
        { id: 11, nombre: "GARCIA GUDIÑO, ELIANNY PAOLA", est: true },
        { id: 12, nombre: "GARCIA VALERA, BRAYAN DAVIDD", est: true },
        { id: 13, nombre: "GONZALEZ DIAZ, ISMELY MARGARITA", est: true },
        { id: 14, nombre: "GONZALEZ HERNANDEZ, LUIS EDUARDO", est: true },
        { id: 15, nombre: "GUALDRON CARRANZA, ARANTZA SUSET", est: true },
        { id: 16, nombre: "HERNANDEZ MARIN, DERISON MIGUEL", est: true },
        { id: 17, nombre: "MARQUEZ REBOLLEDO, MATHIAS ALEXANDER", est: true },
        { id: 18, nombre: "MONTERROSA GUZMAN, ANDRES DANIEL", est: true },
        { id: 19, nombre: "MORALES INFANTE, EMMA SARAY", est: true },
        { id: 20, nombre: "NARANJO PAJARO, JEAN PAUL", est: true },
        { id: 21, nombre: "OROPEZA BRAVO, JONATHAN MANUEL", est: true },
        { id: 22, nombre: "OROPEZA MUÑOZ, DARLA SILVANA", est: true },
        { id: 23, nombre: "PEREZ LEZAMA, SAMUEL ANDRES", est: true },
        { id: 24, nombre: "QUEVEDO HEREDIA, NICOLE ALEXANDRA", est: true },
        { id: 25, nombre: "RUJANO MARQUEZ, KARLOS HERNESTO", est: true },
        { id: 26, nombre: "SILVA BARRETO, DARIANNIS JHEIMALYS", est: true },
        { id: 27, nombre: "SILVERA DABOIN, FRANSHESKA JENNYMAR", est: true },
        { id: 28, nombre: "TOUSSAINT CARRANZA, AYNHOA VICTORIA", est: true },
        { id: 29, nombre: "URDANETA RAMIREZ, YOINER", est: true },
        { id: 30, nombre: "VERA RUJANO, ANDRES JESUS", est: true },
    ]);

    const toggle = (id: number) => {
        setAlumnos(alumnos.map(a => a.id === id ? { ...a, est: !a.est } : a));
    };

    return (
        <div style={st.pg}>
            <div style={st.cd}>
                <div style={st.hd}>
                    <button onClick={onBack} style={st.bk}><ArrowLeft size={18} /> Panel</button>
                    <div style={{ textAlign: 'right' }}>
                        <h2 style={st.ti}>Registro de Asistencia Diaria</h2>
                        <p style={st.sub}>SIGEAN - Control Escolar</p>
                    </div>
                </div>

                <div style={st.filtroBanda}>
                    <div style={st.bx}><label style={st.lb}>DOCENTE</label>
                        <select style={st.in} value={docente} onChange={e => setDocente(e.target.value)}>
                            <option value="">Seleccione...</option>
                            {docentes.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div style={st.bx}><label style={st.lb}>AÑO ESCOLAR</label><input style={st.in} value={anoEscolar} onChange={e => setAnoEscolar(e.target.value)} /></div>
                    <div style={st.bx}><label style={st.lb}>FECHA</label><input type="date" style={st.in} value={fecha} onChange={e => setFecha(e.target.value)} /></div>
                    <div style={st.bx}><label style={st.lb}>TURNO</label>
                        <select style={st.in} value={turno} onChange={e => setTurno(e.target.value)}>
                            <option value="Mañana">Mañana</option><option value="Tarde">Tarde</option>
                        </select>
                    </div>
                    <div style={st.bx}><label style={st.lb}>SECCIÓN</label>
                        <select style={st.in} value={seccion} onChange={e => setSeccion(e.target.value)}>
                            <option value="U">U</option><option value="A">A</option><option value="B">B</option>
                        </select>
                    </div>
                </div>

                <div style={st.tablaCont}>
                    <table style={st.tabla}>
                        <thead>
                            <tr style={st.th}>
                                <th style={st.td}>N°</th>
                                <th style={st.td}>APELLIDOS Y NOMBRES</th>
                                <th style={{...st.td, textAlign: 'center'}}>ESTADO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alumnos.map((a, i) => (
                                <tr key={a.id} style={st.tr}>
                                    <td style={st.td}>{i + 1}</td>
                                    <td style={st.td}>{a.nombre}</td>
                                    <td style={{...st.td, display:'flex', justifyContent:'center'}}>
                                        <button onClick={() => toggle(a.id)}
                                            style={{...st.btnEst, backgroundColor: a.est ? '#e6fffa' : '#fff5f5', color: a.est ? '#38a169' : '#e53e3e', border: `1px solid ${a.est ? '#38a169' : '#e53e3e'}`}}>
                                            {a.est ? <CheckCircle size={14}/> : <XCircle size={14}/>} {a.est ? "P" : "A"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={st.ftAsis}>
                    <div style={st.stats}>
                        Presentes: <strong>{alumnos.filter(a=>a.est).length}</strong> | Ausentes: <strong>{alumnos.filter(a=>!a.est).length}</strong>
                    </div>
                    <button style={st.sv} onClick={() => alert("Guardado")}><Save size={18}/> Guardar Asistencia</button>
                </div>
            </div>
        </div>
    );
};

const st: any = {
    pg: { display:'flex', justifyContent:'center', minHeight:'100vh', width:'100%', backgroundColor:'#f0f4f3', padding:'40px 0', position:'absolute', left:0, top:0 },
    cd: { width:'95%', maxWidth:'850px', backgroundColor:'#fff', padding:'30px', borderRadius:'20px', boxShadow:'0 10px 30px rgba(0,0,0,0.1)', margin:'0 auto' },
    hd: { display:'flex', justifyContent:'space-between', borderBottom:'2px solid #008f39', paddingBottom:10, marginBottom: 20 },
    ti: { color:'#008f39', margin:0, fontSize:'1.4rem' },
    sub: { fontSize:10, color:'#666', margin:0 },
    bk: { background:'none', border:'none', color:'#008f39', fontWeight:'bold', cursor:'pointer', display:'flex', alignItems:'center', gap:5 },
    filtroBanda: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(130px, 1fr))', gap:10, marginBottom:20, backgroundColor:'#f9fefb', padding:15, borderRadius:12, border:'1px solid #e0eee6' },
    bx: { display:'flex', flexDirection:'column', gap:4 },
    lb: { fontSize:10, fontWeight:'bold', color:'#555' },
    in: { padding:8, borderRadius:8, border:'1px solid #ccc', fontSize:12 },
    tablaCont: { maxHeight:'500px', overflowY:'auto', border:'1px solid #eee', borderRadius:10 },
    tabla: { width:'100%', borderCollapse:'collapse' },
    th: { backgroundColor:'#f0fdf4', position: 'sticky', top: 0 },
    tr: { borderBottom:'1px solid #eee' },
    td: { padding:'10px', fontSize:11 },
    btnEst: { display:'flex', alignItems:'center', gap:5, padding:'5px 10px', borderRadius:20, cursor:'pointer', fontWeight:'bold', fontSize:10 },
    ftAsis: { marginTop:20, display:'flex', justifyContent:'space-between', alignItems:'center' },
    stats: { fontSize:12 },
    sv: { padding:'10px 20px', backgroundColor:'#008f39', color:'#fff', border:'none', borderRadius:10, cursor:'pointer', display:'flex', gap:8, fontWeight:'bold' }
};

export default Asistencia;