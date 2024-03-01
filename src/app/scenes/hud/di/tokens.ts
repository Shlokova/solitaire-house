import { HightlightOption } from './../entities/highlight.entity';
import { NotificationEntity } from './../entities/notification.entities';
import { Factory, token } from 'brandi';
import { HudScene } from '../hud.scene';
import { CardDeckEntity } from '../entities/card-deck.entity';
import { CardEntity, CardEntityOptions } from '../entities/card.entity';
import { CardSolitaireEntity } from '../entities/card-solitaire.entity';
import { SelectedCardEntity, SelectedCardEntityOptions } from '../entities/selected-card.entity';
import { SelectedCardContainerEntity } from '../entities/selected-card-container.entity';
import { UnknownCardModalEntity } from '../entities/unknown-card-modal';
import { ChooseModalEntity } from '../entities/choose-modal.entity';
import { HandEntity } from '../entities/hand.entity';
import { HightlightEntity } from '../entities/highlight.entity';

export const DI_TOKENS_HUD_SCENE = {
  hudSceneFactory: token<Factory<HudScene>>('Factory<HudScene>'),

  notificationEntity: token<NotificationEntity>('NotificationEntity'),
  unknownCardModalEntity: token<UnknownCardModalEntity>('UnknownCardModalEntity'),
  chooseModalEntity: token<ChooseModalEntity>('ChooseModalEntity'),
  cardDeckEntity: token<CardDeckEntity>('CardDeckEntity'),
  cardSolitaireEntity: token<CardSolitaireEntity>('CardSolitaireEntity'),
  cardEntityFactory:
    token<Factory<CardEntity, [options: CardEntityOptions]>>('Factory<CardDeckEntity>'),
  selectedCardEntityFactory: token<
    Factory<SelectedCardEntity, [options: SelectedCardEntityOptions]>
  >('Factory<SelectedCardEntity>'),
  selectedCardContainerEntityFactory: token<Factory<SelectedCardContainerEntity>>(
    'Factory<SelectedCardContainerEntity>',
  ),

  handEntity: token<HandEntity>('HandEntity'),
  hightlightEntityFactory: token<Factory<HightlightEntity, [options: HightlightOption]>>(
    'Factory<HightlightEntity>',
  ),
};
