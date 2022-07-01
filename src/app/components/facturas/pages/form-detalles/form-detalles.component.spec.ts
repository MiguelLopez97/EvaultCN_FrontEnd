import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDetallesComponent } from './form-detalles.component';

describe('FormDetallesComponent', () => {
  let component: FormDetallesComponent;
  let fixture: ComponentFixture<FormDetallesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDetallesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDetallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
