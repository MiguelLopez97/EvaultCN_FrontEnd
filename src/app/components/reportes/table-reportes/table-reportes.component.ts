import { Component, OnInit, ViewChild } from '@angular/core';
import { KPIService } from '../../../services/kpi.service';
import { GenerateExcelService } from '../../../services/generate-excel.service';

import { fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-table-reportes',
  templateUrl: './table-reportes.component.html',
  styleUrls: ['./table-reportes.component.scss']
})
export class TableReportesComponent implements OnInit {

  @ViewChild('search') search: any;
  
  //Propiedades para Datatable
  public columns = [];
  public rows = [];
  public temp = [];

  public loading: boolean;

  public reportsName = [
    {value: 'EmpresasRegistradas', name: 'Empresas Registradas'},
    {value: 'Sabana', name: 'Sabana'}
  ];

  public reportNameSelected = this.reportsName[0].value;


  constructor(
    private _kpiService: KPIService,
    private _generateExcelService: GenerateExcelService
  ) { }

  ngOnInit() {
    this.onChangeReportName(this.reportNameSelected);
  }

  //Filtrado de datos usando Rxjs
  ngAfterViewInit(): void 
  {
    fromEvent(this.search.nativeElement, 'keydown')
      .pipe(
        debounceTime(10),
        map(x => x['target']['value'])
      )
      .subscribe(value => {
        this.filterUpdate(value);
      });
  }

  onChangeReportName(reportName)
  {
    this.loading = true;

    //Obtiene la consulta del dataset en base al nombre del reporte que se haya seleccionado en el select
    this._kpiService.getReporteDatatable(reportName).subscribe(
      response => {
        this.columns = response.data.columns;
        this.rows = response.data.rows;
        this.temp = response.data.rows;
        this.loading = false;
      },
      error => { 
        this.loading = false;
      }
    );
  }

  filterUpdate(event) 
  {
    //Obtiene el valor de la tecla pulsada y lo convierte en minúsculas
    const value = event.toString().toLowerCase().trim();

    //Obtiene la cantidad de columnas de la tabla
    const count = this.columns.length;
    
    //Obtiene los 'nombres clave' de cada columna de la tabla
    const keys = Object.keys(this.temp[0]);

    //Asigna las coincidencias encontradas en el arreglo 'rows'
    this.rows = this.temp.filter(item => {

      //Recorre cada fila de cada columna
      for (let i = 0; i < count; i++)
      {
        //Si existen coincidencias encontradas
        if ((item[keys[i]] && item[keys[i]].toString().toLowerCase().indexOf(value) !== -1) || !value) 
        {
          //Devuelve true con los datos que coinciden y los agrega al arreglo 'rows'
          return true;
        }
      }
    });

    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }

  generateExcel()
  {
    this._generateExcelService.exportAsExcelFile(this.rows, 'Reporte_Tecnikal_' + this.reportNameSelected);
  }

}
