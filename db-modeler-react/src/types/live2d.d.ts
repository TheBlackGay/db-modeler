declare module '*/lappdelegate' {
  export class LAppDelegate {
    constructor();
    initialize(): void;
    run(): void;
    onResize(): void;
    release(): void;
  }
}

declare module '*/lapplive2dmanager' {
  export class LAppLive2DManager {
    static releaseInstance(): void;
  }
}

declare module '*/live2dcubismcore.js'; 