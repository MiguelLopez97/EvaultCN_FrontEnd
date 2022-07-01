import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';

import { CriptoService } from '../../../../services/cripto.service';
import { MasterDataService } from '../../../../services/master-data.service';
import { EmpresaService } from '../../../../services/empresa.service';
import { CostoDeCompraService } from '../../../../services/costo-compra.service';
import { CFDIDocService } from '../../../../services/cfdidoc.service';
import { CostoDeCompraModel } from '../../../../models/costo-compra.model';
import { DocumentoRelacionadoModel } from '../../../../models/doc-relacionado.model';
import { FormAddProveedorComponent } from '../form-add-proveedor/form-add-proveedor.component';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-detalle-costo-compra',
  templateUrl: './form-detalle-costo-compra.component.html',
  styleUrls: ['./form-detalle-costo-compra.component.scss']
})
export class FormDetalleCostoCompraComponent implements OnInit {

  //Recibe el 'idCostoDetalle' que viene del componente 'FormCostoCompra' cuando se da clic en el botón 'Editar' de la tabla de Detalles
  @Input() idCostoDetalle;

  @Output() resultResponseCreateDetalleCosto: EventEmitter<boolean>;

  @ViewChild('fileInput') fileInput: ElementRef; //Propiedad para cargar un documento de Contenido Nacional
  
  public conceptosCostoCompraForm: FormGroup;

  public actividadesConcepto: any[] = [];
  public proveedoresEmpresa: any[] = [];

  public costoCompra = new CostoDeCompraModel();
  public idCFDIDetalle: number;
  public idCFDIDoc: number;
  public loading: boolean = false;

  //Propiedad para mandar los datos del Documento Relacionado de una Partida
  public fileCartaCN = new DocumentoRelacionadoModel();

  //Propiedad para saber si existe un archivo relacionado al 'Detalle de Costo de Compra'
  public existeArchivoCN: boolean = false;
  public URLArchivoCN: string;

  //Propiedad para determinar si se ha seleccionado un archivo desde el input file de 'Cargar archivo de Carta de Contenido Nacional'
  public localPDFSelected: boolean = false;

  //Propiedad para almacenar la 'Proporción de Contenido Nacional' y realizar validación para subir o no una carta de CN
  public proporcionCN: number;

  public textAfterUploadedCartaCN: string = "";

  public tituloModal: string;

  public idEmpresaDesencriptado: string;

  constructor(
    private _formBuilder: FormBuilder,
    private _cripto: CriptoService,
    private _route: ActivatedRoute,
    private _empresaService: EmpresaService,
    private _masterDataService: MasterDataService,
    private _costoCompraService: CostoDeCompraService,
    private _cfdiDocService: CFDIDocService,
    private modalService: NgbModal, //Modal
    public activeModal: NgbActiveModal //Modal
  ) { 
    this.idEmpresaDesencriptado = this._cripto.decrypt(localStorage.getItem('idEmpresa'));
    this.buildForm();

    this.resultResponseCreateDetalleCosto = new EventEmitter();
  }

  ngOnInit() {
    this.getParamsIdCFDIDetalle();
    
    if (this.idCostoDetalle == null)
    {
      this.tituloModal = 'Agregar Concepto';
    }
    else
    {
      this.loading = true;
      this.tituloModal = 'Editar Concepto';
      this.getDetalleCostoCompra();
      this.getDocumentosRelacionados();
    }

    this.getActividadesConcepto();
    this.getProveedoresEmpresa();

    //Escucha los cambios que se hacen en el select de 'Nombre del proveedor' (Modal Agregar Conceptos)
    this.changeProveedor();

    //Escucha los cambios que se hacen cuando se agreguen valores en los inputs 'Valor Factura' y 'Proporción de CN' (Modal Agregar Conceptos)
    this.setContenidoNacionalMaterialServicio();
  }

