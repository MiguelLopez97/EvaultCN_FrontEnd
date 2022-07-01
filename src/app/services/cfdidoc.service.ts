import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Appsettings } from './appsettings';
import { CFDIDocModel } from '../models/cfdidoc-model';
import { DocumentoRelacionadoModel } from '../models/doc-relacionado.model';

@Injectable({
  providedIn: 'root',
})
export class CFDIDocService{
  public apiUrl: string;

  constructor(
    private _http: HttpClient
  ){
    this.apiUrl = Appsettings.API_ENDPOINT_FULL;
  }

  getFacturasAll(idEmpresa):Observable<any>
  {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this._http.get(this.apiUrl + '/doc/All/' + idEmpresa, { headers: headers });
  }

  getFacturasAllCompras(idEmpresa):Observable<any>
  {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this._http.get(this.apiUrl + '/doc/All/Compras/' + idEmpresa, { headers: headers });
  }

  getFactura(idCFDIDoc):Observable<any>
  {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this._http.get(this.apiUrl + '/doc/' + idCFDIDoc, { headers: headers });
  }

  updateEstatusCFDIDoc(idDoc, idEstatusCFDI):Observable<any>
  {
    const CFDIEstatusDocTemp = { 
      idDoc,
      idEstatusCFDI
    };
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this._http.put(this.apiUrl + '/doc/updateEstatus', CFDIEstatusDocTemp, { headers: headers });
  }

  updateFactura(CFDIDoc: CFDIDocModel):Observable<any>
  {
    const CFDIDocTemp = { 
      ...CFDIDoc
    };

    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this._http.put(this.apiUrl + '/CFDIDoc', CFDIDocTemp, { headers: headers });
  }

  deleteCFDIDoc(idCFDIDoc):Observable<any>
  {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this._http.delete(this.apiUrl + '/doc/' + idCFDIDoc, {headers: headers});
  }

  generateCartas(idEmpresa, idCFDI, idCarta):Observable<any>
  {
    const valores = '?idEmpresa=' + idEmpresa + '&idCFDi=' + idCFDI + '&idCarta=' + idCarta + '&format=pdf';
    
    return this._http.get(this.apiUrl + '/doc/Cartas/Generar/' + valores);
  }

  getDocumentosRelacionadosCFDI(idCFDI):Observable<any>
  {
    return this._http.get(this.apiUrl + '/doc/Relacionado/' + idCFDI);
  }

  uploadDocRelacionado(file: DocumentoRelacionadoModel):Observable<any>
  {
    return this._http.post(this.apiUrl + '/doc/Relacionado', file);    
  }

  getCalculo(idCFDI):Observable<any>
  {
    return this._http.get(this.apiUrl + '/doc/Calculate/' + idCFDI);
  }

  getCalculoPartida(idCFDIDoc, idPartida):Observable<any>
  {
    return this._http.get(this.apiUrl + '/doc/Calculate/CFDI/' + idCFDIDoc + '/Partida/' + idPartida);
  }
}