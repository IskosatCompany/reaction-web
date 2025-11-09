import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
  HttpStatusCode
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { RoutesPaths } from '../../../core/models/routes-paths.enum';
import { AuthenticationService } from '../services/authentication.service';

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  const isRefreshRequest = req.url.includes('refresh');
  const isLoginRequest = req.url.includes('login');
  const token = isRefreshRequest
    ? authenticationService.getRefreshToken()
    : authenticationService.getAuthToken();

  const authReq = token ? setRequestAuthorizationHeader(req, token) : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === HttpStatusCode.Unauthorized) {
        if (isLoginRequest) {
          return throwError(() => error);
        }

        if (!isRefreshRequest) {
          return authenticationService.refresh().pipe(
            switchMap(() => {
              const newAuthToken = authenticationService.getAuthToken();
              const newReq = setRequestAuthorizationHeader(req, newAuthToken!);
              return next(newReq);
            }),
            catchError(() => {
              authenticationService.logout();
              router.navigateByUrl(`/${RoutesPaths.login}`);
              return throwError(() => error);
            })
          );
        }

        authenticationService.logout();
        router.navigateByUrl(`/${RoutesPaths.login}`);
      }

      return throwError(() => error);
    })
  );
};

const setRequestAuthorizationHeader = (
  req: HttpRequest<unknown>,
  token: string
): HttpRequest<unknown> =>
  req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });
