export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  enabled: boolean;
}

export interface OtpVerificationRequest {
  email: string;
  otpCode: string;
}
