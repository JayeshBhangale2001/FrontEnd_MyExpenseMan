import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { Expense, PartialExpense } from './models/expense.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = 'https://backendbudgetplanner-production.up.railway.app/api/expenses'; // Your backend API URL

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

  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  saveExpense(expense: PartialExpense): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expense, { headers: this.getAuthHeaders() });
  }

  updateExpense(expense: Expense): Observable<Expense> {
    return this.http.put<Expense>(`${this.apiUrl}/${expense.id}`, expense, { headers: this.getAuthHeaders() });
  }

  deleteExpense(expenseId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${expenseId}`, { headers: this.getAuthHeaders() });
  }
}
