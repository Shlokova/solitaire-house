import { ASSETS_NAME } from '../../../manifest';
import { DI_TOKENS } from '../../../di/tokens';
import { Emitter } from '@pixi/particle-emitter';
import { injected } from 'brandi';
import { Assets, Container } from 'pixi.js';
import { RootContainerService } from '../../../services/root-container.services';

export type SnowOptions = Container;

const SNOW_CONFIG = {
  lifetime: { min: 2, max: 10 },
  frequency: 0.01,
  maxParticles: 1000,
  autoUpdate: true,
  pos: { x: 0, y: 0 },
  behaviors: [
    {
      type: 'alpha',
      config: {
        alpha: {
          list: [
            { time: 0, value: 0.7 },
            { time: 1, value: 0.3 },
          ],
        },
      },
    },
    {
      type: 'moveAcceleration',
      config: { accel: { x: 1, y: 5 }, minStart: 0, maxStart: 50, rotate: true, maxSpeed: 150 },
    },
    {
      type: 'scale',
      config: {
        scale: {
          list: [
            { time: 0, value: 0.12 },
            { time: 1, value: 0.07 },
          ],
        },
        minMult: 1,
      },
    },
    {
      type: 'color',
      config: {
        color: {
          list: [
            { time: 0, value: '#c7c7c7' },
            { time: 1, value: '#ffffff' },
          ],
        },
      },
    },
    { type: 'rotationStatic', config: { min: 0, max: 90 } },
    { type: 'noRotation', config: {} },
    {
      type: 'moveSpeed',
      config: {
        speed: {
          list: [
            {
              value: 100,
              time: 0,
            },
            {
              value: 50,
              time: 1,
            },
          ],
          isStepped: false,
        },
      },
    },
  ],
};

export class SnowEntity {
  public readonly container: Container;
  private snow!: Emitter;
  private readonly parent!: Container;
  constructor(private readonly rootContainerService: RootContainerService) {
    this.container = new Container();
    this.container.zIndex = 3;
  }

  public init(option: SnowOptions): void {
    // @ts-ignore
    this.snow = new Emitter(this.container, {
      ...SNOW_CONFIG,
      behaviors: [
        ...SNOW_CONFIG.behaviors,
        {
          type: 'spawnShape',
          config: {
            type: 'rect',
            data: {
              x: option.x - option.width * 0.5,
              y: option.y - option.height * 0.7,
              w: option.width * 0.5,
              h: option.height * 0.7,
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
    this.snow.destroy();
    this.container.destroy(true);
    this.rootContainerService.removeOnResize(this.onResize);
  }

  private onResize = () => {
    this.snow.destroy();
    this.snow = new Emitter(this.container, {
      ...SNOW_CONFIG,
      behaviors: [
        ...SNOW_CONFIG.behaviors,
        {
          type: 'spawnShape',
          config: {
            type: 'rect',
            data: {
              x: this.parent.x - this.parent.width * 0.5,
              y: this.parent.y - this.parent.height * 0.7,
              w: this.parent.width * 0.5,
              h: this.parent.height * 0.7,
            },
          },
        },
        { type: 'textureSingle', config: { texture: Assets.get(ASSETS_NAME.Snow) } },
      ],
    });
  };
}

injected(SnowEntity, DI_TOKENS.rootContainerService);
