import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlDescriptionComponent } from './control-description.component';

describe('ControlDescriptionComponent', () => {
  let component: ControlDescriptionComponent;
  let fixture: ComponentFixture<ControlDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlDescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
