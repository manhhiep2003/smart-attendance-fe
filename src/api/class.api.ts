import axiosClient from './axios.client';

export const classApi = {
  getMyClasses: () => {
    return axiosClient.get('/classes/my-classes');
  },
};