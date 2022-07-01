import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { CFDIDocService } from '../../../../services/cfdidoc.service';
import { FileItem } from '../../../../models/file-item.model';
import { DocumentoRelacionadoModel } from '../../../../models/doc-relacionado.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload-doc-relacionado',
  templateUrl: './upload-doc-relacionado.component.html',
  styleUrls: ['./upload-doc-relacionado.component.scss']
})
export class UploadDocRelacionadoComponent implements OnInit {
  @Input() src;
  @Input() idTipoArchivo;
  @Output() getPDF: EventEmitter<boolean>

  @ViewChild('fileInput') fileInput: ElementRef; //Propiedad para el input File

  public archivoSeleccionado: FileItem[] = [];
  public estaSobreElemento: boolean = false;
  public fileCartaCN = new DocumentoRelacionadoModel();
  public nameTipoArchivo: string;

  constructor(
    private _route: ActivatedRoute,
    private _cfdiDocService: CFDIDocService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal
  ) { 
    this.getPDF = new EventEmitter();
  }

  ngOnInit() {
    this._route.params.subscribe(params => {
      //Asigna el parámetro 'idCFDI' que viene de la URL a la propiedad 'fileCartaCN.idCFDI'
      this.fileCartaCN.idCFDI = params['id'];
    });

    if (this.idTipoArchivo == 1)
    {
      this.nameTipoArchivo = 'carta de Contenido Nacional';
    }
    else
    {
      this.nameTipoArchivo = 'carta de Arancel';
    }
  }

  onChangeFile(event)
  {
    const archivoExtraidoDeInput = this.fileInput.nativeElement.files[0];
    if (this._archivoPuedeSerCargado(archivoExtraidoDeInput))
    {
      const archivoParaCargar = new FileItem(archivoExtraidoDeInput);

      if (this.archivoSeleccionado.length == 0)
      {
        this.archivoSeleccionado.push(archivoParaCargar);
      }
      else
      {
        this.archivoSeleccionado[0] = archivoParaCargar;
      }
    }
  }

  saveDocumentoRelacionado()
  {
    let file;

    //Constante de tipo FileReader para leer la información de los archivos seleccionados
    const reader = new FileReader();

    //Separa el nombre del archivo y la extensión y los almacena en un arreglo
    const split = this.archivoSeleccionado[0].archivo.name.split('.');

    //Obtiene la extensión de un archivo de la constante 'split'
    const ext = split[split.length - 1];

    //Obtiene el nombre de un archivo sin la extensión
    const simpleName = this.archivoSeleccionado[0].archivo.name.substr(0, this.archivoSeleccionado[0].archivo.name.length - (ext.length + 1));

    //Se iguala la variable 'file' al archivo que se haya seleccionado desde el componente
    file = this.archivoSeleccionado[0].archivo;

    //Lee la información de la variable 'file'
    reader.readAsDataURL(file);

    reader.onload = () => {
      //Asigna los valores a enviar a la API
      this.fileCartaCN.idTipoArchivo = this.idTipoArchivo; //Asigna el idTipoArchivo que viene como parámetro cuando se da clic en Abrir Modal
      this.fileCartaCN.fileContentBase64 = reader.result.toString().split(',')[1];
      this.fileCartaCN.fileName = simpleName;
      this.fileCartaCN.fileExt = ext;

      Swal.fire({
        allowOutsideClick: false,
        icon:'info',
        title: 'Espere',
        text: 'Guardando archivo'
      });
      Swal.showLoading();

      this._cfdiDocService.uploadDocRelacionado(this.fileCartaCN).subscribe(
        response => {
          //console.log(response);
          if (response.success == true)
          {
            this.modalService.dismissAll();
            this.getPDF.emit(true);
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
              title: 'Error al guardar el archivo',
              text: 'Intente más tarde',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#A0C334',
            });
          }
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'Error al guardar el archivo',
            text: 'Intente más tarde',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#A0C334',
          });
        }
      );      
    };  
  }

  //Validaciones para el input File
  private _archivoPuedeSerCargado(archivo: File): boolean
  {
    if(!this._archivoYaFueSeleccionado(archivo.name) && this._esPDF(archivo.type))
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  private _archivoYaFueSeleccionado(nombreArchivo: string): boolean
  {
    for(const archivo of this.archivoSeleccionado)
    {
      if(archivo.nombreArchivo == nombreArchivo)
      {
        //console.log('El archivo ' + nombreArchivo + ' ya está agregado');
        return true;
      }
    }
    return false;
  }

  private _esPDF(tipoArchivo: string): boolean
  {
    return (tipoArchivo == '' || tipoArchivo == undefined) ? false : tipoArchivo.startsWith('application/pdf');
  }

}
