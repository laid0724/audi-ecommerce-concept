import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersLikedProductComponent } from './members-liked-product.component';

describe('MembersLikedProductComponent', () => {
  let component: MembersLikedProductComponent;
  let fixture: ComponentFixture<MembersLikedProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MembersLikedProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersLikedProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
