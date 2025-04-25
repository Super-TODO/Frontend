import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthResponse, LoginRequest, RegisterRequest, RefreshTokenRequest, UserProfile, OtpVerificationRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';
  private refreshingToken = false;

  constructor(private http: HttpClient) {}

  register(request: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, request);
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request);
  }

  verifyOtp(request: OtpVerificationRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/verify-otp`, request);
  }

  refreshToken(request: RefreshTokenRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, request);
  }

  logout(): Observable<string> {
    const token = this.getAccessToken();
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
    return this.http.post<string>(`${this.apiUrl}/logout`, {}, { headers });
  }

  getUserProfile(): Observable<UserProfile> {
    const token = this.getAccessToken();
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
    return this.http.get<UserProfile>(`${this.apiUrl}/profile`, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.refreshingToken) {
          return this.handleTokenRefresh().pipe(
            switchMap(() => {
              const newToken = this.getAccessToken();
              const newHeaders = new HttpHeaders({
                'Authorization': newToken ? `Bearer ${newToken}` : ''
              });
              return this.http.get<UserProfile>(`${this.apiUrl}/profile`, { headers: newHeaders });
            })
          );
        }
        return throwError(() => error);
      })
    );
  }

  private handleTokenRefresh(): Observable<AuthResponse> {
    this.refreshingToken = true;
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.refreshingToken = false;
      this.clearTokens();
      return throwError(() => new Error('No refresh token available'));
    }

    const refreshRequest: RefreshTokenRequest = { refreshToken };
    return this.refreshToken(refreshRequest).pipe(
      catchError((refreshError) => {
        this.refreshingToken = false;
        this.clearTokens();
        return throwError(() => refreshError);
      }),
      switchMap((authResponse) => {
        this.saveTokens(authResponse);
        this.refreshingToken = false;
        return new Observable<AuthResponse>(observer => {
          observer.next(authResponse);
          observer.complete();
        });
      })
    );
  }

  saveTokens(authResponse: AuthResponse): void {
    localStorage.setItem('accessToken', authResponse.accessToken);
    localStorage.setItem('refreshToken', authResponse.refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }
}