import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

import { DashboardService } from '../../../services/dashboard.service';
import {  DashboardPorActividadModel, 
          DashboardPorProveedorModel, 
          DashboardPorProveedorPorcentajeModel, 
          DashboardPorActividadMontoPorcentajeModel } from '../../../models/dashboard.model';

@Component({
  selector: 'app-view-graficas',
  templateUrl: './view-graficas.component.html',
  styleUrls: ['./view-graficas.component.scss']
})
export class ViewGraficasComponent implements OnInit {

  public dataPorActividad: DashboardPorActividadModel[] = [];
  public dataPorProveedor: DashboardPorProveedorModel[] = [];
  public dataPorProveedorPorcentaje: DashboardPorProveedorPorcentajeModel[] = [];
  public dataPorActividadMontoPorcentaje: DashboardPorActividadMontoPorcentajeModel[] = [];

  public pieChart: Chart;
  public barChart: Chart;
  public pieChart2: Chart;
  public mixedChart: Chart;

  public loading: boolean = true;

  public selectedPeriodo: any;

  public fechaActual = new Date();
  public anio = new Date().getFullYear();

  public anios: any[] = [2021, 2022];

  public periodos: any[] = [
    {fechaInicio: this.anio + '-01-01', fechaFin: this.anio + '-03-31', nombre: 'Primer trimestre'},
    {fechaInicio: this.anio + '-04-01', fechaFin: this.anio + '-06-30', nombre: 'Segundo trimestre'},
    {fechaInicio: this.anio + '-07-01', fechaFin: this.anio + '-09-30', nombre: 'Tercer trimestre'},
    {fechaInicio: this.anio + '-10-01', fechaFin: this.anio + '-12-31', nombre: 'Cuarto trimestre'},
    {fechaInicio: this.anio + '-01-01', fechaFin: this.anio + '-06-30', nombre: 'Primer semestre'},
    {fechaInicio: this.anio + '-07-01', fechaFin: this.anio + '-12-31', nombre: 'Segundo semestre'},
    {fechaInicio: this.anio + '-01-01', fechaFin: this.anio + '-12-31', nombre: 'Anual'},
    {fechaInicio: this.anio + '-01-01', fechaFin: this.anio + '-01-31', nombre: 'Enero'},
    {fechaInicio: this.anio + '-02-01', fechaFin: this.anio + '-02-28', nombre: 'Febrero'},
    {fechaInicio: this.anio + '-03-01', fechaFin: this.anio + '-03-31', nombre: 'Marzo'},
    {fechaInicio: this.anio + '-04-01', fechaFin: this.anio + '-04-30', nombre: 'Abril'},
    {fechaInicio: this.anio + '-05-01', fechaFin: this.anio + '-05-31', nombre: 'Mayo'},
    {fechaInicio: this.anio + '-06-01', fechaFin: this.anio + '-06-30', nombre: 'Junio'},
    {fechaInicio: this.anio + '-07-01', fechaFin: this.anio + '-07-31', nombre: 'Julio'},
    {fechaInicio: this.anio + '-08-01', fechaFin: this.anio + '-08-31', nombre: 'Agosto'},
    {fechaInicio: this.anio + '-09-01', fechaFin: this.anio + '-09-30', nombre: 'Septiembre'},
    {fechaInicio: this.anio + '-10-01', fechaFin: this.anio + '-10-31', nombre: 'Octubre'},
    {fechaInicio: this.anio + '-11-01', fechaFin: this.anio + '-11-30', nombre: 'Noviembre'},
    {fechaInicio: this.anio + '-12-01', fechaFin: this.anio + '-12-31', nombre: 'Diciembre'}
  ];

  constructor(
    private _dashboardService: DashboardService
  ) { }

  ngOnInit() {
    this.getPeriodoActual();
  }

