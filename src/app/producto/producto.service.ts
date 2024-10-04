import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Producto } from './producto.model';
import { PageList } from '../pagination/PageList';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl = 'http://localhost:5077/api/producto';

  constructor(private http: HttpClient) {}


  getProductos(query: Record<string, any>): Observable<PageList<Producto>> {
    let params = new HttpParams();
    Object.keys(query).forEach(key => {
      if (query[key] !== undefined && query[key] !== null) {
        params = params.append(key, query[key].toString());
      }
    });

    return this.http.get<Producto[]>(this.apiUrl, { params }).pipe(
      map((items: Producto[]) => {
        const pageList = new PageList<Producto>();
        pageList.items = items;
        pageList.totalCount = items.length;
        return pageList;
      })
    );
  }

  crearProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto);
  }


  actualizarProducto(id: number, producto: Producto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, producto);
  }

  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
