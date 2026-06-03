import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { signin } from '../api/auth';
import { AuthLayout, Field, buttonClassName, inputClassName } from '../components/AuthLayout';
import { signinSchema, type SigninFormData } from '../lib/validation';

export function SignInPage() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = async (data: SigninFormData) => {
    setApiError(null);
    try {
      await signin(data);
      navigate('/app');
    } catch (error) {
      if (isAxiosError(error)) {
        setApiError(
          (error.response?.data as { message?: string })?.message ??
            'Invalid credentials. Please try again.',
        );
        return;
      }
      setApiError('Invalid credentials. Please try again.');
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue"
      footer={
        <>
          Need an account?{' '}
          <Link to="/signup" className="font-medium text-sky-400 hover:text-sky-300">
            Sign up
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field label="Email" error={errors.email?.message}>
          <input
            type="email"
            autoComplete="email"
            className={inputClassName}
            {...register('email')}
          />
        </Field>

        <Field label="Password" error={errors.password?.message}>
          <input
            type="password"
            autoComplete="current-password"
            className={inputClassName}
            {...register('password')}
          />
        </Field>

        {apiError && (
          <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {apiError}
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className={buttonClassName}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </AuthLayout>
  );
}
