import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class OtpVerificationComponent implements OnInit {
  otpForm: FormGroup;
  errorMessage: string | null = null;
  email: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.otpForm = this.fb.group({
      otpCode: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || null;
      console.log('Email from query params:', this.email);
    });
  }

  onSubmit(): void {
    console.log('Form valid:', this.otpForm.valid); 
    console.log('Form value:', this.otpForm.value); 
    console.log('Email:', this.email);

    if (this.otpForm.valid && this.email) {
      const request = {
        email: this.email,
        otpCode: this.otpForm.get('otpCode')?.value
      };
      console.log('Sending OTP verification request:', request);
      this.authService.verifyOtp(request).subscribe({
        next: (response) => {
          console.log('OTP verification successful:', response);
          this.errorMessage = null;
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('OTP verification error:', error);
          this.errorMessage = error.status === 400 ? 'Invalid OTP. Please try again.' : 'An error occurred. Please try again later.';
        }
      });
    } else {
      this.errorMessage = 'Please enter the OTP or ensure the email is provided.';
      console.log('Form invalid or email missing');
    }
  }
}