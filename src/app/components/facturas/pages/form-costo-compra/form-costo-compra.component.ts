import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../../../../services/auth.service';
import { CostoDeCompraService } from '../../../../services/costo-compra.service';
import { CFDIDocService } from '../../../../services/cfdidoc.service';
import { CFDIPartidaService } from '../../../../services/cfdipartida.service';
import { CFDIDocModel } from '../../../../models/cfdidoc-model';
import { CFDIPartidaModel } from '../../../../models/cfdipartida-model';
import { FormDetalleCostoCompraComponent } from '../form-detalle-costo-compra/form-detalle-costo-compra.component';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-costo-compra',
  templateUrl: './form-costo-compra.component.html',
  styleUrls: ['./form-costo-compra.component.scss'],
})
export class FormCostoCompraComponent implements OnInit {
  
  //Propiedad para actualizar los valores de 'Detalle Partida' cuando el valor que se emita sea true
  public resultUpdateCostoDeCompra = new EventEmitter();

  public detallePartida = new CFDIPartidaModel();

  public costoCompraForm: FormGroup;

  public factura = new CFDIDocModel();
  public detallesCostoCompra: any[] = [];
  public idCFDIDoc: string;
  public idCFDIDetalle: string;
  public loading: boolean = true;

  public totalValorFactura: number;

  constructor(
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _authService: AuthService,
    private _costoCompraService: CostoDeCompraService,
    private _cfdiDocService: CFDIDocService,
    private _cfdiPartidaService: CFDIPartidaService,
    private modalService: NgbModal, //Modal
    public activeModal: NgbActiveModal //Modal
  ) { 
    this.buildForm();  
  }

  ngOnInit() {
    this.getCostoDeCompra();
    this.getCFDIDoc();
    this.getDetallePartida();
  }

  buildForm()
  {
    //Formulario para Costo de Compra
    this.costoCompraForm = this._formBuilder.group({
      pcn: [''],
      vnmoj: [''],
      vmoj: ['']
    });
  }

  //Método para abrir el modal para agregar los conceptos de Costo de Compra
  openModalAddCostoCompra(content, pIdCostoDetalle) 
  {
    const modalRef = this.modalService.open(FormDetalleCostoCompraComponent, { size: 'lg'});
    modalRef.componentInstance.src = content;

    //Mandamos el idCostoDetalle que viene como parámetro al componente 'FormDetalleCostoCompra'
    modalRef.componentInstance.idCostoDetalle = pIdCostoDetalle;

    //Obtiene el valor que emite el componente 'FormDetalleCostoCompra' para poder suscribirse al evento
    modalRef.componentInstance.resultResponseCreateDetalleCosto.subscribe(
      response => {
        this.getCostoDeCompra();
      }
    );
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

  getCostoDeCompra()
  {
    this._route.params.subscribe(params => {
      this.idCFDIDetalle = params['idDetalle'];

      this._costoCompraService.getCostoDeCompraPartida(this.idCFDIDetalle).subscribe(
        response => {
          //console.log(response);
          this.detallesCostoCompra = response.data;

          //Suma de los datos de la columna 'Valor Factura del Material o Servicio (Pesos) VMSj'
          this.totalValorFactura = this.detallesCostoCompra.reduce((
            acumulador,
            detalleCosto,
          ) => acumulador + detalleCosto.vmSj, 0);

          //Asigna a la propiedad 'costoDeCompra' del objeto 'DetallePartida' la suma total de 'VMSJ' y el 'idCFDIDetalle'
          this.detallePartida.costoDeCompra = this.totalValorFactura;
          this.detallePartida.idCFDIDetalle = this.idCFDIDetalle;
        },
      );
    });  
  }

  getDetallePartida()
  {
    this._route.params.subscribe(params => {
      let idCFDIDetalle = params['idDetalle'];

      this._cfdiPartidaService.getPartida(idCFDIDetalle).subscribe(
        response => {
          this.detallePartida = response.data;
        },
        error => { }
      );
    });  
  }

  getCFDIDoc()
  {
    this._route.params.subscribe(params => {
      this.idCFDIDoc = params['id'];

      this._cfdiDocService.getFactura(this.idCFDIDoc).subscribe(
        response => {
          //console.log(response);
          this.factura = response.data;
          this.loading = false;
        },
        error => {
          this.loading = false;
          if (error.status == 401)
          {
            this.modalService.dismissAll();
            this._authService.sesionExpirada();
          }
        }
      );
    });
  }

  //Actualiza el valor de 'Costo de Compra' al 'CFDIDetalle' que se esté consultando
  async updateCFDIPartida()
  {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      title: 'Espere',
      text: 'Guardando información'
    });
    Swal.showLoading();

    //Llama al endpoint de getCalculoPartida para que también se actualicen los datos del cálculo
    await this._cfdiDocService.getCalculoPartida(this.idCFDIDoc, this.idCFDIDetalle).toPromise()
    .then(
      response => {
        //console.log(response);
      },
      error => { }
    );

    //Actualiza el valor de 'Costo de Compra' al 'CFDIDetalle'
    this._cfdiPartidaService.updatePartida(this.detallePartida).subscribe(
      response => {
        if (response.success == true)
        {
          Swal.fire({
            icon: 'success',
            title: 'Datos guardados correctamente',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#A0C334',
          });
          //Emite 'true' para que el componente de 'FormDetalles' pueda consultar de nuevo los datos de 'Detalle Partida'
          this.resultUpdateCostoDeCompra.emit(true);
          this.modalService.dismissAll();
        }
        else
        {
          Swal.fire({
            icon: 'error',
            title: 'Error al guardar los datos',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#A0C334',
          });
        }  
      },
      error => { }
    );
  }

  deleteCostoCompra(idCostoDetalle)
  {
    Swal.fire({
      title: '¿Está seguro de eliminar este registro?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#A0C334',
      cancelButtonColor: '#5D5D5D',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then( result => {
      if (result.value) {

        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: 'Espere',
          text: 'Eliminando información'
        });
        Swal.showLoading();

        this._costoCompraService.deleteCostoDeCompra(idCostoDetalle).subscribe(
          response => {
            //console.log(response);
            if (response.success == true)
            {
              this.getCostoDeCompra();
              Swal.fire({
                icon: 'success',
                title: 'Registro eliminado correctamente',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#A0C334',
              });
            }
            else
            {
              Swal.fire({
                icon: 'error',
                title: 'Error al eliminar el registro',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#A0C334',
              });
            }            
          },
          error => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar el registro',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#A0C334',
            });
          }
        );
        
      }
    }); 
  }

}
