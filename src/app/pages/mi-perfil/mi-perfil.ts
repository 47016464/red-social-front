import { Component, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { LucideAngularModule, Rocket, Edit, LogOut, Home, User, Camera, Mail, Calendar, Shield, Heart, MessageCircle } from 'lucide-angular';
import { Publicacion } from '../../components/publicacion-card/publicacion-card';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css'
})
export class MiPerfilComponent {
  readonly Rocket = Rocket; readonly Edit = Edit;
  readonly LogOut = LogOut; readonly Home = Home;
  readonly User = User; readonly Camera = Camera;
  readonly Mail = Mail; readonly Calendar = Calendar;
  readonly Shield = Shield; readonly Heart = Heart;
  readonly MessageCircle = MessageCircle;

  editMode = signal(false);
  successModal = signal(false);
  previewUrl = signal<string | null>(null);

  user = {
    nombre: 'Juan', apellido: 'Pérez', username: 'juanperez',
    email: 'juan@email.com',
    descripcion: 'Apasionado por la tecnología y el desarrollo web.',
    fechaNacimiento: '1998-05-15', perfil: 'usuario',
    avatar: null as string | null
  };

  // Últimas 3 publicaciones propias (Sprint 2: vendrán del backend)
  misPublicaciones = signal<Publicacion[]>([
    {
      id: 3, autor: 'Juan Pérez', username: 'juanperez', tiempo: 'hace 1 día',
      titulo: 'Mi primera publicación',
      mensaje: 'Hola a todos! Esta es mi primera publicación en Orbit.',
      imagen: '', likes: 3, liked: false,
      comentarios: [{ autor: 'María', texto: 'Bienvenido!', tiempo: 'hace 20h' }],
      showComments: false, esPropia: true
    },
    {
      id: 4, autor: 'Juan Pérez', username: 'juanperez', tiempo: 'hace 3 días',
      titulo: 'Aprendiendo Angular',
      mensaje: 'Angular 17 con Signals es una maravilla. Lo recomiendo totalmente.',
      imagen: '', likes: 7, liked: false,
      comentarios: [],
      showComments: false, esPropia: true
    },
    {
      id: 5, autor: 'Juan Pérez', username: 'juanperez', tiempo: 'hace 1 semana',
      titulo: 'NestJS + MongoDB',
      mensaje: 'Combinación perfecta para el backend. Atlas hace todo más fácil.',
      imagen: '', likes: 5, liked: false,
      comentarios: [
        { autor: 'Lucas', texto: 'Totalmente de acuerdo!', tiempo: 'hace 5 días' }
      ],
      showComments: false, esPropia: true
    }
  ]);

  ultimas3 = computed(() => this.misPublicaciones().slice(0, 3));

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.form = this.fb.group({
      nombre: [this.user.nombre, [Validators.required, Validators.minLength(2)]],
      apellido: [this.user.apellido, [Validators.required, Validators.minLength(2)]],
      descripcion: [this.user.descripcion, Validators.maxLength(150)]
    });
  }

  get f() { return this.form.controls; }

  getInitials() {
    return (this.user.nombre[0] + this.user.apellido[0]).toUpperCase();
  }

  get safeAvatar(): SafeUrl | null {
    const url = this.previewUrl() || this.user.avatar;
    return url ? this.sanitizer.bypassSecurityTrustUrl(url) : null;
  }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { this.previewUrl.set(reader.result as string); };
    reader.readAsDataURL(file);
  }

  saveChanges() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.user.nombre = this.form.value.nombre;
    this.user.apellido = this.form.value.apellido;
    this.user.descripcion = this.form.value.descripcion;
    if (this.previewUrl()) this.user.avatar = this.previewUrl();
    this.editMode.set(false);
    this.successModal.set(true);
  }

  cancelEdit() {
    this.editMode.set(false);
    this.previewUrl.set(null);
    this.form.patchValue({
      nombre: this.user.nombre,
      apellido: this.user.apellido,
      descripcion: this.user.descripcion
    });
  }

  toggleComentarios(pub: Publicacion) {
    pub.showComments = !pub.showComments;
  }

  logout() { localStorage.clear(); this.router.navigate(['/login']); }
}