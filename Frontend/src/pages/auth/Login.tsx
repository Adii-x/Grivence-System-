import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../store/authStore';
import Input from '../../components/shared/Input';
import Button from '../../components/shared/Button';
import { Eye, EyeOff, AlertTriangle, ArrowLeft } from 'lucide-react';
import { loginApi } from '../../api/authApi';

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setError('');
    setLoading(true);
    try {
      const response = await loginApi(data.email, data.password);
      login(response.user, response.token);
      navigate(`/${response.user.role}/dashboard`);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Unable to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="w-full max-w-[380px] bg-surface border border-border rounded-lg p-5 sm:p-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded-sm"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden />
          Back to home
        </Link>
        <Link
          to="/"
          className="flex items-center gap-2 mb-1 w-fit rounded-md -ml-1 px-1 py-0.5 hover:bg-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        >
          <AlertTriangle className="w-5 h-5 text-accent shrink-0" aria-hidden />
          <span className="text-[22px] font-semibold text-text-primary">Nexus</span>
        </Link>
        <p className="text-text-secondary text-sm mb-6">Sign in to your account</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@university.edu"
            error={errors.email?.message}
            {...register('email', { required: 'Please enter a valid email address', pattern: { value: /^\S+@\S+$/i, message: 'Please enter a valid email address' } })}
          />
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password', { required: 'Please fill in all required fields' })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[30px] text-text-muted hover:text-text-secondary"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Signing In...' : 'Sign In'}</Button>
          {error && <p className="text-xs text-danger text-center">{error}</p>}
        </form>

        <p className="text-center text-sm text-text-secondary mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-accent hover:underline">Register</Link>
        </p>

        {import.meta.env.DEV && (
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-text-muted text-center mb-2">Test Credentials</p>
            <div className="space-y-1 text-xs text-text-secondary">
              <p>Student: student.test@grievease.com</p>
              <p>Staff: staff.test@grievease.com</p>
              <p>Admin: admin.test@grievease.com</p>
              <p className="text-text-muted">Password for all: Test@1234</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Login;
