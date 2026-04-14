export type UsuarioRol = "admin" | "tecnico" | "ventas";

export type Usuario = {
  id: string;
  nombre: string;
  email: string;
  rol: UsuarioRol;
  activo: boolean;
  password: string;
  ultimoAcceso?: string;
};
