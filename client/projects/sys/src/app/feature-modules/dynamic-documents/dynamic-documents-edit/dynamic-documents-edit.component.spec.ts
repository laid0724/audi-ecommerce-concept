import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicDocumentsEditComponent } from './dynamic-documents-edit.component';

describe('DynamicDocumentsEditComponent', () => {
  let component: DynamicDocumentsEditComponent;
  let fixture: ComponentFixture<DynamicDocumentsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicDocumentsEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicDocumentsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
