import {
  setCookie,
  parseCookies,
  destroyCookie as destroyNookie,
} from 'nookies';
import { decrypt, encrypt } from './Encrypt';

export const setCookieAt = (name: string, value: any) =>
  setCookie(undefined, name, encrypt(value), { maxAge: 60 * 30 /* 30min */ });

export const setCookieRt = (name: string, value: any) =>
  setCookie(undefined, name, encrypt(value), {
    maxAge: 60 * 60 * 24 * 7 /* 7d */,
  });

export const getCookie = (name: string) => {
  const { [name]: cookie } = parseCookies();
  console.log(`Cookie ${name}: `, cookie);
  return cookie;
};

export const destroyCookie = (name: string) => {
  destroyNookie(undefined, name);
};
