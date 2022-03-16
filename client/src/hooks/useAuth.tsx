import {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useCallback,
} from 'react';

import { CookieAt, CookieRt } from '../helpers/cookie';
import JWT, { decrypt, encrypt } from '../helpers/Encrypt';
import { fetchLogout, fetchRefreshToken } from '../helpers/fetchers';
import { useRouter } from 'next/router';

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

  // useEffect(() => {
  //   const token = decrypt(CookieRt.get('tokenRt') || '');
  //   if (token) {
  //     const { email } = jwt.verify(token);
  //     setEmail(email);
  //   }
  // }, []);

  const RefreshTokenFunction = useCallback(async () => {
    const token = decrypt(CookieRt.get('tokenRt') || '');
    const { userId } = jwt.decode(token);
    const { acess_token, refresh_token, error } = await fetchRefreshToken(
      token,
      userId
    );

    if (error) {
      CookieRt.remove('tokenRt');
      return push('/login')
    };

    if (refresh_token && acess_token) {
      CookieAt.set('tokenAt', encrypt(acess_token));
      CookieRt.set('tokenRt', encrypt(refresh_token));
    }
  }, [email]);

  async function Logout() {
    CookieAt.remove('tokenAt');
    CookieRt.remove('tokenRt');
    setEmail('');
    push('/login');
    await fetchLogout(email);
  }

  useEffect(() => {
    const tokenRt = decrypt(CookieRt.get('tokenRt') || '');
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
