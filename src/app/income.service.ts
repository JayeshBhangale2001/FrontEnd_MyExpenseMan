import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { Income } from './models/income.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {
  private apiUrl = 'http://backendbudgetplanner-production.up.railway.app/api/income'; // Update with your backend URL

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private getAuthHeaders(): HttpHeaders {
    // Always initialize HttpHeaders
    let headers = new HttpHeaders();

    // Check if we are in the browser environment
    if (isPlatformBrowser(this.platformId)) {
      // Try to get the token from localStorage
      const token = localStorage.getItem('authToken');
      if (token) {
        // If token exists, add it to the headers
        headers = headers.append('Authorization', `Bearer ${token}`);
      }
    }

    return headers;
  }

  getIncomes(): Observable<Income[]> {
    return this.http.get<Income[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  saveIncome(income: Income): Observable<Income> {
    return this.http.post<Income>(this.apiUrl, income, { headers: this.getAuthHeaders() });
  }

  updateIncome(income: Income): Observable<Income> {
    return this.http.put<Income>(`${this.apiUrl}/${income.id}`, income, { headers: this.getAuthHeaders() });
  }

  deleteIncome(incomeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${incomeId}`, { headers: this.getAuthHeaders() });
  }
}
