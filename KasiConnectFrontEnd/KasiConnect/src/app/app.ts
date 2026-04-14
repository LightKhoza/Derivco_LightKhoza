import { Component, OnInit, signal } from '@angular/core';
import { Auth } from './core/services/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App implements OnInit {
  constructor(private auth: Auth) {}

  ngOnInit() {
    this.auth.initSession();
  }
}
