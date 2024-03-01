import { GAME_EVENTS } from '../../../constants';
import { injected } from 'brandi';
import { Container, Sprite, Texture, Assets } from 'pixi.js';
import { ASSETS_NAME } from '../../../manifest';
import { DI_TOKENS } from '../../../di/tokens';
import { RootContainerService } from '../../../services/root-container.services';
import { Tween } from 'tweedle.js';

export class NotificationEntity {
  public readonly container: Container;
  private readonly background: Container;
  private readonly content: Container;
  private readonly image: Sprite;
  private readonly pixelRatio = 1052 / 1121;
  private readonly BACKGROUND_OPACITY = 0.5;
  private readonly OPEN_ANIMATION_DURACTION = 1000;
  private readonly OPEN_ANIMATION_DELAY = 1000;
  private readonly HIDE_ANIMATION_DURACTION = 1000;
  private readonly HIDE_ANIMATION_DELAY = 2000;

  constructor(private readonly rootContainerService: RootContainerService) {
    this.container = this.createContainer();
    this.content = this.createContainer();
    this.image = this.createImage();
    this.background = this.createBackground();

    this.onResize();

    this.rootContainerService.onResize(this.onResize);
  }

  public open(): void {
    this.container.addChild(this.background, this.content);
    this.container.alpha = 0;

    new Tween(this.container)
      .to({ alpha: 1 }, this.OPEN_ANIMATION_DURACTION)
      .start(this.OPEN_ANIMATION_DELAY);
    new Tween(this.content.scale)
      .from({ x: 0.7, y: 0.7 })
      .to({ x: 1, y: 1 }, this.OPEN_ANIMATION_DURACTION)
      .start(this.OPEN_ANIMATION_DELAY)
      .onComplete(() => this.hide());
  }

  private destroy(): void {
    this.content.destroy();
    this.rootContainerService.removeOnResize(this.onResize);
  }

  private hide(): void {
    new Tween(this.container)
      .to({ alpha: 0 }, this.HIDE_ANIMATION_DURACTION)
      .start(this.HIDE_ANIMATION_DELAY);
    new Tween(this.content.scale)
      .from({ x: 1, y: 1 })
      .to({ x: 0.7, y: 0.7 }, this.HIDE_ANIMATION_DURACTION)
      .onComplete(() => {
        this.destroy();
        this.rootContainerService.emit(GAME_EVENTS.NOTIFICATION_CLOSED);
      })
      .start(this.HIDE_ANIMATION_DELAY);
  }

  private readonly onResize = (): void => {
    this.setPosition();
    this.resizeImage();
    this.resizeBackground();
  };

  private setPosition(): void {
    const { width, height } = this.rootContainerService.getGameSafeAreaSize();

    this.content.x = width / 2;
    this.content.y = height / 2;
  }

  private resizeBackground(): void {
    const { x, y } = this.rootContainerService.getGameSafeAreaPosition();
    const { width, height } = this.rootContainerService.getGameSize();
    this.background.x = -x;
    this.background.y = -y;
    this.background.width = width;
    this.background.height = height;
  }

  private createBackground(): Sprite {
    const sprite = new Sprite(Texture.WHITE);
    sprite.tint = 0x000000;
    sprite.alpha = this.BACKGROUND_OPACITY;

    return sprite;
  }

  private resizeImage(): void {
    const { width, height } = this.rootContainerService.getGameSafeAreaSize();

    const size = width > height ? height : width;

    this.image.width = size;
    this.image.height = size / this.pixelRatio;
  }

  private createImage(): Sprite {
    const sprite = new Sprite(Assets.get(ASSETS_NAME.Popup));
    sprite.anchor.set(0.5);
    this.content.addChild(sprite);

    return sprite;
  }

  private createContainer(): Container {
    const container = new Container();

    return container;
  }
}

injected(NotificationEntity, DI_TOKENS.rootContainerService);
