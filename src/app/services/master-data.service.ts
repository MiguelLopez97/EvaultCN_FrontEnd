import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appsettings } from './appsettings';

import { map } from 'rxjs/operators';

@Injectable()
export class MasterDataService{
  public apiUrl: string;

  constructor(
    private _http: HttpClient
  ){
    this.apiUrl = Appsettings.API_ENDPOINT_FULL;
  }

  getAllColonias(codigoPostal)
  {
    return this._http.get(this.apiUrl + '/masterdata/getAllColonias/' + codigoPostal)
    .pipe(
      map(
        (response: any) => 
        response.data.map( colonia => (
          {
            idCiudad: colonia.idCd, 
            colonia: colonia.col,
            ciudad: colonia.cd,
            municipio: colonia.mpio,
            estado: colonia.edo
          }
        ))
      )
    );            
  }

  getAllActividadConcepto():Observable<any>
  {
    return this._http.get(this.apiUrl + '/masterdata/getAllActividadConcepto');
  }

  getAllTipoContenido():Observable<any>
  {
    return this._http.get(this.apiUrl + '/masterdata/getAllTipoContenido');
  }

  getAllCodigoSE():Observable<any>
  {
    return this._http.get(this.apiUrl + '/masterdata/getAllCodigoSE');
  }

}