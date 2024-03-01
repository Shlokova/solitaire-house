import { ASSETS_NAME } from '../../../manifest';
import { DI_TOKENS } from '../../../di/tokens';
import { Emitter } from '@pixi/particle-emitter';
import { injected } from 'brandi';
import { Assets, Container } from 'pixi.js';
import { RootContainerService } from '../../../services/root-container.services';

export type WindowRepareOptions = Container;

const Repair_CONFIG = {
  lifetime: { min: 1, max: 2 },
  frequency: 0.01,
  maxParticles: 200,
  autoUpdate: true,
  pos: { x: 0, y: 0 },
  behaviors: [
    {
      type: 'alpha',
      config: {
        alpha: {
          list: [
            { time: 0, value: 0.8 },
            { time: 1, value: 0.7 },
          ],
        },
      },
    },
    {
      type: 'moveAcceleration',
      config: { accel: { x: 0, y: 0 }, minStart: 0, maxStart: 0, rotate: true, maxSpeed: 0 },
    },
    {
      type: 'scale',
      config: {
        scale: {
          list: [
            { time: 0, value: 1.5 },
            { time: 1, value: 3 },
          ],
        },
        minMult: 1,
      },
    },
  ],
};

export class WindowRepairAnimationEntity {
  public readonly container: Container;
  private wind!: Emitter;
  private readonly parent!: Container;
  constructor(private readonly rootContainerService: RootContainerService) {
    this.container = new Container();
    this.container.zIndex = 3;
  }

  public init(option: WindowRepareOptions): void {
    this.wind = new Emitter(this.container, {
      ...Repair_CONFIG,
      behaviors: [
        ...Repair_CONFIG.behaviors,
        {
          type: 'spawnShape',
          config: {
            type: 'rect',
            data: {
              x: option.x - option.width * 0.9,
              y: option.y - option.height * 0.9,
              w: option.width * 0.8,
              h: option.height * 0.8,
            },
          },
        },
        { type: 'textureSingle', config: { texture: Assets.get(ASSETS_NAME.Snow) } },
      ],
    });
    // @ts-ignore
    this.parent = option;
    this.rootContainerService.onResize(this.onResize);
  }

  public destroy(): void {
    this.wind.destroy();
    this.container.destroy(true);
  }

  private onResize = () => {
    this.wind.destroy();
    this.wind = new Emitter(this.container, {
      ...Repair_CONFIG,
      behaviors: [
        ...Repair_CONFIG.behaviors,
        {
          type: 'spawnShape',
          config: {
            type: 'rect',
            data: {
              x: this.parent.x - this.parent.width * 0.9,
              y: this.parent.y - this.parent.height * 0.9,
              w: this.parent.width * 0.8,
              h: this.parent.height * 0.8,
            },
          },
        },
        { type: 'textureSingle', config: { texture: Assets.get(ASSETS_NAME.Snow) } },
      ],
    });
  };
}

injected(WindowRepairAnimationEntity, DI_TOKENS.rootContainerService);
