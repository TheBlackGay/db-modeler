declare module '@cubism/framework/src/live2dcubismframework' {
  export class Application {
    constructor();
    // 添加必要的方法声明
  }

  export class CubismFramework {
    static startUp(): void;
    static initialize(): void;
    static dispose(): void;
  }
}

declare module '@cubism/framework/src/cubismmodelsettingjson' {
  export class CubismModelSettingJson {
    constructor(json: any);
    loadModel(): Promise<any>;
  }
}

declare module '@cubism/framework/src/math/cubismmatrix44' {
  export class CubismMatrix44 {
    constructor();
    scale(x: number, y: number): void;
  }
}

declare module '@cubism/framework/src/math/cubismviewmatrix' {
  export class CubismViewMatrix {
    constructor();
    setScreenRect(left: number, right: number, bottom: number, top: number): void;
    scale(x: number, y: number): void;
  }
} 