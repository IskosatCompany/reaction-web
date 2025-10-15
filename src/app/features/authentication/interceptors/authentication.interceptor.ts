import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { RoutesPaths } from '../../../core/models/routes-paths.enum';
import { AuthenticationService } from '../services/authentication.service';

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  const token = authenticationService.getJwtToken();
  const clonedRequest = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      // Invalid/expired token → logout and redirect to login page
      if (error.status === HttpStatusCode.Forbidden) {
        authenticationService.logout();
        router.navigateByUrl(`/${RoutesPaths.login}`);
      }

      return throwError(() => error);
    })
  );
};
