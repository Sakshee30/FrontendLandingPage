import { apiClient } from '../api/api-client';

export type Role = 'owner' | 'admin' | 'editor' | 'viewer' | 'user';

export type AuthOrganization = {
  id: string;
  name: string;
  slug: string;
  status: string;
};

export type AuthPlan = {
  id: string;
  name: string;
  slug: string;
  limits: Record<string, unknown>;
  features: string[];
};

export type AuthUser = {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email: string;
  role: Role;
  status?: string;
  organization?: AuthOrganization;
  plan?: AuthPlan | null;
};

export type AuthSession = {
  user: AuthUser;
};

const SESSION_KEY = 'ziplin-user-session';

function unwrap(payload: any) {
  if (payload && typeof payload === 'object' && 'success' in payload) {
    return payload.data ?? {};
  }
  return payload;
}

export function getStoredSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_error) {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function storeSession(session: AuthSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export async function login(
  identifier: string,
  password: string,
): Promise<AuthSession> {
  const data = await apiClient.post<unknown, { user: AuthUser }>(
    '/auth/login',
    { identifier, password },
  );
  const session = { user: data.user };
  storeSession(session);
  return session;
}

export async function loginToPaidDemo(): Promise<AuthSession> {
  const data = await apiClient.post<unknown, { user: AuthUser }>(
    '/auth/dev/paid-login',
  );
  const session = { user: data.user };
  storeSession(session);
  return session;
}

export async function logout() {
  await apiClient.post('/auth/logout').catch(() => null);
  clearSession();
}

export async function getMe(): Promise<AuthUser> {
  const data = await apiClient.get<unknown, { user: AuthUser }>('/auth/me');
  return data.user;
}

export type UpdateProfilePayload = {
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
};

export async function updateProfile(
  payload: UpdateProfilePayload,
): Promise<AuthUser> {
  const data = await apiClient.patch<unknown, { user: AuthUser }>(
    '/auth/me',
    payload,
  );
  return data.user;
}

export type SignupDetails = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export async function requestRegistrationOtp(details: SignupDetails) {
  return apiClient.post<
    unknown,
    { email: string; expiresInMinutes: number; developmentOtp?: string }
  >('/auth/register/request-otp', details);
}

export async function verifyRegistrationOtp(
  email: string,
  otp: string,
): Promise<AuthSession> {
  const data = await apiClient.post<unknown, { user: AuthUser }>(
    '/auth/register/verify-otp',
    { email, otp },
  );
  const session = { user: data.user };
  storeSession(session);
  return session;
}

export async function forgotPassword(
  email: string,
): Promise<{ sent: boolean }> {
  return apiClient.post('/auth/forgot-password', { email });
}

export async function resetPassword(
  token: string,
  password: string,
): Promise<{ reset: boolean }> {
  return apiClient.post('/auth/reset-password', { token, password });
}
