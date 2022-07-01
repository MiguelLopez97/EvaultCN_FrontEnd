import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';

import { Appsettings } from 'app/services/appsettings';
import { UsuarioService } from 'app/services/usuario.service';
import { EmpresaService } from 'app/services/empresa.service';
import { UsuarioModel } from 'app/models/usuario-model';
import { EmpresaModel } from 'app/models/empresa-model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
  providers: [UsuarioService]
})
export class RegistroComponent implements OnInit {
  public apiUrl: string;
  public usuario: UsuarioModel;
  public empresa = new EmpresaModel();

  public tiposActividad = [
    {idTipoActividad: 1, nombre: 'Venta de Bienes'},
    {idTipoActividad: 2, nombre: 'Servicios'},
    {idTipoActividad: 3, nombre: 'Ambos'}
  ];

  public tiposPersona = [
    {idTipoPersona: 1, nombre: 'Persona física'},
    {idTipoPersona: 2, nombre: 'Persona moral'}
  ]

  //Formulario reactivo
  public registroForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _usuarioService: UsuarioService,
    private _empresaService: EmpresaService,
    private _router: Router
  ) { 
    this.apiUrl = Appsettings.API_ENDPOINT_FULL;
    this.usuario = new UsuarioModel();

    this.buildForms();
  }

  ngOnInit() { 
    this.getValueChangesRegistroForm();
  }

  buildForms()
  {
    this.registroForm = this._formBuilder.group({
      correoElectronico: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      telefono: ['', Validators.required],
      razonSocial: ['', Validators.required],
      rfc: ['', Validators.required],
      regimenFiscal: [null, Validators.required],
      domicilioFiscal: ['', Validators.required],
      responsableCNNombre: ['', Validators.required],
      responsableCNAPaterno: ['', Validators.required],
      responsableCNAMaterno: [''],
      tipoActividad: [null, Validators.required]
    });
  }

  getValueChangesRegistroForm()
  {
    this.registroForm.valueChanges.subscribe(value => {
      this.empresa.correoElectronico = value.correoElectronico;
      this.empresa.telefono = value.telefono;
      this.empresa.razonSocial = value.razonSocial;
      this.empresa.rfc = value.rfc;
      this.empresa.idTipoPersona = value.regimenFiscal;
      this.empresa.direccion = value.domicilioFiscal;
      this.empresa.repCNNombre = value.responsableCNNombre;
      this.empresa.repCNAPaterno = value.responsableCNAPaterno;
      this.empresa.repCNAMaterno = value.responsableCNAMaterno;
      this.empresa.idTipoActividad = value.tipoActividad;

      //Valores a asignar a Usuario
      this.usuario.correoElectronico = value.correoElectronico;
      this.usuario.celular = value.telefono;

    });
  }

  onSubmit()
  {
    if (this.registroForm.invalid){
      Object.values(this.registroForm.controls).forEach( control => {
        control.markAsTouched();
      });
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      icon:'info',
      title: 'Creando registro',
      text: 'Un momento por favor'
    });
    Swal.showLoading();

    this.usuario.idRol = 3;

    this._empresaService.createEmpresa(this.empresa).subscribe(
      response => {
        //console.log(response);
        //Si la respuesta de la API es true
        if (response.success == true)
        {          
          //Asigna al Usuario el idEmpresa que devuelve el 'response' cuando se crea el registro de Empresa
          this.usuario.idEmpresa = response.data.idEmpresa;

          //Invoca al UsuarioService para crear la cuenta del usuario
          this._usuarioService.createUsuario(this.usuario).subscribe(
            response => {
              //console.log(response);
              if (response.success == true)
              {
                this._router.navigate(['/login']);
                Swal.fire({
                  icon: 'success',
                  title: 'Registro creado correctamente',
                  text: 'En breve recibirá un correo con su contraseña para poder iniciar sesión',
                  confirmButtonText: 'Aceptar',
                  confirmButtonColor: '#A0C334',
                });
              }
              else 
              {
                Swal.fire({
                  icon: 'error',
                  title: 'Error al crear el registro',
                  text: response.errors[0].message,
                  confirmButtonText: 'Aceptar',
                  confirmButtonColor: '#A0C334',
                });
              }
            },
            error => {
              //console.log(error);
              Swal.fire({
                icon: 'error',
                title: 'Error al crear el registro',
                text: 'Intente más tarde',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#A0C334',
              });
            }
          );
        }
      },
      error => {
        //console.log(error);  
      }
    );
  }

  //Valida que las teclas pulsadas sean únicamente números
  validaNumeros(event)
  {    
    if (event.charCode >= 48 && event.charCode <= 57)
    {
      return true;
    }
    return false; 
  }

  //Método para agregar número telefónico en par
  keyUpEvent(numeros)
  {
    numeros.value = numeros.value.replace(/\s/g, ''); // Borrar todos los espacios

    // replace = Agrega un espacio cada dos numeros | trim = Borra espacio al final
    numeros.value = numeros.value.replace(/([0-9]{2})/g, '$1 ').trim();                              
  }
  
}
