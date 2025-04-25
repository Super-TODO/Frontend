import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserProfile, RefreshTokenRequest } from '../../models/auth.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class SidebarComponent implements OnInit {
  userProfile: UserProfile | null = null;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.loadProfile();
    }
  }

  loadProfile(): void {
    this.authService.getUserProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.errorMessage = null;
      },
      error: (error) => {
        console.error('Profile load error:', error);
        if (error.status === 401) {
          this.handleTokenRefresh();
        } else {
          this.errorMessage = `Failed to load profile: ${error.message || error.statusText}`;
        }
      }
    });
  }

  handleTokenRefresh(): void {
    const refreshToken = this.authService.getRefreshToken();
    if (!refreshToken) {
      this.authService.clearTokens();
      this.router.navigate(['/login']);
      return;
    }

    const refreshRequest: RefreshTokenRequest = { refreshToken };
    this.authService.refreshToken(refreshRequest).subscribe({
      next: (authResponse) => {
        this.authService.saveTokens(authResponse);

        this.loadProfile();
      },
      error: (refreshError) => {
        console.error('Token refresh error:', refreshError);
        this.authService.clearTokens();
        this.router.navigate(['/login']);
      }
    });
  }

  logout(): void {
    const token = this.authService.getAccessToken();
    if (!token) {
      this.authService.clearTokens();
      this.router.navigate(['/login']);
      return;
    }
  
    this.authService.logout(token).subscribe({
      next: () => {
        this.authService.clearTokens();
        this.router.navigate(['/login']);
      },
      error: () => {
        this.authService.clearTokens();
        this.router.navigate(['/login']);
      }
    });  
  }
}