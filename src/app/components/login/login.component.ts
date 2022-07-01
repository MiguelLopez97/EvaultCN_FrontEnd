import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public correoElectronico: string;
  public contrasenia: string;

  constructor(
    private _authService: AuthService,
    private _router: Router
  ) { }

  ngOnInit() { }

  // Funcion para validar usuario
  onSubmit(form: NgForm) 
  {
    if (form.invalid) {
      Object.values(form.controls).forEach( control => {
        control.markAsTouched();
      });
      return;
    }
    
    Swal.fire({
      allowOutsideClick: false,
      icon:'info',
      title: 'Iniciando sesión',
      text: 'Un momento por favor'
    });
    Swal.showLoading();

    this._authService.login(this.correoElectronico, this.contrasenia).subscribe(
      response => {
        //console.log(response);
        Swal.close();
        this._router.navigate(['/dashboard']);
      },
      error => {
        if (error.status == 500 || error.status == 400)
        {
          Swal.fire({
            icon: 'error',
            title: 'Error al autenticar',
            text: 'Correo electrónico y/o contraseña no válidos',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#A0C334',
          });
        }
        else
        {
          Swal.fire({
            icon: 'error',
            title: 'Error al autenticar',
            text: error.statusText,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#A0C334',
          });
        }  
      }
    );
  }

}
