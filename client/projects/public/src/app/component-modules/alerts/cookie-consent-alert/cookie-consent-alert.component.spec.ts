import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieConsentAlertComponent } from './cookie-consent-alert.component';

describe('CookieConsentAlertComponent', () => {
  let component: CookieConsentAlertComponent;
  let fixture: ComponentFixture<CookieConsentAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CookieConsentAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CookieConsentAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
