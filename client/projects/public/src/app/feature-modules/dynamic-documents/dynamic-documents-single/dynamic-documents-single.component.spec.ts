import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicDocumentsSingleComponent } from './dynamic-documents-single.component';

describe('DynamicDocumentsSingleComponent', () => {
  let component: DynamicDocumentsSingleComponent;
  let fixture: ComponentFixture<DynamicDocumentsSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicDocumentsSingleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicDocumentsSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
