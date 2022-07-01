import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import { AuthService } from '../../../../services/auth.service';
import { CFDIPartidaService } from '../../../../services/cfdipartida.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-table-partidas',
  templateUrl: './table-partidas.component.html',
  styleUrls: ['./table-partidas.component.scss'], 
  providers: [CFDIPartidaService]
})
export class TablePartidasComponent implements OnInit {
  
  @ViewChild(DatatableComponent) table: DatatableComponent;

  public partidas: any[] = [];
  public idCFDI: string;
  public totalValorFactura: string;
  public totalProporcionContenido: string;

  public loading: boolean = true;

  constructor(
    private _authService: AuthService,
    private _cfdiPartidaService: CFDIPartidaService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
    this.getPartidasAll();
  }

  getPartidasAll()
  {
    this._route.params.subscribe(params => {      
      //IDCFDI que obtiene de la ruta(URL) para poder navegar al 'Detalle'
      this.idCFDI = params['id'];

      this._cfdiPartidaService.getPartidasAll(this.idCFDI).subscribe(
        response => {
          this.partidas = response.data;
          for (let partida of this.partidas)
          {
            if (partida.actividadConcepto == 'Servicio')
            {
              partida.porcentajeCN = partida.pcnServicios;
            }
            else if (partida.actividadConcepto == 'Material')
            {
              partida.porcentajeCN = partida.pcnMateriales;
            }
            else if (partida.actividadConcepto == 'Bienes')
            {
              partida.porcentajeCN = partida.pcnBienes;
            }
          }
          this.loading = false;

          //Suma de los datos de la columna 'Valor Factura'
          this.totalValorFactura = this.partidas.reduce((
            acumulador,
            partida,
          ) => acumulador + partida.valorFacturado, 0);

          //Suma de los datos de la columna 'Contenido Nacional en Pesos'
          this.totalProporcionContenido = this.partidas.reduce((
            acumulador,
            partida,
          ) => acumulador + (partida.valorFacturado * partida.porcentajeCN), 0);
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

}
