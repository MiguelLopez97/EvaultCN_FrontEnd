import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CriptoService } from '../../../../services/cripto.service';
import { EmpresaService } from '../../../../services/empresa.service';
import { EmpresaModel } from '../../../../models/empresa-model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-add-proveedor',
  templateUrl: './form-add-proveedor.component.html',
  styleUrls: ['./form-add-proveedor.component.scss']
})
export class FormAddProveedorComponent implements OnInit {

  //Propiead Output para emitir un 'true' cuando los datos del Proveedor se guarden correctamente
  @Output() resultResponseCreateProveedor: EventEmitter<boolean> = new EventEmitter();

  public proveedorForm: FormGroup;
  public proveedor = new EmpresaModel();
  public idEmpresaDesencriptado: number;

  constructor(
    private _formBuilder: FormBuilder,
    private _cripto: CriptoService,
    private _empresaService: EmpresaService,
    private modalService: NgbModal, //Modal
    public activeModal: NgbActiveModal //Modal
  ) { 
    this.buildForm();
    this.idEmpresaDesencriptado = this._cripto.decrypt(localStorage.getItem('idEmpresa'));
  }

  ngOnInit() {
  }

  get razonSocialNoValido() {
    return this.proveedorForm.get('razonSocial').invalid && this.proveedorForm.get('razonSocial').touched;
  }

  get rfcNoValido() {
    return this.proveedorForm.get('rfc').invalid && this.proveedorForm.get('rfc').touched;
  }

  buildForm()
  {
    //Formulario para agregar un nuevo Proveedor
    this.proveedorForm = this._formBuilder.group({
      razonSocial: ['', Validators.required],
      rfc: ['', Validators.required]
    });
  }

  saveProveedor()
  {
    //Asigna los valores a enviar a la API
    this.proveedor.idEmpresa = this.idEmpresaDesencriptado;
    this.proveedor.razonSocial = this.proveedorForm.get('razonSocial').value.toUpperCase();
    this.proveedor.rfc = this.proveedorForm.get('rfc').value.toUpperCase();

    if (this.proveedorForm.invalid) {
      Object.values( this.proveedorForm.controls ).forEach( control => {
        control.markAsTouched();
      });
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      icon:'info',
      title: 'Espere',
      text: 'Guardando información'
    });
    Swal.showLoading();

    this._empresaService.createProveedorEmpresa(this.proveedor).subscribe(
      response => {
        //console.log(response);
        this.activeModal.close();
        this.resultResponseCreateProveedor.emit(true);
        Swal.fire({
          icon: 'success',
          title: 'Datos guardados correctamente',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#A0C334',
        });
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al guardar los datos',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#A0C334',
        });
      }
    );
  }
}
