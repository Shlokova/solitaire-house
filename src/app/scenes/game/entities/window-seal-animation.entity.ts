import { injected } from 'brandi';
import { Assets, Container, Sprite, Graphics } from 'pixi.js';
import { GAME_EVENTS } from '../../../constants';
import { DI_TOKENS } from '../../../di/tokens';
import { ASSETS_NAME } from '../../../manifest';
import { RootContainerService } from '../../../services/root-container.services';
import { Tween } from 'tweedle.js';

export type WindowSealAnimationOption = {
  parent: Container;
  width: number;
  height: number;
};

export class WindowSealAnimationEntity {
  private readonly container!: Container;
  private readonly HEIGHT!: number;
  private readonly WIDTH!: number;

  constructor(private readonly rootContainerService: RootContainerService) {}

  public init(options: WindowSealAnimationOption): void {
    // @ts-ignore
    this.container = options.parent;
    // @ts-ignore
    this.WIDTH = options.width;
    // @ts-ignore
    this.HEIGHT = options.height;
  }

  public seal(): void {
    const tapeAnimate = this.createTape();
    const handAnimate = this.createHandWithTape();

    handAnimate.start();
    tapeAnimate.start();
  }

  private createTape(): Tween<Graphics> {
    const sprite = Sprite.from(Assets.get(ASSETS_NAME.TapeWindow));

    sprite.anchor.set(1);
    sprite.width = this.WIDTH;
    sprite.height = this.HEIGHT;

    this.container.addChild(sprite);

    const tape = this.createTapeMask();
    sprite.mask = tape;

    return this.tapeMaskAnimate(tape);
  }

  private createHandWithTape(): Tween<Container> {
    const container = new Container();

    const hand = Sprite.from(Assets.get(ASSETS_NAME.Hand));
    const tape = Sprite.from(Assets.get(ASSETS_NAME.Tape));

    hand.anchor.set(0.5);
    hand.width = (50 * 243) / 300;
    hand.height = 50;

    tape.anchor.set(0.5, 1);
    tape.width = (50 * 416) / 444;
    tape.height = 50;

    container.addChild(tape, hand);

    this.container.addChild(container);
    this.handWithTapeAnimation(container);

    return this.handWithTapeAnimation(container);
  }

  private handWithTapeAnimation(handWithTape: Container): Tween<Container> {
    const duraction = 2000;
    const step = 6;

    handWithTape.position.x = 88 - this.WIDTH;
    handWithTape.position.y = 132 - this.HEIGHT;

    return new Tween(handWithTape)
      .to({ x: 187 - this.WIDTH, y: 139 - this.HEIGHT }, duraction / step)
      .onComplete(() => {
        new Tween(handWithTape)
          .to({ x: 85 - this.WIDTH, y: 174 - this.HEIGHT }, duraction / step)
          .start()
          .onComplete(() => {
            new Tween(handWithTape)
              .to({ x: 191 - this.WIDTH, y: 196 - this.HEIGHT }, duraction / step)
              .start()
              .onComplete(() => {
                new Tween(handWithTape)
                  .to({ x: 82 - this.WIDTH, y: 255 - this.HEIGHT }, duraction / step)
                  .start()
                  .onComplete(() => {
                    new Tween(handWithTape)
                      .to({ x: 192 - this.WIDTH, y: 286 - this.HEIGHT }, duraction / step)
                      .start()
                      .onComplete(() => {
                        new Tween(handWithTape)
                          .to({ x: 82 - this.WIDTH, y: 321 - this.HEIGHT }, duraction / step)
                          .start()
                          .onComplete(() => {
                            handWithTape.destroy();
                            this.rootContainerService.app.stage.emit(GAME_EVENTS.REDIRECT);
                          });
                      });
                  });
              });
          });
      });
  }

  private tapeMaskAnimate(maskGraphic: Graphics): Tween<Graphics> {
    const duraction = 2000;
    const step = 6;

    maskGraphic.position.x = -this.WIDTH - 58;
    maskGraphic.position.y = -270 - this.HEIGHT;
    maskGraphic.angle = -19;

    return new Tween(maskGraphic).to({ y: -219 - this.HEIGHT }, duraction / step).onComplete(() => {
      maskGraphic.position.x = -this.WIDTH + 45;
      maskGraphic.position.y = -295 - this.HEIGHT;
      maskGraphic.angle = 12;
      new Tween(maskGraphic)
        .to({ y: -265 - this.HEIGHT }, duraction / step)
        .start()
        .onComplete(() => {
          maskGraphic.position.x = -this.WIDTH - 57;
          maskGraphic.position.y = -195 - this.HEIGHT;
          maskGraphic.angle = -19;
          new Tween(maskGraphic)
            .to({ y: -158 - this.HEIGHT }, duraction / step)
            .start()
            .onComplete(() => {
              maskGraphic.position.x = -this.WIDTH + 44;
              maskGraphic.position.y = -236 - this.HEIGHT;
              maskGraphic.angle = 12;
              new Tween(maskGraphic)
                .to({ y: -180 - this.HEIGHT }, duraction / step)
                .start()
                .onComplete(() => {
                  maskGraphic.position.x = -this.WIDTH - 57;
                  maskGraphic.position.y = -118 - this.HEIGHT;
                  maskGraphic.angle = -19;
                  new Tween(maskGraphic)
                    .to({ y: -75 - this.HEIGHT }, duraction / step)
                    .start()
                    .onComplete(() => {
                      maskGraphic.position.x = -this.WIDTH + 44;
                      maskGraphic.position.y = -153 - this.HEIGHT;
                      maskGraphic.angle = 12;
                      new Tween(maskGraphic).to({ y: -96 - this.HEIGHT }, duraction / step).start();
                    });
                });
            });
        });
    });
  }

  private createTapeMask(): Graphics {
    let maskGraphic = new Graphics();
    maskGraphic.beginFill(0xffffff).drawRoundedRect(0, 0, this.WIDTH, this.HEIGHT, 0);
    maskGraphic.endFill();

    this.container.addChild(maskGraphic);

    return maskGraphic;
  }
}

injected(WindowSealAnimationEntity, DI_TOKENS.rootContainerService);
