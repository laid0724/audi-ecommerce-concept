import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconWithBadgeComponent } from './icon-with-badge.component';

describe('IconWithBadgeComponent', () => {
  let component: IconWithBadgeComponent;
  let fixture: ComponentFixture<IconWithBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IconWithBadgeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IconWithBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
