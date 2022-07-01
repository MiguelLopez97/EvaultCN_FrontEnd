import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap'; //Importaciones para el modal
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-datos-generales-factura',
  templateUrl: './datos-generales-factura.component.html',
  styleUrls: ['./datos-generales-factura.component.scss'],
  providers: [NgbModal, NgbActiveModal]
})
export class DatosGeneralesFacturaComponent implements OnInit {

  public idCFDIDoc;

  //Rutas para los Tabsets (Datos generales, Partidas y Documentos relacionados)
  public routes = [
    { title: 'Datos Generales', url: 'datos-generales', icon: 'far fa-file-alt' },
    { title: 'Partidas', url: 'partidas', icon: 'fas fa-layer-group' },
    { title: 'Documentos Relacionados', url: 'documentos-relacionados', icon: 'far fa-file-pdf' },
    { title: 'Cálculo de Contenido Nacional', url: 'calculo-cn', icon: 'fas fa-calculator' }
  ];

  constructor(
    private _route: ActivatedRoute,
    private modalService: NgbModal, //Modal
    public activeModal: NgbActiveModal //Modal
  ) { }

  ngOnInit() { 
    this._route.params.subscribe(params => {
      this.idCFDIDoc = params['id'];
    });
  }

  //Método para abrir el modal
  open(content) {
    this.modalService.open(content);
  }

  sendSolicitudConsultoria()
  {
    Swal.fire({
      icon: 'success',
      title: 'Solicitud de consultoría enviada',
      text: 'Su solicitud se atenderá tan pronto como sea posible',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#A0C334',
    });
    this.modalService.dismissAll();  
  }

}
