import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { loginSchema } from '../lib/formSchemas';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext'; // 🔹 Import AuthContext

function LoginPage() {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const { login, user } = useAuth(); // 🔹 Use login from context
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  // Only redirect after user state updates (prevents infinite loop)
  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/dashboard");
      else if (user.role === "user") navigate("/");
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage('');

    try {
      const res = await login(data); // 🔹 Use context login

      success(res.message || 'Login successful!');
      // No redirect here; useEffect will handle navigation after user state updates
    } catch (err) {
      console.error(err);
      setMessage(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center"
         style={{ backgroundImage: "url('https://images.unsplash.com/photo-1616627451064-3f4e87c71849?auto=format&fit=crop&w=1400&q=80')" }}>
      <div>
        <div className="h-24 w-24 mx-auto mb-4">
          <img className="h-full w-full" src="img/logo.png" alt="LuxeHome Logo" />
        </div>

        <div className="bg-white bg-opacity-90 backdrop-blur-md shadow-2xl rounded-2xl p-10 max-w-md w-full">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">LuxeHome Furniture</h1>
          <p className="text-center text-gray-500 mb-8">Welcome back! Please log in to continue.</p>

          {message && <p className="text-red-500 text-center mb-4">{message}</p>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              icon={<Mail size={20} />}
              error={errors.email?.message}
              required
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              icon={<Lock size={20} />}
              error={errors.password?.message}
              required
              {...register('password')}
            />

            <div className="flex justify-between items-center">
              <label className="flex items-center text-gray-600 text-sm">
                <input type="checkbox" className="mr-2 accent-amber-700" />
                Remember me
              </label>
              <a href="#" className="text-amber-700 hover:underline text-sm">Forgot Password?</a>
            </div>

            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-md hover:shadow-lg transition-all duration-300"
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-amber-700 font-semibold hover:underline">Sign up</Link>
          </p>

          <div className="mt-4 text-center">
            <Link to="/" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm
                 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800
                 text-white rounded-md shadow-md hover:shadow-lg transition-all duration-300 font-medium">
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
