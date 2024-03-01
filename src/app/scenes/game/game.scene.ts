import { SnowEntity, SnowOptions } from './entities/snow.entity';
import { GirlEntity } from './entities/girl.entity';
import { injected } from 'brandi';
import { Container } from 'pixi.js';
import { DI_TOKENS } from '../../di/tokens';
import { RootContainerService } from '../../services/root-container.services';
import { DI_TOKENS_GAME_SCENE } from './di/tokens';
import { BackgroundEntity } from './entities/background.entity';
import { WindowEntity } from './entities/window.entity';
import { CameraEntity } from './entities/camera';
import { GAME_EVENTS } from '../../constants';
import { WindEntity, WindOptions } from './entities/wind.entity';

export class GameScene {
  private readonly sceneContainer: Container;
  private readonly camera: CameraEntity;
  private readonly snow: SnowEntity;
  private readonly wind: WindEntity;

  constructor(
    private readonly rootContainerService: RootContainerService,
    private readonly windowEntity: WindowEntity,
    private readonly background: BackgroundEntity,
    private readonly girl: GirlEntity,
    createSnow: (options: SnowOptions) => SnowEntity,
    createWind: (options: WindOptions) => WindEntity,
    private readonly createCamera: (container: Container) => CameraEntity,
  ) {
    this.sceneContainer = this.createSceneContainer();
    const content = new Container();
    const effects = new Container();
    this.sceneContainer.addChild(content, effects);
    this.camera = this.createCamera(this.sceneContainer);

    content.addChild(background.container, this.windowEntity.container, girl.container);

    this.snow = createSnow(this.windowEntity.container);
    this.wind = createWind(this.windowEntity.container);

    effects.addChild(this.snow.container, this.wind.container);

    this.rootContainerService.once(GAME_EVENTS.MOVE_CAMERA_TO_WINDOW, () => {
      this.moveCameraToWindow();
    });
  }

  public async start(): Promise<void> {}

  public destroy(): void {
    this.sceneContainer.destroy();
    this.background.destroy();
    this.windowEntity.destroy();
    this.girl.destroy();
    this.snow.destroy();
    this.wind.destroy();
  }

  private moveCameraToWindow(): void {
    this.camera.setZoom({
      album: 1,
      portrat: 1.3,
    });
    this.camera.setPosition(
      {
        album: { x: 60, y: 120 },
        portrat: { x: 40, y: -10 },
      },
      () => this.rootContainerService.emit(GAME_EVENTS.CHOOSE_ACTIVE),
    );
  }

  private createSceneContainer(): Container {
    const container = new Container();

    this.rootContainerService.addChild(container);
    return container;
  }
}

injected(
  GameScene,
  DI_TOKENS.rootContainerService,
  DI_TOKENS_GAME_SCENE.windowEntity,
  DI_TOKENS_GAME_SCENE.backgroundEntity,
  DI_TOKENS_GAME_SCENE.girlEntity,
  DI_TOKENS_GAME_SCENE.snowFactory,
  DI_TOKENS_GAME_SCENE.windFactory,
  DI_TOKENS_GAME_SCENE.cameraFactory,
);
