import { Component, OnInit } from '@angular/core';
import { Auth } from '../core/services/auth';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {

  user: any;

  constructor(public auth: Auth, private router: Router, private http: HttpClient) {}

  ngOnInit() {
  this.loadUser();

  window.addEventListener('storage', () => {
    this.loadUser();
  });
}

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  isCustomer() {
    return this.auth.getUserRole() === 'Customer';
  }

  isProvider() {
    return this.auth.getUserRole() === 'Provider';
  }

  loadUser() {

  const token = localStorage.getItem('token');

  if (!token) {
    this.user = null;
    return;
  }

  this.http.get('https://localhost:7002/api/users/me')
    .subscribe({
      next: (res: any) => this.user = res,
      error: () => this.user = null
    });
}

  goToProfile() {
  this.router.navigate(['/profile']);
}

  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
