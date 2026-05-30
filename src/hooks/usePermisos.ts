// src/hooks/usePermisos.ts
import { permisosPorRol } from "../roles/permissions";
import type { Rol } from "../roles/permissions";

export const usePermisos = () => {
  const rol = (localStorage.getItem("userRole") || "Invitado") as Rol;

  const puede = (permiso: string) => {
    return permisosPorRol[rol]?.includes(permiso);
  };

  return { rol, puede };
};
