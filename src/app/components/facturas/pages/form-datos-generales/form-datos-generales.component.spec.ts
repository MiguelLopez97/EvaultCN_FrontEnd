import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDatosGeneralesComponent } from './form-datos-generales.component';

describe('FormDatosGeneralesComponent', () => {
  let component: FormDatosGeneralesComponent;
  let fixture: ComponentFixture<FormDatosGeneralesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDatosGeneralesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDatosGeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
