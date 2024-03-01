import { ShadowEntity } from './../entities/shadow.entity';
import { DI_TOKENS_HUD_SCENE } from './../scenes/hud/di/tokens';
import { DI_TOKENS_GAME_SCENE } from './../scenes/game/di/tokens';
import { Container } from 'brandi';
import { BootScene } from '../scenes/boot/boot.scene';
import { SceneManager } from '../scenes/scene-manager';
import { ResizerService } from '../services/resizer.service';
import { RootContainerService } from '../services/root-container.services';
import { DI_TOKENS } from './tokens';
import { createDiModuleGameScene } from '../scenes/game/di/container';
import { Game } from '../game';
import { createDiModuleHudScene } from '../scenes/hud/di/container';
import { DI_TOKENS_UI_SCENE } from '../scenes/ui/di/tokens';
import { createDiModuleUiScene } from '../scenes/ui/di/container';

export const container = new Container();

export function createRootDiContainer({ $root }: { $root: HTMLElement }): Container {
  const c = new Container();

  c.bind(DI_TOKENS.$root).toConstant($root);
  c.bind(DI_TOKENS.game).toInstance(Game).inSingletonScope();

  c.use(DI_TOKENS_GAME_SCENE.gameSceneFactory).from(createDiModuleGameScene());
  c.use(DI_TOKENS_HUD_SCENE.hudSceneFactory).from(createDiModuleHudScene());
  c.use(DI_TOKENS_UI_SCENE.uiSceneFactory).from(createDiModuleUiScene());

  c.bind(DI_TOKENS.sceneManager).toInstance(SceneManager).inSingletonScope();
  c.bind(DI_TOKENS.rootContainerService).toInstance(RootContainerService).inSingletonScope();

  c.bind(DI_TOKENS.bootSceneFactory).toFactory(BootScene);

  c.bind(DI_TOKENS.resizerService).toInstance(ResizerService).inSingletonScope();
  c.bind(DI_TOKENS.shadowFactory).toFactory(ShadowEntity, (instance, options) =>
    instance.init(options),
  );

  return c;
}
