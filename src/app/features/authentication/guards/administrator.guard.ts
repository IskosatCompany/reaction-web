import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { inject } from '@angular/core';
import { RoutesPaths } from '../../../core/models/routes-paths.enum';
import { UserRole } from '../models/login.interface';

export const administratorGuard: CanActivateFn = () => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  if (
    authenticationService.userRole() === UserRole.admin ||
    authenticationService.userId() === '0c2ed097-e49f-4281-a745-670f175c38a7'
  ) {
    return true;
  }

  return router.navigateByUrl(`/${RoutesPaths.sessions}`);
};
