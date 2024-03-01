import { GAME_EVENTS } from '../../../constants';
import { ASSETS_NAME } from '../../../manifest';
import { injected } from 'brandi';
import { Container, Sprite, Assets } from 'pixi.js';
import { DI_TOKENS } from '../../../di/tokens';
import { RootContainerService } from '../../../services/root-container.services';

export class PlayNowElementEntity {
  public readonly container: Container;
  public readonly logo: Sprite;
  private readonly WIDTH = 70;
  private readonly pixelRatioLogo = 1193 / 683;
  private readonly pixelRatioButton = 492 / 178;

  constructor(private readonly rootContainerService: RootContainerService) {
    this.container = this.createContainer();
    this.logo = this.createLogo();
    this.logo = this.createButton();

    this.onResize();

    this.rootContainerService.onResize(this.onResize);
  }

  public destroy(): void {
    this.container.destroy();
    this.rootContainerService.removeOnResize(this.onResize);
  }

  private readonly onResize = (): void => {};

  private createLogo(): Sprite {
    const sprite = new Sprite(Assets.get(ASSETS_NAME.Logo));
    sprite.anchor.set(0);
    sprite.width = this.WIDTH;
    sprite.height = this.WIDTH / this.pixelRatioLogo;

    this.container.addChild(sprite);

    return sprite;
  }

  private createButton(): Sprite {
    const sprite = new Sprite(Assets.get(ASSETS_NAME.Button));
    sprite.anchor.set(0);
    sprite.width = this.WIDTH;
    sprite.height = this.WIDTH / this.pixelRatioButton;
    sprite.y = this.logo.height;
    sprite.eventMode = 'dynamic';
    sprite.cursor = 'pointer';
    sprite.on('pointertap', () => this.rootContainerService.emit(GAME_EVENTS.REDIRECT));

    this.container.addChild(sprite);

    return sprite;
  }

  private createContainer(): Container {
    const container = new Container();
    container.x = 10;
    container.y = 10;

    return container;
  }
}

injected(PlayNowElementEntity, DI_TOKENS.rootContainerService);
