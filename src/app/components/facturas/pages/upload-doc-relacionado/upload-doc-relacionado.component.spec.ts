import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDocRelacionadoComponent } from './upload-doc-relacionado.component';

describe('UploadDocRelacionadoComponent', () => {
  let component: UploadDocRelacionadoComponent;
  let fixture: ComponentFixture<UploadDocRelacionadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadDocRelacionadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDocRelacionadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
