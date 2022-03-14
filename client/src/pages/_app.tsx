import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.css';
import type { AppProps } from 'next/app';
import { ResultsProvider } from '../hooks/useAuth';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ResultsProvider>
      <Component {...pageProps} />
    </ResultsProvider>
  );
}

export default MyApp
