import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressFgComponent } from './address-fg.component';

describe('AddressFgComponent', () => {
  let component: AddressFgComponent;
  let fixture: ComponentFixture<AddressFgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddressFgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressFgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
