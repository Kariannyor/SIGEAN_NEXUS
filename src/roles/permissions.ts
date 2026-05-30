// src/roles/permissions.ts

export type Rol =
  | "Administrador"
  | "Docente"
  | "Secretaria"
  | "Directivo"
  | "Invitado";

export const permisosPorRol: Record<Rol, string[]> = {
  Administrador: [
    "ver_dashboard",
    "ver_estudiantes",
    "ver_boletas",
    "ver_calificaciones",
    "ver_asistencia",
    "crear_boleta",
    "editar_calificaciones",
    "configuracion"
  ],

  Docente: [
    "ver_dashboard",
    "ver_estudiantes",
    "ver_boletas",
    "ver_calificaciones",
    "ver_asistencia",
    "crear_boleta"
  ],

  Secretaria: [
    "ver_dashboard",
    "ver_boletas",
    "ver_asistencia"
  ],

  Directivo: [
    "ver_dashboard",
    "ver_boletas",
    "ver_calificaciones"
  ],

  Invitado: [
    "ver_dashboard"
  ]
};
