export interface User {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  role: 'guest' | 'host' | 'both';
  cnicStatus: 'pending' | 'verified' | 'rejected';
  cnicNumber?: string;
  cnicDocUrl?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  phone: string;
  password: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface CnicUploadRequest {
  cnicNumber: string;
}
