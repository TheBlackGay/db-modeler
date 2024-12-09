import axios from 'axios';
import { message } from 'ant-design-vue';

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 15000,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 可以在这里添加 token 等认证信息
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data;
    // 这里可以根据后端的响应结构进行调整
    return res;
  },
  (error) => {
    message.error(error.message || '请求失败');
    return Promise.reject(error);
  }
);

export { request };
export default request;
