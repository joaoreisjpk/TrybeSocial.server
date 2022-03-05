import NextLink, { LinkProps } from 'next/link';
import { AnchorHTMLAttributes, DetailedHTMLProps } from 'react';
import { Nav } from 'react-bootstrap';

interface AnchorProps
  extends DetailedHTMLProps<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  children: any;
}

export default function Link({ children, ...props }: LinkProps & AnchorProps) {
  return (
    <NextLink href={props.href} passHref>
      <Nav.Link href='#'>{children}</Nav.Link>
    </NextLink>
  );
}
