import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RoutesPaths } from '../../../core/models/routes-paths.enum';
import { AuthenticationService } from '../services/authentication.service';

export const authenticationGuard: CanActivateFn = () => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  if (authenticationService.isAuthenticated()) {
    return true;
  }

  return router.navigateByUrl(`/${RoutesPaths.login}`);
};
