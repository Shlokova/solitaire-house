import { GAME_EVENTS } from '../../../constants';
import { injected } from 'brandi';
import { Container, Sprite, Texture } from 'pixi.js';
import { DI_TOKENS } from '../../../di/tokens';
import { RootContainerService } from '../../../services/root-container.services';

export class RedirectScreenEntity {
  public readonly container: Container;
  public readonly redirectScreen: Sprite;

  constructor(private readonly rootContainerService: RootContainerService) {
    this.container = this.createContainer();
    this.redirectScreen = this.createRedirectScreen();

    this.onResize();

    this.rootContainerService.onResize(this.onResize);
    this.rootContainerService.once(GAME_EVENTS.REDIRECT, () => {
      setTimeout(() => this.redirectToDownloadPage());
      this.activateRedirectScreen();
    });
  }

  public activateRedirectScreen(): void {
    this.redirectScreen.eventMode = 'dynamic';
    this.redirectScreen.cursor = 'pointer';
    this.redirectScreen.on('pointertap', () => this.redirectToDownloadPage());
  }

  public destroy(): void {
    this.container.destroy();
    this.rootContainerService.removeOnResize(this.onResize);
  }

  private readonly onResize = (): void => {
    this.resizeScreen();
  };

  private detectOS(): 'android' | 'ios' {
    const userAgent = navigator.userAgent || navigator.vendor;

    if (/(Mac|iPhone|iPod|iPad)/i.test(userAgent)) {
      return 'ios';
    }

    return 'android';
  }

  private redirectToDownloadPage(): void {
    const os = this.detectOS();
    if (os === 'ios') {
      window.open('https://apps.apple.com/us/app/id1621680427', '_self');
    } else {
      window.open('https://play.google.com/store/apps/details?id=com.bfk.cards', '_self');
    }
  }

  private resizeScreen(): void {
    const { x, y } = this.rootContainerService.getGameSafeAreaPosition();
    const { width, height } = this.rootContainerService.getGameSize();
    this.redirectScreen.x = -x;
    this.redirectScreen.y = -y;
    this.redirectScreen.width = width;
    this.redirectScreen.height = height;
  }

  private createRedirectScreen(): Sprite {
    const sprite = new Sprite(Texture.EMPTY);

    this.container.addChild(sprite);

    return sprite;
  }

  private createContainer(): Container {
    const container = new Container();

    return container;
  }
}

injected(RedirectScreenEntity, DI_TOKENS.rootContainerService);
