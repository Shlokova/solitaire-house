import { injected } from 'brandi';
import { Application, Container } from 'pixi.js';
import { DI_TOKENS } from './../di/tokens';
import { ResizeOptionsVariant, ResizerService, ScreenAspect } from './resizer.service';

type Listener = () => void;

export class RootContainerService {
  public app: Application<HTMLCanvasElement>;
  private readonly listeners: Set<Listener>;

  constructor(
    private readonly $root: HTMLElement,
    private readonly resizer: ResizerService,
  ) {
    this.app = new Application<HTMLCanvasElement>({
      background: '#a5a5a5',
      resolution: 2,
      autoDensity: true,
    });
    this.listeners = new Set([this.resizeCanvasAndWorld]);

    this.bindGlobalResize();
    this.resizeCanvasAndWorld();
  }

  public init(): void {
    this.$root.appendChild(this.app.view);
  }

  public on(event: any, fn: (...args: any) => void, context?: any): void {
    this.app.stage.on(event, fn, context);
  }

  public once(event: any, fn: (...args: any) => void, context?: any): void {
    this.app.stage.once(event, fn, context);
  }

  public emit(event: any, ...args: any): void {
    this.app.stage.emit(event, ...args);
  }

  public addChild(container: Container): void {
    this.app.stage.addChild(container);
  }

  public getGameSize(): { width: number; height: number } {
    return this.resizer.getGameSize(this.app);
  }

  public getGameSafeAreaSize(): { width: number; height: number } {
    return this.resizer.getGameSafeAreaSize(this.app);
  }

  public getGameSafeAreaPosition(): { x: number; y: number } {
    return this.resizer.getGameSafeAreaPosition(this.app);
  }

  public getResizeOptions<T>(options: ResizeOptionsVariant<T>): T {
    return this.resizer.getResizeOptions(this.app, options);
  }

  public onResize(listener: Listener): void {
    this.listeners.add(listener);
  }

  public removeOnResize(listener: Listener): void {
    this.listeners.delete(listener);
  }

  private readonly onGlobalResize = (): void => {
    this.listeners.forEach((listener) => listener());
  };

  private readonly resizeCanvasAndWorld = (): void => {
    const { app, resizer } = this;

    const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
    const screenAspect = windowWidth > windowHeight ? ScreenAspect.Album : ScreenAspect.Portrait;
    if (screenAspect === ScreenAspect.Portrait) {
      const newSize = resizer.getNewCanvasAndWorldSize(windowHeight, windowWidth);
      const { newCanvasWidth, newCanvasHeight, newWorldScale, newWorldPosition } = newSize;

      app.renderer.resize(newCanvasHeight, newCanvasWidth);
      app.stage.scale.set(newWorldScale, newWorldScale);
      app.stage.position.set(newWorldPosition.y, newWorldPosition.x);
    } else {
      const newSize = resizer.getNewCanvasAndWorldSize(windowWidth, windowHeight);
      const { newCanvasWidth, newCanvasHeight, newWorldScale, newWorldPosition } = newSize;

      app.renderer.resize(newCanvasWidth, newCanvasHeight);
      app.stage.scale.set(newWorldScale, newWorldScale);
      app.stage.position.set(newWorldPosition.x, newWorldPosition.y);
    }
  };

  private bindGlobalResize(): void {
    window.addEventListener('resize', this.onGlobalResize);
    window.addEventListener('orientationchange', this.onGlobalResize);
  }
}

injected(RootContainerService, DI_TOKENS.$root, DI_TOKENS.resizerService);
