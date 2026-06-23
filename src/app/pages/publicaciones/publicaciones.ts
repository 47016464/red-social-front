import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  LucideAngularModule, Rocket, Plus, LogOut,
  Home, User, X, ChevronLeft, ChevronRight,
} from 'lucide-angular';
import { PublicacionCardComponent, Publicacion } from '../../components/publicacion-card/publicacion-card';
import { PublicacionesService } from '../../services/publicaciones.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule, PublicacionCardComponent],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.css',
})
export class PublicacionesComponent implements OnInit {
  readonly Rocket = Rocket; readonly Plus = Plus;
  readonly LogOut = LogOut; readonly Home = Home;
  readonly User = User; readonly X = X;
  readonly ChevronLeft = ChevronLeft; readonly ChevronRight = ChevronRight;

  // ── Estado ─────────────────────────────────────────────────────────────────
  newPostModal = signal(false);
  successModal = signal(false);
  errorModal = signal(false);
  errorMsg = signal('');
  cargando = signal(false);

  ordenamiento = signal<'fecha' | 'likes'>('fecha');
  paginaActual = signal(1);
  totalPublicaciones = signal(0);
  readonly porPagina = 5;

  publicaciones = signal<Publicacion[]>([]);

  nuevaPublicacion = { titulo: '', mensaje: '' };
  imagenFile: File | null = null;

  usuarioActual: any;

  // Páginas totales calculadas desde el total del servidor
  totalPaginas = computed(() => Math.ceil(this.totalPublicaciones() / this.porPagina));

  constructor(
    private router: Router,
    private pubService: PublicacionesService,
    private authService: AuthService,
  ) {
    this.usuarioActual = this.authService.getUsuario();
  }

  ngOnInit() {
    this.cargarPublicaciones();
  }

  // ── Cargar desde backend ───────────────────────────────────────────────────
  cargarPublicaciones() {
    this.cargando.set(true);
    const offset = (this.paginaActual() - 1) * this.porPagina;
    this.pubService.listar(this.ordenamiento(), offset, this.porPagina).subscribe({
      next: (res) => {
        this.publicaciones.set(res.publicaciones.map(p => ({ ...p, showComments: false })));
        this.totalPublicaciones.set(res.total);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.mostrarError('No se pudieron cargar las publicaciones.');
      },
    });
  }

  // ── Ordenamiento ───────────────────────────────────────────────────────────
  cambiarOrden(orden: 'fecha' | 'likes') {
    this.ordenamiento.set(orden);
    this.paginaActual.set(1);
    this.cargarPublicaciones();
  }

  // ── Paginación ─────────────────────────────────────────────────────────────
  paginaAnterior() {
    if (this.paginaActual() > 1) {
      this.paginaActual.update(p => p - 1);
      this.cargarPublicaciones();
    }
  }

  paginaSiguiente() {
    if (this.paginaActual() < this.totalPaginas()) {
      this.paginaActual.update(p => p + 1);
      this.cargarPublicaciones();
    }
  }

  // ── Like ───────────────────────────────────────────────────────────────────
  toggleLike(pub: Publicacion) {
    const yaLikeó = pub.likes.includes(this.usuarioActual._id);
    const accion$ = yaLikeó
      ? this.pubService.quitarLike(pub._id)
      : this.pubService.darLike(pub._id);

    accion$.subscribe({
      next: (res) => {
        // Actualizamos likes localmente sin recargar todo
        this.publicaciones.update(posts =>
          posts.map(p => {
            if (p._id !== pub._id) return p;
            const likes = yaLikeó
              ? p.likes.filter(id => id !== this.usuarioActual._id)
              : [...p.likes, this.usuarioActual._id];
            return { ...p, likes };
          })
        );
      },
      error: (err) => {
        this.mostrarError(err?.error?.message || 'Error al procesar el Me Gusta.');
      },
    });
  }

  // ── Eliminar ───────────────────────────────────────────────────────────────
  eliminarPost(pub: Publicacion) {
    this.pubService.eliminar(pub._id).subscribe({
      next: () => {
        // Quitamos de la lista local y ajustamos total
        this.publicaciones.update(posts => posts.filter(p => p._id !== pub._id));
        this.totalPublicaciones.update(t => t - 1);
      },
      error: (err) => {
        this.mostrarError(err?.error?.message || 'No se pudo eliminar la publicación.');
      },
    });
  }

  // ── Comentar ───────────────────────────────────────────────────────────────
  agregarComentario(event: { post: Publicacion; texto: string }) {
    this.pubService.comentar(event.post._id, event.texto).subscribe({
      next: (pubActualizada) => {
        this.publicaciones.update(posts =>
          posts.map(p => p._id === event.post._id
            ? { ...pubActualizada, showComments: true }
            : p
          )
        );
      },
      error: () => this.mostrarError('No se pudo agregar el comentario.'),
    });
  }

  // ── Nueva publicación ──────────────────────────────────────────────────────
  onImagenChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.imagenFile = file;
  }

  submitPost() {
    if (!this.nuevaPublicacion.titulo.trim() || !this.nuevaPublicacion.mensaje.trim()) return;

    const formData = new FormData();
    formData.append('titulo', this.nuevaPublicacion.titulo);
    formData.append('mensaje', this.nuevaPublicacion.mensaje);
    if (this.imagenFile) formData.append('imagen', this.imagenFile);

    this.pubService.crear(formData).subscribe({
      next: () => {
        this.nuevaPublicacion = { titulo: '', mensaje: '' };
        this.imagenFile = null;
        this.newPostModal.set(false);
        this.successModal.set(true);
        // Volvemos a la primer página para ver la publicación nueva
        this.paginaActual.set(1);
        this.ordenamiento.set('fecha');
        this.cargarPublicaciones();
      },
      error: (err) => {
        this.mostrarError(err?.error?.message || 'No se pudo crear la publicación.');
      },
    });
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  yaLikeó(pub: Publicacion): boolean {
    return pub.likes.includes(this.usuarioActual?._id);
  }

  esMia(pub: Publicacion): boolean {
    return pub.autor?._id === this.usuarioActual?._id;
  }

  mostrarError(msg: string) {
    this.errorMsg.set(msg);
    this.errorModal.set(true);
  }

  logout() { this.authService.logout(); }
}