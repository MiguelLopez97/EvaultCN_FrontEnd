import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-buzon',
  templateUrl: './form-buzon.component.html',
  styleUrls: ['./form-buzon.component.scss']
})
export class FormBuzonComponent implements OnInit {

  constructor(
    private _router: Router
  ) { }

  ngOnInit() {
  }

  guardarBuzon()
  {
    Swal.fire({
      icon: 'success',
      title: 'Datos guardados correctamente',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#A0C334',
    });
    this._router.navigate(['/dashboard']);
  }

}
