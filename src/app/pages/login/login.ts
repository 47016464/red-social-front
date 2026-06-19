import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Rocket, Eye, EyeOff } from 'lucide-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink,
    LucideAngularModule],
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

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
  identifier: ['', Validators.required], 
  password: ['', [
    Validators.required,
    Validators.minLength(8),
    Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)
      ]]
    });
  }

  get email() { return this.loginForm.get('email')!; }
  get password() { return this.loginForm.get('password')!; }
  get identifier() { return this.loginForm.get('identifier')!; }  

  onSubmit() {
    if (this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }
    this.loading = true;
    this.errorMsg = '';
    setTimeout(() => {
      this.loading = false;
      localStorage.setItem('token', 'mock-token');
      this.router.navigate(['/publicaciones']);
    }, 1000);
  }
}