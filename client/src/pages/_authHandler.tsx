import type { AppProps } from 'next/app';
import { ResultsProvider, useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';
import Login from './login';
import { useEffect } from 'react';

function AuthHandler({ Component, pageProps }: AppProps) {
  const { authLoading } = useAuth();

  if (authLoading) return <h1>Carregando...</h1>;

  return <Component {...pageProps} />;
}

export default AuthHandler;
