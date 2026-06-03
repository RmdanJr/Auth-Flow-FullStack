import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signup } from '../api/auth';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Field } from '../components/ui/Field';
import { getApiErrorMessage } from '../lib/apiError';
import {
  alertErrorClassName,
  buttonClassName,
  inputClassName,
  linkClassName,
} from '../lib/formStyles';
import { signupSchema, type SignupFormData } from '../lib/validation';

export function SignUpPage() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setApiError(null);
    try {
      await signup(data);
      navigate('/signin', { state: { registered: true } });
    } catch (error) {
      setApiError(getApiErrorMessage(error, 'Unable to create account. Please try again.'));
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Sign up to access the application"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/signin" className={linkClassName}>
            Sign in
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

        <Field label="Name" error={errors.name?.message}>
          <input
            type="text"
            autoComplete="name"
            className={inputClassName}
            {...register('name')}
          />
        </Field>

        <Field label="Password" error={errors.password?.message}>
          <input
            type="password"
            autoComplete="new-password"
            className={inputClassName}
            {...register('password')}
          />
          <p className="text-xs leading-relaxed text-[#848fa3]">
            At least 8 characters with one letter, one number, and one special character.
          </p>
        </Field>

        {apiError && <div className={alertErrorClassName}>{apiError}</div>}

        <button type="submit" disabled={isSubmitting} className={buttonClassName}>
          {isSubmitting ? 'Creating account...' : 'Sign up'}
        </button>
      </form>
    </AuthLayout>
  );
}
