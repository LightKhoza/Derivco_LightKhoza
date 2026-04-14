import { Component, OnInit } from '@angular/core';
import { Provider } from '../../core/services/provider';
import { Router } from '@angular/router';

@Component({
  selector: 'app-providers',
  standalone: false,
  templateUrl: './providers.html',
  styleUrl: './providers.scss',
})
export class Providers implements OnInit {
  providers: any[] = [];
  searchTerm: string = '';

  constructor(
    private providerService: Provider,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProviders();
  }

  loadProviders() {
    this.providerService.getProviders()
      .subscribe({
        next: (data: any) => this.providers = data,
        error: (err) => console.error(err)
      });
  }

  filteredProviders() {
    if (!this.searchTerm) return this.providers;

    const term = this.searchTerm.toLowerCase();

    return this.providers.filter(p =>
      (p.name || '').toLowerCase().includes(term) ||
      (p.email || '').toLowerCase().includes(term) ||
      (p.location || '').toLowerCase().includes(term) ||
      (p.description || '').toLowerCase().includes(term)
    );
  }

  selectProvider(provider: any) {
    this.router.navigate(['/book'], {
      state: { provider }
    });
  }
}
