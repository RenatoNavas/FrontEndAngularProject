import { Component, OnInit } from '@angular/core';
import { ProductoService } from './producto.service';
import { Producto } from './producto.model';
import { MessageService } from 'primeng/api';
import { FilterHandler } from '../filter/FilterHandler';
import { PaginatorHandler } from '../pagination/PaginatorHandler';
import { ColumnHeader } from '../pagination/ColumnHeader';
import { PageList } from '../pagination/PageList';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss'],
  providers: [MessageService]
})
export class ProductoComponent implements OnInit {

  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  productoSeleccionado: Producto = { id: 0, nombre: '', precio: 0, stock: 0 };
  displayDialog: boolean = false;
  displayDialogEliminar: boolean = false;
  editMode: boolean = false;

  stockMinimo: number = 0;
  nombreFiltro: string = '';

  paginatorHandler = new PaginatorHandler<Producto>(this.cargarProductosFiltrados.bind(this));
  filterHandler = new FilterHandler();

  columns: ColumnHeader[] = [
    { field: 'nombre', header: 'Nombre', type: 'text', filter: true },
    { field: 'precio', header: 'Precio', type: 'text', filter: true },
    { field: 'stock', header: 'Stock', type: 'text', filter: true }
  ];

  constructor(private productoService: ProductoService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.paginatorHandler.init();
    this.cargarProductosFiltrados({}); 
  }


  cargarProductosFiltrados(query: Record<string, any>): Promise<PageList<Producto>> {

    this.filterHandler.setFilters(query);
    const filtros = this.filterHandler.getFilters();

    filtros['pageSize'] = this.paginatorHandler.rows;  
    filtros['page'] = this.paginatorHandler.pageCount / this.paginatorHandler.rows + 1;

    return this.productoService.getProductos(filtros).toPromise().then(data => {
      if (data) {
        this.productosFiltrados = data.items; 
        this.paginatorHandler.page.totalCount = data.totalCount;  
      }
      return new PageList<Producto>();  
    });
  }


  aplicarFiltros(): void {
    const filtros = {
      stockMinimo: this.stockMinimo,
      nombre: this.nombreFiltro
    };


    this.paginatorHandler.setFilters(filtros);
    this.paginatorHandler.reload();  
  }

  mostrarDialogoCrear(): void {
    this.productoSeleccionado = { id: 0, nombre: '', precio: 0, stock: 0 };
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
      this.productoService.actualizarProducto(this.productoSeleccionado.id, this.productoSeleccionado).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Producto Actualizado' });
        this.paginatorHandler.reload(); 
        this.cerrarDialogo();
      });
    } else {

      this.productoService.crearProducto(this.productoSeleccionado).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Producto Creado' });
        this.paginatorHandler.reload(); 
        this.cerrarDialogo();
      });
    }
  }

  mostrarDialogoEliminar(producto: Producto): void {
    this.productoSeleccionado = { ...producto };
    this.displayDialogEliminar = true;
  }

  confirmarEliminar(): void {
    this.productoService.eliminarProducto(this.productoSeleccionado.id).subscribe(() => {
      this.messageService.add({ severity: 'warn', summary: 'Producto Eliminado' });
      this.paginatorHandler.reload();  
      this.cerrarDialogoEliminar();
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
    if (newPageCount >= 0 && newPageCount < this.paginatorHandler.page.totalCount) {
      this.paginatorHandler.pageCount = newPageCount;
      this.paginatorHandler.reload();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.paginatorHandler.page.totalCount / this.paginatorHandler.rows);
  }
}
