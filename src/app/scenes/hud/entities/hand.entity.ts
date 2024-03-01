import { ASSETS_NAME } from 'src/app/manifest';
import { injected } from 'brandi';
import { Container, Sprite, Assets } from 'pixi.js';
import { DI_TOKENS } from '../../../di/tokens';
import { RootContainerService } from '../../../services/root-container.services';
import { Tween } from 'tweedle.js';

export class HandEntity {
  public readonly container: Container;
  private readonly image!: Sprite;
  private currentTween: Tween<Sprite> | null = null;
  private currentParent: Container | null = null;
  private readonly pixelRatio = 160 / 243;
  private readonly WIDTH: number;
  private readonly HEIGHT: number;

  constructor(private readonly rootContainerService: RootContainerService) {
    this.WIDTH = 30;
    this.HEIGHT = this.WIDTH / this.pixelRatio;

    this.container = this.createContainer();
    this.image = this.createImage();
  }

  public destroy(): void {
    this.container.destroy();
  }

  public showHand(container: Container, position: { x: number; y: number }) {
    if (this.currentParent) this.currentParent.removeChild(this.container);

    this.currentParent = container;
    this.container.position.set(position.x, position.y);
    this.currentParent.addChild(this.container);
  }

  public bounce(repeat: number): void {
    this.currentTween = new Tween(this.image)
      .from({ width: this.WIDTH * 1.3, height: this.HEIGHT * 1.3 })
      .to({ width: this.WIDTH, height: this.HEIGHT }, 600)
      .repeat(repeat)
      .yoyo(true)
      .start();
  }

  public hideHand(): void {
    this.currentTween?.stop();
    this.currentTween = null;

    if (this.currentParent) this.currentParent.removeChild(this.container);
  }

  private createImage(): Sprite {
    const sprite = new Sprite(Assets.get(ASSETS_NAME.Hand));
    sprite.anchor.set(0.4, 0);
    sprite.width = this.WIDTH;
    sprite.height = this.HEIGHT;

    this.container.addChild(sprite);

    return sprite;
  }

  private createContainer(): Container {
    const container = new Container();

    return container;
  }
}

injected(HandEntity, DI_TOKENS.rootContainerService);
