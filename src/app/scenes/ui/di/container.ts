import { TimerEntity } from './../entities/timer.entity';
import { DependencyModule } from 'brandi';
import { PlayNowElementEntity } from '../entities/play-now-element.entity';
import { RedirectScreenEntity } from '../entities/redirect-screen.entity';
import { UiScene } from '../ui.scene';
import { DI_TOKENS_UI_SCENE } from './tokens';

export function createDiModuleUiScene(): DependencyModule {
  const dm = new DependencyModule();
  dm.bind(DI_TOKENS_UI_SCENE.uiSceneFactory).toFactory(UiScene);
  dm.bind(DI_TOKENS_UI_SCENE.playNowElementEntity)
    .toInstance(PlayNowElementEntity)
    .inTransientScope();
  dm.bind(DI_TOKENS_UI_SCENE.redirectScreenEntity)
    .toInstance(RedirectScreenEntity)
    .inTransientScope();
  dm.bind(DI_TOKENS_UI_SCENE.timerEntity).toInstance(TimerEntity).inTransientScope();

  return dm;
}
