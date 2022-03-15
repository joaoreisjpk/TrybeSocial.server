const URL = process.env.URL //|| 'http://localhost:3333';

interface IuserTokenResponse {
  acess_token?: string;
  refresh_token?: string;
  error?: string;
}

export async function fetchLogin(body: string) {
  const response = (await fetch(`${URL}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  }).then((data) => data.json())) as IuserTokenResponse;

  return response;
}

export async function fetchRefreshToken(
  token: string,
  id: number,
) {
  return (await fetch(`${URL}/auth/refresh/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token,
    },
  }).then((data) => data.json())) as IuserTokenResponse;
}

export async function fetchLogout(email: string) {
  return fetch(`${URL}/auth/logout/${email}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
