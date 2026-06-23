import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // En SSR no existe localStorage, dejamos pasar y el cliente redirige
  if (!isPlatformBrowser(platformId)) return true;

  const token = localStorage.getItem("token");
  if (!token) {
    router.navigate(["/login"]);
    return false;
  }
  return true;
};