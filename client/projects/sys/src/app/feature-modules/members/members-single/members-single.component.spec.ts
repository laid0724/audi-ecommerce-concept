import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersSingleComponent } from './members-single.component';

describe('MembersSingleComponent', () => {
  let component: MembersSingleComponent;
  let fixture: ComponentFixture<MembersSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MembersSingleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