  onChangeAnioPeriodos(anio)
  {
    this.periodos = [
      {fechaInicio: anio + '-01-01', fechaFin: anio + '-03-31', nombre: 'Primer trimestre'},
      {fechaInicio: anio + '-04-01', fechaFin: anio + '-06-30', nombre: 'Segundo trimestre'},
      {fechaInicio: anio + '-07-01', fechaFin: anio + '-09-30', nombre: 'Tercer trimestre'},
      {fechaInicio: anio + '-10-01', fechaFin: anio + '-12-31', nombre: 'Cuarto trimestre'},
      {fechaInicio: anio + '-01-01', fechaFin: anio + '-06-30', nombre: 'Primer semestre'},
      {fechaInicio: anio + '-07-01', fechaFin: anio + '-12-31', nombre: 'Segundo semestre'},
      {fechaInicio: anio + '-01-01', fechaFin: anio + '-12-31', nombre: 'Anual'},
      {fechaInicio: anio + '-01-01', fechaFin: anio + '-01-31', nombre: 'Enero'},
      {fechaInicio: anio + '-02-01', fechaFin: anio + '-02-28', nombre: 'Febrero'},
      {fechaInicio: anio + '-03-01', fechaFin: anio + '-03-31', nombre: 'Marzo'},
      {fechaInicio: anio + '-04-01', fechaFin: anio + '-04-30', nombre: 'Abril'},
      {fechaInicio: anio + '-05-01', fechaFin: anio + '-05-31', nombre: 'Mayo'},
      {fechaInicio: anio + '-06-01', fechaFin: anio + '-06-30', nombre: 'Junio'},
      {fechaInicio: anio + '-07-01', fechaFin: anio + '-07-31', nombre: 'Julio'},
      {fechaInicio: anio + '-08-01', fechaFin: anio + '-08-31', nombre: 'Agosto'},
      {fechaInicio: anio + '-09-01', fechaFin: anio + '-09-30', nombre: 'Septiembre'},
      {fechaInicio: anio + '-10-01', fechaFin: anio + '-10-31', nombre: 'Octubre'},
      {fechaInicio: anio + '-11-01', fechaFin: anio + '-11-30', nombre: 'Noviembre'},
      {fechaInicio: anio + '-12-01', fechaFin: anio + '-12-31', nombre: 'Diciembre'}
    ];
  }

  getPeriodoActual()
  {
    //Trimestres
    const primerTrimestre = {fechaInicio: new Date(this.anio + '-01-01'), fechaFin: new Date(this.anio + '-03-31')};
    const segundoTrimestre = {fechaInicio: new Date(this.anio + '-04-01'), fechaFin: new Date(this.anio + '-06-30')};
    const tercerTrimestre = {fechaInicio: new Date(this.anio + '-07-01'), fechaFin: new Date(this.anio + '-09-30')};
    const cuartoTrimestre = {fechaInicio: new Date(this.anio + '-10-01'), fechaFin: new Date(this.anio + '-12-31')};

    //1. Verificar en que periodo se encuentra la fecha actual
    if (this.fechaActual.getTime() >= primerTrimestre.fechaInicio.getTime() && this.fechaActual.getTime() <= primerTrimestre.fechaFin.getTime())
    {
      this.selectedPeriodo = this.periodos[0];
    }
    else if (this.fechaActual.getTime() >= segundoTrimestre.fechaInicio.getTime() && this.fechaActual.getTime() <= segundoTrimestre.fechaFin.getTime())
    {
      this.selectedPeriodo = this.periodos[1];
    }
    else if (this.fechaActual.getTime() >= tercerTrimestre.fechaInicio.getTime() && this.fechaActual.getTime() <= tercerTrimestre.fechaFin.getTime())
    {
      this.selectedPeriodo = this.periodos[2];
    }
    else if (this.fechaActual.getTime() >= cuartoTrimestre.fechaInicio.getTime() && this.fechaActual.getTime() <= cuartoTrimestre.fechaFin.getTime())
    {
      this.selectedPeriodo = this.periodos[3];
    }

    //2. Establecer las fechas del periodo en que se encuentra la fecha actual
    this._dashboardService.getData(this.selectedPeriodo.fechaInicio, this.selectedPeriodo.fechaFin).subscribe(
      response => {

        //3. Obtener los datos para la gráfica en base a las fechas establecidas anteriormente
        this.getGraficaPorActividad();
        this.getGraficaPorProveedor();
        this.getGraficaPorProveedorPorcentaje();
        this.getGraficaPorActividadMontoPorcentaje();
      },
      error => { }
    );
  }

  findByPeriodo(periodo)
  {
    if (periodo == undefined)
    {
      return;
    }
    else
    {
      this.loading = true;
      this._dashboardService.getData(periodo.fechaInicio, periodo.fechaFin).subscribe(
        response => {
          this.getGraficaPorActividad();
          this.getGraficaPorProveedor();
          this.getGraficaPorProveedorPorcentaje();
          this.getGraficaPorActividadMontoPorcentaje();
        },
        error => { }
      );
    }
  }

