import { GAME_EVENTS } from '../../../constants';
import { SelectedCardContainerEntity } from './selected-card-container.entity';
import { injected } from 'brandi';
import { Container, Assets } from 'pixi.js';
import { ASSETS_NAME } from '../../../manifest';
import { DI_TOKENS } from '../../../di/tokens';
import { RootContainerService } from '../../../services/root-container.services';
import { DI_TOKENS_HUD_SCENE } from '../di/tokens';
import { SelectedCardEntity, SelectedCardEntityOptions } from './selected-card.entity';

type SelectedCardOptions = {
  texture: ASSETS_NAME;
  x: number;
  y: number;
  isUnknown: boolean;
  isTutorial?: boolean;
};
enum SOLITER_CARDS_LINE {
  FirstLeftLine = 'FirstLeftLine',
  FirstRightLine = 'FirstRightLine',
  SecondLeftLine = 'SecondLeftLine',
  SecondRightLine = 'SecondRightLine',
  ThirdLeftLine = 'ThirdLeftLine',
  ThirdRightLine = 'ThirdRightLine',
  FourthLeftLine = 'FourthLeftLine',
  FourthRightLine = 'FourthRightLine',
  FifthLeftLine = 'FifthLeftLine',
  FifthRightLine = 'FifthRightLine',
}

export const SOLITER_CARDS_SIZE = {
  width: 140,
  height: 106,
};

const SOLITER_CARDS: Record<
  SOLITER_CARDS_LINE,
  { cards: SelectedCardOptions[]; next: SOLITER_CARDS_LINE | null }
> = {
  [SOLITER_CARDS_LINE.FirstRightLine]: {
    cards: [{ texture: ASSETS_NAME.CardK, x: 75, y: 0, isUnknown: false }],
    next: null,
  },
  [SOLITER_CARDS_LINE.FirstLeftLine]: {
    cards: [{ texture: ASSETS_NAME.CardA, x: 35, y: 0, isUnknown: false }],
    next: null,
  },
  [SOLITER_CARDS_LINE.SecondLeftLine]: {
    cards: [{ texture: ASSETS_NAME.CardJ, x: 25, y: 15, isUnknown: false }],
    next: SOLITER_CARDS_LINE.FirstLeftLine,
  },
  [SOLITER_CARDS_LINE.SecondRightLine]: {
    cards: [{ texture: ASSETS_NAME.CardQ, x: 85, y: 15, isUnknown: false }],
    next: SOLITER_CARDS_LINE.FirstRightLine,
  },
  [SOLITER_CARDS_LINE.ThirdLeftLine]: {
    cards: [{ texture: ASSETS_NAME.Card10, x: 15, y: 30, isUnknown: false }],
    next: SOLITER_CARDS_LINE.SecondLeftLine,
  },
  [SOLITER_CARDS_LINE.ThirdRightLine]: {
    cards: [{ texture: ASSETS_NAME.Card8, x: 95, y: 30, isUnknown: false }],
    next: SOLITER_CARDS_LINE.SecondRightLine,
  },
  [SOLITER_CARDS_LINE.FourthLeftLine]: {
    cards: [
      { texture: ASSETS_NAME.Card9, x: 0, y: 45, isUnknown: false },
      { texture: ASSETS_NAME.Card7, x: 30, y: 45, isUnknown: false },
    ],
    next: SOLITER_CARDS_LINE.ThirdLeftLine,
  },
  [SOLITER_CARDS_LINE.FourthRightLine]: {
    cards: [
      { texture: ASSETS_NAME.Card6, x: 110, y: 45, isUnknown: true },
      { texture: ASSETS_NAME.Card4, x: 80, y: 45, isUnknown: false },
    ],
    next: SOLITER_CARDS_LINE.ThirdRightLine,
  },
  [SOLITER_CARDS_LINE.FifthLeftLine]: {
    cards: [{ texture: ASSETS_NAME.Card5, x: 15, y: 60, isUnknown: false }],
    next: SOLITER_CARDS_LINE.FourthLeftLine,
  },
  [SOLITER_CARDS_LINE.FifthRightLine]: {
    cards: [{ texture: ASSETS_NAME.Card3, x: 95, y: 60, isUnknown: false, isTutorial: true }],
    next: SOLITER_CARDS_LINE.FourthRightLine,
  },
};

