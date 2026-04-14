import { Component } from '@angular/core';
import { Auth } from '../../core/services/auth';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  name = '';
  email = '';
  password = '';
  role = 'Customer';

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  register() {

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.name || !this.email || !this.password) {
      this.errorMessage = 'All fields are required';
      return;
    }

    this.loading = true;

    const payload = {
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role
    };

    this.auth.register(payload).subscribe({
      next: (res: any) => {

        this.loading = false;

        this.successMessage =
          res?.message || 'Account created successfully';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1200);
      },

      error: (err) => {

        this.loading = false;

        console.log('REGISTER ERROR:', err);

        this.errorMessage =
          err?.error?.message || 'Registration failed';
      }
    });
  }
}
