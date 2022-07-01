import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosGeneralesFacturaComponent } from './datos-generales-factura.component';

describe('DatosGeneralesFacturaComponent', () => {
  let component: DatosGeneralesFacturaComponent;
  let fixture: ComponentFixture<DatosGeneralesFacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosGeneralesFacturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosGeneralesFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
