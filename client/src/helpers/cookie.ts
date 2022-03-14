import Cookie from 'js-cookie';

export const CookieAt = Cookie.withAttributes({
  expires: 1 / 48,
  secure: process.env.NODE_ENV === 'production',
});

export const CookieRt = Cookie.withAttributes({
  expires: 3,
  secure: process.env.NODE_ENV === 'production',
});
