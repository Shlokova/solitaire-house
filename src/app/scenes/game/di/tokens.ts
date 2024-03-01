import { WindowSealAnimationOption } from './../entities/window-seal-animation.entity';
import {
  WindowRepairAnimationEntity,
  WindowRepareOptions,
} from './../entities/window-repair-animation.entity';
import { WindOptions } from './../entities/wind.entity';
import { Factory, token } from 'brandi';
import { Container } from 'pixi.js';
import { CameraEntity } from '../entities/camera';
import { BackgroundEntity } from '../entities/background.entity';
import { GirlEntity } from '../entities/girl.entity';
import { WindowEntity } from '../entities/window.entity';
import { GameScene } from '../game.scene';
import { SnowEntity, SnowOptions } from '../entities/snow.entity';
import { WindEntity } from '../entities/wind.entity';
import { WindowSealAnimationEntity } from '../entities/window-seal-animation.entity';

export const DI_TOKENS_GAME_SCENE = {
  gameSceneFactory: token<Factory<GameScene>>('Factory<GameScene>'),
  backgroundEntity: token<BackgroundEntity>('BackgroundEntity'),
  windowEntity: token<WindowEntity>('WindowEntity'),
  girlEntity: token<GirlEntity>('GirlEntity'),
  cameraFactory: token<Factory<CameraEntity, [container: Container]>>('Factory<CameraEntity>'),
  snowFactory: token<Factory<SnowEntity, [options: SnowOptions]>>('Factory<SnowEntity>'),
  windFactory: token<Factory<WindEntity, [options: WindOptions]>>('Factory<WindEntity>'),
  windowRepairAnimationFactory: token<
    Factory<WindowRepairAnimationEntity, [options: WindowRepareOptions]>
  >('Factory<WindowRepairAnimationEntity>'),
  windowSealAnimationFactory: token<
    Factory<WindowSealAnimationEntity, [options: WindowSealAnimationOption]>
  >('Factory<WindowSealAnimationEntity>'),
};
