export interface Booking {
  id: number;
  customerId: number;
  providerId: number;
  serviceId: number;
  dateTime: string;
  status: string;
  address: string;
}