  buildForm()
  {
    //Formulario para agregar un concepto de Costo de Compra
    this.conceptosCostoCompraForm = this._formBuilder.group({
      materialServicio: ['', Validators.required],
      descripcionMaterialServicio: ['', Validators.required],
      idProveedor: ['', Validators.required],
      rfcProveedor: [{value: '', disabled: true}],
      valorFactura: ['', Validators.required],
      proporcionCN: ['', Validators.required],
      CNMaterialServicio: [{value: 0, disabled: true}]
    });
  }

  get materialServicioNoValido() {
    return this.conceptosCostoCompraForm.get('materialServicio').invalid && this.conceptosCostoCompraForm.get('materialServicio').touched
  }

  get descripcionMaterialServicioNoValido() {
    return this.conceptosCostoCompraForm.get('descripcionMaterialServicio').invalid && this.conceptosCostoCompraForm.get('descripcionMaterialServicio').touched
  }

  get proveedorNoValido() {
    return this.conceptosCostoCompraForm.get('idProveedor').invalid && this.conceptosCostoCompraForm.get('idProveedor').touched
  }

  get valorFacturaNoValido() {
    return this.conceptosCostoCompraForm.get('valorFactura').invalid && this.conceptosCostoCompraForm.get('valorFactura').touched
  }

  get proporcionCNNoValido() {
    return this.conceptosCostoCompraForm.get('proporcionCN').invalid && this.conceptosCostoCompraForm.get('proporcionCN').touched
  }

