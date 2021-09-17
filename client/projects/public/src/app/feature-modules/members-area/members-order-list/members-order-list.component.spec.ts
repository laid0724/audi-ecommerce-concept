import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersOrderListComponent } from './members-order-list.component';

describe('MembersOrderListComponent', () => {
  let component: MembersOrderListComponent;
  let fixture: ComponentFixture<MembersOrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MembersOrderListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
