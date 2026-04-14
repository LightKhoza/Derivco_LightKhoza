import { Component, OnInit } from '@angular/core';
import { Booking } from '../../core/services/booking';

@Component({
  selector: 'app-bookings',
  standalone: false,
  templateUrl: './bookings.html',
  styleUrl: './bookings.scss',
})
export class Bookings implements OnInit {
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
        console.error('ERROR LOADING BOOKINGS:', err);
        this.loading = false;
      }
    });
  }

  countStatus(status: string) {
    return this.bookings.filter(b =>
      (b.status || '').toLowerCase() === status.toLowerCase()
    ).length;
  }
}
