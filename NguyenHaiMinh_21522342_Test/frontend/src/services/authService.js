import api from './api';

export const register = async (userData) => {
  const response = await api.post('/UserAuth/register', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/UserAuth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    return { role: decodedToken.role, ...decodedToken };
  } catch (error) {
    console.error("Failed to parse token", error);
    return null;
  }
};
