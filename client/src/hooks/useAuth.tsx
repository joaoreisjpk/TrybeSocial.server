import {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';

import { CookieAt, CookieRt } from '../helpers/cookie';
import JWT from '../helpers/jwt';
import { fetchLogout, fetchRefreshToken } from '../helpers/fetchers';

interface IContext {
  authorized: boolean;
  Logout: () => Promise<void>;
  setAuthorized: Dispatch<SetStateAction<boolean>>;
  email: string | undefined;
  setEmail: Dispatch<SetStateAction<string | undefined>>;
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
  const [email, setEmail] = useState(CookieAt.get('tokenAt'));

  useEffect(() => {
    const token = CookieAt.get('tokenAt');
    if (token) {
      const { email } = jwt.verify(token);
      setEmail(email);
    }
  }, [authorized]);

  async function RefreshTokenFunction() {
    const token = CookieRt.get('tokenRt') || '';

    const {
      acess_token,
      refresh_token,
    } = await fetchRefreshToken(token, email);

    if (refresh_token && acess_token) {
      CookieAt.set('tokenAt', acess_token);
      CookieRt.set('tokenRt', refresh_token);
      setAuthorized(true);
    }
  }

  async function Logout() {
    const token = CookieRt.get('tokenRt') || '';

    await fetchLogout(token, email);

    CookieAt.remove('tokenAt');
    CookieRt.remove('tokenRt');
    setAuthorized(false);
  }

  useEffect(() => {
    const tokenRt = CookieRt.get('tokenRt');
    if (tokenRt) {
      setInterval(
        RefreshTokenFunction, 1000 * 60 * 5 // 5min
      );
    }
  }, []);

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
