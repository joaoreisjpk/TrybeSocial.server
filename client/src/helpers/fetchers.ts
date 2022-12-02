const URL = process.env.URL || 'http://localhost:3333';

interface IuserTokenResponse {
  acess_token?: string;
  refresh_token?: string;
  error?: string;
}
console.log(URL)
export async function fetchLogin(body: string) {
  let response
  try {
    response = (await fetch(`${URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    }).then((data) => data.json())) as IuserTokenResponse;
  } catch (err) {
    console.log(err)
    return {}
  }

  return response;
}

export async function fetchRefreshToken(
  token: string,
  id: number,
) {
  try {
    const TokenResponse = await fetch(`${URL}/auth/refresh/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token,
      },
    }).then((data) => data.json()) as IuserTokenResponse;
    console.log('TokenResponse', TokenResponse)
    return TokenResponse
  } catch (err) {
    console.log(err)
    return {}
  }
}

export async function fetchLogout(email: string) {
  return fetch(`${URL}/auth/logout/${email}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
