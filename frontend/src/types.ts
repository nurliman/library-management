import { UserRole } from "@/constants";

export type Nullable<T> = T | null | undefined;

export type ServerResponse<T> = {
  status: number;
  data: T;
  message: string;
};

export type Credential = {
  access_token: string;
  refresh_token: string;
};

export type User = {
  id: string;
  username: string;
  email: string;
  role: string;
};

export type CredentialUser = {
  user: User;
  credentials: Credential;
};

export type LoginRequest = {
  username?: string;
  email?: string;
  password: string;
};

export type UserRoles = (typeof UserRole)[keyof typeof UserRole];
