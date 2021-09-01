import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersAreaContainerComponent } from './members-area-container.component';

describe('MembersAreaContainerComponent', () => {
  let component: MembersAreaContainerComponent;
  let fixture: ComponentFixture<MembersAreaContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MembersAreaContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersAreaContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
