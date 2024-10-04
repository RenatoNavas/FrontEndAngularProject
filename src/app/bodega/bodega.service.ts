import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Bodega } from './bodega.model';
import { GenericService } from '../generic.service';

@Injectable({
  providedIn: 'root'
})
export class BodegaService extends GenericService<Bodega> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:5077/api/bodega');
  }
}
