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
    const token = localStorage.getItem('authToken');
    return token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : new HttpHeaders();
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
