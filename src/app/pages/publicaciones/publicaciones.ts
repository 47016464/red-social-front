import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, Rocket, Plus, LogOut, Home, User, X, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-angular';
import { PublicacionCardComponent, Publicacion } from '../../components/publicacion-card/publicacion-card';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule, PublicacionCardComponent],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.css'
})
export class PublicacionesComponent {
  readonly Rocket = Rocket; readonly Plus = Plus;
  readonly LogOut = LogOut; readonly Home = Home;
  readonly User = User; readonly X = X;
  readonly ArrowUpDown = ArrowUpDown;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  // Estado con signals
  newPostModal = signal(false);
  successModal = signal(false);
  ordenamiento = signal<'fecha' | 'likes'>('fecha');
  paginaActual = signal(1);
  readonly porPagina = 5;

  nuevaPublicacion = { titulo: '', mensaje: '', imagen: '' };
  imagenFile: File | null = null;

  // Usuario actual simulado (Sprint 2: vendrá del localStorage)
  usuarioActual = 'yo';

  todasLasPublicaciones = signal<Publicacion[]>([
    {
      id: 1, autor: 'María García', username: 'mgarcia', tiempo: 'hace 2 horas',
      titulo: 'Bienvenidos a Orbit 🚀',
      mensaje: 'Esta es la primera publicación de nuestra nueva red social.',
      imagen: '', likes: 12, liked: false,
      comentarios: [{ autor: 'Carlos', texto: '¡Genial!', tiempo: 'hace 1h' }],
      showComments: false, esPropia: false
    },
    {
      id: 2, autor: 'Lucas Rodríguez', username: 'lucasr', tiempo: 'hace 5 horas',
      titulo: 'Tip de programación',
      mensaje: 'Recuerden siempre validar sus formularios tanto en el frontend como en el backend.',
      imagen: '', likes: 8, liked: false, comentarios: [], showComments: false, esPropia: false
    },
    {
      id: 3, autor: 'Mi usuario', username: 'yo', tiempo: 'hace 1 día',
      titulo: 'Mi primera publicación',
      mensaje: 'Hola a todos! Esta es mi primera publicación en Orbit.',
      imagen: '', likes: 3, liked: false, comentarios: [], showComments: false, esPropia: true
    }
  ]);

  // Publicaciones ordenadas
  publicacionesOrdenadas = computed(() => {
    const todas = [...this.todasLasPublicaciones()];
    if (this.ordenamiento() === 'likes') {
      return todas.sort((a, b) => b.likes - a.likes);
    }
    return todas.sort((a, b) => b.id - a.id);
  });

  // Total de páginas
  totalPaginas = computed(() =>
    Math.ceil(this.publicacionesOrdenadas().length / this.porPagina)
  );

  // Publicaciones de la página actual
  publicacionesPaginadas = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.porPagina;
    return this.publicacionesOrdenadas().slice(inicio, inicio + this.porPagina);
  });

  constructor(private router: Router) {}

  cambiarOrden(orden: 'fecha' | 'likes') {
    this.ordenamiento.set(orden);
    this.paginaActual.set(1);
  }

  paginaAnterior() {
    if (this.paginaActual() > 1) this.paginaActual.update(p => p - 1);
  }

  paginaSiguiente() {
    if (this.paginaActual() < this.totalPaginas()) this.paginaActual.update(p => p + 1);
  }

  toggleLike(post: Publicacion) {
    this.todasLasPublicaciones.update(posts =>
      posts.map(p => p.id === post.id
        ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
        : p
      )
    );
  }

  eliminarPost(post: Publicacion) {
    this.todasLasPublicaciones.update(posts => posts.filter(p => p.id !== post.id));
  }

  agregarComentario(event: { post: Publicacion; texto: string }) {
    this.todasLasPublicaciones.update(posts =>
      posts.map(p => p.id === event.post.id
        ? { ...p, comentarios: [...p.comentarios, { autor: 'Yo', texto: event.texto, tiempo: 'ahora' }] }
        : p
      )
    );
  }

  onImagenChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.imagenFile = file;
  }

  submitPost() {
  if (!this.nuevaPublicacion.titulo.trim() || !this.nuevaPublicacion.mensaje.trim()) return;

  let imagenUrl = '';

  if (this.imagenFile) {
    const reader = new FileReader();
    reader.onload = () => {
      const nueva: Publicacion = {
        id: Date.now(), autor: 'Mi usuario', username: this.usuarioActual,
        tiempo: 'ahora', titulo: this.nuevaPublicacion.titulo,
        mensaje: this.nuevaPublicacion.mensaje,
        imagen: reader.result as string,
        likes: 0, liked: false, comentarios: [], showComments: false, esPropia: true
      };
      this.todasLasPublicaciones.update(posts => [nueva, ...posts]);
      this.nuevaPublicacion = { titulo: '', mensaje: '', imagen: '' };
      this.imagenFile = null;
      this.newPostModal.set(false);
      this.successModal.set(true);
    };
    reader.readAsDataURL(this.imagenFile);
  } else {
    const nueva: Publicacion = {
      id: Date.now(), autor: 'Mi usuario', username: this.usuarioActual,
      tiempo: 'ahora', titulo: this.nuevaPublicacion.titulo,
      mensaje: this.nuevaPublicacion.mensaje, imagen: '',
      likes: 0, liked: false, comentarios: [], showComments: false, esPropia: true
    };
    this.todasLasPublicaciones.update(posts => [nueva, ...posts]);
    this.nuevaPublicacion = { titulo: '', mensaje: '', imagen: '' };
    this.imagenFile = null;
    this.newPostModal.set(false);
    this.successModal.set(true);
  }
}

  logout() { localStorage.clear(); this.router.navigate(['/login']); }
}