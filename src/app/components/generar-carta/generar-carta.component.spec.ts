import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarCartaComponent } from './generar-carta.component';

describe('GenerarCartaComponent', () => {
  let component: GenerarCartaComponent;
  let fixture: ComponentFixture<GenerarCartaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerarCartaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarCartaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
