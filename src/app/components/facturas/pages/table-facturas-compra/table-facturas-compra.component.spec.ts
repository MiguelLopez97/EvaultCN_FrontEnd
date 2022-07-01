import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableFacturasCompraComponent } from './table-facturas-compra.component';

describe('TableFacturasCompraComponent', () => {
  let component: TableFacturasCompraComponent;
  let fixture: ComponentFixture<TableFacturasCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableFacturasCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableFacturasCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
