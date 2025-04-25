import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export function authInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getAccessToken();
  let authReq = req;

  if (token && !req.url.includes('/auth')) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && authService.getRefreshToken()) {
        return handle401Error(authReq, next, authService, router);
      }
      return throwError(() => error);
    })
  );
}

function handle401Error(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService,
  router: Router
): Observable<HttpEvent<any>> {
  const refreshToken = authService.getRefreshToken();
  if (!refreshToken) {
    authService.clearTokens();
    router.navigate(['/login']);
    return throwError(() => new Error('Refresh token missing'));
  }

  return authService.refreshToken({ refreshToken }).pipe(
    switchMap((authResponse) => {
      authService.saveTokens(authResponse);
      const newReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authResponse.accessToken}`
        }
      });
      return next(newReq);
    }),
    catchError(() => {
      authService.clearTokens();
      router.navigate(['/login']);
      return throwError(() => new Error('Refresh failed'));
    })
  );
}
