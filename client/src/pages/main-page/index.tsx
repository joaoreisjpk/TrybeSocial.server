import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React, { useEffect } from 'react';
import Header from '../../components/Header';
import { fetchRefreshToken } from '../../helpers/fetchers';
import JWT, { encrypt, decrypt, getTokenId } from '../../helpers/Encrypt';
import { useAuth } from '../../hooks/useAuth';
import { CookieAt, CookieRt } from '../../helpers/cookie';

interface IServerSideProps {
  email: string;
  tokens?: {
    refresh_token: string;
    acess_token: string;
  };
}
export default function MainPage({
  email: propEmail,
  tokens,
}: IServerSideProps) {
  const { email, setEmail } = useAuth();
  if (email === '') {
    setEmail(propEmail);
  }

  useEffect(() => {
    if (tokens) {
      CookieRt.set('tokenRt', encrypt(tokens.refresh_token));
      CookieAt.set('tokenAt', encrypt(tokens.acess_token));
    }
  }, []);

  return (
    <div>
      <Head>
        <title>Main Page - Trybe Social</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <h1>Main Page</h1>
      <h2>Você está logado com o email: {email}</h2>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { tokenAt, tokenRt: RtCrypted } = req.cookies;
  let AtCrypted = tokenAt ? decrypt(tokenAt) : undefined;

  if (!RtCrypted) {
    return {
      props: {},
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const tokenRt = decrypt(RtCrypted);
  const jwt = new JWT();

  if (!AtCrypted) {
    const userId = getTokenId(jwt.verify(tokenRt) as string);
    const { acess_token, refresh_token, error } = await fetchRefreshToken(
      tokenRt,
      userId
    );
    console.log({ userId, acess_token, refresh_token, error });

    if (error) {
      CookieRt.remove('tokenRt');
      return {
        props: {},
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
    AtCrypted = acess_token as string;
    const { email } = jwt.decode(acess_token || '') as { email: string };

    return {
      props: {
        email,
        tokens: {
          acess_token,
          refresh_token,
        },
      },
    };
  }

  const { email } = jwt.decode(AtCrypted) as { email: string };

  return {
    props: {
      email,
    },
  };
};
