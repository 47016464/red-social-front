import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, Rocket, Edit, LogOut, Home, User, Camera, Mail, Calendar, Shield } from 'lucide-angular';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink,
    LucideAngularModule],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css'
})
export class MiPerfilComponent {
  readonly Rocket = Rocket; readonly Edit = Edit;
  readonly LogOut = LogOut; readonly Home = Home;
  readonly User = User; readonly Camera = Camera;
  readonly Mail = Mail; readonly Calendar = Calendar;
  readonly Shield = Shield;

  editMode = false;
  previewUrl: string | null = null;
  successModal = false;

  user = {
    nombre: 'Juan', apellido: 'Pérez', username: 'juanperez',
    email: 'juan@email.com',
    descripcion: 'Apasionado por la tecnología y el desarrollo web.',
    fechaNacimiento: '1998-05-15', perfil: 'usuario',
    avatar: null as string | null
  };

  form!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      nombre: [this.user.nombre, [Validators.required, Validators.minLength(2)]],
      apellido: [this.user.apellido, [Validators.required, Validators.minLength(2)]],
      descripcion: [this.user.descripcion, Validators.maxLength(150)]
    });
  }

  get f() { return this.form.controls; }
  getInitials() { return (this.user.nombre[0] + this.user.apellido[0]).toUpperCase(); }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => this.previewUrl = reader.result as string;
    reader.readAsDataURL(file);
  }

  saveChanges() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.user.nombre = this.form.value.nombre;
    this.user.apellido = this.form.value.apellido;
    this.user.descripcion = this.form.value.descripcion;
    if (this.previewUrl) this.user.avatar = this.previewUrl;
    this.editMode = false;
    this.successModal = true;
  }

  cancelEdit() {
    this.editMode = false; this.previewUrl = null;
    this.form.patchValue({ nombre: this.user.nombre, apellido: this.user.apellido, descripcion: this.user.descripcion });
  }

  logout() { localStorage.clear(); this.router.navigate(['/login']); }
}