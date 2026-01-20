export interface User {
  userInfo: {
    nameSurname: string;
    userName: string;
    eMail: string;
  };
}

export interface LoginCredentials {
  nameOrEmail: string;
  password: string;
}
export interface RefreshTokenResponse {
  token: {
    accessToken: string;
    expiration: string;
    refreshToken: string;
  };
}
export interface RegisterCredentials {
  nameSurname: string;
  userName: string;
  email: string;
  password: string;
  passwordConfirm: string;
}
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiration: string;
}

export interface TokenResponse {
  token: {
    accessToken: string;
    expiration: string;
    refreshToken: string;
  };
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
