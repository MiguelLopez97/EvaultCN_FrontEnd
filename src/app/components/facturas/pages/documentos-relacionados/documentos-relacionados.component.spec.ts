import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentosRelacionadosComponent } from './documentos-relacionados.component';

describe('DocumentosRelacionadosComponent', () => {
  let component: DocumentosRelacionadosComponent;
  let fixture: ComponentFixture<DocumentosRelacionadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentosRelacionadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentosRelacionadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
