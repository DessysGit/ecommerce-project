// Signup component - Form for creating new user accounts
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

function Signup({ onSwitchToLogin }) {
    // State for form fields
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    // State for error messages
    const [error, setError] = useState('');

    // State for loading
    const [loading, setLoading] = useState(false);

    // Get signup function from auth context
    const { signup } = useAuth();

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
            // Call signup function with form data
            await signup(
                formData.email, 
                formData.password, 
                formData.firstName, 
                formData.lastName
            );
            
            // Success! User is now logged in
            alert('Account created successfully!');
            
        } catch (err) {
            // Show error message to user
            setError(err.response?.data?.error || 'Signup failed. Please try again.');
        } finally {
            // Set loading back to false
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Create Account</h2>

                {/* Show error message if exists */}
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {/* First Name input */}
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                        required
                    />

                    {/* Last Name input */}
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                        required
                    />

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
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                {/* Link to switch to login */}
                <p className="auth-switch">
                    Already have an account?{' '}
                    <span onClick={onSwitchToLogin}>Log in</span>
                </p>
            </div>
        </div>
    );
}

export default Signup;
