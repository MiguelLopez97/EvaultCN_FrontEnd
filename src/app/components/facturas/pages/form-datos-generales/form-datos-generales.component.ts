import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../../../../services/auth.service';
import { CFDIDocService } from '../../../../services/cfdidoc.service';
import { CFDIPartidaService } from '../../../../services/cfdipartida.service';
import { CFDIDocModel } from '../../../../models/cfdidoc-model';
import { CalculoContenidoNacionalModel } from '../../../../models/calculo-cn.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-datos-generales',
  templateUrl: './form-datos-generales.component.html',
  styleUrls: ['./form-datos-generales.component.scss'],  
  providers: [CFDIDocService, CFDIPartidaService]
})
export class FormDatosGeneralesComponent implements OnInit {

  public factura = new CFDIDocModel();
  //public activateButtonCalculo: boolean = true;
  public loading: boolean = false;
  public manoDeObra: string = 'mexicana'; //Propiedad para los radio button
  public vmoj: number;
  public vnmoj: number;

  public calculoCN: CalculoContenidoNacionalModel[] = [];

  public tipoMateriales: any[] = [
    {idTipoMaterial: 1, tipo: 'Nacional'},
    {idTipoMaterial: 2, tipo: 'Importado'}
  ];

  constructor(
    private _authService: AuthService,
    private _cfdiDocService: CFDIDocService,
    private _cfdiPartidaService: CFDIPartidaService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
    this.loading = true;

    this.getCalculo();
    this.getFactura();
  }

  getCalculo()
  {
    this._route.params.subscribe(params => {
      let idDoc = params['id'];

      this._cfdiDocService.getCalculo(idDoc).subscribe(
        response => {
          //console.log(response);
          this.calculoCN = response.data;
        },
        error => { }
      );
    });
  }

  getFactura()
  {
    this._route.params.subscribe(params => {
      let idDoc = params['id'];

      this._cfdiDocService.getFactura(idDoc).subscribe(
        response => {
          //console.log(response);
          this.factura = response.data;
          this.factura.vmj = response.data.xml.subTotal;
          this.vmoj = this.factura.vmoj;
          this.vnmoj = this.factura.vnmoj;
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

  //Evento change para cambiar la 'Proporción de contenido nacional del material' a 1 cuando el criterio sea 'Obtenido en su totalidad en México' 
  onChangePCNMj (event: any)
  {
    if (this.factura.criterio == 'Obtenido en su totalidad o producido enteramente en México')
    {
      this.factura.pcnmj = 1;
    } 
  }

  //Valida que las teclas pulsadas sean únicamente números y el punto
  validaNumeros(event)
  {    
    if ((event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46)
    {
      return true;
    }
    return false; 
  }

  onChangeSueldosHonorarios(event)
  {
    this.manoDeObra = event.target.value;

    if (this.manoDeObra == 'extranjera')
    {
      this.vnmoj = 0;
      this.vmoj = 0;
    }
  }

  onSubmit(form: NgForm)
  {
    if (form.invalid) {
      Object.values( form.controls ).forEach( control => {
        control.markAsTouched();
      });
      return;
    }

    this.factura.vnmoj = this.vnmoj;
    this.factura.vmoj = this.vmoj;

    Swal.fire({
      allowOutsideClick: false,
      icon:'info',
      title: 'Espere',
      text: 'Guardando información'
    });
    Swal.showLoading();

    this._cfdiDocService.updateFactura(this.factura).subscribe(
      response => {
        //console.log(response);
        Swal.fire({
          icon: 'success',
          title: 'Datos actualizados correctamente',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#A0C334',
        });
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

}
