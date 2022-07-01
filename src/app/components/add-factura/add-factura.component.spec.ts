import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFacturaComponent } from './add-factura.component';

describe('AddFacturaComponent', () => {
  let component: AddFacturaComponent;
  let fixture: ComponentFixture<AddFacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFacturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
