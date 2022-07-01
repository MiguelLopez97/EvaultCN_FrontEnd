import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCostoCompraComponent } from './form-costo-compra.component';

describe('FormCostoCompraComponent', () => {
  let component: FormCostoCompraComponent;
  let fixture: ComponentFixture<FormCostoCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCostoCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCostoCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
