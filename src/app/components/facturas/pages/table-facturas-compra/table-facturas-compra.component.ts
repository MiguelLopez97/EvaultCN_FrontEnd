import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import { AuthService } from '../../../../services/auth.service';
import { CriptoService } from '../../../../services/cripto.service';
import { CFDIDocService } from '../../../../services/cfdidoc.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-table-facturas-compra',
  templateUrl: './table-facturas-compra.component.html',
  styleUrls: ['./table-facturas-compra.component.scss'],
  providers: [CFDIDocService]
})
export class TableFacturasCompraComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;

  //Propiedad para la paginación de las tablas
  public pageActual: number = 1;

  //Propiedades para filtrar los datos de la tabla
  public filterRFC = ''; 
  public filterEstatus = '';

  //Propiedades para Datatable
  public rows = [];
  public temp = [];

  public loading: boolean = true;

  public opcionesFiltro: any[] = [
    {opcion: 'todas', nombreOpcion: 'Todas las facturas'},
    {opcion: 'revisarArancel', nombreOpcion: 'Sólo las facturas que tengan Fracción Arancelaria'},
    {opcion: 'revisarCN', nombreOpcion: 'Sólo las facturas que declaren Contenido Nacional como 100%'},
    {opcion: 'estatusporRevisar', nombreOpcion: "Estatus 'Por Revisar'"},
    {opcion: 'estatusRevisado', nombreOpcion: "Estatus 'Revisado'"}
  ];

  public estatusCFDI: any[] = [
    {idEstatusCFDI: '', EstatusCFDI: 'Filtrar por estatus'},
    {idEstatusCFDI: 'Por Revisar', EstatusCFDI: 'Por Revisar'},
    {idEstatusCFDI: 'Revisado', EstatusCFDI: 'Revisado'}
  ];

  public filtrarFraccion: any[] = [
    {idOpcion: '', opcion: 'Filtrar por Fracción Arancelaria'},
    {idOpcion: 'filtrar', opcion: 'Filtrar sólo las facturas que tengan Fracción Arancelaria'},
    {idOpcion: 'noFiltrar', opcion: 'Filtrar todas las facturas'},
  ];

  public filtrarContenidoNacional: any[] = [
    {idOpcion: '', opcion: 'Filtrar por Contenido Nacional'},
    {idOpcion: 'filtrar', opcion: 'Sólo las facturas que declaren Contenido Nacional como 100%'},
    {idOpcion: 'noFiltrar', opcion: 'Todas las facturas'},
  ];

  public facturasAll: any[] = [];

  public idEmpresaDesencriptado: string;

  constructor(
    private _authService: AuthService,
    private _cfdiDocService: CFDIDocService,
    private _cripto: CriptoService,
    private _router: Router
  ) { 
    this.idEmpresaDesencriptado = this._cripto.decrypt(localStorage.getItem('idEmpresa'));
  }

  ngOnInit() {
    this.getFacturasAllCompra();
  }

  filtrarPor(event)
  {
    const val = event.target.value.toLowerCase();

    // Filtrado de datos
    const temp = this.temp.filter(function (d) {

      if (val == 'revisarcn')
      {
        return d.revisar100 == true;
      }
      else if (val == 'revisararancel')
      {
        return d.revisarArancel == true;
      }
      else if (val == 'estatusrevisado')
      {
        return d.estatusCFDI == 'Revisado';
      }
      else if (val == 'estatusporrevisar')
      {
        return d.estatusCFDI == 'Por Revisar';
      }
    });

    // Actualiza las filas
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  filtrarPorRFC(event)
  {
    const val = event.target.value.toLowerCase();

    // Filtrado de datos
    const temp = this.temp.filter(function (d) {
      if (d.rfcProveedor.toLowerCase().indexOf(val) !== -1 || !val) {
        return d.rfcProveedor.toLowerCase().indexOf(val) !== -1 || !val;
      }
    });

    // Actualiza las filas
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  filtrarPorEstatus(event)
  {
    const val = event.target.value.toLowerCase();

    // Filtrado de datos
    const temp = this.temp.filter(function (d) {
      if (d.estatusCFDI.toLowerCase().indexOf(val) !== -1 || !val) {
        return d.estatusCFDI.toLowerCase().indexOf(val) !== -1 || !val;
      }
    });

    // Actualiza las filas
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  filtrarPorFraccionArancelaria(event)
  {
    const valueFiltrar = event.target.value;

    // Filtrado de datos
    const temp = this.temp.filter(function (d) {
      if (valueFiltrar == 'filtrar')
      {
        return d.fraccionArancelaria > 0;
      }
      else
      {
        return d;
      }
    });

    // Actualiza las filas
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  filtrarPorContenidoNacional(event)
  {
    const valueFiltrar = event.target.value;

    // Filtrado de datos
    const temp = this.temp.filter(function (d) {
      if (valueFiltrar == 'filtrar')
      {
        return d.revisar100 == true;
      }
      else
      {
        return d;
      }
    });

    // Actualiza las filas
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  //Aquí en el parametro que espera es el de idEmpresa
  getFacturasAllCompra()
  {
    this._cfdiDocService.getFacturasAllCompras(this.idEmpresaDesencriptado).subscribe(
      response => {
        //console.log(response);
        this.facturasAll = response.data;
        this.rows = this.facturasAll;
        this.temp = this.facturasAll;
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
  }

  updateEstatusCFDI(idDoc, idEstatusCFDI)
  {
    Swal.fire({
      allowOutsideClick: false,
      icon:'info',
      title: 'Actualizando estatus'
    });
    Swal.showLoading(); 
    
    this._cfdiDocService.updateEstatusCFDIDoc(idDoc, idEstatusCFDI).subscribe(
      response => {
        //console.log(response);
        Swal.fire({
          icon: 'success',
          title: 'Estatus actualizado',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#A0C334',
        });       
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#A0C334',
        });
      },
    );
  }

  deleteCFDIDoc(idCFDIDoc)
  {
    Swal.fire({
      title: '¿Está seguro de eliminar este registro?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#A0C334',
      cancelButtonColor: '#5D5D5D',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: 'Espere',
          text: 'Eliminando información',
        });
        Swal.showLoading();

        this._cfdiDocService.deleteCFDIDoc(idCFDIDoc).subscribe(
          response => {
            if (response.success == true)
            {
              this.getFacturasAllCompra();
              Swal.fire({
                icon: 'success',
                title: 'Datos eliminados correctamente',
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
