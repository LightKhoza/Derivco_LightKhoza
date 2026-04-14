import { Component } from '@angular/core';
import { Auth } from '../../core/services/auth';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword {
    email = '';
  token = '';
  newPassword = '';

  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: Auth
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      this.token = params['token'] || '';
    });
  }

  isValidPassword(password: string): boolean {
    return password.length >= 6; 
  }

  reset() {

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.email || !this.token) {
      this.errorMessage = 'Invalid reset link. Please request a new one.';
      return;
    }

    if (!this.newPassword) {
      this.errorMessage = 'Password is required';
      return;
    }

    if (!this.isValidPassword(this.newPassword)) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    this.loading = true;

    this.auth.resetPassword({
      email: this.email,
      token: this.token,
      newPassword: this.newPassword
    }).subscribe({
      next: (res: any) => {

        this.loading = false;

        this.successMessage = res?.message || 'Password reset successful';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },

      error: (err) => {
        this.loading = false;

        this.errorMessage =
          err?.error?.message || 'Something went wrong. Try again.';
      }
    });
  }
}
