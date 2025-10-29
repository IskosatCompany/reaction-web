import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  isDevMode,
  LOCALE_ID,
  provideAppInitializer,
  provideZonelessChangeDetection
} from '@angular/core';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { LayoutService } from './core/services/layout.service';
import { API_URL } from './core/tokens/api-url.token';
import { IS_MOBILE } from './core/tokens/mobile.token';
import { authenticationInterceptor } from './features/authentication/interceptors/authentication.interceptor';
import { AuthenticationService } from './features/authentication/services/authentication.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authenticationInterceptor])),
    provideZonelessChangeDetection(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    provideRouter(routes),
    provideAppInitializer(() => inject(AuthenticationService).initialize()),
    provideNativeDateAdapter(),
    { provide: IS_MOBILE, useFactory: () => inject(LayoutService).isMobile },
    { provide: API_URL, useValue: environment.apiUrl },
    { provide: LOCALE_ID, useValue: 'pt-PT' },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-PT' }
  ]
};
