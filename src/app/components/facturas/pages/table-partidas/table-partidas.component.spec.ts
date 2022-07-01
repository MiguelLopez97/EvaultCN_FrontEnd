import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablePartidasComponent } from './table-partidas.component';

describe('TablePartidasComponent', () => {
  let component: TablePartidasComponent;
  let fixture: ComponentFixture<TablePartidasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablePartidasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablePartidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
