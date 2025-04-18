import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { admininterceptorInterceptor } from './interceptors/admininterceptor.interceptor';
import { blockedinterceptorInterceptor } from './interceptors/blockedinterceptor.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),provideHttpClient(withInterceptors([blockedinterceptorInterceptor,authInterceptor,admininterceptorInterceptor])),importProvidersFrom(HttpClientModule)]
};
