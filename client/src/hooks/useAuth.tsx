import {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';

interface IContext {
  authorized: boolean;
  authLoading: boolean;
  Logout: () => Promise<void>;
  setAuthorized: Dispatch<SetStateAction<boolean>>;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
}

const initialValues = {
  authorized: false,
  authLoading: true,
};

export const AuthContext = createContext(initialValues as IContext);

export function ResultsProvider({ children }: { children: JSX.Element }): any {
  const [authorized, setAuthorized] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');

  const URL = process.env.URL || 'http://localhost:3333';
  const storageEmail = () => localStorage.getItem('userEmail') || '';

  async function Authenticator() {
    const token = localStorage.getItem('tokenRt') || '';
    console.log(storageEmail());

    const AuthResponse = await fetch(`${URL}/auth/refresh/${storageEmail()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token,
      },
    }).then((data) => data.json());

    const { acess_token, refresh_token, email: userEmail } = AuthResponse;

    setAuthLoading(false);
    if (refresh_token && userEmail && acess_token) {
      localStorage.setItem('tokenAt', acess_token);
      localStorage.setItem('tokenRt', refresh_token);
      localStorage.setItem('userEmail', email);
      setEmail(storageEmail());
      setAuthorized(true);
    }
  }

  async function Logout() {
    const token = localStorage.getItem('tokenRt') || '';

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
    const tokenRt = localStorage.getItem('tokenRt');
    if (!storageEmail()) {
      setAuthLoading(false);
    }
    if (tokenRt) {
      Authenticator();
      setInterval(() => {
        Authenticator();
      }, 1000 * 60 * 5); // 10min
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authorized,
        authLoading,
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
