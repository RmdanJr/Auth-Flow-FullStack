import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signin } from '../api/auth';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Field } from '../components/ui/Field';
import { getApiErrorMessage } from '../lib/apiError';
import {
  alertErrorClassName,
  alertSuccessClassName,
  buttonClassName,
  inputClassName,
  linkClassName,
} from '../lib/formStyles';
import { signinSchema, type SigninFormData } from '../lib/validation';

export function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const registered = (location.state as { registered?: boolean } | null)?.registered;
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
      setApiError(getApiErrorMessage(error, 'Invalid credentials. Please try again.'));
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue"
      footer={
        <>
          Need an account?{' '}
          <Link to="/signup" className={linkClassName}>
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

        {registered && (
          <div className={alertSuccessClassName}>
            Account created. Sign in to continue.
          </div>
        )}

        {apiError && <div className={alertErrorClassName}>{apiError}</div>}

        <button type="submit" disabled={isSubmitting} className={buttonClassName}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </AuthLayout>
  );
}
