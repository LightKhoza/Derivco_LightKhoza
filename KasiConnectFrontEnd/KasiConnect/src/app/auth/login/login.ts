import { Component } from '@angular/core';
import { Auth } from '../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  email = '';
  password = '';

  loading = false;
  errorMessage = '';

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  login() {

    this.errorMessage = '';

    // ---------------- VALIDATION ----------------
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.loading = true;

    // ---------------- LOGIN API ----------------
    this.auth.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res: any) => {

        const token = res?.token;

        if (!token) {
          this.loading = false;
          this.errorMessage = 'Login failed. No token received.';
          return;
        }

        // save token
        this.auth.saveToken(token);

        // ---------------- LOAD USER ----------------
        this.auth.loadUser().subscribe({
          next: (user: any) => {

            this.auth.setUser(user);

            this.loading = false;

            // ---------------- ROLE ROUTING ----------------
            if (user.role === 'Provider') {
              this.router.navigate(['/profile']); // provider setup page
            }
            else if (user.role === 'Customer') {
              this.router.navigate(['/dashboard']);
            }
            else {
              this.router.navigate(['/']);
            }
          },

          error: (err) => {
            console.error('LOAD USER ERROR:', err);

            this.loading = false;
            this.errorMessage = 'Failed to load user profile';

            this.auth.logout();
          }
        });
      },

      error: (err) => {
        console.error('LOGIN ERROR:', err);

        this.loading = false;

        this.errorMessage =
          err?.error?.message ||
          'Invalid email or password';
      }
    });
  }
}
