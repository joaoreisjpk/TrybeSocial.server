import {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';

import { CookieAt, CookieRt } from '../helpers/cookie';
import JWT, { decrypt, encrypt } from '../helpers/Ecrypt';
import { fetchLogout, fetchRefreshToken } from '../helpers/fetchers';
import { useRouter } from 'next/router';

interface IContext {
  authorized: boolean;
  Logout: () => Promise<void>;
  setAuthorized: Dispatch<SetStateAction<boolean>>;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
}

interface IProvider {
  children: JSX.Element | JSX.Element[];
}

const initialValues = {
  authorized: false,
};

const jwt = new JWT();

export const AuthContext = createContext(initialValues as IContext);

export function ResultsProvider({ children }: IProvider) {
  const [authorized, setAuthorized] = useState(false);
  const [email, setEmail] = useState('');
  const [intervalKey, setIntervalKey] = useState<NodeJS.Timer | boolean>(false);
  const { pathname } = useRouter();
  const FiveMin = 1000 * 60 * 5;

  useEffect(() => {
    const token = decrypt(CookieRt.get(encrypt('tokenRt')) || '');
    if (token) {
      const { email } = jwt.verify(token);
      setEmail(email);
    }
  }, [authorized]);

  async function RefreshTokenFunction() {
    const token = decrypt(CookieRt.get(encrypt('tokenRt')) || '');

    const {
      acess_token,
      refresh_token,
    } = await fetchRefreshToken(token, email);

    if (refresh_token && acess_token) {
      CookieAt.set(encrypt('tokenAt'), encrypt(acess_token));
      CookieRt.set(encrypt('tokenRt'), encrypt(refresh_token));
      setAuthorized(true);
    }
  }

  async function Logout() {
    CookieAt.remove(encrypt('tokenAt'));
    CookieRt.remove(encrypt('tokenRt'));
    setAuthorized(false);
    setEmail('');

    await fetchLogout(email);
  }

  useEffect(() => {
    const tokenRt = decrypt(CookieRt.get(encrypt('tokenRt')) || '');
    if (pathname !== '/login' && tokenRt && !intervalKey) {
      const intervalId = setInterval(
        RefreshTokenFunction, FiveMin
      );
      setIntervalKey(intervalId);
    }
    if (pathname === '/login' && intervalKey) {
      clearInterval(intervalKey as NodeJS.Timeout);
      setIntervalKey(false);
    }
  }, [pathname]);

  return (
    <AuthContext.Provider
      value={{
        authorized,
        Logout,
        setAuthorized,
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
