import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { LayoutService } from './core/services/layout.service';
import { API_URL } from './core/tokens/api-url.token';
import { IS_MOBILE } from './core/tokens/mobile.token';
import { authenticationInterceptor } from './features/authentication/interceptors/authentication.interceptor';
import { DateFnsAdapter, MAT_DATE_FNS_FORMATS } from '@angular/material-date-fns-adapter';
import { pt } from 'date-fns/locale';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authenticationInterceptor])),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    { provide: IS_MOBILE, useFactory: () => inject(LayoutService).isMobile },
    { provide: API_URL, useValue: environment.apiUrl },
    { provide: MAT_DATE_LOCALE, useValue: pt },
    { provide: DateAdapter, useClass: DateFnsAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_DATE_FNS_FORMATS }
  ]
};
