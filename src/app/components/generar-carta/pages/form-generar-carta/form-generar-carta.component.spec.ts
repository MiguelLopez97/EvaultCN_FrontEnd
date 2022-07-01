import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGenerarCartaComponent } from './form-generar-carta.component';

describe('FormGenerarCartaComponent', () => {
  let component: FormGenerarCartaComponent;
  let fixture: ComponentFixture<FormGenerarCartaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormGenerarCartaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormGenerarCartaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
