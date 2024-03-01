import { injected } from 'brandi';
import { Assets, Container, Sprite } from 'pixi.js';
import { DI_TOKENS } from '../../../di/tokens';
import { ASSETS_NAME } from '../../../manifest';
import { RootContainerService } from '../../../services/root-container.services';

export class BackgroundEntity {
  public readonly container: Container;
  private image: Sprite;
  private fireplace: Sprite;
  private readonly imagePixelRatio = 2000 / 1298;
  private readonly fireplacePixelRatio = 1067 / 2154;
  private readonly FIREPLACE_SIZE = 600;

  constructor(private readonly rootContainerService: RootContainerService) {
    this.container = this.createContainer();
    this.image = this.createBackgroundImage();
    this.fireplace = this.createFireplace();

    this.onResize();
    this.rootContainerService.onResize(this.onResize);
  }

  public destroy(): void {
    this.container.destroy();
    this.rootContainerService.removeOnResize(this.onResize);
  }

  private readonly onResize = (): void => {
    this.resizeBackground();
    this.resizeFireplace();
  };

  private createContainer(): Container {
    const container = new Container();
    container.zIndex = 0;

    return container;
  }

  private resizeBackground(): void {
    const { height, width } = this.rootContainerService.getGameSize();

    const imageHeight = this.rootContainerService.getResizeOptions({
      album: width,
      portrat: height,
    });

    this.image.width = imageHeight * this.imagePixelRatio;
    this.image.height = imageHeight;
    this.image.x = width / 2;
    this.image.y = height;
  }

  private resizeFireplace(): void {
    const { width, height } = this.rootContainerService.getGameSize();

    const currentPosition = this.rootContainerService.getResizeOptions({
      album: { x: width / 2, y: height / 2 + 40 },
      portrat: { x: width / 2, y: height / 2 + 200 },
    });

    this.fireplace.x = currentPosition.x;
    this.fireplace.y = currentPosition.y;
  }

  private createBackgroundImage(): Sprite {
    const sprite = Sprite.from(Assets.get(ASSETS_NAME.Background));

    sprite.anchor.set(0.5, 1);

    this.container.addChild(sprite);

    return sprite;
  }

  private createFireplace(): Sprite {
    const sprite = Sprite.from(Assets.get(ASSETS_NAME.Fireplace));

    sprite.anchor.set(0, 1);
    sprite.width = this.FIREPLACE_SIZE * this.fireplacePixelRatio;
    sprite.height = this.FIREPLACE_SIZE;

    this.container.addChild(sprite);

    return sprite;
  }
}

injected(BackgroundEntity, DI_TOKENS.rootContainerService);
