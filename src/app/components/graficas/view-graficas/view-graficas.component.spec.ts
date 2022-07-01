import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGraficasComponent } from './view-graficas.component';

describe('ViewGraficasComponent', () => {
  let component: ViewGraficasComponent;
  let fixture: ComponentFixture<ViewGraficasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewGraficasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGraficasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
