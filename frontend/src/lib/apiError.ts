import { isAxiosError } from 'axios';

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    return (error.response?.data as { message?: string })?.message ?? fallback;
  }

  return fallback;
}
