import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { CFDIDocModel } from '../../../../models/cfdidoc-model';
import { AuthService } from '../../../../services/auth.service';
import { CriptoService } from '../../../../services/cripto.service';
import { CFDIDocService } from '../../../../services/cfdidoc.service';
import { CFDIPartidaService } from '../../../../services/cfdipartida.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-generar-carta',
  templateUrl: './form-generar-carta.component.html',
  styleUrls: ['./form-generar-carta.component.scss'],
  providers: [CFDIDocService, CFDIPartidaService]
})
export class FormGenerarCartaComponent implements OnInit {

  public CFDIDocs: CFDIDocModel[] = [];
  public CFDIPartidas: any = [];
  public loadingPartidas: boolean = false;
  public contienePorcentajeCN: boolean = true;
  public CFDIDocSelected = new CFDIDocModel();

  //Propiedades para pasar como parámetros a la funcion Generar Carta
  public idEmpresaDesencriptado: string;
  public idCFDI: number;

  constructor(
    private _authService: AuthService,
    private _CFDIDocService: CFDIDocService,
    private _router: Router,
    private _CFDIPartidaService: CFDIPartidaService,
    private _cripto: CriptoService
  ) {
    this.idEmpresaDesencriptado = this._cripto.decrypt(localStorage.getItem('idEmpresa'));
  }

  ngOnInit() {
    this.getFacturasAll();   
  }

  getFacturasAll()
  {
    this._CFDIDocService.getFacturasAll(this.idEmpresaDesencriptado).subscribe(
      response => {
        this.CFDIDocs = response.data;
      },
      error => {
        if (error.status == 401)
        {
          this._authService.sesionExpirada();
        } 
      }
    );
  }

  getPartidasAll(generarCartaForm: NgForm)
  {
    if(generarCartaForm.invalid) 
    {
      Object.values( generarCartaForm.controls ).forEach( control => {
        control.markAsTouched();
      });
      return;
    }
    
    this.loadingPartidas = true;

    this._CFDIPartidaService.getPartidasAll(this.idCFDI).subscribe(
      async response => {
        this.CFDIPartidas = response.data;
        this.loadingPartidas = false;

        var resultCFDIDocSelected;

        resultCFDIDocSelected = this.CFDIDocs.filter((result) => result.idDoc == this.idCFDI);

        this.CFDIDocSelected = resultCFDIDocSelected[0];
        
        //Variable para almacenar la sumatoria del 'Resultado de CN' de cada Partida
        /*var sumaResultadoCalculo = 0;

        //Recorremos las partidas
        for (let partida of response.data)
        {
          //Consultamos por partida si tienen Porcentaje de Contenido Nacional
          await this._CFDIDocService.getCalculoPartida(this.idCFDI, partida.idCFDIDetalle).toPromise()
          .then(
            response => {
              //Recorremos el 'response.data' donde vienen la información de Porcentaje de CN de Bienes, Servicios y Materiales
              for (let calculo of response.data)
              {
                //Sumamos todos los valores del 'Resultado de CN de Bienes, Servicios y Materiales' de cada Partida y guardamos la sumatoria en la variable 'sumaResultadoCalculo'
                sumaResultadoCalculo+= calculo.resultado;
              }
            }
          );
        }

        //Si la sumatoria del Porcentaje de CN es igual a cero
        if (sumaResultadoCalculo == 0)
        {
          //Significa que ninguna partida contiene CN y no se habilita el botón para generar la carta
          this.contienePorcentajeCN = false;
          this.loadingPartidas = false;
        }
        else //Caso contrario
        {
          //Se habilita el botón para generar la carta
          this.contienePorcentajeCN = true;
          this.loadingPartidas = false;
        }*/
      },
      error => {
        this.loadingPartidas = false;
      }
    );
  }

  generateCarta()
  {
    Swal.fire({
      allowOutsideClick: false,
      icon:'info',
      title: 'Espere',
      text: 'Generando carta'
    });
    Swal.showLoading();

    this._CFDIDocService.generateCartas(this.idEmpresaDesencriptado, this.idCFDI, 1).subscribe(
      response => { },
      error => {
        if (error.status == 200)
        {
          Swal.fire({
            icon: 'success',
            title: 'Carta generada correctamente',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#A0C334',
          });
          window.open(error.url, '_blank');
        }
      }
    );
  }


}
