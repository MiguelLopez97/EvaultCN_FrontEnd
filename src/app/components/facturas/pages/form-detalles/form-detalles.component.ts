import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap'; //Importaciones para el modal

import { CFDIPartidaService } from '../../../../services/cfdipartida.service';
import { CFDIDocService } from '../../../../services/cfdidoc.service';
import { MasterDataService } from '../../../../services/master-data.service';
import { AuthService } from '../../../../services/auth.service';
import { CFDIPartidaModel } from '../../../../models/cfdipartida-model';
import { UploadDocRelacionadoComponent } from '../upload-doc-relacionado/upload-doc-relacionado.component';
import { FormCostoCompraComponent } from '../form-costo-compra/form-costo-compra.component';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-detalles',
  templateUrl: './form-detalles.component.html',
  styleUrls: ['./form-detalles.component.scss'],
  providers: [CFDIPartidaService, MasterDataService, CFDIDocService, NgbModal, NgbActiveModal]
})
export class FormDetallesComponent implements OnInit {

  @ViewChild("inputPorcentajeCN") input: ElementRef;

  public idCFDIDetalle: any;
  public detallePartida = new CFDIPartidaModel();
  public actividadConcepto: any[];
  public tipoContenido: any[];
  public allCodigoSE: any[];
  public tipoDeCambio: number;
  public moneda: string;
  public loading: boolean = false;

  //Propiedad para determinar si los datos requeridos de 'Datos Generales' están capturados o no
  public datosCapturadosCFDIDoc: boolean = false;

  public keyword = 'codigoActividad';

  public criterios: any[] = [
    {idTipoCriterio: 0, criterio: 'Ninguno'},
    {idTipoCriterio: 1, criterio: 'Obtenido en su totalidad o producido enteramente en México'},
    {idTipoCriterio: 2, criterio: 'Producido en México y cumple con un cambio de clasificación arancelaria'},
    {idTipoCriterio: 3, criterio: 'Producido en México a partir exclusivamente de materiales que se clasifican como nacionales'},
  ];

  public tipoMateriales: any[] = [
    {idTipoMaterial: 0, tipoMaterial: 'Ninguno'},
    {idTipoMaterial: 1, tipoMaterial: 'Nacional'},
    {idTipoMaterial: 2, tipoMaterial: 'Importado'}
  ];
  
  constructor(
    private _cfdiDocService: CFDIDocService,
    private _cfdiPartidaService: CFDIPartidaService,
    private _masterDataService: MasterDataService,
    private _authService: AuthService,
    private _route: ActivatedRoute,
    private _router: Router,
    private modalService: NgbModal, //Modal
    public activeModal: NgbActiveModal //Modal
  ) { }

  ngOnInit() {
    this.loading = true;
    this.getCFDIDoc();
    this.getDetallePartida();
    this.getAllActividadConcepto();
    this.getAllTipoContenido();
    this.getAllCodigoSE();
  }

