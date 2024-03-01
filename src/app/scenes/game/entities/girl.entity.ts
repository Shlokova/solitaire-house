import { injected } from 'brandi';
import { Assets, Container, Sprite, Texture } from 'pixi.js';
import { Tween } from 'tweedle.js';
import { DI_TOKENS } from '../../../di/tokens';
import { ASSETS_NAME } from '../../../manifest';
import { RootContainerService } from '../../../services/root-container.services';

export class GirlEntity {
  public readonly container: Container;
  private readonly girl: Sprite;
  private readonly goosebumps: Sprite;
  private readonly steam: Sprite;
  private readonly girlPixelRatio = 233 / 963;
  private readonly goosebumpsPixelRatio = 294 / 685;
  private readonly steamPixelRatio = 225 / 158;

  constructor(private readonly rootContainerService: RootContainerService) {
    this.container = this.createContainer();
    this.girl = this.createImage(Assets.get(ASSETS_NAME.Girl), { x: 0, y: 0 });
    this.goosebumps = this.createImage(Assets.get(ASSETS_NAME.Goosebumps), { x: 0, y: 0 });
    this.steam = this.createImage(Assets.get(ASSETS_NAME.Steam), { x: 0, y: 0 });

    this.onResize();
    this.rootContainerService.onResize(this.onResize);

    this.tremble();
    this.exhalation();
  }

  public destroy(): void {
    this.container.destroy();
    this.rootContainerService.removeOnResize(this.onResize);
  }

  private tremble(): void {
    new Tween(this.girl)
      .from({ angle: -1 })
      .to({ angle: 1 }, 70)
      .repeat(10)
      .delay(1000)
      .yoyo(true)
      .start()
      .onComplete(() => {
        this.tremble();
      });

    new Tween(this.goosebumps)
      .from({ angle: 1 })
      .to(
        {
          angle: -1,
        },
        70,
      )
      .repeat(10)
      .delay(1000)
      .onAfterDelay(() => (this.goosebumps.alpha = 1))
      .yoyo(true)
      .onComplete(() => {
        this.goosebumps.alpha = 0;
      })
      .start();
  }

  private exhalation(): void {
    new Tween(this.steam)
      .from({ alpha: 0 })
      .to(
        {
          alpha: 1,
        },
        1000,
      )
      .repeat(Infinity)
      .delay(1000)
      .yoyo(true)
      .start();
  }

  private readonly onResize = (): void => {
    this.updatePosition();
    this.resizeImage();
  };

  private createContainer(): Container {
    const container = new Container();
    container.zIndex = 2;

    return container;
  }

  private updatePosition(): void {
    const { width, height } = this.rootContainerService.getGameSize();

    const currentPosition = this.rootContainerService.getResizeOptions({
      album: { x: width / 2 + 20, y: height / 2 },
      portrat: { x: width / 2 + 60, y: height / 2 + 80 },
    });

    this.container.x = currentPosition.x;
    this.container.y = currentPosition.y;
  }

  private resizeImage(): void {
    const imageHeight = this.rootContainerService.getResizeOptions({
      album: 300,
      portrat: 350,
    });

    this.girl.width = imageHeight * this.girlPixelRatio;
    this.girl.height = imageHeight;

    this.goosebumps.width = imageHeight * this.goosebumpsPixelRatio;
    this.goosebumps.height = imageHeight;
    this.goosebumps.x = -this.girl.width / 2 + this.goosebumps.width / 2 - 10;

    this.steam.width = 80 * this.steamPixelRatio;
    this.steam.height = 80;
    this.steam.y = -this.girl.height / 2 + 55;
    this.steam.x = -this.girl.width + this.steam.width;
  }

  private createImage(texture: Texture, position: { x: number; y: number }): Sprite {
    const sprite = Sprite.from(texture);
    sprite.x = position.x;
    sprite.y = position.y;

    sprite.anchor.set(1, 0.5);

    this.container.addChild(sprite);

    return sprite;
  }
}

injected(GirlEntity, DI_TOKENS.rootContainerService);
