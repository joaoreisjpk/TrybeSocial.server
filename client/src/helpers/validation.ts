const RegExp = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

export function emailVerifier(email: string) {
  const invalidTerms = [undefined, ''];
  if (invalidTerms.includes(email)) {
    return 'O campo email é obrigatório';
  }

  return RegExp.test(email) ? false : 'Email inválido';
}

export function passwordVerifier(password: string) {
  const invalidTerms = [undefined, ''];
  if (invalidTerms.includes(password)) return 'O campo password é obrigatório';

  if (password.length < 5) return 'Password é pequeno demais';

  return false;
}
