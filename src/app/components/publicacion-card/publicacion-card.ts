import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Heart, MessageCircle, Send, Trash2 } from 'lucide-angular';

export interface Comentario {
  autor: any; // puede ser string (viejo) o { nombre, apellido, username } (backend)
  texto: string;
  tiempo?: string;
  creadoEn?: string;
}

export interface Publicacion {
  _id: string;
  titulo: string;
  mensaje: string;
  imagen: string;
  autor: { _id: string; nombre: string; apellido: string; username: string; imagenPerfil?: string };
  likes: string[];          // array de IDs
  comentarios: Comentario[];
  createdAt: string;
  eliminado: boolean;
  showComments?: boolean;
}

@Component({
  selector: 'app-publicacion-card',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, RouterLink],
  templateUrl: './publicacion-card.html',
  styleUrl: './publicacion-card.css'
})
export class PublicacionCardComponent {
  @Input() post!: Publicacion;
  @Input() usuarioActualId: string = '';   // para saber si liked / esPropia
  @Output() onLike = new EventEmitter<Publicacion>();
  @Output() onEliminar = new EventEmitter<Publicacion>();
  @Output() oncomentar = new EventEmitter<{ post: Publicacion; texto: string }>();

  readonly Heart = Heart;
  readonly MessageCircle = MessageCircle;
  readonly Send = Send;
  readonly Trash2 = Trash2;

  newCommentText = '';

  get primeros3Comentarios() {
    return this.post.comentarios.slice(0, 3);
  }
  showConfirmDelete = false;

  get liked(): boolean {
    return this.post.likes.includes(this.usuarioActualId);
  }

  get esPropia(): boolean {
    return this.post.autor?._id === this.usuarioActualId;
  }

  get cantidadLikes(): number {
    return this.post.likes.length;
  }

  get nombreAutor(): string {
    return `${this.post.autor?.nombre ?? ''} ${this.post.autor?.apellido ?? ''}`.trim();
  }

  get usernameAutor(): string {
    return this.post.autor?.username ?? '';
  }

  getInitials(): string {
    const n = this.post.autor?.nombre?.[0] ?? '';
    const a = this.post.autor?.apellido?.[0] ?? '';
    return (n + a).toUpperCase();
  }

  getNombreComentario(autor: any): string {
    if (typeof autor === 'string') return autor;
    return `${autor?.nombre ?? ''} ${autor?.apellido ?? ''}`.trim();
  }

  toggleComments() {
    this.post.showComments = !this.post.showComments;
  }

  addComment() {
    const texto = this.newCommentText.trim();
    if (!texto) return;
    this.oncomentar.emit({ post: this.post, texto });
    this.newCommentText = '';
  }

  confirmarEliminar() { this.showConfirmDelete = true; }
  cancelarEliminar() { this.showConfirmDelete = false; }
  eliminar() {
    this.showConfirmDelete = false;
    this.onEliminar.emit(this.post);
  }
}