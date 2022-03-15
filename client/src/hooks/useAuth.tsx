import {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useCallback,
} from 'react';

import JWT, { decrypt, getTokenId } from '../helpers/Encrypt';
import { fetchLogout, fetchRefreshToken } from '../helpers/fetchers';
import { useRouter } from 'next/router';
import {
  getCookie,
  destroyCookie,
  setCookieAt,
  setCookieRt,
} from '../helpers/cookie';
interface IContext {
  Logout: () => Promise<void>;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
}

interface IProvider {
  children: JSX.Element | JSX.Element[];
}

const jwt = new JWT();

export const AuthContext = createContext({} as IContext);

export function ResultsProvider({ children }: IProvider) {
  const [email, setEmail] = useState('');
  const [intervalKey, setIntervalKey] = useState<NodeJS.Timer | boolean>(false);
  const { pathname, push } = useRouter();
  const FiveMin = 1000 * 60 * 5;

  const RefreshTokenFunction = useCallback(async () => {
    const token = decrypt(getCookie('tokenRt'));
    const userId = getTokenId(jwt.verify(token) as string);
    const { acess_token, refresh_token, error } = await fetchRefreshToken(
      token,
      userId
    );

    if (refresh_token && acess_token) {
      setCookieAt('tokenAt', acess_token);
      setCookieRt('tokenRt', refresh_token);
    } else {
      destroyCookie('tokenRt');
      return push('/login');
    }
  }, [email]);

  async function Logout() {
    destroyCookie('tokenAt');
    destroyCookie('tokenRt');
    setEmail('');
    push('/login');
    await fetchLogout(email);
  }

  useEffect(() => {
    const tokenRt = decrypt(getCookie('tokenRt'));
    if (pathname !== '/login' && tokenRt && !intervalKey) {
      const intervalId = setInterval(RefreshTokenFunction, FiveMin);
      setIntervalKey(intervalId);
    }
    if (pathname === '/login' && intervalKey) {
      clearInterval(intervalKey as NodeJS.Timeout);
      setIntervalKey(false);
    }
  }, [pathname, FiveMin, RefreshTokenFunction, intervalKey]);

  return (
    <AuthContext.Provider
      value={{
        Logout,
        email,
        setEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): IContext {
  const context = useContext(AuthContext);
  return context;
}
