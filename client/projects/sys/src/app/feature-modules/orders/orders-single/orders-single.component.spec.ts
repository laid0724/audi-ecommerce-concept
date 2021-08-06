import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersSingleComponent } from './orders-single.component';

describe('OrdersSingleComponent', () => {
  let component: OrdersSingleComponent;
  let fixture: ComponentFixture<OrdersSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersSingleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
