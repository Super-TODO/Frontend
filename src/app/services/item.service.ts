import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemRequest, ItemResponse } from '../models/item.model';
import { AuthService } from './auth.service';
import { PageResponse } from '../models/Page.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private apiUrl = 'http://localhost:8081/items';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getAccessToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getItems(page: number = 0, size: number = 10): Observable<PageResponse<ItemResponse>> {
    return this.http.get<PageResponse<ItemResponse>>(`${this.apiUrl}?page=${page}&size=${size}`, { headers: this.getHeaders() });
  }

  addItem(item: ItemRequest): Observable<ItemResponse> {
    return this.http.post<ItemResponse>(this.apiUrl, item, { headers: this.getHeaders() });
  }

  updateItem(id: number, item: ItemRequest): Observable<ItemResponse> {
    return this.http.put<ItemResponse>(`${this.apiUrl}/${id}`, item, { headers: this.getHeaders() });
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
