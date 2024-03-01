import { WindowRepairAnimationEntity } from './../entities/window-repair-animation.entity';
import { SnowEntity } from './../entities/snow.entity';
import { DependencyModule } from 'brandi';
import { CameraEntity } from '../entities/camera';
import { BackgroundEntity } from '../entities/background.entity';
import { GirlEntity } from '../entities/girl.entity';
import { WindowEntity } from '../entities/window.entity';
import { GameScene } from '../game.scene';
import { DI_TOKENS_GAME_SCENE } from './tokens';
import { WindEntity } from '../entities/wind.entity';
import { WindowSealAnimationEntity } from '../entities/window-seal-animation.entity';

export function createDiModuleGameScene(): DependencyModule {
  const dm = new DependencyModule();
  dm.bind(DI_TOKENS_GAME_SCENE.gameSceneFactory).toFactory(GameScene);
  dm.bind(DI_TOKENS_GAME_SCENE.backgroundEntity).toInstance(BackgroundEntity).inTransientScope();
  dm.bind(DI_TOKENS_GAME_SCENE.windowEntity).toInstance(WindowEntity).inTransientScope();
  dm.bind(DI_TOKENS_GAME_SCENE.girlEntity).toInstance(GirlEntity).inTransientScope();
  dm.bind(DI_TOKENS_GAME_SCENE.cameraFactory).toFactory(CameraEntity, (instance, container) =>
    instance.init(container),
  );
  dm.bind(DI_TOKENS_GAME_SCENE.snowFactory).toFactory(SnowEntity, (instance, options) =>
    instance.init(options),
  );
  dm.bind(DI_TOKENS_GAME_SCENE.windFactory).toFactory(WindEntity, (instance, options) =>
    instance.init(options),
  );
  dm.bind(DI_TOKENS_GAME_SCENE.windowRepairAnimationFactory).toFactory(
    WindowRepairAnimationEntity,
    (instance, options) => instance.init(options),
  );
  dm.bind(DI_TOKENS_GAME_SCENE.windowSealAnimationFactory).toFactory(
    WindowSealAnimationEntity,
    (instance, options) => instance.init(options),
  );

  return dm;
}