  //Valida que las teclas pulsadas sean únicamente números y el caracter 'punto'
  validaNumeros(event)
  {    
    if ((event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46)
    {
      return true;
    }
    return false; 
  }

  //Obtiene el Detalle de Costo de compra en base al 'idCostoDetalle' que se esté recibiendo de
  getDetalleCostoCompra()
  {
    this._costoCompraService.getCostoDeCompra(this.idCostoDetalle).subscribe(
      response => {
        //console.log(response);

        //Asigna los valores que vienen del 'response' de la API al formulario
        this.conceptosCostoCompraForm.patchValue({
          materialServicio: response.data.idActividad,
          descripcionMaterialServicio: response.data.descripcion,
          idProveedor: response.data.idProveedor,
          rfcProveedor: response.data.rfcProveedor,
          valorFactura: response.data.vmSj,
          proporcionCN: response.data.pcnmSj,
          CNMaterialServicio: response.data.pcnmSjxVMSj
        });

        this.loading = false;
      },
      error => { 
        this.loading = false;
      }
    );
  }

  //Obtiene el parámetro de la URL (idCFDIDetalle e idCFDIDoc)
  getParamsIdCFDIDetalle()
  {
    this._route.params.subscribe(params => {
      this.idCFDIDoc = params['id'];
      this.idCFDIDetalle = params['idDetalle'];
    });
  }

  //Obtiene los documentos relacionados del idCFDIDoc que se esté consultando
  getDocumentosRelacionados()
  {
    this._cfdiDocService.getDocumentosRelacionadosCFDI(this.idCFDIDoc).subscribe(
      response => {
        //Recorre el arreglo de los documentos relacionados al idCFDIDoc
        for (let item of response.data)
        {
          //Si en los Documentos Relacionados viene un 'idCostoDetalle' igual al que se está consultando
          if (item.idCostoDetalle == this.idCostoDetalle)
          {
            this.existeArchivoCN = true;
            this.URLArchivoCN = item.archivo;
          } 
        }
      },
      error => { }
    );
  }

  //Obtiene el catálogo de las ActividadesConcepto
  getActividadesConcepto()
  {
    this._masterDataService.getAllActividadConcepto().subscribe(
      response => {
        this.actividadesConcepto = response.data;
      },
      error => { }
    );
  }

  //Obtiene el catálogo de los proveedores de la empresa que haya iniciado sesión
  getProveedoresEmpresa()
  {
    this._empresaService.getProveedoresEmpresa(this.idEmpresaDesencriptado).subscribe(
      response => {
        this.proveedoresEmpresa = response.data;
      },
      error => { }
    );
  }
  
  //Método para abrir el modal para agregar un nuevo Proveedor
  openModalAddProveedor()
  {
    const modalRef = this.modalService.open(FormAddProveedorComponent, { size: 'lg'});
    //modalRef.componentInstance.src = content;

    //Obtiene el valor que emite el componente 'FormAddProveedorComponent' para poder suscribirse al evento
    modalRef.componentInstance.resultResponseCreateProveedor.subscribe(
      response => {
        if (response == true)
        {
          this.getProveedoresEmpresa();
        }
      }
    );
  }

  //Cambia el RFC del proveedor en base al nombre de proveedor elegido
  changeProveedor()
  {
    this.conceptosCostoCompraForm.get('idProveedor').valueChanges.subscribe(value => {
      //Filtra el registro del proveedor en base al idEmpresa que se esté seleccionando y se almacena en la variable 'filteredProveedor'
      var filteredProveedor = this.proveedoresEmpresa.filter(result => result.idEmpresa == value);

      //Si la longitud del arreglo 'filteredProveedor' es mayor a 0
      if (filteredProveedor.length > 0)
      {
        //Asigna el valor 'RFC' del registro filtrado en el input 'RFC del Proveedor'
        this.conceptosCostoCompraForm.patchValue({
          rfcProveedor: filteredProveedor[0].rfc
        });
      }  
    });
  }

  //Asigna el valor al input 'Contenido Nacional del Material o Servicio (Pesos)' |Se Multiplica PCNMSj X VMSj
  setContenidoNacionalMaterialServicio()
  {
    var vmsj = 0;
    var pcnmsj = 0;

    //Obtiene el valor del input 'valorFactura' del formulario de 'Agregar conceptos'
    this.conceptosCostoCompraForm.get('valorFactura').valueChanges.subscribe(value => {
      vmsj = value;

      var resultado = vmsj * pcnmsj;
      
      this.conceptosCostoCompraForm.patchValue({
        CNMaterialServicio: resultado
      }); 
    });

    //Obtiene el valor del input 'proporcionCN' del formulario de 'Agregar conceptos'
    this.conceptosCostoCompraForm.get('proporcionCN').valueChanges.subscribe(value => {
      pcnmsj = value;
      
      //Almacena el valor del input 'proporcionCN' para validar si debe de mostrar el input para cargar una carta de CN
      this.proporcionCN = value;

      var resultado = vmsj * pcnmsj;
      
      this.conceptosCostoCompraForm.patchValue({
        CNMaterialServicio: resultado.toFixed(2) //'toFixed' redondea los decimales, en este caso a 2 decimales
      });
    });
  }

  //Valida si se ha seleccionado un archivo desde el input file
  onChangeFileInput(event:any) 
  {
    if (event.target.files && event.target.files[0])
    {   
      //Determina si se ha elegido una archivo desde el input file para habilitar el botón de 'Guardar'
      this.localPDFSelected = true;
    }
  }

  async saveDetalleCostoDeCompraYCartaDeCN()
  {
    if(this.conceptosCostoCompraForm.invalid) {
      Object.values(this.conceptosCostoCompraForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    //Asigna los valores del formulario al objeto 'costoCompra'
    this.costoCompra.idCFDIDetalle = this.idCFDIDetalle;
    this.costoCompra.idActividad = this.conceptosCostoCompraForm.get('materialServicio').value;
    this.costoCompra.descripcion = this.conceptosCostoCompraForm.get('descripcionMaterialServicio').value;
    this.costoCompra.idProveedor = this.conceptosCostoCompraForm.get('idProveedor').value;
    this.costoCompra.vmSj = this.conceptosCostoCompraForm.get('valorFactura').value;
    this.costoCompra.pcnmSj = this.conceptosCostoCompraForm.get('proporcionCN').value;
    this.costoCompra.pcnmSjxVMSj = this.conceptosCostoCompraForm.get('CNMaterialServicio').value;

    Swal.fire({
      allowOutsideClick: false,
      icon:'info',
      title: 'Espere',
      text: 'Guardando información'
    });
    Swal.showLoading();

    //Si el 'idCostoDetalle' que viene del componente 'FormCostoCompra' es vacio o nulo
    if (this.idCostoDetalle == null)
    {
      //Crea un nuevo registro de 'CostoCompra'
      this.createDetalleCostoCompra();
    }
    else //En caso de que sí llegue algun valor en 'idCostoDetalle'
    {
      this.updateDetalleCostoCompra();
    }
    
  }

  createDetalleCostoCompra()
  {
    //Si se ha seleccionado un archivo del input para subir 'Carta de CN'
    if (this.fileInput != undefined && this.fileInput.nativeElement.files.length > 0)
    {
      let file;

      //Constante de tipo FileReader para leer la información de los archivos seleccionados
      const reader = new FileReader();

    //Separa el nombr del archivo y la extensión y los almacena en un arreglo
      const split = this.fileInput.nativeElement.files[0].name.split('.');

      //Obtiene la extensión de un archivo de la constante 'split'
      const ext = split[split.length - 1];

      //Obtiene el nombre de un archivo sin la extensión
      const simpleName = this.fileInput.nativeElement.files[0].name.substr(0, this.fileInput.nativeElement.files[0].name.length - (ext.length + 1));

      //Se iguala la variable 'file' al archivo que se haya seleccionado desde el componente
      file = this.fileInput.nativeElement.files[0];

      //Lee la información de la variable 'file'
      reader.readAsDataURL(file);

      reader.onload = async () => {
        //Primero crea el registro del Detalle de Costo de Compra 'api/v0/CostoDeCompra (POST)'
        await this._costoCompraService.createCostoDeCompra(this.costoCompra).toPromise()
        .then(
          async response => {
            if (response.success == true)
            {
              //Asigna los valores a enviar a la API 'doc/Relacionado (POST)'
              this.fileCartaCN.idCFDI = this.idCFDIDoc;
              this.fileCartaCN.idCostoDetalle = response.data.idCostoDetalle; //El idCostoDetalle viene del response después de que se cree el registro
              this.fileCartaCN.idTipoArchivo = 1; //idTipoArchivo = 1 (Carta de Contenido Nacional)
              this.fileCartaCN.fileContentBase64 = reader.result.toString().split(',')[1];
              this.fileCartaCN.fileName = simpleName;
              this.fileCartaCN.fileExt = ext;

              //Después llama al endpoint de 'doc/Relacionado (POST)' para guardar la carta de Contenido Nacional
              await this._cfdiDocService.uploadDocRelacionado(this.fileCartaCN).toPromise()
              .then(
                response => {
                  if (response.success == true)
                  {
                    //Agrega el mensaje para que pueda ser mostrado al final de guardar un 'Detalle de Costo de Compra'
                    this.textAfterUploadedCartaCN = "Incluido un archivo PDF";
                  }
                }
              );
              this.activeModal.close();
              this.resultResponseCreateDetalleCosto.emit(true);
              Swal.fire({
                icon: 'success',
                title: 'Concepto agregado correctamente',
                text: this.textAfterUploadedCartaCN,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#A0C334',
              });
            }
            else
            {
              Swal.fire({
                icon: 'error',
                title: 'Error al agregar un concepto',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#A0C334',
              });
            }          
          },
          error => {
            Swal.fire({
              icon: 'error',
              title: 'Error al agregar un concepto',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#A0C334',
            });
          }
        );
      };
    }
    else //Si no se ha seleccionado nigún archivo del input file
    {
      //Solamente crea un nuevo registro de 'Detalle de Costo de Compra'
      this._costoCompraService.createCostoDeCompra(this.costoCompra).toPromise()
      .then(
        response => {
          if (response.success == true)
          {
            this.activeModal.close();
            this.resultResponseCreateDetalleCosto.emit(true);
            Swal.fire({
              icon: 'success',
              title: 'Concepto agregado correctamente',
              text: this.textAfterUploadedCartaCN,
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#A0C334',
            });
          }
          else
          {
            Swal.fire({
              icon: 'error',
              title: 'Error al agregar un concepto',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#A0C334',
            });
          }
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'Error al agregar un concepto',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#A0C334',
          });
        }
      );
    }
  }

  updateDetalleCostoCompra()
  {
    //Asigna el 'idCostoDetalle' que viene del componente 'FormCostoCompra'
    this.costoCompra.idCostoDetalle = this.idCostoDetalle;

    //Si se ha seleccionado un archivo del input para subir 'Carta de CN'
    if (this.fileInput != undefined && this.fileInput.nativeElement.files.length > 0)
    {
      let file;

      //Constante de tipo FileReader para leer la información de los archivos seleccionados
      const reader = new FileReader();

    //Separa el nombr del archivo y la extensión y los almacena en un arreglo
      const split = this.fileInput.nativeElement.files[0].name.split('.');

      //Obtiene la extensión de un archivo de la constante 'split'
      const ext = split[split.length - 1];

      //Obtiene el nombre de un archivo sin la extensión
      const simpleName = this.fileInput.nativeElement.files[0].name.substr(0, this.fileInput.nativeElement.files[0].name.length - (ext.length + 1));

      //Se iguala la variable 'file' al archivo que se haya seleccionado desde el componente
      file = this.fileInput.nativeElement.files[0];

      //Lee la información de la variable 'file'
      reader.readAsDataURL(file);

      reader.onload = async () => {
        //Primero actualiza el registro del Detalle de Costo de Compra 'api/v0/CostoDeCompra (UPDATE)'
        await this._costoCompraService.updateCostoDeCompra(this.costoCompra).toPromise()
        .then(
          async response => {
            if (response.success == true)
            {
              //Asigna los valores a enviar a la API 'doc/Relacionado (POST)'
              this.fileCartaCN.idCFDI = this.idCFDIDoc;
              this.fileCartaCN.idCostoDetalle = this.costoCompra.idCostoDetalle; //El idCostoDetalle lo toma del valor que se esté actualizando
              this.fileCartaCN.idTipoArchivo = 1; //idTipoArchivo = 1 (Carta de Contenido Nacional)
              this.fileCartaCN.fileContentBase64 = reader.result.toString().split(',')[1];
              this.fileCartaCN.fileName = simpleName;
              this.fileCartaCN.fileExt = ext;

              //Después llama al endpoint de 'doc/Relacionado (POST)' para guardar la carta de Contenido Nacional
              await this._cfdiDocService.uploadDocRelacionado(this.fileCartaCN).toPromise()
              .then(
                response => {
                  if (response.success == true)
                  {
                    //Agrega el mensaje para que pueda ser mostrado al final de guardar un 'Detalle de Costo de Compra'
                    this.textAfterUploadedCartaCN = "Incluido un archivo PDF";
                  }
                }
              );
              this.activeModal.close();
              this.resultResponseCreateDetalleCosto.emit(true);
              Swal.fire({
                icon: 'success',
                title: 'Concepto actualizado correctamente',
                text: this.textAfterUploadedCartaCN,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#A0C334',
              });
            }
            else
            {
              Swal.fire({
                icon: 'error',
                title: 'Error al actualizar el concepto',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#A0C334',
              });
            }          
          },
          error => {
            Swal.fire({
              icon: 'error',
              title: 'Error al actualizar el concepto',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#A0C334',
            });
          }
        );
      };
    }
    else //Si no se ha seleccionado nigún archivo del input file
    {
      //Solamente actualiza los valores del registro del 'idCostoDetalle'
      this._costoCompraService.updateCostoDeCompra(this.costoCompra).toPromise()
      .then(
        response => {
          if (response.success == true)
          {
            this.activeModal.close();
            this.resultResponseCreateDetalleCosto.emit(true);
            Swal.fire({
              icon: 'success',
              title: 'Concepto actualizado correctamente',
              text: this.textAfterUploadedCartaCN,
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#A0C334',
            });
          }
          else
          {
            Swal.fire({
              icon: 'error',
              title: 'Error al actualizar el concepto',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#A0C334',
            });
          }          
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar el concepto',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#A0C334',
          });
        }
      );
    }
  }

}
