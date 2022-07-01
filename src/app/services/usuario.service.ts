import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';

import { Appsettings } from './appsettings';
import { UsuarioModel } from '../models/usuario-model';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  public apiUrl: string;

  constructor(
    private _http: HttpClient
  ){
    this.apiUrl = Appsettings.API_ENDPOINT_FULL;
  }

  createUsuario(usuario: UsuarioModel):Observable<any>
  {
    //let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.apiUrl + '/Usuario', usuario);
  }

  activarCuenta(correo, telefono):Observable<any>
  {
    const body = '?cuenta=' + correo + '&t=' + telefono;
    return this._http.get(this.apiUrl + '/Usuario/ActivarCuenta?cuenta=' + body);
  }

  getUsuario(idUsuario):Observable<any>
  {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this._http.get(this.apiUrl + '/Usuario/' + idUsuario, {headers: headers});
  }

  updateUsuario(usuario: UsuarioModel):Observable<any>
  {
    const body = { 
      ...usuario
    };
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this._http.put(this.apiUrl + '/Usuario', body, {headers: headers});
  }

  updateContrasenia(usuario: UsuarioModel):Observable<any>
  {
    const body = {
      ...usuario
    }
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this._http.post(this.apiUrl + '/Usuario/ActualizarContrasenia', body, {headers: headers});
  }

  //Método para validar si las contraseñas son iguales en el modal Cambiar Contraseña
  passwordIguales(pass1Name, pass2Name)
  {
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.controls[pass1Name];
      const pass2Control = formGroup.controls[pass2Name];
      
      if(pass1Control.value == pass2Control.value)
      {
        pass2Control.setErrors(null);
      }
      else
      {
        pass2Control.setErrors({noEsIgual: true});
      }
      
    }
  }


  /*recobrarContrasenia( userName: string ) {
    
    const apiUrl = `${Appsettings.API_ENDPOINT_FULL}/Usuario/RecuperarContrasenia`;
    const params = new URLSearchParams();
    params.append('email', userName);

    return this.httpService.get(apiUrl, { params: params }).map(res => res.json());

  }
*/
}
