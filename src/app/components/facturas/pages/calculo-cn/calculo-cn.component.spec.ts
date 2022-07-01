import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculoCNComponent } from './calculo-cn.component';

describe('CalculoCNComponent', () => {
  let component: CalculoCNComponent;
  let fixture: ComponentFixture<CalculoCNComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculoCNComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculoCNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
