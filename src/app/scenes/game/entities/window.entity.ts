import {
  WindowRepairAnimationEntity,
  WindowRepareOptions as WindowRepairOptions,
} from './window-repair-animation.entity';
import { ShadowEntity, ShadowOption } from './../../../entities/shadow.entity';
import { injected } from 'brandi';
import { Assets, Container, Sprite, Graphics } from 'pixi.js';
import { GAME_EVENTS } from '../../../constants';
import { DI_TOKENS } from '../../../di/tokens';
import { ASSETS_NAME } from '../../../manifest';
import { RootContainerService } from '../../../services/root-container.services';
import { Tween } from 'tweedle.js';
import { DI_TOKENS_GAME_SCENE } from '../di/tokens';
import {
  WindowSealAnimationEntity,
  WindowSealAnimationOption,
} from './window-seal-animation.entity';

export class WindowEntity {
  public readonly container: Container;
  public readonly image: Sprite;
  private readonly HEIGHT: number;
  private readonly WIDTH: number;
  private shadow: ShadowEntity | null = null;
  private readonly imagePixelRatio = 1062 / 1608;

  constructor(
    private readonly rootContainerService: RootContainerService,
    private readonly createShadow: (options: ShadowOption) => ShadowEntity,
    private readonly createWindowRepairAnimation: (
      options: WindowRepairOptions,
    ) => WindowRepairAnimationEntity,
    private readonly createWindowSealAnimation: (
      options: WindowSealAnimationOption,
    ) => WindowSealAnimationEntity,
  ) {
    this.HEIGHT = 400;
    this.WIDTH = this.HEIGHT * this.imagePixelRatio;

    this.container = this.createContainer();
    this.image = this.createImage();
    this.onResize();
    this.rootContainerService.onResize(this.onResize);

    this.rootContainerService.once(GAME_EVENTS.REPAIR_WINDOW, () => {
      this.repair();
    });
    this.rootContainerService.once(GAME_EVENTS.SEAL_WINDOW, () => {
      const seal = this.createWindowSealAnimation({
        parent: this.container,
        width: this.WIDTH,
        height: this.HEIGHT,
      });
      seal.seal();
    });
    this.rootContainerService.once(GAME_EVENTS.UNKNOWN_ACTIVE, () => {
      this.shadow = this.createShadow({ parent: this.container, alpha: 0.5 });
    });
    this.rootContainerService.once(GAME_EVENTS.CHOOSE_ACTIVE, () => {
      this.shadow?.removeShadow();
    });
  }

  public destroy(): void {
    this.container.destroy();
    this.rootContainerService.removeOnResize(this.onResize);
  }

  public repair(): void {
    const smoke = this.createWindowRepairAnimation(this.container);
    this.container.parent.addChild(smoke.container);

    setTimeout(() => {
      this.image.texture = Assets.get(ASSETS_NAME.WindowRepair);
      this.rootContainerService.app.stage.emit(GAME_EVENTS.REDIRECT);
      smoke.destroy();
    }, 2000);
  }

  private readonly onResize = (): void => {
    this.updatePosition();
  };

  private createContainer(): Container {
    const container = new Container();
    container.zIndex = 1;

    return container;
  }

  private updatePosition(): void {
    const { width, height } = this.rootContainerService.getGameSize();

    const currentPositionAndSize = this.rootContainerService.getResizeOptions({
      album: { x: width / 2, y: height / 2 + 60 },
      portrat: { x: width / 2 + 40, y: height / 2 + 100 },
    });

    this.container.x = currentPositionAndSize.x;
    this.container.y = currentPositionAndSize.y;
  }

  private createImage(): Sprite {
    const sprite = Sprite.from(Assets.get(ASSETS_NAME.Window));

    sprite.anchor.set(1);
    sprite.width = this.WIDTH;
    sprite.height = this.HEIGHT;

    this.container.addChild(sprite);

    return sprite;
  }
}

injected(
  WindowEntity,
  DI_TOKENS.rootContainerService,
  DI_TOKENS.shadowFactory,
  DI_TOKENS_GAME_SCENE.windowRepairAnimationFactory,
  DI_TOKENS_GAME_SCENE.windowSealAnimationFactory,
);
