import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appsettings } from './appsettings';
import { CFDIPartidaModel } from '../models/cfdipartida-model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CFDIPartidaService{

  public apiUrl: string;

  constructor(
    private _http: HttpClient
  ){
    this.apiUrl = Appsettings.API_ENDPOINT_FULL;
  } 

  getPartidasAll(idCFDI):Observable<any>
  {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this._http.get(this.apiUrl + '/partida/All/' + idCFDI, { headers: headers });
  }

  getPartida(idCFDIDetalle):Observable<any>
  {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this._http.get(this.apiUrl + '/partida/' + idCFDIDetalle, { headers: headers });
  }

  updatePartida(detallePartida: CFDIPartidaModel):Observable<any>
  {
    const detallePartidaTemp = { 
      ...detallePartida
    };
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this._http.put(this.apiUrl + '/partida/updatePartida', detallePartidaTemp, { headers: headers });
  }

}
