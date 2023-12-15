import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  MODE = 'production';

  APIUrl = this.MODE === 'production' ? 'https://tokenapi-ibmu.onrender.com/api'
  : 'http://localhost:3001/api';

  //  APIUrl: string = 'https://tokenapi-ibmu.onrender.com/api';
  //  APIUrl: string = 'https:localhost:3001/api';

  constructor(private http: HttpClient) {}

  authChecking(): boolean {
    const token = localStorage.getItem('auth');
    return !!token
  }

  register(data: any) {
    return this.http.post(`${this.APIUrl}/register`, data);
  }

  login(data: any) {
    return this.http.post(`${this.APIUrl}/login`, data);
  }

  getAll() {
    const authValue = localStorage.getItem('auth');
    const formattedAuth = authValue ? authValue.replace(/^"|"$/g, '') : ''; 
    return this.http.get(`${this.APIUrl}/getAll`, {
      headers: {
        'auth': formattedAuth
      }
    });
  }

  getUserData() {
    const authValue = localStorage.getItem('auth');
    const formattedAuth = authValue ? authValue.replace(/^"|"$/g, '') : ''; 
    return this.http.get(`${this.APIUrl}/getUserData`, {
      headers: {
        'auth': formattedAuth
      }
    });
  }
  
}
