import { apiClient } from './client';
import type { SigninFormData, SignupFormData } from '../lib/validation';

export interface User {
  id: string;
  email: string;
  name: string;
}

export async function signup(data: SignupFormData): Promise<User> {
  const response = await apiClient.post<User>('/auth/signup', data);
  return response.data;
}

export async function signin(data: SigninFormData): Promise<User> {
  const response = await apiClient.post<User>('/auth/signin', data);
  return response.data;
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}

export async function getMe(): Promise<User> {
  const response = await apiClient.get<User>('/users/me');
  return response.data;
}
