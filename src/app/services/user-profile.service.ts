import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { UserProfile } from '../models/user-profile.model';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private apiUrl = 'http://localhost:8080/api/user-profiles'; // Backend URL
  private authToken: string | null = null;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    if (!this.authToken) {
      this.authToken = localStorage.getItem('authToken');
    }
    return this.authToken ? new HttpHeaders({ 'Authorization': `Bearer ${this.authToken}` }) : new HttpHeaders();
  }

  getUserProfileForLoggedInUser(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/me`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(error => {
          console.error('Error fetching user profile:', error);
          return throwError(error);
        })
      );
  }

  updateUserProfileForLoggedInUser(userProfile: UserProfile): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/me`, userProfile, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(error => {
          console.error('Error updating user profile:', error);
          return throwError(error);
        })
      );
  }
}
