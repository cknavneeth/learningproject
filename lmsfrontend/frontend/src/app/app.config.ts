import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { admininterceptorInterceptor } from './interceptors/admininterceptor.interceptor';
import { blockedinterceptorInterceptor } from './interceptors/blockedinterceptor.interceptor';
import { errorInterceptor } from './interceptors/errorhandling/error.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),provideAnimations(),provideHttpClient(withInterceptors([errorInterceptor,blockedinterceptorInterceptor,authInterceptor])),importProvidersFrom(HttpClientModule)]
};
