import React from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import Link from './Link';
import NextLink from 'next/link';

export default function Header() {
  return (
    <Navbar bg='dark' variant='dark' expand='lg'>
      <Container className='d-flex justify-content-between'>
        <NextLink href='/main-page' passHref>
          <Navbar.Brand href='#'>TrybeSocial</Navbar.Brand>
        </NextLink>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav flex-grow-0'>
          <Nav className='me-auto'>
            <Link href='/main-page'>Home</Link>
            <Link href='/login'>Login</Link>
            <Link href='/cadastro'>Cadastro</Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
