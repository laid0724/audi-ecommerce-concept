import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardExpirationDateInputComponent } from './card-expiration-date-input.component';

describe('CardExpirationDateInputComponent', () => {
  let component: CardExpirationDateInputComponent;
  let fixture: ComponentFixture<CardExpirationDateInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardExpirationDateInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardExpirationDateInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
