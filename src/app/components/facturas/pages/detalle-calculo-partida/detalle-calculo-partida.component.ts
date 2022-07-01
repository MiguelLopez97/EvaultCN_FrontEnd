import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap'; //Importaciones para el modal

import { CFDIDocService } from '../../../../services/cfdidoc.service';
import { CalculoContenidoNacionalModel } from '../../../../models/calculo-cn.model';

@Component({
  selector: 'app-detalle-calculo-partida',
  templateUrl: './detalle-calculo-partida.component.html',
  styleUrls: ['./detalle-calculo-partida.component.scss'],
  providers: [NgbModal, NgbActiveModal]
})
export class DetalleCalculoPartidaComponent implements OnInit {

  public calculoCN: CalculoContenidoNacionalModel[] = [];
  public loading: boolean = true;

  constructor(
    private _route: ActivatedRoute,
    private _cfdiDocService: CFDIDocService,
    private modalService: NgbModal, //Modal
    public activeModal: NgbActiveModal //Modal
  ) { }

  ngOnInit() {
    this.getCalculoPartida();
  }

   //Método para abrir el modal
  openModalDetalles(content)
  {
    this.modalService.open(content);
  }

  getCalculoPartida()
  {
    this._route.params.subscribe(params => {
      let idCFDIDoc = params.id;
      let idPartida = params.idDetalle;

      this._cfdiDocService.getCalculoPartida(idCFDIDoc, idPartida).subscribe(
        response => {
          this.calculoCN = response.data;
          this.loading = false;
        },
        error => { }
      );
    });
    
  }

}
