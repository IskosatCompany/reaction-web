export enum UserRole {
  admin = 'ADMINISTRATOR',
  coach = 'COACH'
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  authToken: string;
  refreshToken: string;
  role: UserRole;
}
