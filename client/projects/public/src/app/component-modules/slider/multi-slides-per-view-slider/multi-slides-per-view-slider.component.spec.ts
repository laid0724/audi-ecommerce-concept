import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSlidesPerViewSliderComponent } from './multi-slides-per-view-slider.component';

describe('MultiSlidesPerViewSliderComponent', () => {
  let component: MultiSlidesPerViewSliderComponent;
  let fixture: ComponentFixture<MultiSlidesPerViewSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiSlidesPerViewSliderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSlidesPerViewSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
