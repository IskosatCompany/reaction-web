import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
  HttpStatusCode
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY, switchMap, throwError } from 'rxjs';
import { RoutesPaths } from '../../../core/models/routes-paths.enum';
import { AuthenticationService } from '../services/authentication.service';

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  let clonedRequest: HttpRequest<unknown>;
  if (req.url.includes('refresh')) {
    const refreshToken = authenticationService.getRefreshToken();
    clonedRequest = setRequestAuthorizationHeader(req, refreshToken as string);
  } else {
    const authToken = authenticationService.getAuthToken();
    clonedRequest = authToken ? setRequestAuthorizationHeader(req, authToken) : req;
  }

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      // Invalid/expired token
      // TODO: check with BE the HTTP error for this use case
      if (
        error.status === HttpStatusCode.Forbidden ||
        error.status === HttpStatusCode.Unauthorized
      ) {
        return authenticationService.refresh();
      }

      return throwError(() => error);
    }),
    switchMap(() => {
      const newAuthToken = authenticationService.getAuthToken() as string;
      const newReq = setRequestAuthorizationHeader(clonedRequest, newAuthToken);

      return next(newReq);
    }),
    catchError(() => {
      authenticationService.logout();
      router.navigateByUrl(`/${RoutesPaths.login}`);

      return EMPTY;
    })
  );
};

const setRequestAuthorizationHeader = (
  req: HttpRequest<unknown>,
  token: string
): HttpRequest<unknown> => req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
