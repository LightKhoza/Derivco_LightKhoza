import { Component, OnInit } from '@angular/core';
import { Booking } from '../../core/services/booking';

@Component({
  selector: 'app-provider-bookings',
  standalone: false,
  templateUrl: './provider-bookings.html',
  styleUrl: './provider-bookings.scss',
})
export class ProviderBookings implements OnInit {
   bookings: any[] = [];
  loading = true;

  constructor(private bookingService: Booking) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings() {
    this.bookingService.myBookings().subscribe({
      next: (data: any) => {
        this.bookings = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  updateStatus(id: number, status: string) {
  const booking = this.bookings.find(b => b.id === id);
  if (booking) booking.status = status;

  this.bookingService.updateStatus(id, status).subscribe({
    error: (err) => {
      console.error(err);
      this.loadBookings();
    }
  });
}
}