  //Valida que las teclas pulsadas sean únicamente números
  validaNumeros(event)
  {    
    if ((event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46)
    {
      return true;
    }
    return false; 
  }

  //Método para abrir el modal para agregar los conceptos de Costo de Compra
  openModalCostoCompra(content) 
  {
    //Si los datos requeridos de 'Datos Generales' ya están capturados
    if (this.datosCapturadosCFDIDoc == true)
    {
      //Abre el modal para ver los Costos de Compra
      const modalRef = this.modalService.open(FormCostoCompraComponent, {backdrop: 'static', keyboard: false, size: <any>'xl'});
      modalRef.componentInstance.src = content;

      //Obtiene el resultado del updateCostoDeCompra
      modalRef.componentInstance.resultUpdateCostoDeCompra.subscribe(
        response => {
          //Si se ha actualizado correctamente
          if (response == true)
          {
            //Consulta de nuevo los datos del 'DetallePartida' para mostrar el nuevo valor de 'Costo de Compra'
            this.getDetallePartida();
          }
        }
      );
    }
    else //En caso de que no se hayan capturado esos datos requeridos
    {
      //Muestra una alerta para indicar al usuario que en el tab 'Datos Generales (al principio de la factura)' no se han capturado los datos requeridos
      Swal.fire({
        icon: 'warning',
        title: 'No ha rellenado los datos requeridos en la sección Datos Generales <br>',
        html: 'Dé clic en el botón <button class="btn btn-sm btn-outline-secondary" disabled style="cursor: initial;"><i class="fas fa-arrow-left"></i> Regresar</button> <br>' + 
              'Diríjase a la pestaña <i>Datos Generales</i> y complete los datos requeridos. <br>' +
              '<ul>' +
              '<li>No. De Asignación/Contrato/Permiso</li>' +
              '<li>Orden de compra</li>' +
              '<li>Tipo de Mano de obra y respectiva cantidad</li>' +
              '</ul>' +
              '<p>Una vez completado los campos se activará esta sección.</p>',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#A0C334',
      });
    }  
  }

  //Método para abrir el modal para subir un documento relacionado a la partida
  openModalUploadDocRelacionado(content, idTipoArchivo) 
  {
    //const modalRef = this.modalService.open(content, { size:'lg'});
    const modalRef = this.modalService.open(UploadDocRelacionadoComponent, { size:'lg'});
    modalRef.componentInstance.src = content;
    modalRef.componentInstance.idTipoArchivo = idTipoArchivo;

    //Obtiene el valor que emite el componente 'UploadDocRelacionado' para poder suscribirse y poder llamar a métodos de esta clase
    modalRef.componentInstance.getPDF.subscribe(
      response => {
        /*if (response == true)
        {}*/
      }
    );
  }
  
  getDetallePartida()
  {
    this._route.params.subscribe(params => {
      this.idCFDIDetalle = params['idDetalle'];

      this._cfdiPartidaService.getPartida(this.idCFDIDetalle).subscribe(
        response => {
          //console.log(response);
          this.detallePartida = response.data;
          this.loading = false;
        },
        error => {
          this.loading = false;
          if (error.status == 401)
          {
            this._authService.sesionExpirada();
          }   
        }
      );
    });
  }

  async saveDetallePartida(form: NgForm)
  {
    if(form.invalid) {
      Object.values( form.controls ).forEach( control => {
        control.markAsTouched();
      });
      return;
    }

    if (this.detallePartida.porcentajeCN > 1)
    {
      this.input.nativeElement.focus(); //Realiza un focus sobre el input de 'Porcentaje de Contenido Nacional'
      return;
    }
    
    Swal.fire({
      allowOutsideClick: false,
      icon:'info',
      title: 'Espere',
      text: 'Guardando información'
    });
    Swal.showLoading();

    this._route.params.subscribe(async params => {
      let idDoc = params['id'];

      await this._cfdiDocService.getCalculoPartida(idDoc, this.idCFDIDetalle).toPromise()
      .then(
        response => {
          //console.log(response);
        },
        error => { }
      );

      this._cfdiPartidaService.updatePartida(this.detallePartida).subscribe(
        response => {
          //console.log(response);
          Swal.fire({
            icon: 'success',
            title: 'Datos actualizados correctamente',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#A0C334',
          });

          this._router.navigate(['/facturas/' + idDoc + '/partidas/' + idDoc]);
          
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#A0C334',
          });
        }
      );
    });
  }

  getCFDIDoc()
  {
    this._route.params.subscribe(params => {
      let idCFDIDoc = params['id'];

      this._cfdiDocService.getFactura(idCFDIDoc).subscribe(
        response => {
          //console.log(response);
          this.tipoDeCambio = response.data.tipoDeCambio;
          this.moneda = response.data.moneda;

          //Si la orden de compra, no. de asignacion y VNMOJ no han sido capturados en el tab 'Datos Generales'
          if (response.data.ordenCompra == '' && response.data.noAsignacion == '' && response.data.vnmoj == 0)
          {
            this.datosCapturadosCFDIDoc = false;
          }
          else
          {
            this.datosCapturadosCFDIDoc = true;
          }
        },
        error => { }
      );
    });  
  }

  getAllActividadConcepto()
  {
    this._masterDataService.getAllActividadConcepto().subscribe(
      response => {
        this.actividadConcepto = response.data;
      },
      error => { }
    );
  }

  getAllTipoContenido()
  {
    this._masterDataService.getAllTipoContenido().subscribe(
      response => {
        this.tipoContenido = response.data;
      },
      error => { }
    );
  }

  getAllCodigoSE()
  {
    this._masterDataService.getAllCodigoSE().subscribe(
      response => {
        this.allCodigoSE = response.data;
      },
      error => { }
    );
  }

  selectEvent(item) 
  {
    this.detallePartida.codigoSE = item.codigo;
    this.detallePartida.actividad = item.actividad;
    this.detallePartida.grupo = item.grupo;
    this.detallePartida.nombreGrupo = item.nombreGrupo;
    this.detallePartida.idSE = item.idSE;
  }

  cancelarFormulario(form: NgForm)
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
        form.reset(this.getDetallePartida());
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
