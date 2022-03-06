const RegExp = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

export function emailVerifier(email: string) {
  const invalidTerms = [undefined, ''];
  if (invalidTerms.includes(email)) {
    return 'O campo Email é obrigatório';
  }

  return RegExp.test(email)
    ? false : 'Formato de Email inválido';
}

export function passwordVerifier(password: string) {
  const invalidTerms = [undefined, ''];
  if (invalidTerms.includes(password)) return 'O campo Password é obrigatório';

  if (password.length < 5) return 'Password precisa ser maior';

  return false;
}
