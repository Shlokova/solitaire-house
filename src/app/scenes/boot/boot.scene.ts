import { injected } from 'brandi';
import { Assets, Container } from 'pixi.js';
import { RootContainerService } from 'src/app/services/root-container.services';
import { DI_TOKENS } from '../../di/tokens';
import { manifest } from '../../manifest';
import { SceneManager, SceneName } from '../scene-manager';

export class BootScene {
  private readonly sceneContainer: Container;

  constructor(
    private readonly rootContainerService: RootContainerService,
    private readonly sceneManager: SceneManager,
  ) {
    this.sceneContainer = this.createSceneContainer();
  }

  public async start(): Promise<void> {
    await this.preload();

    void this.sceneManager.startScene(SceneName.GameScene);
    void this.sceneManager.lounchScene(SceneName.HugScene);
    void this.sceneManager.lounchScene(SceneName.UiScene);
  }

  public destroy(): void {
    this.sceneContainer.destroy();
  }

  private async preload(): Promise<void> {
    await Assets.init({ manifest });

    await Assets.loadBundle('assets');
  }

  private createSceneContainer(): Container {
    const container = new Container();

    this.rootContainerService.addChild(container);
    return container;
  }
}

injected(BootScene, DI_TOKENS.rootContainerService, DI_TOKENS.sceneManager);
