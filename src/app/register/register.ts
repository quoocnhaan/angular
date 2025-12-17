import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { mustMatch } from '../helper/mustMatch-validator';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-register',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  authService: AuthService = inject(AuthService)
  fb: FormBuilder = inject(FormBuilder)
  frmRegister = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    ConfirmPassword: ['', [Validators.required]]
  }, { validators: mustMatch('password', 'ConfirmPassword') });

  get f() { return this.frmRegister.controls; }

  get password() {
    return this.frmRegister.value.password || ''
  }

  get email() {
    return this.frmRegister.value.email || ''
  }

  createAccount() {
    if (this.frmRegister.invalid) {
      alert('Form is invalid, please check again')
      return;
    }
    this.authService.CreateAccount(this.email, this.password);
  }
}
