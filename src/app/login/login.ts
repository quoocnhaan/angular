import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth';
import { FormBuilder, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  authService = inject(AuthService)
  fb: FormBuilder = inject(FormBuilder)
  router = inject(Router)
  frmLogin = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  errorMessage = '';


  get f() { return this.frmLogin.controls; }

  get password() {
    return this.frmLogin.value.password || ''
  }

  get email() {
    return this.frmLogin.value.email || ''
  }

  async login() {
    console.log('Attempting to log in');
    if (this.frmLogin.invalid) return;

    this.errorMessage = '';

    try {
      const user = await this.authService.login(this.email, this.password);

      this.router.navigate(['/home']);
    } catch (err) {
      console.log('Login failed', err);
    }
  }
}
