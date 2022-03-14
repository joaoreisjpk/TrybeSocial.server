import {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';

import Cookies from 'js-cookie';
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

export const AuthContext = createContext(initialValues as IContext);

export function ResultsProvider({ children }: IProvider) {
  const [authorized, setAuthorized] = useState(false);
  const [email, setEmail] = useState(Cookies.get('tokenRt'));

  useEffect(() => {
    setEmail(Cookies.get('userEmail'));
  }, [authorized]);

  async function RefreshTokenFunction() {
    const token = Cookies.get('tokenRt') || '';

    const {
      acess_token,
      refresh_token,
      email: userEmail,
    } = await fetchRefreshToken(token, email);

    if (refresh_token && userEmail && acess_token) {
      Cookies.set('tokenAt', acess_token);
      Cookies.set('tokenRt', refresh_token);
      Cookies.set('userEmail', userEmail);
      setAuthorized(true);
    }
  }

  async function Logout() {
    const token = Cookies.get('tokenRt') || '';

    await fetchLogout(token, email);

    Cookies.remove('tokenAt');
    Cookies.remove('tokenRt');
    Cookies.remove('userEmail');
    setAuthorized(false);
  }

  useEffect(() => {
    const tokenRt = Cookies.get('tokenRt');
    if (tokenRt) {
      setInterval(() => {
        RefreshTokenFunction();
      }, 1000 * 60 * 5); // 5min
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
