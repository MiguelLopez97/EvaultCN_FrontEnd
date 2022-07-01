import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBuzonComponent } from './form-buzon.component';

describe('FormBuzonComponent', () => {
  let component: FormBuzonComponent;
  let fixture: ComponentFixture<FormBuzonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormBuzonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormBuzonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
