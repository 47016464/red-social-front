import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Heart, MessageCircle, Send, Trash2 } from 'lucide-angular';

export interface Comentario {
  autor: string;
  texto: string;
  tiempo: string;
}

export interface Publicacion {
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
  esPropia: boolean;
}

@Component({
  selector: 'app-publicacion-card',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './publicacion-card.html',
  styleUrl: './publicacion-card.css'
})
export class PublicacionCardComponent {
  @Input() post!: Publicacion;
  @Output() onLike = new EventEmitter<Publicacion>();
  @Output() onEliminar = new EventEmitter<Publicacion>();
  @Output() oncomentar = new EventEmitter<{ post: Publicacion; texto: string }>();

  readonly Heart = Heart;
  readonly MessageCircle = MessageCircle;
  readonly Send = Send;
  readonly Trash2 = Trash2;

  newCommentText = '';
  showConfirmDelete = false;

  getInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
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

  confirmarEliminar() {
    this.showConfirmDelete = true;
  }

  cancelarEliminar() {
    this.showConfirmDelete = false;
  }

  eliminar() {
    this.showConfirmDelete = false;
    this.onEliminar.emit(this.post);
  }
}