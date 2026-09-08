import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import './index.css';
import App from './App.jsx';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_Z3JlYXQtZ2hvc3QtNDEzMS5jbGVyay5hY2NvdW50cy5kZXYk';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#ef4444',
          colorBackground: '#0d1322',
          colorText: '#f8fafc',
          colorInputBackground: '#060911',
          colorInputText: '#f8fafc'
        },
        elements: {
          card: 'border border-slate-800 shadow-2xl rounded-2xl',
          formButtonPrimary: 'bg-red-600 hover:bg-red-500 font-bold text-white shadow-lg shadow-red-600/30'
        }
      }}
      afterSignOutUrl="/"
    >
      <App />
    </ClerkProvider>
  </StrictMode>
);
