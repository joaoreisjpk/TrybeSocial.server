import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.css';
import type { AppProps } from 'next/app';
import { AuthContext, ResultsProvider } from '../hooks/useAuth';
import AuthHandler from './_authHandler';

function MyApp(param: AppProps) {
  return (
    <ResultsProvider>
      <AuthHandler {...param} />
    </ResultsProvider>
  );
}

export default MyApp
