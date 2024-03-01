import { ASSETS_NAME } from '../../../manifest';
import { DI_TOKENS } from '../../../di/tokens';
import { Emitter } from '@pixi/particle-emitter';
import { injected } from 'brandi';
import { Assets, Container } from 'pixi.js';
import { RootContainerService } from '../../../services/root-container.services';

export type WindOptions = Container;

const WIND_CONFIG = {
  lifetime: { min: 2, max: 3 },
  frequency: 0.5,
  maxParticles: 12,
  autoUpdate: true,
  pos: { x: 0, y: 0 },
  behaviors: [
    {
      type: 'alpha',
      config: {
        alpha: {
          list: [
            { time: 0, value: 0.2 },
            { time: 1, value: 0 },
          ],
        },
      },
    },
    {
      type: 'moveAcceleration',
      config: { accel: { x: 6, y: 5 }, minStart: 0, maxStart: 50, rotate: true, maxSpeed: 150 },
    },
    {
      type: 'scale',
      config: {
        scale: {
          list: [
            { time: 0, value: 1 },
            { time: 0, value: 2 },
            { time: 1, value: 0 },
          ],
        },
        minMult: 1,
      },
    },
    { type: 'rotationStatic', config: { min: 30, max: 30 } },
    {
      type: 'moveSpeed',
      config: {
        speed: {
          list: [
            {
              value: 200,
              time: 0,
            },
            {
              value: 150,
              time: 1,
            },
          ],
          isStepped: false,
        },
      },
    },
  ],
};

export class WindEntity {
  public readonly container: Container;
  private wind!: Emitter;
  private readonly parent!: Container;
  constructor(private readonly rootContainerService: RootContainerService) {
    this.container = new Container();
    this.container.zIndex = 3;
  }

  public init(option: WindOptions): void {
    this.wind = new Emitter(this.container, {
      ...WIND_CONFIG,
      behaviors: [
        ...WIND_CONFIG.behaviors,
        {
          type: 'spawnShape',
          config: {
            type: 'rect',
            data: {
              x: option.x - option.width * 0.1,
              y: option.y - option.height * 0.5,
              w: option.width * 0.1,
              h: option.height * 0.5,
            },
          },
        },
        { type: 'textureSingle', config: { texture: Assets.get(ASSETS_NAME.Wind) } },
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
      ...WIND_CONFIG,
      behaviors: [
        ...WIND_CONFIG.behaviors,
        {
          type: 'spawnShape',
          config: {
            type: 'rect',
            data: {
              x: this.parent.x - this.parent.width * 0.1,
              y: this.parent.y - this.parent.height * 0.5,
              w: this.parent.width * 0.1,
              h: this.parent.height * 0.5,
            },
          },
        },
        { type: 'textureSingle', config: { texture: Assets.get(ASSETS_NAME.Wind) } },
      ],
    });
  };
}

injected(WindEntity, DI_TOKENS.rootContainerService);
