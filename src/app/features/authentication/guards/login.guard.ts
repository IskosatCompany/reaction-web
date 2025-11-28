import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RoutesPaths } from '../../../core/models/routes-paths.enum';
import { AuthenticationService } from '../services/authentication.service';

export const loginGuard: CanActivateFn = () => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  if (authenticationService.isAuthenticated()) {
    return router.navigateByUrl(`/${RoutesPaths.calendar}`);
  }

  return true;
};
