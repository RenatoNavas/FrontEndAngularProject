import { Component, OnInit } from '@angular/core';
import { ProductoService } from './producto.service';
import { Producto } from './producto.model';
import { MessageService } from 'primeng/api';
import { Bodega } from '../bodega/bodega.model';
import { BodegaService } from '../bodega/bodega.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss'],
  providers: [MessageService]
})
export class ProductoComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  bodegas: Bodega[] = [];
  bodegasOpciones: any[] = [];
  productoSeleccionado: Producto = { id: 0, nombre: '', precio: 0, stock: 0, fechaIngreso: new Date(), bodegaId: 0 };
  displayDialog: boolean = false;
  displayDialogEliminar: boolean = false;
  editMode: boolean = false;

  // Filtros
  stockMinimo: number = 0;
  nombreFiltro: string = '';
  fechaIngresoFiltro: Date | null = null;
  bodegaFiltro: number | null = null;

  paginatorHandler = { pageCount: 0, rows: 10, totalCount: 0 };

  constructor(
    private productoService: ProductoService,
    private bodegaService: BodegaService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarBodegas();
  }

  cargarProductos(): void {
    this.productoService.getAll().subscribe(productos => {
      this.productos = productos;
      this.productosFiltrados = productos;
      this.paginatorHandler.totalCount = productos.length;
    });
  }

  cargarBodegas(): void {
    this.bodegaService.getAll().subscribe(bodegas => {
      this.bodegas = bodegas;
      this.bodegasOpciones = [{ nombre: 'Todas', id: null }, ...bodegas];
    });
  }

  aplicarFiltros(): void {
    this.productosFiltrados = this.productos.filter(producto => {
      const cumpleStock = producto.stock >= this.stockMinimo;
      const cumpleNombre = producto.nombre.toLowerCase().includes(this.nombreFiltro.toLowerCase());
      const cumpleFechaIngreso = !this.fechaIngresoFiltro || new Date(producto.fechaIngreso) <= new Date(this.fechaIngresoFiltro);
      const cumpleBodega = !this.bodegaFiltro || producto.bodegaId === this.bodegaFiltro || this.bodegaFiltro === null;

      return cumpleStock && cumpleNombre && cumpleFechaIngreso && cumpleBodega;
    });
  }

  mostrarDialogoCrear(): void {
    this.productoSeleccionado = { id: 0, nombre: '', precio: 0, stock: 0, fechaIngreso: new Date(), bodegaId: 0 };
    this.editMode = false;
    this.displayDialog = true;
  }

  onEditar(producto: Producto): void {
    this.productoSeleccionado = { ...producto };
    this.editMode = true;
    this.displayDialog = true;
  }

  guardarProducto(): void {
    if (this.editMode) {
      this.productoService.update(this.productoSeleccionado.id, this.productoSeleccionado).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Producto Actualizado' });
        this.cargarProductos();
        this.displayDialog = false;
      });
    } else {
      this.productoService.create(this.productoSeleccionado).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Producto Creado' });
        this.cargarProductos();
        this.displayDialog = false;
      });
    }
  }

  mostrarDialogoEliminar(producto: Producto): void {
    this.productoSeleccionado = { ...producto };
    this.displayDialogEliminar = true;
  }

  confirmarEliminar(): void {
    this.productoService.delete(this.productoSeleccionado.id).subscribe(() => {
      this.messageService.add({ severity: 'warn', summary: 'Producto Eliminado' });
      this.cargarProductos();
      this.displayDialogEliminar = false;
    });
  }

  cerrarDialogo(): void {
    this.displayDialog = false;
  }

  cerrarDialogoEliminar(): void {
    this.displayDialogEliminar = false;
  }
}
