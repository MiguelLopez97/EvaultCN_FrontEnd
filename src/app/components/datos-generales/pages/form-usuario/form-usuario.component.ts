import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap'; //Importaciones para el modal
import { AuthService } from '../../../../services/auth.service';
import { CriptoService } from '../../../../services/cripto.service';
import { UsuarioService } from '../../../../services/usuario.service';
import { UsuarioModel } from '../../../../models/usuario-model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-usuario',
  templateUrl: './form-usuario.component.html',
  styleUrls: ['./form-usuario.component.scss'],
  providers: [UsuarioService, NgbModal, NgbActiveModal]
})
export class FormUsuarioComponent implements OnInit {

  @Output() desbloquear = new EventEmitter();

  changePassForm: FormGroup;

  public user = new UsuarioModel();
  public loading: boolean = false;

  //Propiedad para obtener el idRol
  public idRol: number;

  public idUsuarioDesencriptado: string;

  constructor(
    private _usuarioService: UsuarioService,
    private _authService: AuthService,
    private _router: Router,
    private cripto: CriptoService,
    private _formBuilder: FormBuilder,
    private modalService: NgbModal, //Modal
    public activeModal: NgbActiveModal //Modal
  ) {
    this.crearFormCambiarContraseña();    
    this.idUsuarioDesencriptado = this.cripto.decrypt(localStorage.getItem('idUsuario'));
  }

  ngOnInit() {
    this.loading = true;
    this.getUsuario(); 
  }

  getUsuario()
  {
    this._usuarioService.getUsuario(this.idUsuarioDesencriptado).subscribe(
      response => {
        //console.log(response);        
        this.user = response.data;
        //console.log(this.user);
        this.idRol = response.data.rolDeUsuario.idRol;
        this.loading = false;
      },
      error => {
        //console.log(error);
        this.loading = false;
        if (error.status == 401)
        {
          this._authService.sesionExpirada();
        }
      }
    );
  }

  //Desbloquea Tab Empresa
  irAEmpresa(event, tabSet)
  {
    this.desbloquear.emit(1);
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

  //Valida que las teclas pulsadas sean únicamente letras
  validaLetras(event)
  {
    if (event.charCode == 32 || event.charCode == 209 || event.charCode == 241 || 
       (event.charCode >= 65 && event.charCode <= 90) || (event.charCode >= 97 && event.charCode <= 122))
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

  //--------------------- Sección Usuario ----------------------------//
  
  //Valida que la contraseña actual sean iguales en el modal 'Cambiar contraseña'
  passwordActualSonIguales(passActual)
  {
    return (formGroup: FormGroup) => {
      const passActual1Control = this.user.contrasenia;
      const passActual2Control = formGroup.controls[passActual];
      
      if(passActual1Control == passActual2Control.value)
      {
        passActual2Control.setErrors(null);
      }
      else
      {
        passActual2Control.setErrors({noEsIgual: true});
      }
      
    }
  }
 
  //Validaciones para el formulario del modal 'Cambiar Contraseña'
  get passActualNoValido() 
  {
    return this.changePassForm.get('passActual').invalid && this.changePassForm.get('passActual').touched;
  }

  get passActualValido() 
  {
    return this.changePassForm.get('passActual').dirty && this.changePassForm.get('passActual').valid;
  }

  get pass1NoValido() 
  {
    return this.changePassForm.get('nuevaPass1').invalid && this.changePassForm.get('nuevaPass1').touched;
  }  

  get pass1Valido() 
  {
    return this.changePassForm.get('nuevaPass1').valid;
  } 

  get pass2NoValido() 
  {
    const pass1 = this.changePassForm.get('nuevaPass1').value;
    const pass2 = this.changePassForm.get('nuevaPass2').value; 
    return ( pass2 === pass1 ) ? false : true;
  }

  get pass2Valido()
  {
    return this.changePassForm.get('nuevaPass2').dirty && this.changePassForm.get('nuevaPass2').valid;
  }
  //End Validaciones para el formulario del modal 'Cambiar Contraseña'
 
  //Formulario reactivo para 'Cambiar contraseña'
  crearFormCambiarContraseña()
  {
    this.changePassForm = this._formBuilder.group({
      passActual: ['', Validators.required],
      nuevaPass1: ['', Validators.required],
      nuevaPass2: ['', Validators.required]
    }, 
    {
      //validators: [this._usuarioService.passwordIguales('nuevaPass1', 'nuevaPass2'), this.passwordActualSonIguales('passActual')]
      validators: [this._usuarioService.passwordIguales('nuevaPass1', 'nuevaPass2'), this.passwordActualSonIguales('passActual')]
    });
  }  
 
  //Método para abrir el modal
  open(content) {
    this.modalService.open(content);
  }
 
  //Actualiza la contraseña del usuario en el formulario del modal
  cambiarPassword()
  {
    if ( this.changePassForm.invalid ) {
      Object.values( this.changePassForm.controls ).forEach( control => {
        control.markAsTouched();
      });
      return;
    }
     
    //Datos a enviar
    this.user.idUsuario = this.idUsuarioDesencriptado;  
    this.user.contrasenia = this.changePassForm.get('passActual').value;
    this.user.nuevaContrasenia = this.changePassForm.get('nuevaPass2').value; 
 
    Swal.fire({
      allowOutsideClick: false,
      icon:'info',
      title: 'Actualizando contraseña'
    });
    Swal.showLoading(); 
 
    this._usuarioService.updateContrasenia(this.user).subscribe(
      response => {
        //console.log(response);
        if(response.success == true)
        {
          Swal.fire({
            icon: 'success',
            title: 'Contraseña actualizada correctamente',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#A0C334',
          });
        }        
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar la contraseña',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#A0C334',
        });
      }
    );
    this.modalService.dismissAll();   
    this.changePassForm.reset();
  }
 
  guardarUsuario(usuarioForm: NgForm, tabSet)
  {
    if(usuarioForm.invalid) {
      Object.values( usuarioForm.controls ).forEach( control => {
        control.markAsTouched();
      });
      return;
    }
 
    Swal.fire({
      allowOutsideClick: false,
      icon:'info',
      title: 'Espere',
      text: 'Guardando información'
    });
    Swal.showLoading();
 
    this.user.idRol = this.idRol;
 
    this._usuarioService.updateUsuario(this.user).subscribe(
      response => {
        //console.log(response);
        if(response.success == true)
        {
          this.irAEmpresa(event, tabSet);
          Swal.fire({
            icon: 'success',
            title: 'Datos actualizados correctamente',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#A0C334',
          });
        }
        else
        {
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar los datos',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#A0C334',
          });
        }        
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar los datos',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#A0C334',
        });
      }
    );
  }

  cancelarFormulario(usuarioForm: NgForm)
  {
    Swal.fire({
      title: '¿Desea cancelar esta operación?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#A0C334',
      cancelButtonColor: '#5D5D5D',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        usuarioForm.reset(this.getUsuario());
        Swal.fire({
          icon: 'success',
          title: 'Operación cancelada',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#A0C334',
        });
      }
    });
  }
}
