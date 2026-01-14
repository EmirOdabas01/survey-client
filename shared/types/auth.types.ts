export interface UserInfoResponse {
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
  token: AuthTokens;
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
