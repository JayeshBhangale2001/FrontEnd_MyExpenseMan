import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://backendbudgetplanner-production.up.railway.app/api/auth';   //backendbudgetplanner-production.up.railway.app
  private tokenKey = 'authToken';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/signin`, 
      { username, password },
      { withCredentials: true }
    ).pipe(
      tap(response => {
        const token = response.token;
        
        // Token handling is only performed in the browser environment
        if (isPlatformBrowser(this.platformId) && token) {
          this.setToken(token);
        } else if (!isPlatformBrowser(this.platformId)) {
          console.warn('Token setting skipped as it is not running in the browser environment.');
        }
      })
    );
  }

  register(user: { username: string, email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, user, { withCredentials: true });
  }

  getToken(): string | null {
    // Check platform and retrieve token if in browser
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  setToken(token: string): void {
    // Set token only if in browser environment
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  clearToken(): void {
    // Remove token only if in browser environment
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
  }
}
