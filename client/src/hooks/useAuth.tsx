import {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';

import Cookies from 'js-cookie';

interface IContext {
  authorized: boolean;
  Logout: () => Promise<void>;
  setAuthorized: Dispatch<SetStateAction<boolean>>;
  email: string | undefined;
  setEmail: Dispatch<SetStateAction<string | undefined>>;
}

const initialValues = {
  authorized: false,
};

export const AuthContext = createContext(initialValues as IContext);

const storageEmail = () => Cookies.get('userEmail');

export function ResultsProvider({ children }: { children: JSX.Element }): any {
  const [authorized, setAuthorized] = useState(false);
  const [email, setEmail] = useState(storageEmail());
  const URL = process.env.URL || 'http://localhost:3333';

  storageEmail();

  async function Authenticator() {
    const token = Cookies.get('tokenRt') || '';
    console.log(storageEmail());

    const AuthResponse = await fetch(`${URL}/auth/refresh/${storageEmail()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token,
      },
    }).then((data) => data.json());

    const { acess_token, refresh_token, email: userEmail } = AuthResponse;

    if (refresh_token && userEmail && acess_token) {
      Cookies.set('tokenAt', acess_token);
      Cookies.set('tokenRt', refresh_token);
      Cookies.set('userEmail', userEmail);
      setEmail(storageEmail());
      setAuthorized(true);
    }
  }

  async function Logout() {
    const token = Cookies.get('tokenRt') || '';

    await fetch(`${URL}/auth/logout/${storageEmail()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token,
      },
    });

    setAuthorized(false);
  }

  useEffect(() => {
    const tokenRt = Cookies.get('tokenRt');
    if (tokenRt) {
      setInterval(() => {
        Authenticator();
      }, 1000 * 60 * 5); // 10min
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
