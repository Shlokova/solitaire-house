import { injected } from 'brandi';
import { Container, Texture, Assets } from 'pixi.js';
import { ASSETS_NAME } from 'src/app/manifest';
import { DI_TOKENS } from '../../../di/tokens';
import { RootContainerService } from '../../../services/root-container.services';
import { DI_TOKENS_HUD_SCENE } from '../di/tokens';
import { Tween } from 'tweedle.js';
import { CardEntity, CardEntityOptions } from './card.entity';
import { GAME_EVENTS } from '../../../constants';
import { SOLITER_CARDS_SIZE } from './card-solitaire.entity';

export class CardDeckEntity {
  public readonly container: Container;
  private readonly hiddenCardsContainer: Container;
  private readonly openCardsContainer: Container;
  private readonly CARD_WIDTH = 50;
  private hiddenCardsCount = 10;
  private openCardsCount = 1;

  constructor(
    private readonly rootContainerService: RootContainerService,
    private readonly createCard: (options: CardEntityOptions) => CardEntity,
  ) {
    this.container = this.createContainer();
    this.hiddenCardsContainer = this.createHiddenCards();

    this.openCardsContainer = this.createOpenCards();

    this.onResize();

    this.rootContainerService.onResize(this.onResize);
    this.rootContainerService.app.stage.on(GAME_EVENTS.CHOOSE_CARD, this.addOpenCard);
  }

  public setVisible(visible: boolean): void {
    this.container.visible = visible;
  }

  public destroy(): void {
    this.container.destroy();
    this.rootContainerService.removeOnResize(this.onResize);
    this.rootContainerService.app.stage.off(GAME_EVENTS.CHOOSE_CARD, this.addOpenCard);
  }

  private addOpenCard = (options: {
    texture: Texture;
    x: number;
    y: number;
    width: number;
    height: number;
  }): void => {
    const { width: widthGame, height: heightGame } =
      this.rootContainerService.getGameSafeAreaSize();

    const card = this.createCard({
      width: this.CARD_WIDTH,
      texture: options.texture,
    });

    const endWidth = card.container.width;
    const endHeight = card.container.height;
    const endX = this.openCardsCount * 10;
    const endY = 0;

    const startWidth = options.width;
    const startHeight = options.height;
    const startX =
      widthGame -
      SOLITER_CARDS_SIZE.width -
      this.container.x -
      this.openCardsContainer.x +
      options.x -
      10;

    const startY = endHeight - heightGame + options.y + 80;

    this.openCardsContainer.addChild(card.container);

    new Tween(card.container)
      .from({
        width: startWidth,
        height: startHeight,
        x: startX,
        y: startY,
        angle: 360,
      })
      .to({ width: endWidth, height: endHeight, x: endX, y: endY, angle: 0 }, 500)
      .start();

    this.openCardsCount++;
  };

  private createHiddenCards(): Container {
    const hiddenCardsContainer = this.createContainer();
    for (let i = 0; i < this.hiddenCardsCount; i++) {
      const card = this.createCard({
        width: this.CARD_WIDTH,
        texture: Assets.get(ASSETS_NAME.CardBack),
      });

      card.container.position.x = i * 8;

      hiddenCardsContainer.addChild(card.container);
    }

    this.container.addChild(hiddenCardsContainer);

    return hiddenCardsContainer;
  }

  private createOpenCards(): Container {
    const openCardsContainer = this.createContainer();
    openCardsContainer.x = this.hiddenCardsContainer.x + this.hiddenCardsContainer.width + 10;

    const card = this.createCard({
      width: this.CARD_WIDTH,
      texture: Assets.get(ASSETS_NAME.Card2),
    });

    openCardsContainer.addChild(card.container);

    this.container.addChild(openCardsContainer);

    return openCardsContainer;
  }

  private readonly onResize = (): void => {
    this.setPosition();
  };

  private setPosition(): void {
    const { width, height } = this.rootContainerService.getGameSafeAreaSize();

    this.container.x = width / 2 - this.hiddenCardsContainer.width + 10;
    this.container.y = height - this.container.height;
  }

  private createContainer(): Container {
    const container = new Container();

    return container;
  }
}

injected(CardDeckEntity, DI_TOKENS.rootContainerService, DI_TOKENS_HUD_SCENE.cardEntityFactory);
