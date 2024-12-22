import express from 'express';
import cors from 'cors';
import type { Store } from '@reduxjs/toolkit';
import type { RootState } from '../types/store';
import { handleMockRequest } from './mockRouter';

export class MockServer {
  private app: express.Application;
  private store: Store<RootState>;
  private server: any;

  constructor(store: Store<RootState>) {
    this.app = express();
    this.store = store;
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private setupRoutes() {
    // 健康检查接口
    this.app.get('/health', (req, res) => {
      res.json({ status: 'ok' });
    });

    // 测试接口
    this.app.get('/test', (req, res) => {
      res.json({ message: 'Mock server is running' });
    });

    // Mock请求处理
    this.app.all('*', (req, res) => {
      handleMockRequest(req, res, this.store);
    });
  }

  async start(port: number = 3001) {
    return new Promise<void>((resolve, reject) => {
      try {
        this.server = this.app.listen(port, () => {
          console.log(`Mock server is running on port ${port}`);
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async stop() {
    return new Promise<void>((resolve, reject) => {
      if (this.server) {
        this.server.close((error: Error) => {
          if (error) {
            reject(error);
          } else {
            console.log('Mock server stopped');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }
} 