  async getGraficaPorActividad()
  {
    await this._dashboardService.getPorActividad().toPromise()
    .then(
      response => {
        this.dataPorActividad = response;

        let sumaTotalMX = 0;

        let porcentajes = [];

        //1. Suma de todos los totalesMX
        for (let item of this.dataPorActividad)
        {
          sumaTotalMX = sumaTotalMX + item.totalMX;
        }

        //2. Obtenemos el porcentaje de cada elemento de 'dataPorActividad'
        for (let item of this.dataPorActividad)
        {
          //Dividimos el 'totalMX' entre la 'sumaTotal' para obtener el porcentaje
          let porcentaje = item.totalMX / sumaTotalMX;

          //Agregamos al arreglo 'porcentajes' cada porcentaje calculado
          porcentajes.push((porcentaje * 100).toFixed(2));
        }

        //Arreglos para asignarlos a las propiedades de la gráfica
        const labelsActividad = [];
        const dataTotalMX = [];

        //3. Asignamos los labels y la data para las gráficas
        this.dataPorActividad.forEach((value, index) => {
          labelsActividad.push(value.actividad + ' - ' + porcentajes[index] + '%');
          dataTotalMX.push(value.totalMX);
        });

        //Si ya existe una gráfica creada
        if (this.pieChart)
        {
          //Destruimos la gráfica anterior
          this.pieChart.destroy();
        }

        //Grafica de Pastel (PieChart)
        this.pieChart = new Chart ('byActivity', {
          type: 'pie',
          data: {
            labels: labelsActividad,
            datasets: [{
              data: dataTotalMX,
              backgroundColor: [
                'rgba(255, 88, 107, 0.5)',
                'rgba(12, 194, 126, 0.5)',
                'rgba(0, 0, 255,0.3)',
                'rgb(255, 99, 132)',
                'rgb(75, 192, 192)',
                'rgb(255, 205, 86)',
                'rgb(201, 203, 207)',
                '#3F51B5',
                'rgb(54, 162, 235)',
                '#9C27B0',
                '#CDDC39',
              ]
            }]
          },
          options: {
            maintainAspectRatio: false,
            tooltips: {
              callbacks: {
                label: function(tooltipItem, data) {
                  return "Total MX: " + (new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })).format(Number(data.datasets[0].data[tooltipItem.index]));
                },
                title: function(tooltipItem, data) {
                  let title = data.labels[tooltipItem[0].index].toString();
                  return title;
                }
              }
            }
          }
        });
        //End Grafica de Pastel (PieChart)
      }
    )
    .catch(
      error => { }
    );
  }

  async getGraficaPorProveedor()
  {
    await this._dashboardService.getPorProveedor().toPromise()
    .then(
      response => {
        this.dataPorProveedor = response;

        //Arreglos para asignarlos a las propiedades de la gráfica
        const labelsProveedor = [];
        const dataTotalMX = [];

        for (let item of this.dataPorProveedor)
        {
          labelsProveedor.push(item.proveedor);
          dataTotalMX.push(item.totalMX);
        }

        //Si ya existe una gráfica creada
        if (this.barChart)
        {
          //Destruimos la gráfica anterior
          this.barChart.destroy();
        }

        //Grafica de Barra (BarChart)
        this.barChart = new Chart ('byProveedor', {
          type: 'bar',
          data: {
            labels: labelsProveedor,
            datasets: [{
              label: 'Proveedores',
              data: dataTotalMX,
              backgroundColor: [
                'rgba(255, 88, 107, 0.5)',
                'rgba(12, 194, 126, 0.5)',
                'rgba(0, 0, 255,0.3)',
                'rgb(255, 99, 132)',
                'rgb(75, 192, 192)',
                'rgb(255, 205, 86)',
                'rgb(201, 203, 207)',
                '#3F51B5',
                'rgb(54, 162, 235)',
                '#9C27B0',
                '#CDDC39',
              ]
            }]
          },
          options: {
            maintainAspectRatio: false,
            scales: {
              xAxes: [{
                ticks: {
                  maxRotation: 90,
                  minRotation: 90,
                }
              }],
              yAxes: [{
                position: "left",
                ticks: {
                  //Convierte las etiquetas del eje 'Y' de la izquierda en formato de moneda
                  callback: function(value, index, ticks) {
                    return (new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })).format(Number(value));
                  }
                }
              }]
            },
            tooltips: {
              callbacks: {
                label: function(tooltipItem, data) {
                  return 'Total MX: ' + (new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })).format(Number(data.datasets[0].data[tooltipItem.index]));
                }
              }
            }
          }
        });
        //End Grafica de Barra (BarChart)
      }
    )
    .catch(
      error => { }
    );
  }

  async getGraficaPorProveedorPorcentaje()
  {
    await this._dashboardService.getPorProveedorPorcentaje().toPromise()
    .then(
      response => {
        this.dataPorProveedorPorcentaje = response;

        let sumaTotalMX = 0;

        let porcentajes = [];

        //1. Suma de todos los totalesMX
        for (let item of this.dataPorActividad)
        {
          sumaTotalMX = sumaTotalMX + item.totalMX;
        }

        //2. Obtenemos el porcentaje de cada elemento de 'dataPorActividad'
        for (let item of this.dataPorActividad)
        {
          //Dividimos el 'totalMX' entre la 'sumaTotal' para obtener el porcentaje
          let porcentaje = item.totalMX / sumaTotalMX;

          //Agregamos al arreglo 'porcentajes' cada porcentaje calculado
          porcentajes.push((porcentaje * 100).toFixed(2));
        }

        //Arreglos para asignarlos a las propiedades de la gráfica
        const labelsProveedor = [];
        const dataPromedioCN = [];

        //3. Asignamos los labels y la data para las gráficas
        this.dataPorProveedorPorcentaje.forEach((value, index) => {
          labelsProveedor.push(value.proveedor + ' - ' + porcentajes[index] + '%');
          dataPromedioCN.push(value.promedioCN);
        });

        //Si ya existe una gráfica creada
        if (this.pieChart2)
        {
          //Destruimos la gráfica anterior
          this.pieChart2.destroy();
        }

        //Grafica de Pastel (PieChart)
        this.pieChart2 = new Chart ('byProveedorPorcentaje', {
          type: 'pie',
          data: {
            labels: labelsProveedor,
            datasets: [{
              data: dataPromedioCN,
              backgroundColor: [
                'rgba(255, 88, 107, 0.5)',
                'rgba(12, 194, 126, 0.5)',
                'rgba(0, 0, 255,0.3)',
                'rgb(255, 99, 132)',
                'rgb(75, 192, 192)',
                'rgb(255, 205, 86)',
                'rgb(201, 203, 207)',
                '#3F51B5',
                'rgb(54, 162, 235)',
                '#9C27B0',
                '#CDDC39',
              ]
            }]
          },
          options: {
            maintainAspectRatio: false,
            tooltips: {
              callbacks: {
                label: function(tooltipItem, data) {
                  return "Porcentaje Contenido Nacional: " + data.datasets[0].data[tooltipItem.index];
                },
                title: function(tooltipItem, data) {
                  let title = data.labels[tooltipItem[0].index].toString();
                  return title;
                }
              }
            }
          }
        });
        //End Grafica de Pastel (PieChart)
      }
    )
    .catch(
      error => { }
    );
  }

  async getGraficaPorActividadMontoPorcentaje()
  {
    await this._dashboardService.getPorActividadMontoPorcentaje().toPromise()
    .then(
      response => {
        this.dataPorActividadMontoPorcentaje = response;

        //Arreglos para asignarlos a las propiedades de la gráfica
        const labelsActividad = [];
        const dataPromedioCN = [];
        const dataTotalMX = [];

        for (let item of this.dataPorActividadMontoPorcentaje)
        {
          labelsActividad.push(item.actividad);
          dataPromedioCN.push(item.promedioCN);
          dataTotalMX.push(item.totalMX);
        }

        //Si ya existe una gráfica creada
        if (this.mixedChart)
        {
          //Destruimos la gráfica anterior
          this.mixedChart.destroy();
        }

        //Gráfica Combinada (Mixed BarChart & LineChart)
        this.mixedChart = new Chart ('byActividadMontoPorcentaje', {
          type: 'bar',
          data: {
            labels: labelsActividad,
            datasets: [
              {
                type: "bar",
                yAxisID: 'y-axis-b',
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 1,
                label: "Promedio Contenido Nacional",
                data: dataPromedioCN,
              },
              {
                type: "line",
                yAxisID: 'y-axis-a',
                label: "Total MX",
                data: dataTotalMX,
                lineTension: 0,
                borderColor: 'rgb(54, 162, 235)',
                fill: false,
              }
            ]
          },
          options: {
            maintainAspectRatio: false,
            scales: {
              xAxes: [{
                ticks: {
                  maxRotation: 90,
                  minRotation: 90,
                }
              }],
              yAxes: [
                {
                  position: "right",
                  id: "y-axis-a",
                  ticks: {
                    //Convierte los valores del eje 'Y' de la derecha en formato de moneda
                    callback: function(value, index, ticks) {
                      return (new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })).format(Number(value));
                    }
                  }
                }, 
                {
                  position: "left",
                  id: "y-axis-b",
                }
              ]
            },
            tooltips: {
              callbacks: {
                label: function(tooltipItem, data) {
                  var xLabel = data.datasets[tooltipItem.datasetIndex].label;
                  var yLabel = tooltipItem.yLabel;

                  //Si la gráfica es de tipo 'lineal'
                  if (tooltipItem.datasetIndex === 0) 
                  {
                    return xLabel + ': ' + yLabel;                    
                  }
                  //Si la gráfica es de tipo 'barras'
                  else if (tooltipItem.datasetIndex === 1)
                  {
                    return xLabel + ': ' + (new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })).format(Number(yLabel));
                  }
                }
              }
            }
          }
        });
        //End Gráfica Combinada (Mixed BarChart & LineChart)

        this.loading = false;
      }
    )
    .catch(
      error => { 
        this.loading = false;
      }
    );
  }

}
