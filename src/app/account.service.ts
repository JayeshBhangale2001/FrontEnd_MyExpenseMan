import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from './models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = 'http://localhost:8080/api/accounts'; // Your backend API URL

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : new HttpHeaders();
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
