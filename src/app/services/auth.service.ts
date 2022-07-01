import { Injectable } from '@angular/core';
import { CriptoService } from './cripto.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Appsettings } from './appsettings';

import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root',
})
export class AuthService{
    public apiUrl: string;
    private url: string; // Propiedad solamente para validar el Token de inicio de sesión
    public usuarioFullName: string;

    public userToken: string; //Propiedad para guardar el Token 

    constructor(
        private _http: HttpClient,
        private cripto: CriptoService,
        private _router: Router
    ){
        this.apiUrl = Appsettings.API_ENDPOINT_FULL;
        this.url = Appsettings.API_ENDPOINT;
	    this.leerToken();
    }

    logout()
    {
        localStorage.removeItem('token'); //Borra el valor 'token' del localStorage
        localStorage.removeItem('cuenta'); //Borra el valor 'cuenta' del localStorage
        localStorage.removeItem('fullName'); //Borra el valor 'fullName' del localStorage
        localStorage.removeItem('idEmpresa'); //Borra el valor 'idEmpresa' del localStorage
        localStorage.removeItem('idUsuario'); //Borra el valor 'idUsuario' del localStorage
        localStorage.removeItem('expira'); //Borra el valor 'expira' del localStorage
    }
    
    login(correo: string, password: string) 
    {
        const datos = 'grant_type=password&username=' + this.cripto.encrypt(correo) + '&password=' + this.cripto.encrypt(password);
        //console.log(datos);
        
        return this._http.post(this.url + '/Token', datos).pipe(map(
          response => {
            this.guardarToken(response['access_token']);
            
            const correoElectronicoEncriptado = this.cripto.encrypt(response['cuenta']);
            const fullNameEncriptado = this.cripto.encrypt(response['fullName']);
            const idEmpresaEncriptado = this.cripto.encrypt(response['idEmpresa']);
            const idUsuarioEncriptado = this.cripto.encrypt(response['idUsuario']);
            localStorage.setItem('cuenta', correoElectronicoEncriptado);
            localStorage.setItem('fullName', fullNameEncriptado);
            localStorage.setItem('idEmpresa', idEmpresaEncriptado);
            localStorage.setItem('idUsuario', idUsuarioEncriptado);

            //localStorage.setItem('cuenta', response['cuenta']);
            //localStorage.setItem('idEmpresa', response['idEmpresa']);
            //localStorage.setItem('idUsuario', response['idUsuario']);
            return response;
          }
        ));
    }

    //Alerta para mostrar cuando el token ha caducado
    sesionExpirada()
    {
        this.logout();
        Swal.fire({
            allowOutsideClick: false,
            title: 'La sesión ha expirado',
            text: 'Por favor, inicie sesión nuevamente',
            icon: 'error',
            showCancelButton: false,
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#A0C334'
        }).then((result) => {
            if (result.value)
            {
              this._router.navigate(['/login']);
            }
        });
    }
    
    //Metodo para guardar Token en el LocalStorage
    private guardarToken(idToken: string)
    {
        this.userToken = idToken; //La propiedad declarada al inicio se iguala al parámetro de este método
        localStorage.setItem('token', idToken); //En el localStorage se guarda un valor llamado key y su valor es el idToken

        let hoy = new Date(); //Variable que contiene la fecha actual
        hoy.setSeconds(3599); //Agrega una hora más a la fecha actual (Esto sería el tiempo de vida del Token)

        localStorage.setItem('expira', hoy.getTime().toString()); //Se agrega el tiempo de expiracion al localStorage, y la varible 'hoy' se extrae solo la hora

    }
    
    //Método para leer el Token del LocalStorage
    leerToken() 
    {
        if (localStorage.getItem('token')) //Si el Token existe entonces
        {
            this.userToken = localStorage.getItem('token'); //Lee el valor de token en el localStorage y lo asigna a la propiedad userToken
        }
        else //Si el Token no existe
        {
            this.userToken = ''; //Se inicializa el userToken como vacío
        }
    
        return this.userToken;
    }
    
    //Método para saber si el usuario está autenticado
    estaAutenticado(): boolean {
        if(this.userToken.length < 2)
        {
            return false;
        }

        const expira = Number(localStorage.getItem('expira')); //Constante que obtiene el valor 'expira' del localStorage y lo convierte a número
        const expiraDate = new Date(); //Constante con la fecha actual
        expiraDate.setTime(expira); //Se agrega la fecha de expiracion a la fecha actual

        if(expiraDate > new Date()) //Si la fecha de expiracion no ha pasado de la fecha actual
        {
            return true;
        }
        else
        {
            return false;
        }

        return this.userToken.length > 2; //Si el token es mayor a 2 caracteres
    }
}
