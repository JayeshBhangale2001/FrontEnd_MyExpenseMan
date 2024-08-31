import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { Expense, PartialExpense } from './models/expense.model';

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

   // New method to fetch expense statistics
   getExpenseStatistics(timeline: string, startDate: Date, endDate: Date): Observable<any> {
    const params = new HttpParams()
      .set('timeline', timeline)
      .set('startDate', startDate.toISOString().split('T')[0]) // Convert to 'YYYY-MM-DD' format
      .set('endDate', endDate.toISOString().split('T')[0]);

    return this.http.get<any>(`${this.apiUrl}/statistics`, { headers: this.getAuthHeaders(), params });
  }

  // New method to fetch detailed category data
  getDetailedCategoryData(categoryName: string, timeline: string, startDate: Date, endDate: Date): Observable<any> {
    const params = new HttpParams()
    .set('category', categoryName)
    .set('timeline', timeline)
    .set('startDate', startDate.toISOString().split('T')[0]) // Convert to 'YYYY-MM-DD' format
    .set('endDate', endDate.toISOString().split('T')[0]);

    return this.http.get<any>(`${this.apiUrl}/detailed-category`, { headers: this.getAuthHeaders(), params });
  }

  // New method to fetch detailed trend data
  getDetailedTrendData(date: string): Observable<any> {
    const params = new HttpParams().set('date', date);

    return this.http.get<any>(`${this.apiUrl}/detailed-trend`, { headers: this.getAuthHeaders(), params });
  }
}
