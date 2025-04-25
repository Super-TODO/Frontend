import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OtpVerificationRequest } from '../../models/auth.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class OtpVerificationComponent implements OnInit {
  model: OtpVerificationRequest = { email: '', otpCode: '' };
  error: string | null = null;
  success: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    const email = localStorage.getItem('pendingVerificationEmail');
    if (email) this.model.email = email;
    else this.router.navigate(['/register']);
  }

  resend() {
    this.clear();
    this.auth.resendOtp(this.model.email).subscribe({
      next: () => this.success = 'A new OTP has been sent to your email.',
      error: e => this.error = e.error?.message || 'Failed to resend OTP.'
    });
  }

  verify() {
    this.clear();
    if (!this.model.otpCode) { this.error = 'Please enter the OTP.'; return; }
    this.auth.verifyOtp(this.model).subscribe({
      next: res => {
        this.success = res;
        localStorage.removeItem('pendingVerificationEmail');
        this.router.navigate(['/login']);
      },
      error: e => this.error = e.error?.message || 'Failed to verify OTP.'
    });
  }

  private clear() {
    this.error = this.success = null;
  }
}
