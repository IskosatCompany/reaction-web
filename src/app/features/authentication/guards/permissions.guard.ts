import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RoutesPaths } from '../../../core/models/routes-paths.enum';
import { Permission } from '../models/permissions.model';
import { AuthenticationService } from '../services/authentication.service';

export const coachPageGuard: CanActivateFn = () => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  if (authenticationService.userPermissions().includes(Permission.viewCoachSection)) {
    return true;
  }

  return router.navigateByUrl(`/${RoutesPaths.calendar}`);
};

export const permissionsPageGuard: CanActivateFn = () => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  if (authenticationService.userPermissions().includes(Permission.managePermissions)) {
    return true;
  }

  return router.navigateByUrl(`/${RoutesPaths.calendar}`);
};
