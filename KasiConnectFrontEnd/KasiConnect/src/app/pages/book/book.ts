import { Component } from '@angular/core';
import { Booking } from '../../core/services/booking';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book',
  standalone: false,
  templateUrl: './book.html',
  styleUrl: './book.scss',
})
export class Book {
  provider: any;
  serviceId = 1;
  dateTime = '';
  address = '';

  constructor(
    private bookingService: Booking,
    private router: Router
  ) {
    const nav = this.router.getCurrentNavigation();
    this.provider = nav?.extras.state?.['provider'];
  }

  book() {
    const payload = {
      providerId: this.provider.id,
      serviceId: this.serviceId,
      dateTime: this.dateTime,
      address: this.address
    };

    this.bookingService.createBooking(payload)
      .subscribe(() => {
        alert('Booking created!');
        this.router.navigate(['/bookings']);
      });
  }
}
