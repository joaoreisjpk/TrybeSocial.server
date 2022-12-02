import React, { Fragment, useEffect, useState } from 'react';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import Link from './Link';
import NextLink from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { Logout } = useAuth();
  const { pathname } = useRouter();

  useEffect(() => {
    const loginPaths = ['/cadastro', '/login'];
    return () => {
      setIsLoggedIn(loginPaths.includes(pathname));
    };
  }, [pathname]);

  const handleClick = async () => {
    await Logout();
  };

  return (
    <Navbar bg='dark' variant='dark' expand='lg'>
      <Container className='d-flex justify-content-between'>
        <NextLink href='/main-page' passHref>
          <Navbar.Brand href='#'>TrybeSocial</Navbar.Brand>
        </NextLink>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav' className='flex-grow-0'>
          <Nav className='me-auto'>
            {isLoggedIn ? (
              <Fragment>
                <Link href='/login'>Login</Link>
                <Link href='/cadastro'>Cadastrar</Link>
              </Fragment>
            ) : (
              <Fragment>
                <Link href='/main-page'>Home</Link>
                <Button onClick={handleClick}>Logout</Button>
              </Fragment>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
