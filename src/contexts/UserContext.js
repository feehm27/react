import React, { createContext, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API, API_AUTHENTICATED } from '../services/api';

export const UserContext = createContext();

export const UserStorage = ({ children }) => {
  const [data, setData] = useState(null);
  const [login, setLogin] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function getUser(token) {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    await API.get('me', config).then((response) => {
      setData(response.data);
      setLogin(true);
      const { logo } = response.data;
      window.localStorage.setItem('logo', logo);
    });
  }

  async function userLogin(email, password) {
    setError(null);
    setLoading(true);
    await API_AUTHENTICATED.get('/sanctum/csrf-cookie').then(() => {
      API.post('login', { email, password })
        .then((response) => {
          const token = response.data.access_token;
          window.localStorage.setItem('token', token);
          getUser(token);
          setLogin(true);
          navigate('dashboard');
        })
        .catch((err) => {
          setError(err.response.data.message);
          setLogin(false);
        });
    });
    setLoading(false);
  }

  const userLogout = useCallback(
    async function () {
      setData(null);
      setError(null);
      setLoading(false);
      setLogin(false);
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('logo');
      navigate('/login');
    },
    [navigate]
  );

  useEffect(() => {}, [userLogout]);

  return (
    <UserContext.Provider
      value={{ userLogin, userLogout, getUser, data, login, error, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};
