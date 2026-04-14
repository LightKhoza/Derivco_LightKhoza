import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {

  user: any = null;

  // provider
  providerProfile = {
    description: '',
    location: '',
    hourlyRate: 0
  };

  services: any[] = [];
  selectedServices: number[] = [];

  selectedFile!: File;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUser();
    this.loadServices();
    this.loadProviderProfile();
  }

  // ================= USER =================
  loadUser() {
    this.http.get('https://localhost:7002/api/users/me')
      .subscribe({
        next: (res) => this.user = res,
        error: (err) => console.error(err)
      });
  }

  // ================= SERVICES =================
  loadServices() {
    this.http.get('https://localhost:7002/api/providers/services')
      .subscribe({
        next: (res: any) => this.services = res,
        error: (err) => console.error(err)
      });
  }

  toggleService(id: number) {
    if (this.selectedServices.includes(id)) {
      this.selectedServices = this.selectedServices.filter(x => x !== id);
    } else {
      this.selectedServices.push(id);
    }
  }

  // ================= PROVIDER PROFILE =================
  loadProviderProfile() {
    this.http.get('https://localhost:7002/api/providers/profile')
      .subscribe({
        next: (res: any) => {
          if (!res) return;

          this.providerProfile = {
            description: res.description,
            location: res.location,
            hourlyRate: res.hourlyRate
          };

          this.selectedServices =
            res.providerServices?.map((x: any) => x.serviceId) || [];
        },
        error: () => {}
      });
  }

  saveProviderProfile() {

  const payload = {
    description: this.providerProfile.description,
    location: this.providerProfile.location,
    hourlyRate: Number(this.providerProfile.hourlyRate),
    serviceIds: this.selectedServices || []
  };

  console.log("SENDING:", payload);

  this.http.post('https://localhost:7002/api/providers/profile', payload)
    .subscribe({
      next: () => alert('Profile saved successfully'),
      error: (err) => {
        console.error("ERROR:", err);
        alert(err?.error?.message || 'Save failed');
      }
    });
}

  // ================= IMAGE =================
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  upload() {
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post('https://localhost:7002/api/users/upload-profile', formData)
      .subscribe({
        next: (res: any) => {
          this.user.profileImageUrl = res.imageUrl;
        },
        error: (err) => console.error(err)
      });
  }

  updateName() {
    this.http.put('https://localhost:7002/api/users/update-name', {
      name: this.user.name
    }).subscribe({
      next: () => alert('Updated'),
      error: (err) => console.error(err)
    });
  }
}