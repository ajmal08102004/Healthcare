import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [showValidation, setShowValidation] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Password validation function
  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    return {
      minLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSymbol,
      isValid: minLength && hasUppercase && hasLowercase && hasNumber && hasSymbol
    };
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = 'Password must meet all requirements';
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setShowValidation(true);
      return;
    }
    
    // Set user data in context for the personal info form
    login({ email: formData.email, role: formData.role });
    
    // Navigate to personal information form
    navigate('/personal-info');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handlePasswordFocus = () => {
    setShowValidation(true);
  };

  const handlePasswordBlur = () => {
    if (formData.password === '') {
      setShowValidation(false);
    }
  };

  const validation = validatePassword(formData.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 p-4">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 p-8 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Register</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Email</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 ${
                    errors.email ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Enter your email"
                  required
                />
                <Mail className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-200">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={handlePasswordFocus}
                  onBlur={handlePasswordBlur}
                  className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 ${
                    errors.password ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Create password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center gap-2 mt-2 text-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{errors.password}</span>
                </div>
              )}

              {showValidation && formData.password && (
                <div className="mt-3 bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-sm text-white font-medium mb-2">Password Requirements:</p>
                  <div className="space-y-1">
                    <div className={`flex items-center gap-2 text-sm ${validation.minLength ? 'text-green-200' : 'text-red-200'}`}>
                      <Check className={`h-3 w-3 ${validation.minLength ? 'text-green-300' : 'text-red-300'}`} />
                      <span>At least 8 characters</span>
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${validation.hasUppercase ? 'text-green-200' : 'text-red-200'}`}>
                      <Check className={`h-3 w-3 ${validation.hasUppercase ? 'text-green-300' : 'text-red-300'}`} />
                      <span>One uppercase letter</span>
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${validation.hasLowercase ? 'text-green-200' : 'text-red-200'}`}>
                      <Check className={`h-3 w-3 ${validation.hasLowercase ? 'text-green-300' : 'text-red-300'}`} />
                      <span>One lowercase letter</span>
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${validation.hasNumber ? 'text-green-200' : 'text-red-200'}`}>
                      <Check className={`h-3 w-3 ${validation.hasNumber ? 'text-green-300' : 'text-red-300'}`} />
                      <span>One number</span>
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${validation.hasSymbol ? 'text-green-200' : 'text-red-200'}`}>
                      <Check className={`h-3 w-3 ${validation.hasSymbol ? 'text-green-300' : 'text-red-300'}`} />
                      <span>One symbol (!@#$%^&*)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Confirm your password"
                  required
                />
                <Lock className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-200">{errors.confirmPassword}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Role</label>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 appearance-none ${
                    errors.role ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="patient">Patient</option>
                  <option value="physiotherapist">Physiotherapist</option>
                </select>
                <div className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.role && <p className="mt-1 text-sm text-red-200">{errors.role}</p>}
            </div>

             <button
              type="submit"
              className="w-full bg-black text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors duration-200"
            >
              Register
            </button>

            <div className="space-y-3">
              <button
                type="button"
                className="w-full bg-white text-gray-700 py-3 px-4 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-3"
              >
                <span className="text-xl">🔍</span>
                Google
              </button>

              <button
                type="button"
                className="w-full bg-white text-gray-700 py-3 px-4 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-3"
              >
                <span className="text-xl">📘</span>
                Facebook
              </button>
            </div>

            <div className="text-center text-white">
              <span>Already have an account? </span>
              <Link to="/login" className="font-semibold hover:text-gray-200 transition-colors">
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;