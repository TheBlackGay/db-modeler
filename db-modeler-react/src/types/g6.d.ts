import '@antv/g6';

declare module '@antv/g6' {
  interface GraphOptions {
    container: HTMLElement | string;
    width: number;
    height: number;
    modes?: {
      default: string[];
      [key: string]: string[];
    };
    layout?: {
      type: string;
      [key: string]: any;
    };
    defaultNode?: {
      type: string;
      size: number | number[];
      style?: Record<string, any>;
      labelCfg?: {
        style?: Record<string, any>;
      };
    };
    defaultEdge?: {
      type: string;
      style?: Record<string, any>;
      labelCfg?: {
        style?: Record<string, any>;
      };
    };
  }

  interface Graph {
    data(data: any): void;
    render(): void;
    layout(): void;
    changeSize(width: number, height: number): void;
    clear(): void;
    destroy(): void;
  }
} 