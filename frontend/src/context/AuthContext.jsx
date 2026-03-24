import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session
    const storedUser = localStorage.getItem('campusai_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mocking POST /api/auth/login/
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (password === 'password') {
          let role = 'student';
          if (email.includes('teacher')) role = 'teacher';
          if (email.includes('hod')) role = 'hod';
          
          const userData = {
            id: '1',
            name: email.split('@')[0],
            email,
            role,
            token: 'mock-jwt-token-123'
          };
          
          setUser(userData);
          localStorage.setItem('campusai_user', JSON.stringify(userData));
          resolve(userData);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('campusai_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
