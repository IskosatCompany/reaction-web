import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesPaths } from '../../../../core/models/routes-paths.enum';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-logout',
  template: ''
})
export class LogoutComponent implements OnInit {
  readonly #authenticationService = inject(AuthenticationService);
  readonly #router = inject(Router);

  ngOnInit(): void {
    this.#authenticationService.logout();
    this.#router.navigateByUrl(`/${RoutesPaths.login}`);
  }
}
