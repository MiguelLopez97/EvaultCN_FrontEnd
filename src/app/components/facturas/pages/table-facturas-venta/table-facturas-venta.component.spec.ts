import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableFacturasVentaComponent } from './table-facturas-venta.component';

describe('TableFacturasVentaComponent', () => {
  let component: TableFacturasVentaComponent;
  let fixture: ComponentFixture<TableFacturasVentaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableFacturasVentaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableFacturasVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
