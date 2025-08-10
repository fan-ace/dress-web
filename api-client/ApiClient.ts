import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string, defaultConfig?: AxiosRequestConfig) {
    this.client = axios.create({
      baseURL,
      ...defaultConfig,
    });
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }
};

/* How to use:
import { ApiClient } from './common/ApiClient';

const api = new ApiClient('https://api.example.com');

// GET
const response = await api.get('/users');
console.log(response.data);

// POST
const postResponse = await api.post('/users', { name: 'John' });
console.log(postResponse.data);
 */