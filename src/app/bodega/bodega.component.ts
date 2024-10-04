import { Component, OnInit } from '@angular/core';
import { BodegaService } from './bodega.service';
import { Bodega } from './bodega.model';
import { ProductoService } from '../producto/producto.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-bodega',
  templateUrl: './bodega.component.html',
  styleUrls: ['./bodega.component.scss'],
  providers: [MessageService]
})
export class BodegaComponent implements OnInit {

  bodegas: Bodega[] = [];
  bodegasReasignar: Bodega[] = []; // Array para las bodegas filtradas
  bodegaSeleccionada: Bodega = { id: 0, nombre: '', descripcion: '' };
  displayDialog: boolean = false;
  displayDialogEliminar: boolean = false;
  editMode: boolean = false;
  nuevaBodegaId: number | null = null;

  constructor(
    private bodegaService: BodegaService,
    private productoService: ProductoService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarBodegas();
  }

  cargarBodegas(): void {
    this.bodegaService.getAll().subscribe(bodegas => this.bodegas = bodegas);
  }

  mostrarDialogoCrear(): void {
    this.bodegaSeleccionada = { id: 0, nombre: '', descripcion: '' };
    this.editMode = false;
    this.displayDialog = true;
  }

  onEditar(bodega: Bodega): void {
    this.bodegaSeleccionada = { ...bodega };
    this.editMode = true;
    this.displayDialog = true;
  }

  mostrarDialogoEliminar(bodega: Bodega): void {
    this.bodegaSeleccionada = { ...bodega };
    this.bodegasReasignar = this.bodegas.filter(b => b.id !== bodega.id);
    this.nuevaBodegaId = null; // Resetear la selección anterior
    this.displayDialogEliminar = true;
  }

  guardarBodega(): void {
    if (this.editMode) {
      this.bodegaService.update(this.bodegaSeleccionada.id, this.bodegaSeleccionada).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Bodega Actualizada' });
        this.cargarBodegas();
        this.displayDialog = false;
      });
    } else {
      this.bodegaService.create(this.bodegaSeleccionada).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Bodega Creada' });
        this.cargarBodegas();
        this.displayDialog = false;
      });
    }
  }

  eliminarBodega(): void {
    if (this.nuevaBodegaId != null) {
      this.productoService.getAll().subscribe(productos => {
        const productosActualizar = productos.filter(p => p.bodegaId === this.bodegaSeleccionada.id);
        productosActualizar.forEach(producto => {
          producto.bodegaId = this.nuevaBodegaId!;
          this.productoService.update(producto.id, producto).subscribe(() => {
            this.messageService.add({ severity: 'info', summary: 'Producto Actualizado', detail: `Producto ${producto.nombre} reasignado.` });
          });
        });

        this.bodegaService.delete(this.bodegaSeleccionada.id).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Bodega Eliminada' });
          this.cargarBodegas();
          this.displayDialogEliminar = false;
        });
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar una bodega nueva antes de eliminar.' });
    }
  }

  cerrarDialogoEliminar(): void {
    this.displayDialogEliminar = false;
  }
}
