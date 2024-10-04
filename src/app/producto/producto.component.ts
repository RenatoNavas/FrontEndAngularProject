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
  productoSeleccionado: Producto = { id: 0, nombre: '', precio: 0, stock: 0, fechaIngreso: new Date(), bodegaId: 0 };
  displayDialog: boolean = false;
  displayDialogEliminar: boolean = false;
  editMode: boolean = false;
  
  stockMinimo: number = 0;
  nombreFiltro: string = '';
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
    });
  }

  aplicarFiltros(): void {
    this.productosFiltrados = this.productos.filter(producto => 
      producto.stock >= this.stockMinimo && 
      producto.nombre.toLowerCase().includes(this.nombreFiltro.toLowerCase())
    );
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
      console.log("Enviando bodegaId:", this.productoSeleccionado.bodegaId);
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

  cambiarPagina(direccion: number): void {
    const newPageCount = this.paginatorHandler.pageCount + (direccion * this.paginatorHandler.rows);
    if (newPageCount >= 0 && newPageCount < this.paginatorHandler.totalCount) {
      this.paginatorHandler.pageCount = newPageCount;
      this.aplicarFiltros();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.paginatorHandler.totalCount / this.paginatorHandler.rows);
  }
}
