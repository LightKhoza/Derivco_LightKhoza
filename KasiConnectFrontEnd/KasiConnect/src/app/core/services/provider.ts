import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Provider {
  private baseUrl = 'https://localhost:7002/api/providers';

  constructor(private http: HttpClient) {}

  getProviders() {
    return this.http.get(this.baseUrl);
  }

  createProvider(data: any) {
    return this.http.post(`${this.baseUrl}/create`, data);
  }
}
