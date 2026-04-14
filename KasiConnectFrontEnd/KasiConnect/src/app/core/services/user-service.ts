import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private http: HttpClient) {}

  uploadProfile(file: File) {
  
    const formData = new FormData();
    formData.append('file', file);

  return this.http.post('https://localhost:7002/api/users/upload-profile', formData);
}

  getProfile() {
    return this.http.get('https://localhost:7002/api/users/me');
} 
}
