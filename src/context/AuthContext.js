import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const savedUser = localStorage.getItem('dentalUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Get users from localStorage or use default data
    const users = JSON.parse(localStorage.getItem('dentalUsers') || JSON.stringify([
      { "id": "1", "role": "Admin", "email": "admin@entnt.in", "password": "admin123", "name": "Dr. Smith" },
      { "id": "2", "role": "Patient", "email": "john@entnt.in", "password": "patient123", "patientId": "p1", "name": "John Doe" }
    ]));

    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userData = { ...foundUser };
      delete userData.password; // Don't store password in session
      setUser(userData);
      localStorage.setItem('dentalUser', JSON.stringify(userData));
      return { success: true };
    }
    
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dentalUser');
  };

  const isAdmin = () => user?.role === 'Admin';
  const isPatient = () => user?.role === 'Patient';

  const value = {
    user,
    login,
    logout,
    isAdmin,
    isPatient,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
