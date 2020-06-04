/* eslint-disable no-underscore-dangle */
import axios from 'axios';
import { paths } from 'constants/routes';
import history from './history';

const instance = axios.create({
  baseURL: '/api/',
  timeout: 1000,
});

instance.interceptors.request.use(
  config => {
    const updatedConfig = { ...config };
    const accessToken = localStorage.getItem('authToken');
    if (accessToken) {
      updatedConfig.headers.Authorization = `${accessToken}`;
    }
    return updatedConfig;
  },
  error => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  response => {
    const authUrls = ['/login', '/refreshToken', '/register'];
    if (authUrls.includes(response?.config?.url)) {
      const { headers } = response;
      const { authorization, 'refresh-token': refreshToken } = headers;
      localStorage.setItem('authToken', authorization);
      localStorage.setItem('refreshToken', refreshToken);
    }

    return response?.data?.result;
  },
  error => {
    const status = error?.response?.status;
    const originalRequest = error.config;
    if (originalRequest.url.indexOf('refreshToken') > -1) {
      history.push(paths.LOGOUT);
      return Promise.reject(error);
    }
    if (status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      return instance
        .post('/refreshToken', null, {
          headers: {
            'Content-Type': 'application/json',
            'Refresh-Token': localStorage.getItem('refreshToken'),
          },
        })
        .then(() => {
          return instance(originalRequest);
        });
    }

    return Promise.reject(error);
  },
);

export default () => instance;
