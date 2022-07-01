import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CriptoService } from './cripto.service';
import { Appsettings } from './appsettings';
import { EmpresaModel, LogoEmpresaModel } from '../models/empresa-model'

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EmpresaService{
  public apiUrl: string;

  constructor(
    private _http: HttpClient,
    private cripto: CriptoService
  ){
    this.apiUrl = Appsettings.API_ENDPOINT_FULL;
  }

  getEmpresa(idEmpresa):Observable<any>
  {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this._http.get(this.apiUrl + '/Empresa/' + idEmpresa, {headers: headers}); 
  } 
  
  createEmpresa(empresa: EmpresaModel):Observable<any>
  {
    return this._http.post(this.apiUrl + '/Empresa', empresa);

    /*return this._http.post(this.apiUrl + '/Empresa', empresa ).pipe(map(
      (response: any) => {
        empresa.idEmpresa = response.data.idEmpresa;   
        const idEmpresaEncriptado = this.cripto.encrypt(response.data.idEmpresa);
        localStorage.setItem('idEmpresa', idEmpresaEncriptado);
        return response; //return empresa
      }
    ));*/
  }

  createProveedorEmpresa(proveedor: EmpresaModel):Observable<any>
  {
    return this._http.post(this.apiUrl + '/Empresa/Proveedores', proveedor);
  }

  updateEmpresa(empresa: EmpresaModel):Observable<any>
  {
    const empresaTemp = { 
      ...empresa
    };
        
    return this._http.put(this.apiUrl + '/Empresa', empresaTemp);
  }  

  uploadLogo(fileLogo: LogoEmpresaModel):Observable<any>
  {
    //return this._http.post(this.apiUrl + '/Empresa/logo', logo, {observe: 'response'});
    return this._http.post(this.apiUrl + '/Empresa/logo', fileLogo);
  }

  getLogo(idEmpresa):Observable<any>
  {
    return this._http.get(this.apiUrl + '/Empresa/logo/' + idEmpresa);
  }

  getProveedoresEmpresa(idEmpresa):Observable<any>
  {
    return this._http.get(this.apiUrl + '/Empresa/Proveedores/' + idEmpresa);
  }

}