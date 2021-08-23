import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertContainerGlobalComponent } from './alert-container-global.component';

describe('AlertContainerGlobalComponent', () => {
  let component: AlertContainerGlobalComponent;
  let fixture: ComponentFixture<AlertContainerGlobalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertContainerGlobalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertContainerGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
