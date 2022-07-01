import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleCalculoPartidaComponent } from './detalle-calculo-partida.component';

describe('DetalleCalculoPartidaComponent', () => {
  let component: DetalleCalculoPartidaComponent;
  let fixture: ComponentFixture<DetalleCalculoPartidaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleCalculoPartidaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleCalculoPartidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
