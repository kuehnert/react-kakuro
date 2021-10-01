function authHeader(): {
  Authorization: string;
} | {
  Authorization: null;
} {
  const token = localStorage.getItem('token');

  if (token) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return { Authorization: null };
  }
}

export default authHeader;
