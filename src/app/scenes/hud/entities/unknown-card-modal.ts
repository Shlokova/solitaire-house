import { HightlightEntity, HightlightOption } from './highlight.entity';
import { GAME_EVENTS } from '../../../constants';
import { injected } from 'brandi';
import { Container, Sprite, Texture, Assets } from 'pixi.js';
import { ASSETS_NAME } from '../../../manifest';
import { DI_TOKENS } from '../../../di/tokens';
import { RootContainerService } from '../../../services/root-container.services';
import { DI_TOKENS_HUD_SCENE } from '../di/tokens';
import { Tween } from 'tweedle.js';
import { SOLITER_CARDS_SIZE } from './card-solitaire.entity';

export class UnknownCardModalEntity {
  public readonly container: Container;
  private readonly content: Container;
  private readonly background: Sprite;
  private readonly card: Sprite;
  private readonly WIDTH = 100;
  private readonly pixelRatio = 160 / 243;

  constructor(
    private readonly rootContainerService: RootContainerService,
    private readonly createHightlight: (option: HightlightOption) => HightlightEntity,
  ) {
    this.container = this.createContainer();
    this.background = this.createBackground();

    this.content = this.createContainer();
    this.content.alpha = 0;
    this.card = this.createCard();

    this.onResize();

    this.rootContainerService.onResize(this.onResize);

    this.rootContainerService.once(GAME_EVENTS.UNKNOWN_ACTIVE, (e) => {
      this.open(e);
    });
    this.rootContainerService.once(GAME_EVENTS.CHOOSE_ACTIVE, () => {
      this.destroy();
    });
  }

  public open(options: { x: number; y: number; width: number; height: number }): void {
    this.container.addChild(this.background, this.content);

    const { width, height } = this.rootContainerService.getGameSafeAreaSize();

    new Tween(this.content)
      .from({
        x: width - SOLITER_CARDS_SIZE.width + options.x - 10,
        y: options.y + 60,
        angle: 360,
        alpha: 0.7,
      })
      .to({ x: width / 2, y: height / 2, angle: 0, alpha: 1 }, 500)
      .start();

    new Tween(this.card)
      .from({
        width: options.width,
        height: options.height,
      })
      .to({ width: this.WIDTH, height: this.WIDTH / this.pixelRatio }, 500)
      .start()
      .onComplete(() => {
        this.hightlightCard();
      });
  }

  private hightlightCard(): void {
    const hightlight = this.createHightlight({
      parent: this.content,
      width: this.WIDTH,
      height: this.WIDTH / this.pixelRatio,
      repeat: 5,
      onRepeat: (count) => {
        if (count === 2) this.rootContainerService.emit(GAME_EVENTS.MOVE_CAMERA_TO_WINDOW);
      },
    });

    hightlight.start();
  }

  public hide(): void {
    new Tween(this.container).to({ alpha: 0 }, 1000).start();
    new Tween(this.content.scale)
      .from({ x: 1, y: 1 })
      .to({ x: 0.7, y: 0.7 }, 1000)
      .onComplete(() => {
        this.destroy();
      })
      .start();
  }

  private destroy(): void {
    this.container.destroy();
    this.rootContainerService.removeOnResize(this.onResize);
  }

  private readonly onResize = (): void => {
    this.setPosition();
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

  private createCard(): Sprite {
    const sprite = new Sprite(Assets.get(ASSETS_NAME.CardUnknown));
    sprite.anchor.set(0.5);
    sprite.width = this.WIDTH;
    sprite.height = this.WIDTH / this.pixelRatio;

    this.content.addChild(sprite);

    return sprite;
  }

  private createBackground(): Sprite {
    const sprite = new Sprite(Texture.WHITE);
    sprite.tint = 0x000000;
    sprite.alpha = 0;
    sprite.eventMode = 'dynamic';

    return sprite;
  }

  private createContainer(): Container {
    const container = new Container();

    return container;
  }
}

injected(
  UnknownCardModalEntity,
  DI_TOKENS.rootContainerService,
  DI_TOKENS_HUD_SCENE.hightlightEntityFactory,
);
