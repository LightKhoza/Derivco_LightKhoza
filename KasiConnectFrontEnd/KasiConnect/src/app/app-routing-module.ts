import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Providers } from './pages/providers/providers';
import { AuthGuard } from './core/guards/auth-guard';
import { Dashboard } from './pages/dashboard/dashboard';
import { Home } from './pages/home/home';
import { Bookings } from './pages/bookings/bookings';
import { Register } from './auth/register/register';
import { Book } from './pages/book/book';
import { ProviderBookings } from './pages/provider-bookings/provider-bookings';
import { BookingHistory } from './pages/booking-history/booking-history';
import { ForgotPassword } from './auth/forgot-password/forgot-password';
import { ResetPassword } from './auth/reset-password/reset-password';
import { Profile } from './pages/profile/profile';

const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login }, 
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },

  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
  { path: 'providers', component: Providers, canActivate: [AuthGuard] },
  { path: 'bookings', component: Bookings, canActivate: [AuthGuard] },

  { path: 'book', component: Book },
  { path: 'provider-bookings', component: ProviderBookings },
  { path: 'history', component: BookingHistory, canActivate: [AuthGuard] },
  { path: 'reset-password', component: ResetPassword },
  { path: 'profile', component: Profile, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
