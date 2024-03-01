import { Factory, token } from 'brandi';
import { PlayNowElementEntity } from '../entities/play-now-element.entity';
import { RedirectScreenEntity } from '../entities/redirect-screen.entity';
import { TimerEntity } from '../entities/timer.entity';
import { UiScene } from '../ui.scene';

export const DI_TOKENS_UI_SCENE = {
  uiSceneFactory: token<Factory<UiScene>>('Factory<UiScene>'),
  playNowElementEntity: token<PlayNowElementEntity>('PlayNowElementEntity'),
  redirectScreenEntity: token<RedirectScreenEntity>('RedirectScreenEntity'),
  timerEntity: token<TimerEntity>('TimerEntity'),
};
