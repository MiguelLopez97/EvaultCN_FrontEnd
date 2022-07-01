import { LOCALE_ID, NgModule } from '@angular/core'; //Yo coloqué el LOCALE_ID
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "./shared/shared.module";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { AngularFileUploaderModule } from "angular-file-uploader";
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
//import { PdfViewerModule } from 'ng2-pdf-viewer';

import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { AppComponent } from './app.component';
import { ContentLayoutComponent } from "./layouts/content/content-layout.component";
import { FullLayoutComponent } from "./layouts/full/full-layout.component";

//Servicio Authentication
import { AuthService } from './services/auth.service';

//Para cambiar la fecha a Español-México
import { registerLocaleData } from '@angular/common';
import localeMX from '@angular/common/locales/es-MX';
registerLocaleData(localeMX, 'es-Mx');

//Pipes
import { FilterMesPipe } from './pipes/filter-mes.pipe';
import { FilterEstatusCFDIPipe } from './pipes/filter-estatus-cfdi.pipe';
import { FilterRFCPipe } from './pipes/filter-rfc.pipe';

//Componentes creados
import { LoginComponent } from './components/login/login.component';
import { AddFacturaComponent } from './components/add-factura/add-factura.component';
import { DatosGeneralesComponent } from './components/datos-generales/datos-generales.component';
import { RegistroComponent } from './components/registro/registro.component';
import { FacturasComponent } from './components/facturas/facturas.component';
import { FormDatosGeneralesComponent } from './components/facturas/pages/form-datos-generales/form-datos-generales.component';
import { TablePartidasComponent } from './components/facturas/pages/table-partidas/table-partidas.component';
import { FormDetallesComponent } from './components/facturas/pages/form-detalles/form-detalles.component';
import { DocumentosRelacionadosComponent } from './components/facturas/pages/documentos-relacionados/documentos-relacionados.component';
import { DatosGeneralesFacturaComponent } from './components/facturas/datos-generales-factura/datos-generales-factura.component';
import { DetalleComponent } from './components/facturas/detalle/detalle.component';
import { FormUsuarioComponent } from './components/datos-generales/pages/form-usuario/form-usuario.component';
import { FormEmpresaComponent } from './components/datos-generales/pages/form-empresa/form-empresa.component';
import { FormBuzonComponent } from './components/datos-generales/pages/form-buzon/form-buzon.component';
import { KpiComponent } from './components/dashboard/pages/kpi/kpi.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GenerarCartaComponent } from './components/generar-carta/generar-carta.component';
import { FormGenerarCartaComponent } from './components/generar-carta/pages/form-generar-carta/form-generar-carta.component';
import { TableFacturasVentaComponent } from './components/facturas/pages/table-facturas-venta/table-facturas-venta.component';
import { TableFacturasCompraComponent } from './components/facturas/pages/table-facturas-compra/table-facturas-compra.component';
import { NgDropFilesDirective } from './directives/ng-drop-files.directive';
import { UploadDocRelacionadoComponent } from './components/facturas/pages/upload-doc-relacionado/upload-doc-relacionado.component';
import { CalculoCNComponent } from './components/facturas/pages/calculo-cn/calculo-cn.component';
import { FormCostoCompraComponent } from './components/facturas/pages/form-costo-compra/form-costo-compra.component';
import { FormDetalleCostoCompraComponent } from './components/facturas/pages/form-detalle-costo-compra/form-detalle-costo-compra.component';
import { FormAddProveedorComponent } from './components/facturas/pages/form-add-proveedor/form-add-proveedor.component';
import { DetalleCalculoPartidaComponent } from './components/facturas/pages/detalle-calculo-partida/detalle-calculo-partida.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { TableReportesComponent } from './components/reportes/table-reportes/table-reportes.component';
import { GraficasComponent } from './components/graficas/graficas.component';
import { ViewGraficasComponent } from './components/graficas/view-graficas/view-graficas.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true,
    wheelPropagation: false
  };
  
  @NgModule({
    declarations: [
      AppComponent, 
      FullLayoutComponent, 
      ContentLayoutComponent, 
      LoginComponent,  
      AddFacturaComponent,  
      DatosGeneralesComponent, 
      RegistroComponent, 
      FacturasComponent, 
      FormDatosGeneralesComponent,
      TablePartidasComponent,
      FormDetallesComponent,
      DocumentosRelacionadosComponent,
      DatosGeneralesFacturaComponent,
      DetalleComponent,
      FormUsuarioComponent,
      FormEmpresaComponent,
      FormBuzonComponent,
      KpiComponent,
      DashboardComponent,
      GenerarCartaComponent,
      FormGenerarCartaComponent,
      TableFacturasVentaComponent,
      FilterMesPipe,
      FilterEstatusCFDIPipe,
      FilterRFCPipe,
      TableFacturasCompraComponent,
      NgDropFilesDirective,
      UploadDocRelacionadoComponent,
      CalculoCNComponent,
      FormCostoCompraComponent,
      FormDetalleCostoCompraComponent,
      FormAddProveedorComponent,
      DetalleCalculoPartidaComponent,
      ReportesComponent,
      TableReportesComponent,
      GraficasComponent,
      ViewGraficasComponent
    ],
    imports: [
      BrowserAnimationsModule,
      AppRoutingModule,
      SharedModule,
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule,
      NgbModule.forRoot(),// NgbModule.forRoot()
      PerfectScrollbarModule,
      AngularFileUploaderModule,
      AutocompleteLibModule,
      NgxPaginationModule,
      NgxDatatableModule,
      NgSelectModule
      //PdfViewerModule
    ],
    providers: [
      AuthService,
      //AuthGuard,
      { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
      { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
      { provide: LOCALE_ID, useValue: 'es-Mx' } //Para cambiar la fecha a Español-México
    ],
    entryComponents: [
      UploadDocRelacionadoComponent,
      FormCostoCompraComponent,
      FormDetalleCostoCompraComponent,
      FormAddProveedorComponent
    ],
    bootstrap: [AppComponent]
  })
  export class AppModule {}
  