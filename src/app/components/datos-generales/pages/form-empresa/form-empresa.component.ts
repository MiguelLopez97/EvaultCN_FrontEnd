import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { AuthService } from '../../../../services/auth.service';
import { CriptoService } from '../../../../services/cripto.service';
import { EmpresaService } from '../../../../services/empresa.service';
import { UsuarioService } from '../../../../services/usuario.service';
import { MasterDataService } from '../../../../services/master-data.service';
import { EmpresaModel, LogoEmpresaModel } from '../../../../models/empresa-model';
import { UsuarioModel } from '../../../../models/usuario-model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-empresa',
  templateUrl: './form-empresa.component.html',
  styleUrls: ['./form-empresa.component.scss'],
  providers: [EmpresaService, MasterDataService, UsuarioService]
})
export class FormEmpresaComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef; //Propiedad para cargar el logo de Empresa

  @Output() desbloquear = new EventEmitter();

  public empresa = new EmpresaModel();
  public logoEmpresa = new LogoEmpresaModel();
  public user = new UsuarioModel();
  public loading: boolean = false;

  public idEmpresaDesencriptado: number;
  public idUsuarioDesencriptado: string;

  //Propiedad para almacenar el Uri del logo de la Empresa
  public imgUri: string;
  
  //Propiedad para obtener el idRol
  public idRol: number; 

  //Propiedad para almacenar el idEmpresa cuando se crea una nueva empresa y posteriormente actualizarlo al Usuario
  public newIdEmpresa: string; 

  //Propiedad para seleccionar el tipo de persona (Física o Moral)
  public selectedTipoPersona: number;

  //Propiedades para el Código Postal
  public arrayLocalidades: any[] = [];
  public loadingColonias: boolean = false; 

  //Propiedad para cambiar los valores del estado y municipio
  public selectedId: string;

  //Propiedad para saber si se ha elegido un archivo en el input file de 'Cargar logo de Empresa'
  public localImgSelected: boolean = false;

  public tiposActividad = [
    {idTipoActividad: 1, tipoActividad: 'Productos'},
    {idTipoActividad: 2, tipoActividad: 'Servicios'},
    {idTipoActividad: 3, tipoActividad: 'Ambos'}
  ];

  constructor(
    private _authService: AuthService,
    private cripto: CriptoService,
    private _router: Router,
    private _empresaService: EmpresaService,
    private _usuarioService: UsuarioService,
    private _masterDataService: MasterDataService
  ) {
    this.idEmpresaDesencriptado = this.cripto.decrypt(localStorage.getItem('idEmpresa'));
    this.idUsuarioDesencriptado = this.cripto.decrypt(localStorage.getItem('idUsuario'));
  }

  ngOnInit() {
    this.loading = true;
    this.getUsuario();
    this.getEmpresa();
  }

  //Desbloquea Tab Buzón
  irABuzon(event, tabSet)
  {
    this.desbloquear.emit(2);
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

  validaLetrasYNumeros(event)
  {
    if (event.charCode == 209 || event.charCode == 241 || 
       (event.charCode >= 65 && event.charCode <= 90) || (event.charCode >= 97 && event.charCode <= 122) || 
       (event.charCode >= 48 && event.charCode <= 57))
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

  //Método para decidir si es persona Física o Moral y cambiar la longitud del RFC
  changeTipoPersona(event: any)
  {
    this.selectedTipoPersona = event.target.value;
  }

  //Obtiene el logo de la empresa
  getLogo()
  {
    this._empresaService.getLogo(this.idEmpresaDesencriptado).subscribe(
      response => {
        this.imgUri = response.data;
      },
      error => {
        //console.log(error);
      }
    );
  }

  //Obtiene las localidades a través del Código Postal
  getColonias()
  {
    this.loadingColonias = true;

    this._masterDataService.getAllColonias(this.empresa.codigoPostal).subscribe(
      response => {
        this.arrayLocalidades = response;
        this.loadingColonias = false;
        //console.log(this.arrayLocalidades);
                      
        this.arrayLocalidades.unshift({            
          idCiudad: '',
          colonia: 'Seleccione la localidad'
        })
      },
      error => {
        //console.log(error);
        this.loadingColonias = false;
      }
    ); 
  }

  //Cambia el estado y municipio en base a la localidad elegida
  changeLocalidad(idLocalidad) 
  {
    this.empresa.idMunicipio = this.arrayLocalidades.find(edo => edo.idCiudad == idLocalidad).idCiudad;
    this.empresa.estado = this.arrayLocalidades.find(edo => edo.idCiudad == idLocalidad).estado;
    this.empresa.municipio = this.arrayLocalidades.find(edo => edo.idCiudad == idLocalidad).municipio;
    this.empresa.colonia = this.arrayLocalidades.find(edo => edo.idCiudad == idLocalidad).colonia;
  }

  //Muestra una previsualización de la imagen seleccionada localmente del input file
  onFileInput(event:any) 
  {
    if (event.target.files && event.target.files[0])
    {   
      //Determina si se ha elegido una imagen desde el input file para habilitar el botón de 'Cargar archivo'
      this.localImgSelected = true;

      var reader = new FileReader();
      reader.onload = (event:any) => {
        this.imgUri = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  //Carga del logo
  uploadLogo()
  {
    let file;
    
    //Constante de tipo FileReader para leer la información de los archivos seleccionados
    const reader = new FileReader();

    //Separa el nombre del archivo y la extensión y los almacena en un arreglo
    const split = this.fileInput.nativeElement.files[0].name.split('.');

    //Obtiene la extensión de un archivo de la constante 'split'
    const ext = split[split.length - 1];

    //Obtiene el nombre de un archivo sin la extensión
    const simpleName = this.fileInput.nativeElement.files[0].name.substr(0, this.fileInput.nativeElement.files[0].name.length - (ext.length + 1));

    //Se iguala la variable 'file' al archivo que se haya seleccionado desde el componente
    file = this.fileInput.nativeElement.files[0];

    //Lee la información de la variable 'file'
    reader.readAsDataURL(file);

    reader.onload = () => {
      //Asigna los valores a enviar a la API
      this.logoEmpresa.fileContentBase64 = reader.result.toString().split(',')[1];
      this.logoEmpresa.fileName = simpleName;
      this.logoEmpresa.fileExt = ext;

      if (this.empresa.idEmpresa > 0)
      {
        this.logoEmpresa.idEmpresa = this.empresa.idEmpresa;
      }

      Swal.fire({
        allowOutsideClick: false,
        icon:'info',
        title: 'Espere',
        text: 'Guardando imagen'
      });
      Swal.showLoading();
      
      this._empresaService.uploadLogo(this.logoEmpresa).subscribe(
        response => {
          //console.log(response);
          if(response.success == true)
          {
            Swal.fire({
              icon: 'success',
              title: 'Imagen cargada correctamente',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#A0C334',
            });
          }
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'Error al cargar la imagen',
            text: 'Verifique su imagen y vuelva a intentarlo.',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#A0C334',
          });
        }
      );            
    };
  }

  guardarEmpresa(form: NgForm, tabSet)
  {
    if(form.invalid) {
      Object.values( form.controls ).forEach( control => {
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

    //idRol del usuario ya que en la respuesta viene como un objeto
    this.user.idRol = this.idRol;

    //Si el idEmpresa existe o es mayor a 0 (Actualiza los datos de la empresa)
    if(this.empresa.idEmpresa)
    {
      this._empresaService.updateEmpresa(this.empresa).subscribe(
        response => {
          //console.log(response);        
          //this.irABuzon(event, tabSet);
          Swal.fire({
            icon: 'success',
            title: 'Datos actualizados correctamente',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#A0C334',
          });         
        },
        error => {
          //console.log(error);
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#A0C334',
          });
        }
      );
    }
    else //Si el idEmpresa no existe o es igual a 0, crea un nuevo registro de Empresa
    {
      this._empresaService.createEmpresa(this.empresa).subscribe(
        response => {
          //console.log(response); 
          //El idEmpresa que se crea se almacena en la propiedad 'newIdEmpresa'
          this.newIdEmpresa = response.idEmpresa;
          //this.irABuzon(event, tabSet);
          Swal.fire({
            icon: 'success',
            title: 'Datos guardados correctamente',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#A0C334',
          });     
          //El idEmpresa del Usuario va a ser igual al idEmpresa que se acaba de almacenar en 'newIdEmpresa'
          this.user.idEmpresa = this.newIdEmpresa;
          //Actualiza el idEmpresa de inmediato al Usuario
          this._usuarioService.updateUsuario(this.user).subscribe(
            response => {
              if(response.success == true)
              {
                //console.log('idEmpresa asignada al Usuario');
              }
            },
            error => {
              //console.log(error);
            }
          );    
        },
        error => {
          //console.log(error);
          Swal.fire({
            icon: 'error',
            title: 'Error al guardar',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#A0C334',
          });
        }
      );
    }
    //console.log(this.empresa);
  }  

  cancelarFormulario(empresaForm: NgForm)
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
        empresaForm.reset(this.getEmpresa());
        Swal.fire({
          icon: 'success',
          title: 'Operación cancelada',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#A0C334',
        });
      }
    });
  }

  getUsuario()
  {
    this._usuarioService.getUsuario(this.idUsuarioDesencriptado).subscribe(
      response => {
        if(response.data)
        {
          this.user = response.data;
          this.idRol = response.data.rolDeUsuario.idRol;
        }
      },
      error => {
        //console.log(error);
      }
    );
  }

  getEmpresa()
  {
    this._empresaService.getEmpresa(this.idEmpresaDesencriptado).subscribe(
      response => {
        //console.log(response);
        this.empresa = response.data;
        this.getColonias();
        this.selectedId = response.data.idMunicipio;
        this.empresa.repLegalNombre = response.data.representante.nombre;
        this.empresa.repLegalAPaterno = response.data.representante.apellidoPaterno;
        this.empresa.repLegalAMaterno = response.data.representante.apellidoMaterno;

        this.empresa.repCNNombre = response.data.responsableCN.nombre;
        this.empresa.repCNAPaterno = response.data.responsableCN.apellidoPaterno;
        this.empresa.repCNAMaterno = response.data.responsableCN.apellidoMaterno;

        this.getLogo(); //Llama al método para obtener el logo

        this.selectedTipoPersona = response.data.idTipoPersona;
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

}
