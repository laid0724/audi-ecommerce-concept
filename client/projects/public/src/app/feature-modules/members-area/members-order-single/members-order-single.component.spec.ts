import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersOrderSingleComponent } from './members-order-single.component';

describe('MembersOrderSingleComponent', () => {
  let component: MembersOrderSingleComponent;
  let fixture: ComponentFixture<MembersOrderSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MembersOrderSingleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersOrderSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
