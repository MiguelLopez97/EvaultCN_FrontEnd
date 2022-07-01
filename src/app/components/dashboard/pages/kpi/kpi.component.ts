import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

import { KPIModel } from '../../../../models/kpi.model';
import { KPIService } from '../../../../services/kpi.service';
import { CriptoService } from '../../../../services/cripto.service';

@Component({
  selector: 'app-kpi',
  templateUrl: './kpi.component.html',
  styleUrls: ['./kpi.component.scss'],
  providers: [KPIService]
})
export class KpiComponent implements OnInit {

  public kpi: KPIModel[];
  public cartasEmitidas: KPIModel[];
  public CFDIsPorRevisar: KPIModel[];
  public CFDIsRevisados: KPIModel[];
  public CFDIsTotales: KPIModel[];
  public proveedores: KPIModel[];

  public idEmpresaDesencriptado: string;

  PieChart = [];

  constructor(
    private _kpiService: KPIService,
    private _cripto: CriptoService
  ) { 
    this.idEmpresaDesencriptado = this._cripto.decrypt(localStorage.getItem('idEmpresa'));
  }

  ngOnInit() {
    this.getKPI();
  }

  getKPI()
  {
    this._kpiService.getKPI(this.idEmpresaDesencriptado).subscribe(
      response => {
        this.kpi = response.data;
        //console.log(this.kpi);
        this.cartasEmitidas = response.data[0];
        this.CFDIsPorRevisar = response.data[1];
        this.CFDIsRevisados = response.data[2];
        this.CFDIsTotales = response.data[3];
        this.proveedores = response.data[4];

        const numeroCartasEmitidas = response.data[0];
        const numeroCFDIsPorRevisar = response.data[1].valor;
        const numeroCFDIsRevisados = response.data[2].valor;
        const numeroCFDIsTotales = response.data[3].valor;
        const numeroProveedores = response.data[4].valor;

        //Grafica de Pastel (PieChart)
        this.PieChart.push(new Chart ('pieChart', {
          type: 'pie',
          data: {
            labels: ['CFDIs por revisar', 'CFDIs revisados'],
            datasets: [{
              label: 'KPI',
              data: [numeroCFDIsPorRevisar, numeroCFDIsRevisados],
              backgroundColor: [
                'rgba(255, 88, 107, 0.5)',
                'rgba(12, 194, 126, 0.5)',
                'rgba(0,0,255,0.3)',
              ]
            }]
          },
          options: {
            title: {
              text: "Estado de CFDIs",
              display: true
            },
            /*scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }*/
          }
        }));
        //End Grafica de Pastel (PieChart)
      },
      error => {
        //console.log(error);
      }
    );
  }
}
