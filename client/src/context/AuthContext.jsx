// AuthContext - Provides authentication state and methods to the application
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    // State to store current user
    const [user, setUser] = useState(null);

    // State to store JWT token
    const [token, setToken] = useState(null);

    // State to track if we're checking for existing session
    const [loading, setLoading] = useState(true);

    // On component mount, check if token exists in localStorage
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    // When token or user changes, save to localStorage
    useEffect(() => {
        if (token && user) {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }, [token, user]);

    // Signup function
    const signup = async (email, password, firstName, lastName) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/signup', {
                email,
                password,
                first_name: firstName,
                last_name: lastName
            });
            
            setUser(response.data.user);
            setToken(response.data.token);
            return { success: true };
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    };

    // Login function
    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });
            
            setUser(response.data.user);
            setToken(response.data.token);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    // Logout function
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        return !!token;
    };

    const value = {
    user,
    token,
    loading,
    signup,
    login,
    logout,
    isAuthenticated,
      setUser  // Add setUser so components can update user info
  };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
