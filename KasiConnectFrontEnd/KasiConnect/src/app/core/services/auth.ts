import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthUser } from '../../models/auth-user';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root',
})
export class Auth {
private baseUrl = 'https://localhost:7002/api';

  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initSession();
  }

  // ---------------- AUTH API ----------------

  login(data: any) {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  register(data: any) {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  loadUser() {
    return this.http.get(`${this.baseUrl}/me`);
  }

  forgotPassword(email: string) {
  return this.http.post<{ message: string }>(
    `${this.baseUrl}/auth/forgot-password`,
    { email }
  );
}

resetPassword(data: any) {
  return this.http.post(`${this.baseUrl}/auth/reset-password`, data);
}

  // ---------------- TOKEN ----------------

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ---------------- USER STATE ----------------

  setUser(user: any) {
    this.userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    return this.userSubject.value;
  }

  // ---------------- REQUIRED BY NAVBAR ----------------

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string | null {
    return this.userSubject.value?.role || null;
  }

  // ---------------- SESSION RESTORE ----------------

  initSession() {
    const user = localStorage.getItem('user');

    if (user) {
      this.userSubject.next(JSON.parse(user));
    }
  }

  // ---------------- LOGOUT ----------------

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }
}
