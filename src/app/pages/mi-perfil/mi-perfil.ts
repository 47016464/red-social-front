import { Component, signal, computed, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {
  LucideAngularModule, Rocket, Edit, LogOut, Home,
  User, Camera, Mail, Calendar, Shield, Heart, MessageCircle,
} from 'lucide-angular';
import { PublicacionesService } from '../../services/publicaciones.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css',
})
export class MiPerfilComponent implements OnInit {
  readonly Rocket = Rocket; readonly Edit = Edit;
  readonly LogOut = LogOut; readonly Home = Home;
  readonly User = User; readonly Camera = Camera;
  readonly Mail = Mail; readonly Calendar = Calendar;
  readonly Shield = Shield; readonly Heart = Heart;
  readonly MessageCircle = MessageCircle;

  editMode = signal(false);
  successModal = signal(false);
  previewUrl = signal<string | null>(null);

  // Se llena desde localStorage al iniciar
  user: any = {};

  misPublicaciones = signal<any[]>([]);

  ultimas3 = computed(() => this.misPublicaciones().slice(0, 3));

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sanitizer: DomSanitizer,
    private pubService: PublicacionesService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.user = this.authService.getUsuario() ?? {};
    this.form = this.fb.group({
      nombre: [this.user.nombre ?? '', [Validators.required, Validators.minLength(2)]],
      apellido: [this.user.apellido ?? '', [Validators.required, Validators.minLength(2)]],
      descripcion: [this.user.descripcion ?? '', Validators.maxLength(150)],
    });

    if (this.user._id) {
      this.pubService.listar('fecha', 0, 3, this.user._id).subscribe({
        next: (res) => this.misPublicaciones.set(res.publicaciones),
        error: () => {},
      });
    }
  }

  get f() { return this.form.controls; }

  getInitials(): string {
    const n = this.user.nombre?.[0] ?? '';
    const a = this.user.apellido?.[0] ?? '';
    return (n + a).toUpperCase();
  }

  get safeAvatar(): SafeUrl | null {
    const url = this.previewUrl() || this.user.imagenPerfil;
    return url ? this.sanitizer.bypassSecurityTrustUrl(url) : null;
  }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => this.previewUrl.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  saveChanges() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    // Actualizamos el objeto local y el localStorage
    this.user = {
      ...this.user,
      nombre: this.form.value.nombre,
      apellido: this.form.value.apellido,
      descripcion: this.form.value.descripcion,
      ...(this.previewUrl() ? { imagenPerfil: this.previewUrl() } : {}),
    };
    localStorage.setItem('usuario', JSON.stringify(this.user));
    this.editMode.set(false);
    this.successModal.set(true);
    // TODO Sprint 3: llamar a endpoint PUT /usuarios/:id para persistir en DB
  }

  cancelEdit() {
    this.editMode.set(false);
    this.previewUrl.set(null);
    this.form.patchValue({
      nombre: this.user.nombre,
      apellido: this.user.apellido,
      descripcion: this.user.descripcion,
    });
  }

  toggleComentarios(pub: any) {
    pub.showComments = !pub.showComments;
  }

  logout() { this.authService.logout(); }
}