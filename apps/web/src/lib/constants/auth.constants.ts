export const AUTH_TOKEN_KEY = "matoshreecabs_token";
export const AUTH_USER_KEY = "matoshreecabs_user";

// Auth calls only ever run in the browser (they read the token from
// localStorage), so always use the same-origin proxy path — next.config
// rewrites forward /api/* to the backend with no CORS involved.
export const API_BASE = "/api";