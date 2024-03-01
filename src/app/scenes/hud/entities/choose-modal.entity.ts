import { GAME_EVENTS } from '../../../constants';
import { injected } from 'brandi';
import { Container, Sprite, Texture, Assets } from 'pixi.js';
import { ASSETS_NAME } from '../../../manifest';
import { DI_TOKENS } from '../../../di/tokens';
import { RootContainerService } from '../../../services/root-container.services';
import { Tween } from 'tweedle.js';
import { HightlightEntity, HightlightOption } from './highlight.entity';
import { DI_TOKENS_HUD_SCENE } from '../di/tokens';
import { HandEntity } from './hand.entity';
import { ShadowEntity, ShadowOption } from 'src/app/entities/shadow.entity';

type CardOptions = {
  texture: Texture;
  x: number;
  card: Container;
};

export class ChooseModalEntity {
  public readonly container: Container;
  private firstCard: Container;
  private secondCard: Container;
  private firstCardHightlight: HightlightEntity | null = null;
  private secondCardHightlight: HightlightEntity | null = null;
  private readonly content: Container;
  private readonly background: Sprite;
  private readonly WIDTH = 100;
  private readonly pixelRatio = 160 / 243;
  private tutorialTimer: NodeJS.Timeout | null = null;

  constructor(
    private readonly rootContainerService: RootContainerService,
    private readonly createHightlight: (option: HightlightOption) => HightlightEntity,
    private readonly createShadow: (option: ShadowOption) => ShadowEntity,
    private readonly hand: HandEntity,
  ) {
    this.container = this.createContainer();
    this.content = this.createContainer();
    this.background = this.createBackground();

    this.firstCard = this.createCard(() => {
      this.rootContainerService.app.stage.emit(GAME_EVENTS.REPAIR_WINDOW);
      this.destroy();
    });

    this.secondCard = this.createCard(() => {
      this.rootContainerService.app.stage.emit(GAME_EVENTS.SEAL_WINDOW);
      this.destroy();
    });

    this.onResize();

    this.rootContainerService.onResize(this.onResize);
    this.rootContainerService.app.stage.on(GAME_EVENTS.CHOOSE_ACTIVE, () => {
      this.show();
    });
  }

  private show(): void {
    this.container.addChild(this.background, this.content);

    const { height } = this.rootContainerService.getGameSafeAreaSize();
    this.content.y = height / 2;

    this.showCard({ card: this.firstCard, x: -80, texture: Assets.get(ASSETS_NAME.CardWindow) });
    this.showCard({ card: this.secondCard, x: 80, texture: Assets.get(ASSETS_NAME.CardTape) });

    new Tween(this.content).to({ y: height - this.WIDTH / this.pixelRatio / 2 }, 500).start(500);
  }

  private showCard(cardOptions: CardOptions): void {
    new Tween(cardOptions.card)
      .to({ x: cardOptions.x }, 500)
      .start(1000)
      .onComplete(() => this.openCard(cardOptions));
  }

  private openCard(cardOptions: CardOptions): void {
    new Tween(cardOptions.card.scale)
      .to({ x: 0 }, 250)
      .start(200)
      .onComplete(() => {
        const image = cardOptions.card.children.at(-1) as Sprite;
        image.texture = cardOptions.texture;
        new Tween(cardOptions.card.scale).to({ x: 1 }, 250).start();
        image.eventMode = 'dynamic';
        image.cursor = 'pointer';
        this.tutorialTimer = setTimeout(() => this.showTutorialFitstCard(), 1500);
      });
  }

  private showTutorialFitstCard(): void {
    if (!this.tutorialTimer) return;

    this.hand.showHand(this.firstCard, { x: 0, y: 0 });
    this.hand.bounce(2);

    const shadow = this.createShadow({ parent: this.firstCard, alpha: 0.5 });
    this.firstCardHightlight = this.createHightlight({
      parent: this.firstCard,
      width: this.WIDTH,
      height: this.WIDTH / this.pixelRatio,
      repeat: 2,
      onComplete: () => {
        this.hand.hideHand();
        this.showTutorialLastCard();
        shadow.removeShadow();
      },
    });

    this.firstCardHightlight.start();
  }

  private showTutorialLastCard(): void {
    if (!this.tutorialTimer) return;

    this.hand.showHand(this.secondCard, { x: 0, y: 0 });
    this.hand.bounce(2);

    const shadow = this.createShadow({ parent: this.secondCard, alpha: 0.5 });
    this.secondCardHightlight = this.createHightlight({
      parent: this.secondCard,
      width: this.WIDTH,
      height: this.WIDTH / this.pixelRatio,
      repeat: 2,
      onComplete: () => {
        shadow.removeShadow();
        this.hand.hideHand();
      },
    });

    this.secondCardHightlight.start();
  }

  private destroy(): void {
    this.content.destroy();
    this.container.destroy();
    this.rootContainerService.removeOnResize(this.onResize);
  }

  private readonly onResize = (): void => {
    this.setPosition();
    this.resizeBackground();
  };

  private resizeBackground(): void {
    const { x, y } = this.rootContainerService.getGameSafeAreaPosition();
    const { width, height } = this.rootContainerService.getGameSize();
    this.background.x = -x;
    this.background.y = -y;
    this.background.width = width;
    this.background.height = height;
  }

  private setPosition(): void {
    const { width, height } = this.rootContainerService.getGameSafeAreaSize();

    this.content.x = width / 2;
    this.content.y = height - this.WIDTH / this.pixelRatio / 2;
  }

  private createCard(onClick: () => void): Container {
    const card = new Container();

    const image = new Sprite(Assets.get(ASSETS_NAME.CardUnknown));
    image.anchor.set(0.5);
    image.width = this.WIDTH;
    image.height = this.WIDTH / this.pixelRatio;

    image.on('pointertap', () => {
      this.tutorialTimer && clearTimeout(this.tutorialTimer);
      this.tutorialTimer = null;
      this.secondCardHightlight?.stop();
      this.firstCardHightlight?.stop();
      onClick();
    });

    card.addChild(image);
    this.content.addChild(card);

    return card;
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
  ChooseModalEntity,
  DI_TOKENS.rootContainerService,
  DI_TOKENS_HUD_SCENE.hightlightEntityFactory,
  DI_TOKENS.shadowFactory,
  DI_TOKENS_HUD_SCENE.handEntity,
);
