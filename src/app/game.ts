import { Group } from 'tweedle.js';
import { injected } from 'brandi';
import { DI_TOKENS } from './di/tokens';
import { SceneManager, SceneName } from './scenes/scene-manager';
import { RootContainerService } from './services/root-container.services';

export class Game {
  constructor(
    private readonly rootContainerService: RootContainerService,
    private readonly sceneManager: SceneManager,
  ) {}

  public async start(): Promise<void> {
    this.rootContainerService.init();
    await this.sceneManager.startScene(SceneName.BootScene);
    this.rootContainerService.app.ticker.add(() => {
      Group.shared.update(this.rootContainerService.app.ticker.deltaMS);
    });
  }
}

injected(Game, DI_TOKENS.rootContainerService, DI_TOKENS.sceneManager);
