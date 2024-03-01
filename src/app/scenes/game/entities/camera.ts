import { injected } from 'brandi';
import { Container } from 'pixi.js';
import { DI_TOKENS } from '../../../di/tokens';
import { RootContainerService } from '../../../services/root-container.services';
import { Tween } from 'tweedle.js';

export class CameraEntity {
  public readonly container!: Container;
  private position = {
    album: { x: 0, y: 0 },
    portrat: { x: 0, y: 0 },
  };
  private zoom = {
    album: 1,
    portrat: 1,
  };

  constructor(private readonly rootContainerService: RootContainerService) {
    this.rootContainerService.onResize(this.onResize);
  }

  public init(container: Container): void {
    // @ts-ignore
    this.container = container;
  }

  public setPosition(
    position: {
      album: { x: number; y: number };
      portrat: { x: number; y: number };
    },
    onComplete?: () => void,
  ) {
    this.position = position;

    const currentPosition = this.rootContainerService.getResizeOptions(position);
    new Tween(this.container)
      .to({ ...currentPosition }, 800)
      .start()
      .onComplete(() => {
        onComplete && onComplete();
      });
  }

  public setZoom(zoom: { album: number; portrat: number }, onComplete?: () => void) {
    this.zoom = zoom;

    const currentZoom = this.rootContainerService.getResizeOptions(zoom);
    new Tween(this.container.scale)
      .to({ x: currentZoom, y: currentZoom }, 800)
      .start()
      .onComplete(() => {
        onComplete && onComplete();
      });
  }

  private onResize = () => {
    this.setPosition(this.position);
    this.setZoom(this.zoom);
  };
}

injected(CameraEntity, DI_TOKENS.rootContainerService);
