import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Home } from './pages/home/home';
import { Providers } from './pages/providers/providers';
import { Bookings } from './pages/bookings/bookings';
import { Dashboard } from './pages/dashboard/dashboard';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { Book } from './pages/book/book';
import { ProviderBookings } from './pages/provider-bookings/provider-bookings';
import { BookingHistory } from './pages/booking-history/booking-history';
import { ForgotPassword } from './auth/forgot-password/forgot-password';
import { ResetPassword } from './auth/reset-password/reset-password';
import { Profile } from './pages/profile/profile';

@NgModule({
  declarations: [
    App,
    Login,
    Register,
    Home,
    Providers,
    Bookings,
    Dashboard,
    Navbar,
    Book,
    ProviderBookings,
    BookingHistory,
    ForgotPassword,
    ResetPassword,
    Profile,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [App],
})
export class AppModule {}
