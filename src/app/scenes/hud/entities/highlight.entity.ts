import { injected } from 'brandi';
import { Container, Sprite, Texture, BlurFilter } from 'pixi.js';
import { Tween } from 'tweedle.js';

export type HightlightOption = {
  parent: Container;
  width: number;
  height: number;
  repeat: number;
  onComplete?: () => void;
  onRepeat?: (count: number) => void;
};

export class HightlightEntity {
  private readonly animation!: Tween<Sprite>;
  private readonly highlightBackground: Sprite;

  constructor() {
    this.highlightBackground = this.createHightlight();
  }

  public init(option: HightlightOption): void {
    //@ts-ignore
    this.animation = this.createAnimation(option);
  }

  public start(delay?: number, onAfterDelay?: () => void): void {
    this.animation.start(delay).onAfterDelay(() => {
      this.highlightBackground.alpha = 1;
      onAfterDelay && onAfterDelay();
    });
  }

  public stop(): void {
    this.animation.stop();
  }

  private createAnimation(option: HightlightOption): Tween<Sprite> {
    option.parent.addChildAt(this.highlightBackground, 0);

    return new Tween(this.highlightBackground)
      .from({ width: option.width * 0.9, height: option.height * 0.9 })
      .to({ width: option.width * 1.1, height: option.height * 1.1 }, 600)
      .yoyo(true)
      .repeat(option.repeat)
      .onRepeat((_, count) => option.onRepeat && option.onRepeat(count))
      .onComplete(() => {
        option.onComplete && option.onComplete();
        option.parent.removeChild(this.highlightBackground);
        this.highlightBackground.destroy();
      })
      .onStop(() => {
        option.parent.removeChild(this.highlightBackground);
        this.highlightBackground.destroy();
      });
  }

  private createHightlight(): Sprite {
    const highlightBackground = new Sprite(Texture.WHITE);
    highlightBackground.x = -1;
    highlightBackground.y = -1;
    highlightBackground.anchor.set(0.5);
    highlightBackground.filters = [new BlurFilter(10, 2)];
    highlightBackground.alpha = 0;

    return highlightBackground;
  }
}

injected(HightlightEntity);
