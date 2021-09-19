import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicDocumentsCardComponent } from './dynamic-documents-card.component';

describe('DynamicDocumentsCardComponent', () => {
  let component: DynamicDocumentsCardComponent;
  let fixture: ComponentFixture<DynamicDocumentsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicDocumentsCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicDocumentsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
