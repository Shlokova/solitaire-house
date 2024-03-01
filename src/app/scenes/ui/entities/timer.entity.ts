import { ASSETS_NAME } from 'src/app/manifest';
import { GAME_EVENTS } from '../../../constants';
import { injected } from 'brandi';
import { Container, Graphics, Text, Assets } from 'pixi.js';
import { DI_TOKENS } from '../../../di/tokens';
import { RootContainerService } from '../../../services/root-container.services';

export class TimerEntity {
  public readonly container: Container;
  private readonly time: Text;
  private timer = 15;
  private isTimerRunning = false;
  private readonly WIDTH = 75;
  private readonly HEIGHT = 35;

  constructor(private readonly rootContainerService: RootContainerService) {
    this.container = this.createContainer();
    this.createBackground();
    this.time = this.createTime();

    this.onResize();

    this.rootContainerService.onResize(this.onResize);

    this.rootContainerService.once(GAME_EVENTS.CHOOSE_CARD, () => this.startTimer());
    this.rootContainerService.once(GAME_EVENTS.UNKNOWN_ACTIVE, () => this.pause());
  }

  public destroy(): void {
    this.stop();
    this.container.destroy();
    this.rootContainerService.removeOnResize(this.onResize);
  }

  private startTimer(): void {
    if (this.isTimerRunning) return;

    this.isTimerRunning = true;
    this.container.visible = true;
    this.rootContainerService.app.ticker.add(this.updateTimer);
  }

  private updateTimer = (delta: number): void => {
    this.timer -= delta / 60;

    if (this.timer <= 0) {
      this.stop();
    }

    this.updateTime(this.timer);
  };

  private stop(): void {
    this.timer = 0;
    this.pause();
    this.rootContainerService.emit(GAME_EVENTS.REDIRECT);
    this.container.destroy();
  }

  private pause() {
    this.isTimerRunning = false;
    this.rootContainerService.app.ticker.remove(this.updateTimer);
    this.container.visible = false;
  }

  private updateTime(time: number) {
    let minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, '0');
    let seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, '0');

    this.time.text = `${minutes}:${seconds}`;
  }

  private readonly onResize = (): void => {
    this.setPosition();
  };

  private setPosition(): void {
    const { width } = this.rootContainerService.getGameSafeAreaSize();

    this.container.x = width - this.WIDTH - 10;
    this.container.y = 10;
  }

  private createTime(): Text {
    const text = new Text(`00:${this.timer}`, {
      fontSize: 20,
      fontFamily: ASSETS_NAME.Font,
      fontWeight: 'bold',
      align: 'justify',
    });

    text.x = this.WIDTH / 2 - text.width / 2 - 1;
    text.y = this.HEIGHT / 2 - text.height / 2;

    this.container.addChild(text);

    return text;
  }

  private createBackground(): Graphics {
    const background = new Graphics()
      .lineStyle(4, 0x918885, 1)
      .beginFill(0xc5c3c1, 1)
      .drawRoundedRect(0, 0, this.WIDTH, this.HEIGHT, 30)
      .endFill();

    this.container.addChild(background);

    return background;
  }

  private createContainer(): Container {
    const container = new Container();

    return container;
  }
}

injected(TimerEntity, DI_TOKENS.rootContainerService);
