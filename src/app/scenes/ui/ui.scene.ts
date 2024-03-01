import { RedirectScreenEntity } from './entities/redirect-screen.entity';
import { PlayNowElementEntity } from './entities/play-now-element.entity';
import { injected } from 'brandi';
import { Container } from 'pixi.js';
import { RootContainerService } from 'src/app/services/root-container.services';
import { DI_TOKENS } from '../../di/tokens';
import { DI_TOKENS_UI_SCENE } from './di/tokens';
import { TimerEntity } from './entities/timer.entity';

export class UiScene {
  private readonly sceneContainer: Container;

  constructor(
    private readonly rootContainerService: RootContainerService,
    private readonly playNowElement: PlayNowElementEntity,
    private readonly redirectScreen: RedirectScreenEntity,
    private readonly timer: TimerEntity,
  ) {
    this.sceneContainer = this.createSceneContainer();
    this.sceneContainer.addChild(
      playNowElement.container,
      timer.container,
      redirectScreen.container,
    );

    this.onResize();
    this.rootContainerService.onResize(this.onResize);
  }

  public async start(): Promise<void> {}

  public destroy(): void {
    this.playNowElement.destroy();
    this.timer.destroy();
    this.redirectScreen.destroy();
    this.rootContainerService.removeOnResize(this.onResize);
  }

  private onResize = (): void => {
    const { x, y } = this.rootContainerService.getGameSafeAreaPosition();

    this.sceneContainer.x = x;
    this.sceneContainer.y = y;
  };

  private createSceneContainer(): Container {
    const container = new Container();

    this.rootContainerService.addChild(container);
    return container;
  }
}

injected(
  UiScene,
  DI_TOKENS.rootContainerService,
  DI_TOKENS_UI_SCENE.playNowElementEntity,
  DI_TOKENS_UI_SCENE.redirectScreenEntity,
  DI_TOKENS_UI_SCENE.timerEntity,
);
