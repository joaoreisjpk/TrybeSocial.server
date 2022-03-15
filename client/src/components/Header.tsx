import React from 'react';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import Link from './Link';
import NextLink from 'next/link';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
  const { Logout } = useAuth();

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
            <Link href='/main-page'>Home</Link>
            <Link href='/login'>Login</Link>
            <Link href='/cadastro'>Cadastro</Link>
            <Button onClick={handleClick}>Logout</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
