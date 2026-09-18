import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';

import api from '../api/api';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');

    if (!formData.email || !formData.password) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);

      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      const token = response.data.token;
      const user = response.data.user;

      if (!token) {
        setError('Login failed. No authentication token received.');
        return;
      }

      login(token, user);

      if (user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }

    } catch (error) {
      console.error('Login failed:', error);

      setError(
        error.response?.data?.message ||
        'Invalid email or password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">

      <div className="auth-container login-container">

        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Login to your E-Shop account</p>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div className="form-group">

            <label>Email</label>

            <div className="input-wrapper">
              <Mail size={18} />

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

          </div>

          {/* Password */}
          <div className="form-group">

            <label>Password</label>

            <div className="input-wrapper">
              <Lock size={18} />

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="forgot-password">
            <Link to="/forgot-password">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

        </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register">
            Register
          </Link>
        </div>

      </div>

    </main>
  );
}

export default Login;