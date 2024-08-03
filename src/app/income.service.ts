import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Income } from './models/income.model';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {
  private apiUrl = 'http://localhost:8080/api/income'; // Update with your backend URL

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    // Check if localStorage is available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken'); // Retrieve the token from local storage or wherever you store it
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    }
    return new HttpHeaders(); // Return empty headers if localStorage is not available
  }

  getIncomes(): Observable<Income[]> {
    return this.http.get<Income[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  saveIncome(income: Income): Observable<Income> {
    return this.http.post<Income>(this.apiUrl, income, { headers: this.getAuthHeaders() });
  }
}
