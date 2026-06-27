import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Rocket, Eye, EyeOff } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';
import { SesionService } from '../../services/sesion.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  errorMsg = '';
  showPassword = false;

  readonly Rocket = Rocket;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private sesionService: SesionService,
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/publicaciones']);
      return;
    }

    this.loginForm = this.fb.group({
      identifier: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)
      ]]
    });
  }

  get identifier() { return this.loginForm.get('identifier')!; }
  get password() { return this.loginForm.get('password')!; }

  onSubmit() {
    if (this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }
    this.loading = true;
    this.errorMsg = '';

    const { identifier, password } = this.loginForm.value;
    this.authService.login(identifier, password).subscribe({
      next: () => {
        this.loading = false;
        this.sesionService.dispararTimer(); // Arranca el contador de sesión
        this.router.navigate(['/publicaciones']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Usuario o contraseña incorrectos';
      }
    });
  }
}