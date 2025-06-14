// hooks/useAuth.ts (veya useAuth.tsx, eğer JSX içeriyorsa ama genelde .ts olur)
import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext'; // Default import, AuthContext.tsx'ten
import { AuthContextType } from '../types/authTypes'; // AuthContextType'ın isAuthenticated içerdiğinden emin olun

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};