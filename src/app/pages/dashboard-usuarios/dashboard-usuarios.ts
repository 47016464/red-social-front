import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Rocket, Home, User, LogOut, UserPlus, UserCheck, UserX, Shield, X } from 'lucide-angular';
import { UsuariosService } from '../../services/usuarios.service';
import { AuthService } from '../../services/auth.service';
import { TiempoRelativoPipe } from '../../pipes/pipes';
import { ResaltarDirective } from '../../directivas/directivas';

function passwordMatch(control: AbstractControl): ValidationErrors | null {
  const pass = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return pass === confirm ? null : { mismatch: true };
}

@Component({
  selector: 'app-dashboard-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule, TiempoRelativoPipe, ResaltarDirective],
  templateUrl: './dashboard-usuarios.html',
  styleUrl: './dashboard-usuarios.css',
})
export class DashboardUsuariosComponent implements OnInit {
  readonly Rocket = Rocket; readonly Home = Home;
  readonly User = User; readonly LogOut = LogOut;
  readonly UserPlus = UserPlus; readonly UserCheck = UserCheck;
  readonly UserX = UserX; readonly Shield = Shield;
  readonly X = X;

  usuarios = signal<any[]>([]);
  cargando = signal(true);
  mostrarFormulario = signal(false);
  guardando = signal(false);
  successMsg = signal('');
  errorMsg = signal('');
  previewUrl = signal<string | null>(null);
  selectedFile: File | null = null;

  form!: FormGroup;
  usuarioActual: any;

  constructor(
    private usuariosService: UsuariosService,
    private authService: AuthService,
    private fb: FormBuilder,
  ) {
    this.usuarioActual = this.authService.getUsuario();
  }

  ngOnInit() {
    this.iniciarForm();
    this.cargarUsuarios();
  }

  iniciarForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)]],
      confirmPassword: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      descripcion: [''],
      perfil: ['usuario'],
    }, { validators: passwordMatch });
  }

  get f() { return this.form.controls; }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => this.previewUrl.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  cargarUsuarios() {
    this.cargando.set(true);
    this.usuariosService.listar().subscribe({
      next: (res) => { this.usuarios.set(res); this.cargando.set(false); },
      error: () => this.cargando.set(false),
    });
  }

  crearUsuario() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.guardando.set(true);

    const formData = new FormData();
    Object.entries(this.form.value).forEach(([k, v]) => {
      if (k !== 'confirmPassword' && v) formData.append(k, v as string);
    });
    if (this.selectedFile) {
      formData.append('imagenPerfil', this.selectedFile);
    }

    this.usuariosService.crear(formData).subscribe({
      next: () => {
        this.guardando.set(false);
        this.mostrarFormulario.set(false);
        this.form.reset({ perfil: 'usuario' });
        this.previewUrl.set(null);
        this.selectedFile = null;
        this.successMsg.set('Usuario creado correctamente');
        setTimeout(() => this.successMsg.set(''), 3000);
        this.cargarUsuarios();
      },
      error: (err) => {
        this.guardando.set(false);
        this.errorMsg.set(err?.error?.message || 'Error al crear el usuario');
        setTimeout(() => this.errorMsg.set(''), 3000);
      },
    });
  }

  deshabilitar(usuario: any) {
    this.usuariosService.deshabilitar(usuario._id).subscribe({
      next: () => {
        this.successMsg.set(`Usuario ${usuario.username} deshabilitado`);
        setTimeout(() => this.successMsg.set(''), 3000);
        this.cargarUsuarios();
      },
      error: () => {},
    });
  }

  habilitar(usuario: any) {
    this.usuariosService.habilitar(usuario._id).subscribe({
      next: () => {
        this.successMsg.set(`Usuario ${usuario.username} habilitado`);
        setTimeout(() => this.successMsg.set(''), 3000);
        this.cargarUsuarios();
      },
      error: () => {},
    });
  }

  logout() { this.authService.logout(); }
}