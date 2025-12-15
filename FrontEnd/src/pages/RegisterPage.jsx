import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock } from 'lucide-react';
import { registerSchema } from '../lib/formSchemas';
import { LOGO_URL } from '../lib/constants';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import axios from 'axios';

function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [message, setMessage] = useState('');

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      address: '',
    },
  });

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  const onSubmit = async (data) => {
    if (!termsAccepted) {
      setMessage('You must agree to the terms and conditions.');
      return;
    }

    if (data.password !== data.confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Backend call to Laravel registration API
      const res = await axios.post('http://127.0.0.1:8000/api/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || null,      // optional
        address: data.address || null,  // optional
      });

      setMessage(res.data.message || 'Registration successful!');
      navigate('/login'); // redirect to login
    } catch (err) {
      console.error(err);

      // Laravel validation errors
      if (err.response?.status === 422) {
        const errors = err.response.data.errors;
        const firstField = Object.keys(errors)[0];
        setMessage(errors[firstField][0]);
      } 
      // Other backend errors
      else if (err.response?.data?.message) {
        setMessage(err.response.data.message);
      } 
      // Unknown/network errors
      else {
        setMessage('Registration failed. Check your input or backend.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    !Object.keys(errors).length &&
    termsAccepted &&
    password &&
    confirmPassword &&
    password === confirmPassword;

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1616627451064-3f4e87c71849?auto=format&fit=crop&w=1400&q=80')",
      }}
    >
      <div>
        <div className="h-24 w-24 mx-auto mb-4">
          <img className="h-full w-full" src={LOGO_URL || 'img/logo.png'} alt="LuxeHome Logo" />
        </div>

        <div className="bg-white bg-opacity-90 backdrop-blur-md shadow-2xl rounded-2xl p-10 max-w-md w-full">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">LuxeHome Furniture</h1>
          <p className="text-center text-gray-500 mb-8">Create your account to join LuxeHome.</p>

          {message && <p className="text-red-500 text-center mb-4">{message}</p>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input label="Full Name" type="text" placeholder="Enter your full name" icon={<User size={20} />} error={errors.name?.message} required {...register('name')} />
            <Input label="Email" type="email" placeholder="Enter your email" icon={<Mail size={20} />} error={errors.email?.message} required {...register('email')} />
            <Input label="Password" type="password" placeholder="Create a password" icon={<Lock size={20} />} error={errors.password?.message} required {...register('password')} />
            <Input label="Confirm Password" type="password" placeholder="Re-enter your password" icon={<Lock size={20} />} error={errors.confirmPassword?.message} required {...register('confirmPassword')} />
            <Input label="Phone" type="text" placeholder="Enter your phone number" error={errors.phone?.message} {...register('phone')} />
            <Input label="Address" type="text" placeholder="Enter your address" error={errors.address?.message} {...register('address')} />

            <div className="flex items-start space-x-2">
              <input type="checkbox" id="terms" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-1 accent-amber-700" />
              <label htmlFor="terms" className="text-gray-600 text-sm leading-tight">
                I agree to the <a href="#" className="text-amber-700 hover:underline font-medium">Terms & Conditions</a>
              </label>
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-md hover:shadow-lg transition-all duration-300" loading={loading} disabled={!isFormValid || loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Already have an account? <Link to="/login" className="text-amber-700 font-semibold hover:underline">Login</Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-md shadow-md hover:shadow-lg transition-all duration-300 font-medium">
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
