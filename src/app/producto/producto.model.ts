export interface Producto {
    id: number;
    nombre: string;
    precio: number;
    stock: number;
    fechaIngreso: Date; // Asegúrate de agregar esta propiedad
    bodegaId: number;   
  }
  