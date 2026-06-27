import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LucideAngularModule, Rocket, Home, User, LogOut, Heart, Send, Edit2, Check, X, ChevronDown, ChevronUp } from 'lucide-angular';
import { PublicacionesService } from '../../services/publicaciones.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-publicacion-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './publicacion-detalle.html',
  styleUrl: './publicacion-detalle.css',
})
export class PublicacionDetalleComponent implements OnInit {
  readonly Rocket = Rocket; readonly Home = Home;
  readonly User = User; readonly LogOut = LogOut;
  readonly Heart = Heart; readonly Send = Send;
  readonly Edit2 = Edit2; readonly Check = Check;
  readonly X = X; readonly ChevronDown = ChevronDown;
  readonly ChevronUp = ChevronUp;

  publicacion = signal<any>(null);
  todosLosComentarios = signal<any[]>([]);  // todos los comentarios cargados
  mostrandoTodos = signal(false);
  readonly comentariosIniciales = 3;
  totalComentarios = signal(0);

  cargando = signal(true);
  cargandoMas = signal(false);
  nuevoComentario = '';
  editandoId = signal<string | null>(null);
  textoEditado = '';

  usuarioActual: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pubService: PublicacionesService,
    private authService: AuthService,
  ) {
    this.usuarioActual = this.authService.getUsuario();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    // Cargamos los primeros 3 comentarios
    this.pubService.obtener(id, 0, this.comentariosIniciales).subscribe({
      next: (pub) => {
        this.publicacion.set(pub);
        // Más recientes primero
        this.todosLosComentarios.set(pub.comentarios ?? []);
        this.totalComentarios.set(pub.totalComentarios ?? 0);
        this.cargando.set(false);
      },
      error: () => { this.cargando.set(false); this.router.navigate(['/publicaciones']); },
    });
  }

  // Comentarios que se muestran según el estado
  get comentariosVisibles(): any[] {
    if (this.mostrandoTodos()) return this.todosLosComentarios();
    return this.todosLosComentarios().slice(0, this.comentariosIniciales);
  }

  get hayMasComentarios(): boolean {
    return !this.mostrandoTodos() && this.totalComentarios() > this.comentariosIniciales;
  }

  cargarTodos() {
    const pub = this.publicacion();
    if (!pub) return;
    this.cargandoMas.set(true);
    // Cargamos todos los comentarios restantes
    this.pubService.cargarComentarios(pub._id, this.todosLosComentarios().length, 999).subscribe({
      next: (res) => {
        this.todosLosComentarios.update(prev => [...prev, ...res.comentarios]);
        this.totalComentarios.set(res.total);
        this.mostrandoTodos.set(true);
        this.cargandoMas.set(false);
      },
      error: () => this.cargandoMas.set(false),
    });
  }

  cargarMenos() {
    this.mostrandoTodos.set(false);
  }

  get liked(): boolean {
    return this.publicacion()?.likes?.includes(this.usuarioActual?._id);
  }

  get cantidadLikes(): number {
    return this.publicacion()?.likes?.length ?? 0;
  }

  toggleLike() {
    const pub = this.publicacion();
    if (!pub) return;
    const accion$ = this.liked ? this.pubService.quitarLike(pub._id) : this.pubService.darLike(pub._id);
    accion$.subscribe({
      next: () => {
        const likes = this.liked
          ? pub.likes.filter((id: string) => id !== this.usuarioActual._id)
          : [...pub.likes, this.usuarioActual._id];
        this.publicacion.set({ ...pub, likes });
      },
      error: () => {},
    });
  }

  enviarComentario() {
    const texto = this.nuevoComentario.trim();
    if (!texto) return;
    const pub = this.publicacion();
    this.pubService.comentar(pub._id, texto).subscribe({
      next: () => {
        this.nuevoComentario = '';
        // Recargar comentarios desde el backend para evitar duplicados
        this.pubService.obtener(pub._id, 0, this.mostrandoTodos() ? 999 : this.comentariosIniciales).subscribe({
          next: (pubActualizada) => {
            const comentarios = [...(pubActualizada.comentarios ?? [])].reverse();
            this.todosLosComentarios.set(comentarios);
            this.totalComentarios.set(pubActualizada.totalComentarios ?? 0);
          },
          error: () => {},
        });
      },
      error: () => {},
    });
  }

  iniciarEdicion(c: any) {
    this.editandoId.set(c._id);
    this.textoEditado = c.texto;
  }

  cancelarEdicion() {
    this.editandoId.set(null);
    this.textoEditado = '';
  }

  guardarEdicion(c: any) {
    const texto = this.textoEditado.trim();
    if (!texto) return;
    const pub = this.publicacion();
    this.pubService.editarComentario(pub._id, c._id, texto).subscribe({
      next: () => {
        this.todosLosComentarios.update(prev =>
          prev.map(com => com._id === c._id ? { ...com, texto, editado: true } : com)
        );
        this.editandoId.set(null);
      },
      error: () => {},
    });
  }

  esMiComentario(c: any): boolean {
    return c.autor?._id === this.usuarioActual?._id;
  }

  getNombreAutor(autor: any): string {
    if (!autor) return 'Usuario';
    return `${autor.nombre ?? ''} ${autor.apellido ?? ''}`.trim();
  }

  logout() { this.authService.logout(); }
}