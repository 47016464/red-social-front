import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) return true;

  const usuario = localStorage.getItem('usuario');
  if (!usuario) { router.navigate(['/login']); return false; }

  const u = JSON.parse(usuario);
  if (u.perfil !== 'administrador') {
    router.navigate(['/publicaciones']);
    return false;
  }
  return true;
};