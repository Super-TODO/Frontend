import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RegisterRequest } from '../../models/auth.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class RegisterComponent {
  model: RegisterRequest = {
    username: '',
    email: '',
    password: ''
  };
  error: string | null = null;
  successMessage: string | null = null;
  auth: any;

  constructor(private authService: AuthService, private router: Router) {}
 register() {
  this.error = null;

  this.authService.register(this.model).subscribe({
    next: () => {
      localStorage.setItem('pendingVerificationEmail', this.model.email);
      this.router.navigate(['/verify-otp']);
    },
    error: (err) => {
      const backendError = err?.error?.error;

      if (typeof backendError === 'string') {
        if (backendError.includes('Email')) {
          this.error = 'This email is already registered';
        } else if (backendError.includes('Username')) {
          this.error = 'This username is already taken';
        } else {
          this.error = backendError;
        }
      } else {
        this.error = 'Registration failed. Please try again.';
      }

      console.error('Registration error:', err);
    }
  });
}
}