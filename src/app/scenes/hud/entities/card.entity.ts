import { injected } from 'brandi';
import { Container, Sprite, Texture } from 'pixi.js';
import { DI_TOKENS } from '../../../di/tokens';
import { RootContainerService } from '../../../services/root-container.services';

export type CardEntityOptions = {
  width: number;
  texture: Texture;
};

export class CardEntity {
  public readonly container: Container;
  public readonly image!: Sprite;
  private readonly pixelRatio = 160 / 243;

  constructor(private readonly rootContainerService: RootContainerService) {
    this.container = this.createContainer();

    this.onResize();

    this.rootContainerService.onResize(this.onResize);
  }

  public init(options: CardEntityOptions): void {
    // @ts-ignore
    this.image = this.createImage(options);
  }

  public destroy(): void {
    this.container.destroy();
    this.rootContainerService.removeOnResize(this.onResize);
  }

  private readonly onResize = (): void => {
    this.setPosition();
    this.resizeImage();
  };

  private setPosition(): void {
    const { width, height } = this.rootContainerService.getGameSafeAreaSize();

    // this.container.x = width / 2;
    // this.container.y = height / 2;
  }

  private resizeImage(): void {
    // const { width, height } = this.rootContainerService.getGameSafeAreaSize();
    // const size = width > height ? height : width;
    // this.image.width = size;
    // this.image.height = size / this.pixelRatio;
  }

  private createImage(options: CardEntityOptions): Sprite {
    const sprite = new Sprite(options.texture);
    sprite.anchor.set(0.5);
    sprite.width = options.width;
    sprite.height = options.width / this.pixelRatio;

    this.container.addChild(sprite);

    return sprite;
  }

  private createContainer(): Container {
    const container = new Container();

    return container;
  }
}

injected(CardEntity, DI_TOKENS.rootContainerService);
