import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from './models/account.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = 'http://localhost:8080/api/accounts'; // Your backend API URL

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return headers;
  }

  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  saveAccount(account: Account): Observable<Account> {
    return this.http.post<Account>(this.apiUrl, account, { headers: this.getAuthHeaders() });
  }

  updateAccount(account: Account): Observable<Account> {
    return this.http.put<Account>(`${this.apiUrl}/${account.id}`, account, { headers: this.getAuthHeaders() });
  }

  deleteAccount(accountId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${accountId}`, { headers: this.getAuthHeaders() });
  }
}
