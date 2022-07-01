import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDetalleCostoCompraComponent } from './form-detalle-costo-compra.component';

describe('FormDetalleCostoCompraComponent', () => {
  let component: FormDetalleCostoCompraComponent;
  let fixture: ComponentFixture<FormDetalleCostoCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDetalleCostoCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDetalleCostoCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
