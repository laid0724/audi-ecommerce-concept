import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlValidComponent } from './control-valid.component';

describe('ControlValidComponent', () => {
  let component: ControlValidComponent;
  let fixture: ComponentFixture<ControlValidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlValidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlValidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
