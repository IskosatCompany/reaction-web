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
  const token = isRefreshRequest
    ? authenticationService.getRefreshToken()
    : authenticationService.getAuthToken();

  const authReq = token ? setRequestAuthorizationHeader(req, token) : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Invalid/expired token
      // TODO: check with BE the HTTP error for this use case
      if (
        !isRefreshRequest &&
        (error.status === HttpStatusCode.Unauthorized || error.status === HttpStatusCode.Forbidden)
      ) {
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

      if (isRefreshRequest) {
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
