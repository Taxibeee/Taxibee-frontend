import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './auth/AuthProvider.tsx';
import  AdminContextProvider  from './contexts/AdminContextProvider.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <AdminContextProvider>
        <App />
        </AdminContextProvider>
      </QueryClientProvider>
    </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
