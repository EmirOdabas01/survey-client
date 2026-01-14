// src/shared/lib/cookies.client.ts
export const COOKIE_NAMES = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  TOKEN_EXPIRATION: "token_expiration",
} as const;

const COOKIE_OPTIONS = {
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

export function setAccessToken(token: string, expiration: string) {
  const expirationDate = new Date(expiration);
  const maxAge = Math.floor((expirationDate.getTime() - Date.now()) / 1000);

  document.cookie = `${COOKIE_NAMES.ACCESS_TOKEN}=${token}; path=${
    COOKIE_OPTIONS.path
  }; max-age=${maxAge}; ${COOKIE_OPTIONS.secure ? "secure;" : ""} samesite=${
    COOKIE_OPTIONS.sameSite
  }`;
  document.cookie = `${COOKIE_NAMES.TOKEN_EXPIRATION}=${expiration}; path=${
    COOKIE_OPTIONS.path
  }; max-age=${maxAge}; ${COOKIE_OPTIONS.secure ? "secure;" : ""} samesite=${
    COOKIE_OPTIONS.sameSite
  }`;
}

export function setRefreshToken(token: string) {
  const maxAge = 30 * 24 * 60 * 60;
  document.cookie = `${COOKIE_NAMES.REFRESH_TOKEN}=${token}; path=${
    COOKIE_OPTIONS.path
  }; max-age=${maxAge}; ${COOKIE_OPTIONS.secure ? "secure;" : ""} samesite=${
    COOKIE_OPTIONS.sameSite
  }`;
}

export function getAccessToken(): string | null {
  const cookies = document.cookie.split(";");
  const tokenCookie = cookies.find((c) =>
    c.trim().startsWith(`${COOKIE_NAMES.ACCESS_TOKEN}=`)
  );
  return tokenCookie ? tokenCookie.split("=")[1] : null;
}

export function getRefreshToken(): string | null {
  const cookies = document.cookie.split(";");
  const tokenCookie = cookies.find((c) =>
    c.trim().startsWith(`${COOKIE_NAMES.REFRESH_TOKEN}=`)
  );
  return tokenCookie ? tokenCookie.split("=")[1] : null;
}

export function getTokenExpiration(): string | null {
  const cookies = document.cookie.split(";");
  const expCookie = cookies.find((c) =>
    c.trim().startsWith(`${COOKIE_NAMES.TOKEN_EXPIRATION}=`)
  );
  return expCookie ? expCookie.split("=")[1] : null;
}

export function isTokenExpired(): boolean {
  const expiration = getTokenExpiration();
  if (!expiration) return true;

  return new Date(expiration) <= new Date();
}

export function deleteAuthTokens() {
  document.cookie = `${COOKIE_NAMES.ACCESS_TOKEN}=; path=/; max-age=0`;
  document.cookie = `${COOKIE_NAMES.REFRESH_TOKEN}=; path=/; max-age=0`;
  document.cookie = `${COOKIE_NAMES.TOKEN_EXPIRATION}=; path=/; max-age=0`;
}
