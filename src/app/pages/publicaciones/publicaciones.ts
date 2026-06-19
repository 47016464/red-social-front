import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, Rocket, Heart, MessageCircle, Plus, LogOut, Home, User, X, Send } from 'lucide-angular';

interface Comentario {
  autor: string;
  texto: string;
  tiempo: string;
}

interface Publicacion {
  id: number;
  autor: string;
  username: string;
  tiempo: string;
  titulo: string;
  mensaje: string;
  imagen: string;
  likes: number;
  liked: boolean;
  comentarios: Comentario[];
  showComments: boolean;
}

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink,
    LucideAngularModule],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.css'
})
export class PublicacionesComponent {
  readonly Rocket = Rocket; readonly Heart = Heart;
  readonly MessageCircle = MessageCircle; readonly Plus = Plus;
  readonly LogOut = LogOut; readonly Home = Home;
  readonly User = User; readonly X = X; readonly Send = Send;

  newPostModal = false;
  successModal = false;
  nuevaPublicacion = { titulo: '', mensaje: '', imagen: '' };
  newCommentText: { [key: number]: string } = {};

  publicaciones: Publicacion[] = [
    {
      id: 1, autor: 'María García', username: 'mgarcia', tiempo: 'hace 2 horas',
      titulo: 'Bienvenidos a Orbit 🚀',
      mensaje: 'Esta es la primera publicación de nuestra nueva red social. ¡Estamos felices de que estés acá!',
      imagen: '', likes: 12, liked: false,
      comentarios: [{ autor: 'Carlos', texto: '¡Genial, estaba esperando esto!', tiempo: 'hace 1h' }],
      showComments: false
    },
    {
      id: 2, autor: 'Lucas Rodríguez', username: 'lucasr', tiempo: 'hace 5 horas',
      titulo: 'Tip de programación',
      mensaje: 'Recuerden siempre validar sus formularios tanto en el frontend como en el backend.',
      imagen: '', likes: 8, liked: false, comentarios: [], showComments: false
    }
  ];

  constructor(private router: Router) {}

  toggleLike(post: Publicacion) {
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
  }

  toggleComments(post: Publicacion) {
    post.showComments = !post.showComments;
  }

  addComment(post: Publicacion) {
    const texto = (this.newCommentText[post.id] || '').trim();
    if (!texto) return;
    post.comentarios.push({ autor: 'Yo', texto, tiempo: 'ahora' });
    this.newCommentText[post.id] = '';
  }

  submitPost() {
    if (!this.nuevaPublicacion.titulo.trim() || !this.nuevaPublicacion.mensaje.trim()) return;
    this.publicaciones.unshift({
      id: Date.now(), autor: 'Mi usuario', username: 'yo', tiempo: 'ahora',
      titulo: this.nuevaPublicacion.titulo, mensaje: this.nuevaPublicacion.mensaje,
      imagen: this.nuevaPublicacion.imagen,
      likes: 0, liked: false, comentarios: [], showComments: false
    });
    this.nuevaPublicacion = { titulo: '', mensaje: '', imagen: '' };
    this.newPostModal = false;
    this.successModal = true;
  }

  getInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  logout() { localStorage.clear(); this.router.navigate(['/login']); }
}