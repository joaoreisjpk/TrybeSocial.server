import Head from 'next/head';
import { MouseEvent, useState } from 'react';

export default function Login() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const handleClick = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();
    console.log(user, password);
  };
  return (
    <div>
      <Head>
        <title>Login - Trybe Social</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <form action=''>
        <h1 className='text-3xl font-bold'>Login</h1>
        <input
          type='text'
          name='user'
          className='border-2 m-2 border-black'
          value={user}
          onChange={({ target }) => setUser(target.value)}
          id='user'
        />
        <input
          type='password'
          name='password'
          className='border-2 m-2 border-black'
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          id='password'
        />
        <button
          onClick={(e) => handleClick(e)}
          type='submit'
          className='border-2 m-2 border-black'
        >
          Login
        </button>
      </form>
    </div>
  );
}
