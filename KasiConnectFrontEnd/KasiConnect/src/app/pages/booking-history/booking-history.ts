import { Component, OnInit } from '@angular/core';
import { Booking } from '../../core/services/booking';


@Component({
  selector: 'app-booking-history',
  standalone: false,
  templateUrl: './booking-history.html',
  styleUrl: './booking-history.scss',
})
export class BookingHistory implements OnInit{
  history: any[] = [];
  loading = true;

  constructor(private bookingService: Booking) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory() {
    this.bookingService.getBookingHistory().subscribe({
      next: (data: any) => {
        this.history = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
}
