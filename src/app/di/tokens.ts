import { Factory, token } from 'brandi';
import { Game } from '../game';
import { BootScene } from '../scenes/boot/boot.scene';
import { SceneManager } from '../scenes/scene-manager';
import { ResizerService } from '../services/resizer.service';
import { RootContainerService } from '../services/root-container.services';
import { ShadowEntity, ShadowOption } from '../entities/shadow.entity';
export const DI_TOKENS = {
  $root: token<HTMLElement>('$root'),
  game: token<Game>('game'),
  sceneManager: token<SceneManager>('scene-manager'),
  rootContainerService: token<RootContainerService>('rootContainerService'),

  bootSceneFactory: token<Factory<BootScene>>('Factory<BootScene>'),

  resizerService: token<ResizerService>('resizerService'),
  shadowFactory: token<Factory<ShadowEntity, [options: ShadowOption]>>('Factory<ShadowEntity>'),
};
