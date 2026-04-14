import { Component } from '@angular/core';
import { Auth } from '../../core/services/auth';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
 email = '';
  token = '';
  newPassword = '';

  step = 1;

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private auth: Auth, private router: Router) {}

  sendToken() {
  this.errorMessage = '';
  this.successMessage = '';
  this.loading = true;

  this.auth.forgotPassword(this.email)
    .pipe(
      finalize(() => {
        this.loading = false; 
      })
    )
    .subscribe({
      next: (res) => {
        console.log('RESPONSE:', res);

        this.successMessage = res.message;
        this.step = 2;
      },
      error: (err) => {
        console.error(err);

        this.errorMessage =
          err?.error?.message || 'Failed to send reset email';
      }
    });
}

  reset() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.token || !this.newPassword) {
      this.errorMessage = 'All fields are required';
      return;
    }

    if (this.newPassword.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    this.loading = true;

    this.auth.resetPassword({
      email: this.email,
      token: this.token,
      newPassword: this.newPassword
    })
    .pipe(
      finalize(() => {
        this.loading = false;
      })
    )
    .subscribe({
      next: () => {
        this.successMessage = 'Password reset successful! Redirecting...';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: () => {
        this.errorMessage = 'Invalid token or reset failed';
      }
    });
  }
}
