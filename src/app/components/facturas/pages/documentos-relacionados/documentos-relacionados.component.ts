import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../../../../services/auth.service';
import { CFDIDocService } from '../../../../services/cfdidoc.service';
import { DocumentoRelacionadoModel } from '../../../../models/doc-relacionado.model';

@Component({
  selector: 'app-documentos-relacionados',
  templateUrl: './documentos-relacionados.component.html',
  styleUrls: ['./documentos-relacionados.component.scss'],
  providers: [NgbModal]
})
export class DocumentosRelacionadosComponent implements OnInit {

  public documentosPartida: DocumentoRelacionadoModel[] = [];
  public loadingPDF: boolean = true;
  public loading: boolean = true;

  constructor(
    private _route: ActivatedRoute,
    private modalService: NgbModal,
    private _authService: AuthService,
    private _cfdiDocService: CFDIDocService
  ) { }

  ngOnInit() {
    this.getDocumentosRelacionados();
  }

  //Abre el modal para visualizar el archivo PDF
  openModal(content) {
    this.modalService.open(content, {size: 'lg'});
  }

  getDocumentosRelacionados()
  {
    this._route.params.subscribe(params => {
      //Asigna el parámetro 'idCFDI' que viene de la URL a la propiedad 'fileCartaCN.idCFDI'
      let idCFDI = params['id'];

      this._cfdiDocService.getDocumentosRelacionadosCFDI(idCFDI).subscribe(
        response => {
          //console.log(response);
          this.documentosPartida = response.data;
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
    });
  }

  loadingFilePDF(event)
  {
    this.loadingPDF = false;
  }

}
