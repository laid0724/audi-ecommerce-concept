import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersPersonalInfoComponent } from './members-personal-info.component';

describe('MembersPersonalInfoComponent', () => {
  let component: MembersPersonalInfoComponent;
  let fixture: ComponentFixture<MembersPersonalInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MembersPersonalInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersPersonalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
