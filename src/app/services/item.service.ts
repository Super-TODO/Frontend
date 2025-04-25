import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ItemResponse } from '../models/item.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private apiUrl = 'http://localhost:8081/items';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getItems(): Observable<ItemResponse[]> {
    const token = this.authService.getAccessToken();
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
    return this.http.get<ItemResponse[]>(this.apiUrl, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching items:', error);
        return throwError(() => new Error('Failed to fetch items. Please try again later.'));
      })
    );
  }
}