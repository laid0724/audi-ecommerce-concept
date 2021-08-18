import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlGridComponent } from './control-grid.component';

describe('ControlGridComponent', () => {
  let component: ControlGridComponent;
  let fixture: ComponentFixture<ControlGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
