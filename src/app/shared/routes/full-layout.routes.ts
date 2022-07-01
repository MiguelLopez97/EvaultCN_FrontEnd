import { Routes, RouterModule } from '@angular/router';
import { AddFacturaComponent } from 'app/components/add-factura/add-factura.component';
import { DatosGeneralesComponent } from 'app/components/datos-generales/datos-generales.component';
import { FacturasComponent } from 'app/components/facturas/facturas.component';
import { DatosGeneralesFacturaComponent } from 'app/components/facturas/datos-generales-factura/datos-generales-factura.component';
import { DetalleComponent } from 'app/components/facturas/detalle/detalle.component';
import { TablePartidasComponent } from 'app/components/facturas/pages/table-partidas/table-partidas.component';
import { FormDatosGeneralesComponent } from 'app/components/facturas/pages/form-datos-generales/form-datos-generales.component';
import { DashboardComponent } from 'app/components/dashboard/dashboard.component';
import { GenerarCartaComponent } from 'app/components/generar-carta/generar-carta.component';
import { DocumentosRelacionadosComponent } from 'app/components/facturas/pages/documentos-relacionados/documentos-relacionados.component';
import { CalculoCNComponent } from 'app/components/facturas/pages/calculo-cn/calculo-cn.component';
import { DetalleCalculoPartidaComponent } from 'app/components/facturas/pages/detalle-calculo-partida/detalle-calculo-partida.component';
import { FormDetallesComponent } from 'app/components/facturas/pages/form-detalles/form-detalles.component';
import { ReportesComponent } from 'app/components/reportes/reportes.component';
import { GraficasComponent } from 'app/components/graficas/graficas.component';

//Route for content layout with sidebar, navbar and footer
export const Full_ROUTES: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'agregar-factura', component: AddFacturaComponent },
  { path: 'datos-generales', component: DatosGeneralesComponent },
  { path: 'facturas', component: FacturasComponent },
  { path: 'facturas/:id', component: DatosGeneralesFacturaComponent,
    children: [
      { path: 'datos-generales/:id', component: FormDatosGeneralesComponent },
      { path: 'partidas/:id', component: TablePartidasComponent },
      { path: 'documentos-relacionados/:id', component: DocumentosRelacionadosComponent },
      { path: 'calculo-cn/:idCFDI', component: CalculoCNComponent }
    ]
  },
  { path: 'facturas/:id/partidas/:id/detalle/:idDetalle', component: DetalleComponent, children: [
      { path: 'partida/:id/:idDetalle', component: FormDetallesComponent },
      { path: 'calculo/:id/:idDetalle', component: DetalleCalculoPartidaComponent },
    ]
  },
  { path: 'generar-carta', component: GenerarCartaComponent },
  { path: 'reportes', component: ReportesComponent },
  { path: 'graficas', component: GraficasComponent },
];