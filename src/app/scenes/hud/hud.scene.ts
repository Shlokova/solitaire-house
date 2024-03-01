import { CardSolitaireEntity } from './entities/card-solitaire.entity';
import { injected } from 'brandi';
import { Container } from 'pixi.js';
import { RootContainerService } from 'src/app/services/root-container.services';
import { DI_TOKENS } from '../../di/tokens';
import { DI_TOKENS_HUD_SCENE } from './di/tokens';
import { NotificationEntity } from './entities/notification.entities';
import { CardDeckEntity } from './entities/card-deck.entity';
import { GAME_EVENTS } from '../../constants';
import { UnknownCardModalEntity } from './entities/unknown-card-modal';
import { ChooseModalEntity } from './entities/choose-modal.entity';

export class HudScene {
  private readonly sceneContainer: Container;

  constructor(
    private readonly rootContainerService: RootContainerService,
    private readonly notification: NotificationEntity,
    private readonly unknownCardModal: UnknownCardModalEntity,
    private readonly chooseModal: ChooseModalEntity,
    private readonly cardDeck: CardDeckEntity,
    private readonly cardSolitaire: CardSolitaireEntity,
  ) {
    this.sceneContainer = this.createSceneContainer();

    this.sceneContainer.addChild(this.cardSolitaire.container);
    this.sceneContainer.addChild(this.cardDeck.container);
    this.sceneContainer.addChild(this.notification.container);
    this.sceneContainer.addChild(this.chooseModal.container);
    this.sceneContainer.addChild(this.unknownCardModal.container);

    this.onResize();
    this.rootContainerService.onResize(this.onResize);
    this.rootContainerService.app.stage.once(GAME_EVENTS.UNKNOWN_ACTIVE, () => {
      this.cardSolitaire.setVisible(false);
      this.cardDeck.setVisible(false);
    });
  }

  public async start(): Promise<void> {
    this.notification.open();
  }

  public destroy(): void {
    this.sceneContainer.destroy();
    this.cardSolitaire.destroy();
    this.cardDeck.destroy();
    this.rootContainerService.removeOnResize(this.onResize);
  }

  private onResize = (): void => {
    const { x, y } = this.rootContainerService.getGameSafeAreaPosition();

    this.sceneContainer.x = x;
    this.sceneContainer.y = y;
  };

  private createSceneContainer(): Container {
    const container = new Container();

    this.rootContainerService.addChild(container);
    return container;
  }
}

injected(
  HudScene,
  DI_TOKENS.rootContainerService,
  DI_TOKENS_HUD_SCENE.notificationEntity,
  DI_TOKENS_HUD_SCENE.unknownCardModalEntity,
  DI_TOKENS_HUD_SCENE.chooseModalEntity,
  DI_TOKENS_HUD_SCENE.cardDeckEntity,
  DI_TOKENS_HUD_SCENE.cardSolitaireEntity,
);