export class CardSolitaireEntity {
  public readonly container: Container;
  private readonly CARD_WIDTH = 30;
  private selectedCardContainers: Map<SOLITER_CARDS_LINE, SelectedCardContainerEntity> = new Map();

  constructor(
    private readonly rootContainerService: RootContainerService,
    private readonly createSelectedCard: (options: SelectedCardEntityOptions) => SelectedCardEntity,
    private readonly createSelectedCardContainer: () => SelectedCardContainerEntity,
  ) {
    this.container = this.createContainer();
    this.createSolitaireCards();

    this.onResize();
    this.rootContainerService.onResize(this.onResize);
    this.rootContainerService.on(GAME_EVENTS.NOTIFICATION_CLOSED, () => {
      this.openFirstCards();
    });
  }

  public setVisible(visible: boolean): void {
    this.container.visible = visible;
  }

  public destroy(): void {
    this.container.destroy();
    this.rootContainerService.removeOnResize(this.onResize);
  }

  private openFirstCards(): void {
    const fifthLeftLine = this.selectedCardContainers.get(SOLITER_CARDS_LINE.FifthLeftLine);
    if (fifthLeftLine) fifthLeftLine.open();

    const fifthRightLine = this.selectedCardContainers.get(SOLITER_CARDS_LINE.FifthRightLine);
    if (fifthRightLine) fifthRightLine.open();
  }

  private createSolitaireCards(): Container {
    const hiddenCardsContainer = this.createContainer();

    Object.entries(SOLITER_CARDS).forEach(([name, line]) => {
      const container = this.createCardSelectedContainer(line.cards, line.next);

      hiddenCardsContainer.addChild(container.container);

      this.selectedCardContainers.set(name as SOLITER_CARDS_LINE, container);
    });

    this.container.addChild(hiddenCardsContainer);

    return hiddenCardsContainer;
  }

  private createCardSelectedContainer(
    cards: SelectedCardOptions[],
    next: SOLITER_CARDS_LINE | null,
  ) {
    const cardSelectedContainer = this.createSelectedCardContainer();

    cards.forEach((cardParams) => {
      const card = this.createSelectedCard({
        width: this.CARD_WIDTH,
        texture: Assets.get(cardParams.texture),
        isUnknown: cardParams.isUnknown,
        isTutorial: cardParams.isTutorial,
        position: { x: cardParams.x, y: cardParams.y },
        onPointerTap: () => {
          cardSelectedContainer.removeChildren(card);

          if (cardSelectedContainer.isEmpty() && next) {
            const nextContainer = this.selectedCardContainers.get(next);
            if (nextContainer) {
              nextContainer.open();
            }
          }
          if (cardSelectedContainer.isEmpty()) {
            cardSelectedContainer.destroy();
          }
        },
      });

      cardSelectedContainer.addChildren(card);
    });

    return cardSelectedContainer;
  }

  private readonly onResize = (): void => {
    this.setPosition();
  };

  private setPosition(): void {
    const { width } = this.rootContainerService.getGameSafeAreaSize();

    this.container.x = width - SOLITER_CARDS_SIZE.width - 10;
    this.container.y = 80;
  }

  private createContainer(): Container {
    const container = new Container();

    return container;
  }
}

injected(
  CardSolitaireEntity,
  DI_TOKENS.rootContainerService,
  DI_TOKENS_HUD_SCENE.selectedCardEntityFactory,
  DI_TOKENS_HUD_SCENE.selectedCardContainerEntityFactory,
);
