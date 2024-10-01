import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error('Token is invalid or expired.');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
//
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//
//       try {
//         const refreshToken = localStorage.getItem('refreshToken');
//         if (!refreshToken) {
//           return Promise.reject(error);
//         }
//
//         const response = await axios.post('/api/auth/refresh-token', {}, {
//           headers: {
//             'Refresh-Token': `${refreshToken}`
//           }
//         });
//
//         const newToken = response.data.accessToken;
//         localStorage.setItem('token', newToken);
//         axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
//         originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
//
//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         console.error('Refresh token is invalid or expired.');
//         localStorage.removeItem('token');
//         localStorage.removeItem('refreshToken');
//         window.location.href = '/login';
//         return Promise.reject(refreshError);
//       }
//     }
//
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;