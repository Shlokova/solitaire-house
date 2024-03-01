import { HudScene } from './../hud.scene';
import { DependencyModule } from 'brandi';
import { DI_TOKENS_HUD_SCENE } from './tokens';
import { NotificationEntity } from '../entities/notification.entities';
import { CardDeckEntity } from '../entities/card-deck.entity';
import { CardEntity } from '../entities/card.entity';
import { CardSolitaireEntity } from '../entities/card-solitaire.entity';
import { SelectedCardEntity } from '../entities/selected-card.entity';
import { SelectedCardContainerEntity } from '../entities/selected-card-container.entity';
import { UnknownCardModalEntity } from '../entities/unknown-card-modal';
import { ChooseModalEntity } from '../entities/choose-modal.entity';
import { HandEntity } from '../entities/hand.entity';
import { HightlightEntity } from '../entities/highlight.entity';

export function createDiModuleHudScene(): DependencyModule {
  const dm = new DependencyModule();
  dm.bind(DI_TOKENS_HUD_SCENE.hudSceneFactory).toFactory(HudScene);
  dm.bind(DI_TOKENS_HUD_SCENE.notificationEntity).toInstance(NotificationEntity).inTransientScope();
  dm.bind(DI_TOKENS_HUD_SCENE.chooseModalEntity).toInstance(ChooseModalEntity).inTransientScope();
  dm.bind(DI_TOKENS_HUD_SCENE.unknownCardModalEntity)
    .toInstance(UnknownCardModalEntity)
    .inTransientScope();
  dm.bind(DI_TOKENS_HUD_SCENE.cardDeckEntity).toInstance(CardDeckEntity).inTransientScope();
  dm.bind(DI_TOKENS_HUD_SCENE.cardSolitaireEntity)
    .toInstance(CardSolitaireEntity)
    .inTransientScope();
  dm.bind(DI_TOKENS_HUD_SCENE.cardEntityFactory).toFactory(CardEntity, (instance, options) =>
    instance.init(options),
  );
  dm.bind(DI_TOKENS_HUD_SCENE.selectedCardEntityFactory).toFactory(
    SelectedCardEntity,
    (instance, options) => instance.init(options),
  );
  dm.bind(DI_TOKENS_HUD_SCENE.selectedCardContainerEntityFactory).toFactory(
    SelectedCardContainerEntity,
  );
  dm.bind(DI_TOKENS_HUD_SCENE.handEntity).toInstance(HandEntity).inSingletonScope();
  dm.bind(DI_TOKENS_HUD_SCENE.hightlightEntityFactory).toFactory(
    HightlightEntity,
    (instance, options) => instance.init(options),
  );
  return dm;
}
