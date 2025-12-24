// Login component - Form for users to log into their accounts
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

function Login({ onSwitchToSignup }) {
    // State for form fields
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // State for error messages
    const [error, setError] = useState('');

    // State for loading
    const [loading, setLoading] = useState(false);

    // Get login function from auth context
    const { login } = useAuth();

    // Handle input changes - updates formData when user types
    const handleChange = (e) => {
        setFormData({ 
            ...formData, 
            [e.target.name]: e.target.value 
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page refresh

        // Clear previous errors
        setError('');

        // Set loading to true (shows loading state on button)
        setLoading(true);

        try {
            // Call login function with form data
            await login(
                formData.email, 
                formData.password
            );
            
            // Success! User is now logged in
            
        } catch (err) {
            // Show error message to user
            setError(err.response?.data?.error || 'Login failed. Invalid credentials.');
        } finally {
            // Set loading back to false
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Log In</h2>

                {/* Show error message if exists */}
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {/* Email input */}
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                    />

                    {/* Password input */}
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                    />

                    {/* Submit button */}
                    <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                {/* Link to switch to signup */}
                <p className="auth-switch">
                    Don't have an account?{' '}
                    <span onClick={onSwitchToSignup}>Sign up</span>
                </p>
            </div>
        </div>
    );
}

export default Login;
