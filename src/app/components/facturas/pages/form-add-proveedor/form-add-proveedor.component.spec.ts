import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddProveedorComponent } from './form-add-proveedor.component';

describe('FormAddProveedorComponent', () => {
  let component: FormAddProveedorComponent;
  let fixture: ComponentFixture<FormAddProveedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormAddProveedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAddProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
