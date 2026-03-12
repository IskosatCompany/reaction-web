import { inject, Pipe, PipeTransform } from '@angular/core';
import { Permission } from '../models/permissions.model';
import { AuthenticationService } from '../services/authentication.service';

@Pipe({ name: 'hasPermission' })
export class HasPermissionPipe implements PipeTransform {
  private readonly authenticationService = inject(AuthenticationService);

  transform(value: Permission): boolean {
    return this.authenticationService.userPermissions().includes(value);
  }
}
