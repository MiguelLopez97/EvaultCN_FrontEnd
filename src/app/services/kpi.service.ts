import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appsettings } from './appsettings';

@Injectable({
  providedIn: 'root',
})
export class KPIService {
  public apiUrl: string;

  constructor(
    private _http: HttpClient
  ) {
    this.apiUrl = Appsettings.API_ENDPOINT_FULL;
  }

  getKPI(idEmpresa):Observable<any>
  {
    return this._http.get(this.apiUrl + '/kpi/' + idEmpresa);
  }

  getReporteDatatable(nombreReporte):Observable<any>
  {
    let params = '?ReportName=Reportes.' + nombreReporte;
    return this._http.get(this.apiUrl + '/kpi/ReportDataTable' + params);
  }
}