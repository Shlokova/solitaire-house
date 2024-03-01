import { DI_TOKENS } from '../di/tokens';
import { injected } from 'brandi';
import { Container, Sprite, Texture } from 'pixi.js';
import { RootContainerService } from '../services/root-container.services';

export type ShadowOption = {
  parent: Container;
  alpha: number;
};

export class ShadowEntity {
  private readonly shadow!: Sprite;
  private readonly parent!: Container;
  private zIndex = 0;

  constructor(private readonly rootContainerService: RootContainerService) {}

  public init(option: ShadowOption): void {
    //@ts-ignore
    this.shadow = this.createShadow(option);
    //@ts-ignore
    this.parent = option.parent;
    this.zIndex = option.parent.zIndex;

    option.parent.zIndex = 10;
    option.parent.parent && option.parent.parent.sortChildren();
  }

  public removeShadow(): void {
    this.parent.zIndex = this.zIndex;
    this.parent.parent && this.parent.parent.sortChildren();

    this.shadow.destroy();
  }

  private createShadow(option: ShadowOption): Sprite {
    const { width, height } = this.rootContainerService.getGameSize();
    const shadow = new Sprite(Texture.WHITE);
    shadow.x = 0;
    shadow.y = 0;
    shadow.width = 4 * width;
    shadow.height = 4 * height;
    shadow.anchor.set(0.5);
    shadow.tint = 0x000000;
    shadow.alpha = option.alpha;

    option.parent.addChildAt(shadow, 0);

    return shadow;
  }
}

injected(ShadowEntity, DI_TOKENS.rootContainerService);
