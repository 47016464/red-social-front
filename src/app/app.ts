import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { SesionService } from './services/sesion.service';

const DIEZ_MINUTOS = 10 * 60 * 1000;
const CINCO_MINUTOS = 5 * 60 * 1000;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <!-- Pantalla de carga -->
    <div class="splash-screen" *ngIf="cargando()">
      <div class="splash-content">
        <div class="splash-logo">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
          </svg>
        </div>
        <h1 class="splash-title">Orbit</h1>
        <div class="splash-spinner"></div>
      </div>
    </div>

    <!-- App normal -->
    <ng-container *ngIf="!cargando()">
      <router-outlet></router-outlet>

      <!-- Modal sesión por vencer -->
      <div class="modal-overlay session-modal" *ngIf="mostrarModalSesion()">
        <div class="modal-box session-box">
          <div class="session-icon">⏱️</div>
          <h3 class="session-title">Sesión por vencer</h3>
          <p class="session-desc">Tu sesión vence en <span class="session-highlight">5 minutos</span>. ¿Querés extenderla?</p>
          <div class="session-actions">
            <button class="session-btn session-btn-danger" (click)="cerrarSesionAhora(false)">
              Cerrar sesión
            </button>
            <button class="session-btn session-btn-ghost" (click)="mostrarModalSesion.set(false)">
              Usar los 5 min
            </button>
            <button class="session-btn session-btn-primary" (click)="extenderSesion()">
              ✦ Extender sesión
            </button>
          </div>
        </div>
      </div>

      <!-- Modal sesión expirada -->
      <div class="modal-overlay session-modal" *ngIf="mostrarModalExpirado()">
        <div class="modal-box session-box">
          <div class="session-crash">🚀💥</div>
          <h3 class="session-title">¡Sesión expirada!</h3>
          <p class="session-desc">Tu tiempo de sesión se agotó. Redirigiendo al login...</p>
          <div class="session-progress">
            <div class="session-progress-bar"></div>
          </div>
        </div>
      </div>
    </ng-container>
  `,
  styles: [`
    .splash-screen {
      position: fixed; inset: 0; z-index: 9999;
      background: #05070f;
      display: flex; align-items: center; justify-content: center;
    }
    .splash-content {
      display: flex; flex-direction: column;
      align-items: center; gap: 1rem;
    }
    .splash-logo {
      width: 80px; height: 80px; border-radius: 20px;
      background: linear-gradient(135deg, #7c6ef7, #9c6ef7);
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 8px 32px rgba(124,110,247,0.5);
      animation: pulse 1.5s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    .splash-title {
      font-size: 2rem; font-weight: 800; color: white;
      background: linear-gradient(135deg, #fff, #b8b0ff);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .splash-spinner {
      width: 32px; height: 32px;
      border: 3px solid rgba(255,255,255,0.1);
      border-top-color: #7c6ef7;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .modal-overlay {
      position: fixed; inset: 0; z-index: 9998;
      background: rgba(0,0,0,0.75);
      display: flex; align-items: center; justify-content: center;
      backdrop-filter: blur(8px);
      animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .session-box {
      background: linear-gradient(145deg, #13151f, #1a1d2e);
      border: 1px solid rgba(124,110,247,0.25);
      border-radius: 24px;
      padding: 2.5rem 2rem;
      max-width: 420px; width: 90%;
      text-align: center;
      box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,110,247,0.1);
      animation: slideUp 0.3s ease;
    }
    @keyframes slideUp { from { transform: translateY(20px); opacity:0; } to { transform: translateY(0); opacity:1; } }

    .session-icon {
      font-size: 3rem; margin-bottom: 1rem;
      animation: pulse 1s ease-in-out infinite;
    }
    .session-crash {
      font-size: 3rem; margin-bottom: 1rem;
      animation: crash 0.5s ease forwards;
    }
    @keyframes crash {
      0% { transform: translateY(-20px) rotate(-10deg); }
      60% { transform: translateY(5px) rotate(5deg); }
      100% { transform: translateY(0) rotate(0); }
    }
    @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }

    .session-title {
      font-size: 1.4rem; font-weight: 800; color: white; margin-bottom: 0.6rem;
    }
    .session-desc {
      color: #9098b1; font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;
    }
    .session-highlight {
      color: #fbbf24; font-weight: 700;
    }
    .session-actions {
      display: flex; gap: 0.6rem; justify-content: center; flex-wrap: wrap;
    }
    .session-btn {
      padding: 0.6rem 1.2rem; border-radius: 12px; border: none;
      cursor: pointer; font-weight: 600; font-size: 0.88rem;
      transition: all 0.2s;
    }
    .session-btn-primary {
      background: linear-gradient(135deg,#7c6ef7,#9c6ef7);
      color: white;
      box-shadow: 0 4px 15px rgba(124,110,247,0.4);
    }
    .session-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(124,110,247,0.5); }
    .session-btn-ghost {
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      color: #9098b1;
    }
    .session-btn-ghost:hover { background: rgba(255,255,255,0.1); color: white; }
    .session-btn-danger {
      background: rgba(239,68,68,0.1);
      border: 1px solid rgba(239,68,68,0.2);
      color: #ef4444;
    }
    .session-btn-danger:hover { background: rgba(239,68,68,0.2); }

    .session-progress {
      height: 4px; background: rgba(255,255,255,0.08);
      border-radius: 2px; overflow: hidden; margin-top: 1.5rem;
    }
    .session-progress-bar {
      height: 100%; width: 100%;
      background: linear-gradient(90deg,#7c6ef7,#ef4444);
      border-radius: 2px;
      animation: drain 3s linear forwards;
    }
    @keyframes drain { from { width: 100%; } to { width: 0%; } }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  cargando = signal(true);
  mostrarModalSesion = signal(false);
  mostrarModalExpirado = signal(false);

  private timerAviso: any;
  private timerCierre: any;
  private enRutaPublica = false;

  constructor(private authService: AuthService, private router: Router, private sesionService: SesionService) {}

  ngOnInit() {
    // Escuchar cuando el login dispara el timer
    this.sesionService.iniciarTimer$.subscribe(() => {
      this.iniciarTimer();
    });

    // Detectar rutas públicas
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.enRutaPublica = e.url === '/login' || e.url === '/registro';
      if (this.enRutaPublica) {
        this.limpiarTimers();
      }
    });

    // Tiempo mínimo de splash para que el cliente renderice el SVG
    const tiempoMinimo = new Promise(resolve => setTimeout(resolve, 1200));

    const token = this.authService.getToken();
    if (!token) {
      tiempoMinimo.then(() => {
        this.cargando.set(false);
        this.router.navigate(['/login']);
      });
      return;
    }

    Promise.all([
      tiempoMinimo,
      this.authService.autorizar().toPromise().catch(() => null),
    ]).then(([, resultado]: any[]) => {
      if (resultado?.valido) {
        // Actualizar datos del usuario en localStorage
        if (resultado.usuario) {
          localStorage.setItem("usuario", JSON.stringify(resultado.usuario));
        }
        this.cargando.set(false);
        this.router.navigate(['/publicaciones']);
        this.iniciarTimer();
      } else {
        this.authService.logout();
        this.cargando.set(false);
        this.router.navigate(['/login']);
      }
    });
  }

  iniciarTimer() {
    this.limpiarTimers();
    // A los 10 min muestra el modal
    this.timerAviso = setTimeout(() => {
      this.mostrarModalSesion.set(true);
      // A los 15 min cierra sesión si no respondió
      this.timerCierre = setTimeout(() => {
        this.cerrarSesionAhora(true);
      }, CINCO_MINUTOS);
    }, DIEZ_MINUTOS);
  }

  extenderSesion() {
    this.mostrarModalSesion.set(false);
    this.authService.refrescar().subscribe({
      next: () => this.iniciarTimer(),
      error: () => this.cerrarSesionAhora(true),
    });
  }

  cerrarSesionAhora(mostrarExpirado = false) {
    this.mostrarModalSesion.set(false);
    this.limpiarTimers();
    if (mostrarExpirado) {
      // Limpiamos storage pero NO redirigimos todavía
      if (typeof localStorage !== 'undefined') localStorage.clear();
      this.mostrarModalExpirado.set(true);
      setTimeout(() => {
        this.mostrarModalExpirado.set(false);
        this.router.navigate(["/login"]);
      }, 3000);
    } else {
      this.authService.logout();
    }
  }

  limpiarTimers() {
    if (this.timerAviso) clearTimeout(this.timerAviso);
    if (this.timerCierre) clearTimeout(this.timerCierre);
  }

  ngOnDestroy() {
    this.limpiarTimers();
  }
}

export { AppComponent as App };