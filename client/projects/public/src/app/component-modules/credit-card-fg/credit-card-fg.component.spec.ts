import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardFgComponent } from './credit-card-fg.component';

describe('CreditCardFgComponent', () => {
  let component: CreditCardFgComponent;
  let fixture: ComponentFixture<CreditCardFgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditCardFgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditCardFgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
