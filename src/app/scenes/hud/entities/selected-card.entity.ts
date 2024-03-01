import { injected } from 'brandi';
import { Container, Texture, Assets } from 'pixi.js';
import { ASSETS_NAME } from 'src/app/manifest';
import { DI_TOKENS_HUD_SCENE } from '../di/tokens';
import { Tween } from 'tweedle.js';
import { CardEntity, CardEntityOptions } from './card.entity';
import { GAME_EVENTS } from '../../../constants';
import { RootContainerService } from 'src/app/services/root-container.services';
import { DI_TOKENS } from '../../../di/tokens';
import { HandEntity } from './hand.entity';
import { HightlightEntity, HightlightOption } from './highlight.entity';
import { ShadowEntity, ShadowOption } from 'src/app/entities/shadow.entity';

export type SelectedCardEntityOptions = CardEntityOptions & {
  isUnknown: boolean;
  isTutorial?: boolean;
  onPointerTap: () => void;
  position: { x: number; y: number };
};

export class SelectedCardEntity {
  public readonly container: Container;
  public readonly card!: CardEntity;
  public isTutorial: boolean = false;
  public highlight: HightlightEntity | null = null;
  public shadow: ShadowEntity | null = null;
  public unknownCard: CardEntity | null = null;
  public readonly texture!: Texture;

  constructor(
    private rootContainer: RootContainerService,
    private readonly createShadow: (option: ShadowOption) => ShadowEntity,
    private readonly hand: HandEntity,
    private readonly createHightlight: (options: HightlightOption) => HightlightEntity,
    private readonly createCard: (options: CardEntityOptions) => CardEntity,
  ) {
    this.container = this.createContainer();
    this.rootContainer.once(GAME_EVENTS.CHOOSE_CARD, () => {
      this.hideTutorial();
    });
  }

  public init(options: SelectedCardEntityOptions) {
    // @ts-ignore
    this.card = this.createSelectedCard({ ...options, texture: Assets.get(ASSETS_NAME.CardBack) });

    this.unknownCard = this.createUnknownCard(options);
    // @ts-ignore
    this.texture = options.texture;
    this.container.addChildAt(this.card.container, 0);

    this.isTutorial = !!options.isTutorial;
  }

  public open(): void {
    new Tween(this.card.container.scale)
      .to({ x: 0 }, 200)
      .start(500)
      .onComplete(() => {
        this.card.image.texture = this.texture;
        this.card.container.eventMode = 'dynamic';
        this.card.container.cursor = 'pointer';
        new Tween(this.card.container.scale).to({ x: 1 }, 200).start();
        this.openUnknownCard();
        if (this.isTutorial) {
          this.showTutorial();
        }
      });
  }

  public destroy(): void {
    this.rootContainer.emit(GAME_EVENTS.CHOOSE_CARD, {
      texture: this.card.image.texture,
      x: this.container.x,
      y: this.container.y,
      width: this.card.container.width,
      height: this.card.container.height,
    });

    this.hideTutorial();
    this.card.destroy();
    this.container.destroy();
  }

  private showTutorial(): void {
    this.highlight = this.createHightlight({
      parent: this.container,
      width: this.card.image.width,
      height: this.card.image.height,
      repeat: 4,
      onComplete: () => {
        this.shadow && this.shadow.removeShadow();
        this.hand.hideHand();
        this.isTutorial = false;
      },
    });

    this.highlight.start(1000, () => {
      this.hand.showHand(this.container, { x: 0, y: 0 });
      this.hand.bounce(4);
      this.shadow = this.createShadow({ parent: this.container, alpha: 0.5 });
    });
  }

  private hideTutorial(): void {
    if (!this.isTutorial) return;

    this.hand.hideHand();
    this.shadow?.removeShadow();
    this.highlight?.stop();
    this.isTutorial = false;
  }

  private createContainer(): Container {
    const container = new Container();

    return container;
  }

  private openUnknownCard() {
    if (!this.unknownCard) return;

    const unknownCard = this.unknownCard;

    new Tween(this.unknownCard.container.scale)
      .to({ x: 1 }, 200)
      .onComplete(() => {
        this.rootContainer.app.stage.emit(GAME_EVENTS.UNKNOWN_ACTIVE, {
          x: this.container.x,
          y: this.container.y,
          width: unknownCard.container.width,
          height: unknownCard.container.height,
        });

        this.unknownCard?.destroy();
        this.unknownCard = null;
      })
      .start();
  }

  private createUnknownCard(options: SelectedCardEntityOptions): CardEntity | null {
    if (!options.isUnknown) return null;

    const unknownCard = this.createCard({
      ...options,
      texture: Assets.get(ASSETS_NAME.CardUnknown),
    });
    unknownCard.container.scale.x = 0;
    this.container.addChild(unknownCard.container);

    return unknownCard;
  }

  private createSelectedCard(options: SelectedCardEntityOptions): CardEntity {
    const card = this.createCard({ ...options, texture: Assets.get(ASSETS_NAME.CardBack) });

    card.container.on('pointertap', options.onPointerTap);
    this.container.position.x = options.position.x;
    this.container.position.y = options.position.y;

    return card;
  }
}

injected(
  SelectedCardEntity,
  DI_TOKENS.rootContainerService,
  DI_TOKENS.shadowFactory,
  DI_TOKENS_HUD_SCENE.handEntity,
  DI_TOKENS_HUD_SCENE.hightlightEntityFactory,
  DI_TOKENS_HUD_SCENE.cardEntityFactory,
);
