// src/app/providers.js
'use client';
import { AuthProvider } from '../context/AuthContext';

export function Providers({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}