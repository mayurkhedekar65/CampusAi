import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

const API_URL = 'http://127.0.0.1:8001/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('campusai_token');
    if (token) {
      fetchProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async (token) => {
    try {
      const res = await fetch(`${API_URL}/auth/profile/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const userData = await res.json();
        setUser({ ...userData, token });
      } else {
        localStorage.removeItem('campusai_token');
      }
    } catch (error) {
      console.error('Failed to fetch profile', error);
      localStorage.removeItem('campusai_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Invalid credentials');
    }
    
    const data = await res.json();
    localStorage.setItem('campusai_token', data.access);
    await fetchProfile(data.access);
  };

  const register = async (userData) => {
    const res = await fetch(`${API_URL}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to create account');
    }
    
    const data = await res.json();
    localStorage.setItem('campusai_token', data.access);
    await fetchProfile(data.access);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('campusai_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, token: user?.token || localStorage.getItem('campusai_token') }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
