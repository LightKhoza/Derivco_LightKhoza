import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Booking {
  private baseUrl = 'https://localhost:7002/api/bookings';

  constructor(private http: HttpClient) {}

  createBooking(data: any) {
    return this.http.post(this.baseUrl, data);
  }

  myBookings() {
    return this.http.get(`${this.baseUrl}/my`);
  }

 updateStatus(id: number, status: string) {
  return this.http.put(
    `${this.baseUrl}/status/${id}`,
    { status: status } 
  );
}

  getBookingHistory() {
  return this.http.get(`${this.baseUrl}/history`);
}
}
