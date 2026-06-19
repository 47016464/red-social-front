import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Rocket, Eye, EyeOff, Camera } from 'lucide-angular';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { signal } from '@angular/core';

function passwordMatch(control: AbstractControl): ValidationErrors | null {
  const pass = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return pass === confirm ? null : { mismatch: true };
}

function mayorDeEdad(minAge: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const hoy = new Date();
    const nacimiento = new Date(control.value);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return edad >= minAge ? null : { menorDeEdad: true };
  };
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class RegistroComponent {
  form!: FormGroup;

  loading = signal(false);
  successModal = signal(false);
  showPassword = signal(false);
  showConfirm = signal(false);
  previewUrl = signal<string | null>(null);
  errorMsg = signal('');

  selectedFile: File | null = null;

  readonly Rocket = Rocket;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly Camera = Camera;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^\S+$/)]],
      fechaNacimiento: ['', [Validators.required, mayorDeEdad(15)]],
      descripcion: ['', Validators.maxLength(150)],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatch });
  }

  get f() { return this.form.controls; }

  get safePreview(): SafeUrl | null {
    const url = this.previewUrl();
    return url ? this.sanitizer.bypassSecurityTrustUrl(url) : null;
  }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => { this.previewUrl.set(reader.result as string); };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.errorMsg.set('');

    setTimeout(() => {
      this.loading.set(false);
      this.successModal.set(true);
    }, 1000);
  }

  goToLogin() {
    this.successModal.set(false);
    this.form.reset();
    this.previewUrl.set(null);
    this.selectedFile = null;
    this.router.navigate(['/login']);
  }
}