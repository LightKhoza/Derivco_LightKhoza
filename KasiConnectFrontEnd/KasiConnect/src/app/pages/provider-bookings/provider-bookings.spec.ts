import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderBookings } from './provider-bookings';

describe('ProviderBookings', () => {
  let component: ProviderBookings;
  let fixture: ComponentFixture<ProviderBookings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProviderBookings],
    }).compileComponents();

    fixture = TestBed.createComponent(ProviderBookings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
