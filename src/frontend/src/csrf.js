import axios from 'axios';

export async function buildCsrfHeaders(apiBase) {
  const response = await axios.get(`${apiBase}/auth/csrf`);
  const { headerName, token } = response.data;
  return {
    [headerName]: token,
  };
}