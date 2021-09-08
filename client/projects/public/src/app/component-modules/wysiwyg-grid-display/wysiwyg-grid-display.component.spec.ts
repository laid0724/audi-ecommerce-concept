import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WysiwygGridDisplayComponent } from './wysiwyg-grid-display.component';

describe('WysiwygGridDisplayComponent', () => {
  let component: WysiwygGridDisplayComponent;
  let fixture: ComponentFixture<WysiwygGridDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WysiwygGridDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WysiwygGridDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
