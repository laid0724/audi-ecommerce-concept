import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicDocumentsListComponent } from './dynamic-documents-list.component';

describe('DynamicDocumentsListComponent', () => {
  let component: DynamicDocumentsListComponent;
  let fixture: ComponentFixture<DynamicDocumentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicDocumentsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicDocumentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
