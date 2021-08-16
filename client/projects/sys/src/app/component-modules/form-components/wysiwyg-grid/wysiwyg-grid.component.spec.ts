import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WysiwygGridComponent } from './wysiwyg-grid.component';

describe('WysiwygGridComponent', () => {
  let component: WysiwygGridComponent;
  let fixture: ComponentFixture<WysiwygGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WysiwygGridComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WysiwygGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
