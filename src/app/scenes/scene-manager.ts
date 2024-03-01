import { DI_TOKENS_HUD_SCENE } from './hud/di/tokens';
import { DI_TOKENS_GAME_SCENE } from './game/di/tokens';
import { Factory, injected } from 'brandi';
import { BootScene } from './boot/boot.scene';
import { GameScene } from './game/game.scene';
import { HudScene } from './hud/hud.scene';
import { DI_TOKENS } from '../di/tokens';
import { UiScene } from './ui/ui.scene';
import { DI_TOKENS_UI_SCENE } from './ui/di/tokens';

type Scene = BootScene | GameScene | HudScene | UiScene;
export enum SceneName {
  BootScene = 'BootScene',
  GameScene = 'GameScene',
  HugScene = 'HugScene',
  UiScene = 'UiScene',
}

export class SceneManager {
  private activeScenes: Map<SceneName, Scene> = new Map([]);

  constructor(
    private readonly createBootScene: Factory<BootScene>,
    private readonly createGameScene: Factory<GameScene>,
    private readonly createHudScene: Factory<HudScene>,
    private readonly createUiScene: Factory<UiScene>,
  ) {}

  public async startScene(sceneName: SceneName): Promise<void> {
    this.destroyActiveScenes();
    this.activeScenes.set(sceneName, this.createScene(sceneName));
    await this.activeScenes.get(sceneName)?.start();
  }

  public async lounchScene(sceneName: SceneName): Promise<void> {
    this.activeScenes.set(sceneName, this.createScene(sceneName));
    await this.activeScenes.get(sceneName)?.start();
  }

  public stopScene(sceneName: SceneName): void {
    this.activeScenes.get(sceneName)?.destroy();
    this.activeScenes.delete(sceneName);
  }

  private createScene(sceneName: SceneName): Scene {
    switch (sceneName) {
      case SceneName.BootScene:
        return this.createBootScene();
      case SceneName.HugScene:
        return this.createHudScene();
      case SceneName.GameScene:
        return this.createGameScene();
      case SceneName.UiScene:
        return this.createUiScene();
      default:
        throw new Error(`Scene=${sceneName} not created`);
    }
  }

  private destroyActiveScenes(): void {
    this.activeScenes?.forEach((scene) => scene.destroy());
    this.activeScenes.clear();
  }
}

injected(
  SceneManager,
  DI_TOKENS.bootSceneFactory,
  DI_TOKENS_GAME_SCENE.gameSceneFactory,
  DI_TOKENS_HUD_SCENE.hudSceneFactory,
  DI_TOKENS_UI_SCENE.uiSceneFactory,
);
