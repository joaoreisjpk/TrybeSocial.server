import { GetServerSidePropsContext as GSSContext } from 'next';
import {
  setCookie,
  parseCookies as allCookies,
  destroyCookie as destroyNookie,
} from 'nookies';
import { decrypt, encrypt } from './Encrypt';

export const setCookieAt = (
  name: string, value: any, context: GSSContext | undefined = undefined
) =>
  setCookie(context, name, encrypt(value), { maxAge: 60 * 30 /* 30min */ });

export const setCookieRt = (
  name: string, value: any, context: GSSContext | undefined = undefined
) =>
  setCookie(context, name, encrypt(value), {
    maxAge: 60 * 60 * 24 * 7 /* 7d */,
  });

export const getCookie = (name: string) => {
  const { [name]: cookie } = allCookies();
  return decrypt(cookie);
};

export const destroyCookie = (name: string, context: GSSContext | undefined = undefined) => {
  destroyNookie(context, name);
};

export const parseCookies = (context: GSSContext | undefined = undefined) => {
  return context ? allCookies(context) : allCookies();
};
