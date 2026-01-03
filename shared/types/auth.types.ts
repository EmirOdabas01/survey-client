export interface User {
  nameSurname: string;
  userName: string;
  email: string;
}

export interface LoginCredentials {
  nameOrEmail: string;
  password: string;
}

export interface RegisterCredentials {
  nameSurname: string;
  userName: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiration: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  title: string;
}
