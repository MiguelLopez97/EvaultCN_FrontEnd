import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CFDIDocService } from '../../../../services/cfdidoc.service';
import { CFDIDocModel } from '../../../../models/cfdidoc-model';
import { CalculoContenidoNacionalModel } from '../../../../models/calculo-cn.model';

@Component({
  selector: 'app-calculo-cn',
  templateUrl: './calculo-cn.component.html',
  styleUrls: ['./calculo-cn.component.scss']
})
export class CalculoCNComponent implements OnInit {

  public calculoCN: CalculoContenidoNacionalModel[] = [];
  public loading: boolean = true;

  public CFDIDoc = new CFDIDocModel();

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _cfdiDocService: CFDIDocService
  ) { }

  ngOnInit() {
    this.getCalculo();
    this.getCFDIDoc();
  }

  getCalculo()
  {
    this._route.params.subscribe(params => {
      let idDoc = params['idCFDI'];

      this._cfdiDocService.getCalculo(idDoc).subscribe(
        response => {
          this.calculoCN = response.data;
        },
        error => { }
      );
    });
  }

  getCFDIDoc()
  {
    this._route.params.subscribe(params => {
      let idCFDIDoc = params['idCFDI'];

      this._cfdiDocService.getFactura(idCFDIDoc).subscribe(
        response => {
          //console.log(response);
          this.CFDIDoc = response.data;
          this.loading = false;
        },
        error => { 
          this.loading = false;
        }
      );
      
    });
  }

}
