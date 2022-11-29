import { Reclamo } from "./reclamo";

export interface Usuario{
  id: string;
  nombre: string,
  noCasa: string,
  telefono: string,
  correo: string;
  imageUrl: string;
  reclamos: Reclamo[];
}




