import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const genericErrorHandlingInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBarService = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === HttpStatusCode.InternalServerError) {
        snackBarService.open('Ocorreu um erro inesperado. Por favor, tente novamente.');
      }

      return throwError(() => error);
    })
  );
};
