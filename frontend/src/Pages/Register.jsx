import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, MapPin } from 'lucide-react';

import api from '../api/api';
import { useAuth } from '../context/AuthContext';

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
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

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError('Please fill in all fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      const response = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        password: formData.password
      });

      const token = response.data.token;
      const user = response.data.user;

      if (token && user) {
        login(token, user);
        navigate('/');
      } else {
        navigate('/login');
      }

    } catch (error) {
      console.error('Registration failed:', error);

      setError(
        error.response?.data?.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">

      <div className="auth-container">

        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Create your customer account</p>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Name */}
          <div className="form-group">

            <label>Name</label>

            <div className="input-wrapper">
              <User size={18} />

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

          </div>

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

          {/* Phone */}
          <div className="form-group">

            <label>Phone</label>

            <div className="input-wrapper">
              <Phone size={18} />

              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

          </div>

          {/* Address */}
          <div className="form-group">

            <label>Address</label>

            <div className="input-wrapper">
              <MapPin size={18} />

              <input
                type="text"
                name="address"
                placeholder="Enter your address"
                value={formData.address}
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
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

          </div>

          {/* Confirm Password */}
          <div className="form-group">

            <label>Confirm Password</label>

            <div className="input-wrapper">
              <Lock size={18} />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>

        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">
            Login
          </Link>
        </div>

      </div>

    </main>
  );
}

export default Register;