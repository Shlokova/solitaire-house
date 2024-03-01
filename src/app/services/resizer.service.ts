import { injected } from 'brandi';
import { Application } from 'pixi.js';

export const GAME_WIDTH = 694;
export const GAME_HEIGHT = 360;

const GAME_WIDTH_MAX = GAME_WIDTH * 2.4;

export const GAME_SAFE_AREA_WIDTH = 480;
export const GAME_SAFE_AREA_HEIGHT = 320;

const GAME_SPACING_WIDTH = GAME_WIDTH - GAME_SAFE_AREA_WIDTH;
const GAME_SPACING_HEIGHT = GAME_HEIGHT - GAME_SAFE_AREA_HEIGHT;

export enum ScreenAspect {
  Album = 'album',
  Portrait = 'portrait',
}

export type ResizeOptionsVariant<T> = {
  album: T;
  portrat: T;
};

export class ResizerService {
  constructor() {}

  public getOrientation(app: Application): ScreenAspect {
    return app.view.width > app.view.height ? ScreenAspect.Album : ScreenAspect.Portrait;
  }

  public getGameSize(app: Application): { width: number; height: number } {
    const screenAspect = this.getOrientation(app);

    if (screenAspect === ScreenAspect.Album) {
      return {
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
      };
    }

    return {
      width: GAME_HEIGHT,
      height: GAME_WIDTH,
    };
  }

  public getGameSafeAreaSize(app: Application): { width: number; height: number } {
    const screenAspect = this.getOrientation(app);

    if (screenAspect === ScreenAspect.Album) {
      return {
        width: GAME_SAFE_AREA_WIDTH,
        height: GAME_SAFE_AREA_HEIGHT,
      };
    }

    return {
      width: GAME_SAFE_AREA_HEIGHT,
      height: GAME_SAFE_AREA_WIDTH,
    };
  }

  public getGameSafeAreaPosition(app: Application): { x: number; y: number } {
    const screenAspect = this.getOrientation(app);

    if (screenAspect === ScreenAspect.Album) {
      return {
        x: GAME_SPACING_WIDTH / 2,
        y: GAME_SPACING_HEIGHT / 2,
      };
    }

    return {
      x: GAME_SPACING_HEIGHT / 2,
      y: GAME_SPACING_WIDTH / 2,
    };
  }

  public getResizeOptions<T>(app: Application, options: ResizeOptionsVariant<T>): T {
    const screenAspect = this.getOrientation(app);

    if (screenAspect === ScreenAspect.Album) {
      return options.album;
    }

    return options.portrat;
  }

  public getNewCanvasAndWorldSize(
    windowWidth: number,
    windowHeight: number,
  ): {
    newCanvasWidth: number;
    newCanvasHeight: number;
    newWorldWidth: number;
    newWorldHeight: number;
    newWorldScale: number;
    newWorldPosition: { x: number; y: number };
  } {
    const defaultLetterboxWidth = GAME_WIDTH;
    const maxLetterboxWidth = GAME_WIDTH_MAX;
    const defaultLetterboxHeight = GAME_HEIGHT;
    const defaultLogicalWidth = GAME_SAFE_AREA_WIDTH;
    const defaultLogicalHeight = GAME_SAFE_AREA_HEIGHT;
    const defaultPaddingWidth = GAME_SPACING_WIDTH;
    const defaultPaddingHeight = GAME_SPACING_HEIGHT;

    let newCanvasWidth = 0;
    let newCanvasHeight = 0;
    let newPaddingWidth = 0;
    let newPaddingHeight = 0;

    newCanvasWidth = Math.min(windowWidth, maxLetterboxWidth);
    newCanvasHeight = newCanvasWidth * (defaultLogicalHeight / defaultLogicalWidth);
    if (newCanvasHeight > windowHeight) {
      newCanvasHeight = windowHeight;
      newCanvasWidth = newCanvasHeight * (defaultLogicalWidth / defaultLogicalHeight);
    }

    newPaddingHeight = defaultPaddingHeight * (newCanvasHeight / defaultLogicalHeight);
    newPaddingWidth = defaultPaddingWidth * (newCanvasWidth / defaultLogicalWidth);

    const resizedWorldHeight = newCanvasHeight + newPaddingHeight;
    const resizedWorldWidth = resizedWorldHeight * (defaultLetterboxWidth / defaultLetterboxHeight);

    let restWidth = windowWidth - newCanvasWidth;
    if (restWidth > 0) {
      restWidth = Math.min(restWidth, newPaddingWidth);
      newCanvasWidth += restWidth;
    }

    if (newCanvasHeight < windowHeight) {
      let restHeight = windowHeight - newCanvasHeight;
      if (restHeight > 0) {
        restHeight = Math.min(restHeight, newPaddingHeight);
        newCanvasHeight += restHeight;
      }
    }

    const scaleValue = resizedWorldHeight / GAME_HEIGHT;
    const x = -(resizedWorldWidth - newCanvasWidth) / 2;
    const y = -(resizedWorldHeight - newCanvasHeight) / 2;
    return {
      newCanvasWidth,
      newCanvasHeight,
      newWorldWidth: resizedWorldWidth,
      newWorldHeight: resizedWorldHeight,
      newWorldScale: scaleValue,
      newWorldPosition: { x, y },
    };
  }
}

injected(ResizerService);
