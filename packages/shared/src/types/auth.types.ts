import { Role } from '../enums';

export interface JwtPayload {
  sub: string;
  role: Role;
  email: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: Role;
}

export interface AuthResult {
  accessToken: string;
  user: AuthUser;
}

