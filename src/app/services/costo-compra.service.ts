import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Appsettings } from './appsettings';
import { CostoDeCompraModel } from '../models/costo-compra.model';

@Injectable({
  providedIn: 'root',
})
export class CostoDeCompraService {
  public apiUrl: string;

  constructor(
    private _http: HttpClient
  ) {
    this.apiUrl = Appsettings.API_ENDPOINT_FULL;
  }

  getCostoDeCompra(idCosto):Observable<any>
  {
    return this._http.get(this.apiUrl + '/CostoDeCompra/' + idCosto);
  }

  getCostoDeCompraPartida(idCFDIDetalle):Observable<any>
  {
    return this._http.get(this.apiUrl + '/CostoDeCompra/Partida/' + idCFDIDetalle);
  }

  createCostoDeCompra(costoCompra: CostoDeCompraModel):Observable<any>
  {
    return this._http.post(this.apiUrl + '/CostoDeCompra', costoCompra);
  }

  updateCostoDeCompra(costoCompra: CostoDeCompraModel):Observable<any>
  {
    const body = {
      ...costoCompra
    }
    return this._http.put(this.apiUrl + '/CostoDeCompra', body);
  }

  deleteCostoDeCompra(idCosto):Observable<any>
  {
    return this._http.delete(this.apiUrl + '/CostoDeCompra/' + idCosto);
  }  
}