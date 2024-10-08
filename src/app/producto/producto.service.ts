import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from './producto.model';
import { GenericService } from '../generic.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService extends GenericService<Producto> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:5077/api/producto');
  }
}
