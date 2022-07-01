import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Appsettings } from './appsettings';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  public apiUrl: string;

  constructor(
    private _http: HttpClient
  ) {
    this.apiUrl = Appsettings.API_ENDPOINT_FULL;
  }

  getData(fechaInicio: string, fechaFin: string):Observable<any>
  {
    let params = '?fechaInicio=' + fechaInicio + '&fechaFin=' + fechaFin;
    return this._http.get(this.apiUrl + '/Dashboard/Data' + params);
  }

  getPorActividad():Observable<any>
  {
    return this._http.get(this.apiUrl + '/Dashboard/PorActividad');
  }

  getPorProveedor():Observable<any>
  {
    return this._http.get(this.apiUrl + '/Dashboard/PorProveedor');
  }

  getPorProveedorPorcentaje():Observable<any>
  {
    return this._http.get(this.apiUrl + '/Dashboard/PorProveedorPorcentaje');
  }

  getPorActividadMontoPorcentaje():Observable<any>
  {
    return this._http.get(this.apiUrl + '/Dashboard/PorActividadMontoPorcentaje');
  }
}