import { apiClient } from "../api/api-client";
import { AuthUser, Role } from "./auth";

export async function listUsers(): Promise<AuthUser[]> {
  const data = await apiClient.get<unknown, { users: AuthUser[] }>(
    "/auth/users",
  );
  return data.users ?? [];
}

export async function createUser(payload: {
  name: string;
  email: string;
  role: Role;
  password: string;
}) {
  const data = await apiClient.post<unknown, { user: AuthUser }>(
    "/auth/users",
    payload,
  );
  return data.user;
}

export async function updateUser(
  id: string,
  payload: { name: string; role: Role },
) {
  const data = await apiClient.put<unknown, { user: AuthUser }>(
    `/auth/users/${id}`,
    payload,
  );
  return data.user;
}

export async function deleteUser(id: string) {
  await apiClient.delete(`/auth/users/${id}`);
}

export async function blockUser(id: string) {
  await apiClient.patch(`/auth/users/${id}/block`);
}

export async function unblockUser(id: string) {
  await apiClient.patch(`/auth/users/${id}/unblock`);
}
