import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent),
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro').then(m => m.RegistroComponent),
  },
  {
    path: 'publicaciones',
    loadComponent: () => import('./pages/publicaciones/publicaciones').then(m => m.PublicacionesComponent),
    canActivate: [authGuard],
  },
  {
    path: 'publicaciones/:id',
    loadComponent: () => import('./pages/publicacion-detalle/publicacion-detalle').then(m => m.PublicacionDetalleComponent),
    canActivate: [authGuard],
  },
  {
    path: 'mi-perfil',
    loadComponent: () => import('./pages/mi-perfil/mi-perfil').then(m => m.MiPerfilComponent),
    canActivate: [authGuard],
  },
  {
    path: 'dashboard/usuarios',
    loadComponent: () => import('./pages/dashboard-usuarios/dashboard-usuarios').then(m => m.DashboardUsuariosComponent),
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'dashboard/estadisticas',
    loadComponent: () => import('./pages/dashboard-estadisticas/dashboard-estadisticas').then(m => m.DashboardEstadisticasComponent),
    canActivate: [authGuard, adminGuard],
  },
  { path: '**', redirectTo: 'login' },
];