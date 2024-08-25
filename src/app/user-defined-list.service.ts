import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface UserDefinedListItem {
  id?: number;
  listType: string;
  itemName: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserDefinedListService {
  private apiUrl = 'http://localhost:8080/api/user-defined-lists'; // Adjust the API endpoint as needed

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private getAuthHeaders(): HttpHeaders {
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

  getItems(listType: string): Observable<UserDefinedListItem[]> {
    return this.http.get<UserDefinedListItem[]>(`${this.apiUrl}/${listType}`, { headers: this.getAuthHeaders() });
  }

  saveItem(item: UserDefinedListItem): Observable<UserDefinedListItem> {
    return this.http.post<UserDefinedListItem>(`${this.apiUrl}/items`, item, { headers: this.getAuthHeaders() });
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  getListTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/list-types`, { headers: this.getAuthHeaders() });
  }
}
