import { Component, OnInit } from '@angular/core';
import { Appsettings } from '../../services/appsettings';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-factura',
  templateUrl: './add-factura.component.html',
  styleUrls: ['./add-factura.component.scss']
})
export class AddFacturaComponent implements OnInit {

  public tipoFactura = 'facturaVenta';

  afuConfig = {
    multiple: false,
    formatsAllowed: ".xml",
    maxSize: "10",
    uploadAPI:  {
      url: Appsettings.API_ENDPOINT_FULL + '/doc/uploadCFDI',
      headers: {
        "Authorization": 'Bearer ' + localStorage.getItem('token')
      },
    },
    theme: "dragNDrop",
    hideProgressBar: true,
    hideResetBtn: true,
    hideSelectBtn: false,
    replaceTexts: {
      selectFileBtn: 'Seleccionar archivo',
      resetBtn: 'Reset',
      uploadBtn: 'Cargar facturas',
      dragNDropBox: 'Arrastra tus archivos XML aquí (facturas de venta)',
      attachPinBtn: 'Attach Files...',
      afterUploadMsg_success: ' ',
      afterUploadMsg_error: ' '
    }
  };

  afuConfig2 = {
    multiple: false,
    formatsAllowed: ".xml",
    maxSize: "10",
    uploadAPI:  {
      url: Appsettings.API_ENDPOINT_FULL + '/doc/uploadCFDI/Compra',
      headers: {
        "Authorization": 'Bearer ' + localStorage.getItem('token')
      },
    },
    theme: "dragNDrop",
    hideProgressBar: true,
    hideResetBtn: true,
    hideSelectBtn: false,
    replaceTexts: {
      selectFileBtn: 'Seleccionar archivo',
      resetBtn: 'Reset',
      uploadBtn: 'Cargar facturas',
      dragNDropBox: 'Arrastra tus archivos XML aquí (facturas de compra)',
      attachPinBtn: 'Attach Files...',
      afterUploadMsg_success: ' ',
      afterUploadMsg_error: ' '
    }
  };

  constructor() { }

  ngOnInit() {    
  }

  facturaVentaUpload(data)
  {
    let response = data;
    //console.log(response);
    
    if (response.status == 200) {
      Swal.fire({
        icon: 'success',
        title: 'Archivo cargado correctamente',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#A0C334',
      });
    }
    else
    {
      Swal.fire({
        icon: 'error',
        title: 'Carga fallida',
        text: response.responseText,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#A0C334',
      });
    }
  }

  facturaCompraUpload(data)
  {
    let response = data;
    //console.log(response);
    if (response.status == 200) {
      Swal.fire({
        icon: 'success',
        title: 'Archivo cargado correctamente',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#A0C334',
      });
    }
    else
    {
      Swal.fire({
        icon: 'error',
        title: 'Carga fallida',
        text: response.responseText,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#A0C334',
      });
    }
  }
}
