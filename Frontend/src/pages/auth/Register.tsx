import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../store/authStore';
import Input from '../../components/shared/Input';
import Select from '../../components/shared/Select';
import Button from '../../components/shared/Button';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { DEPARTMENTS, YEARS } from '../../utils/constants';
import { registerApi } from '../../api/authApi';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  studentId: string;
  department: string;
  year: string;
}

const strengthSegments = (password: string) => {
  let s = 0;
  if (password.length >= 6) s++;
  if (/[A-Z]/.test(password)) s++;
  if (/[0-9]/.test(password)) s++;
  if (/[^A-Za-z0-9]/.test(password)) s++;
  return s;
};

const segColors = ['bg-danger', 'bg-danger', 'bg-warning', 'bg-success'];

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>();
  const pwd = watch('password', '');

  const onSubmit = async (data: RegisterForm) => {
    setError('');
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const response = await registerApi({
        name: data.name,
        email: data.email,
        password: data.password,
        studentId: data.studentId,
        department: data.department,
        year: data.year,
      });
      login(response.user, response.token);
      navigate('/student/dashboard');
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Unable to create account');
    } finally {
      setLoading(false);
    }
  };

  const strength = strengthSegments(pwd);

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="w-full max-w-[480px] bg-surface border border-border rounded-lg p-5 sm:p-8">
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
        <p className="text-text-secondary text-sm mb-6">Create your student account</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" placeholder="John Doe" error={errors.name?.message}
              {...register('name', { required: 'Please fill in all required fields' })} />
            <Input label="Email" type="email" placeholder="you@university.edu" error={errors.email?.message}
              {...register('email', { required: 'Please enter a valid email address', pattern: { value: /^\S+@\S+$/i, message: 'Please enter a valid email address' } })} />
          </div>

          <div>
            <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message}
              {...register('password', { required: 'Please fill in all required fields', minLength: { value: 6, message: 'Minimum 6 characters' } })} />
            {pwd && (
              <div className="flex gap-1 mt-2">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className={`h-1 flex-1 rounded-sm ${i < strength ? segColors[strength - 1] : 'bg-border'}`} />
                ))}
              </div>
            )}
          </div>

          <Input label="Confirm Password" type="password" placeholder="••••••••" error={errors.confirmPassword?.message}
            {...register('confirmPassword', { required: 'Please fill in all required fields' })} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Student ID" placeholder="CS2021045" error={errors.studentId?.message}
              {...register('studentId', { required: 'Please fill in all required fields' })} />
            <Select label="Department" placeholder="Select department" error={errors.department?.message}
              options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
              {...register('department', { required: 'Please fill in all required fields' })} />
          </div>

          <Select label="Year" placeholder="Select year" error={errors.year?.message}
            options={YEARS.map((y) => ({ value: y, label: y }))}
            {...register('year', { required: 'Please fill in all required fields' })} />

          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</Button>
          {error && <p className="text-xs text-danger text-center">{error}</p>}
        </form>

        <p className="text-center text-sm text-text-secondary mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
