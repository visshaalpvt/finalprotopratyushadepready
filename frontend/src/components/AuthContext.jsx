import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fake auth that just checks localStorage to bypass blocked Firebase URL
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
      setUser({
        displayName: savedRole === 'teacher' ? 'Teacher Admin' : 'Student User',
        photoURL: `https://ui-avatars.com/api/?name=${savedRole === 'teacher' ? 'Teacher' : 'Student'}&background=6338f0&color=fff`,
        role: savedRole
      });
    }
    setLoading(false);
  }, []);

  // Mock Login
  const loginWithMock = async (role) => {
    localStorage.setItem('userRole', role);
    setUser({
      displayName: role === 'teacher' ? 'Teacher Admin' : 'Student User',
      photoURL: `https://ui-avatars.com/api/?name=${role === 'teacher' ? 'Teacher' : 'Student'}&background=6338f0&color=fff`,
      role: role
    });
  };

  // Sign Out
  const logout = async () => {
    localStorage.removeItem('userRole');
    setUser(null);
  };

  const value = {
    user,
    loading,
    loginWithMock,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
