import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Pipe,
  PipeTransform,
  signal
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectSearchComponent } from 'ngx-mat-select-search';
import { switchMap } from 'rxjs';
import { Permission } from '../../../authentication/models/permissions.model';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { PermissionsApiService } from '../../api/permissions-api.service';
import { PermissionsLabels, PermissionToggle } from '../../models/permissions.model';

@Pipe({ name: 'translatePermission' })
export class TranslatePermissionPipe implements PipeTransform {
  transform(value: Permission): string {
    return PermissionsLabels[value];
  }
}

@Component({
  selector: 'app-permissions',
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatSelect,
    MatOption,
    MatSelectSearchComponent,
    MatButton,
    TranslatePermissionPipe,
    MatSlideToggle,
    MatIcon
  ],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionsComponent {
  private readonly authService = inject(AuthenticationService);
  private readonly permissionsService = inject(PermissionsApiService);
  private readonly snackbarService = inject(MatSnackBar);

  readonly selectedUserId = signal('');
  readonly users = toSignal(this.permissionsService.getUsers(), { initialValue: [] });
  readonly userFilterControl = new FormControl('');
  readonly userFilter = toSignal(this.userFilterControl.valueChanges, { initialValue: '' });
  readonly filteredUsers = computed(() => {
    const search = this.userFilter()?.toLowerCase();
    if (!search?.trim()) {
      return this.users();
    }

    return this.users().filter((item) => item.name.toLowerCase().includes(search));
  });

  readonly permissionsList = signal<PermissionToggle[]>(
    Object.values(Permission).map((permission) => ({
      value: permission,
      isActive: false
    }))
  );

  save(): void {
    const selectedPermissions = this.permissionsList()
      .filter((item) => item.isActive)
      .map((item) => item.value);

    this.permissionsService
      .updateUserPermissions(this.selectedUserId(), selectedPermissions)
      .pipe(switchMap(() => this.authService.updateUserPermissions()))
      .subscribe(() => this.snackbarService.open('Permissões atualizadas com sucesso'));
  }

  userChanged(userId: string): void {
    this.selectedUserId.set(userId);
    this.permissionsService
      .getUserPermissions(this.selectedUserId())
      .subscribe((userPermissions) => {
        this.permissionsList.update((permissions) =>
          permissions.map((permissionToggle) => ({
            value: permissionToggle.value,
            isActive: userPermissions.includes(permissionToggle.value)
          }))
        );
      });
  }
}
