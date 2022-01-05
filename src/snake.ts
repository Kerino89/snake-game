import { clamp } from "./helpers/clamp";
import { isString } from "./helpers/types-guard";

import type { SnakeOptions } from "./interfaces/snake-options";

export const SNAKE_OPTIONS = {};

export class SnakeGame {
  private _options: SnakeOptions;
  private _canvasElement: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;

  constructor(
    selector: HTMLCanvasElement | string,
    options?: Partial<SnakeOptions>
  ) {
    this._canvasElement = (
      isString(selector) ? document.querySelector(selector) : selector
    ) as HTMLCanvasElement;

    if (!(this._canvasElement instanceof HTMLCanvasElement)) {
      throw new Error("Selector can be a string or HTMLCanvasElement");
    }

    this._ctx = this._canvasElement.getContext(
      "2d"
    ) as CanvasRenderingContext2D;

    if (!(this._ctx instanceof CanvasRenderingContext2D)) {
      throw new Error("Failed to get CanvasRenderingContext2D");
    }

    this._options = { ...SNAKE_OPTIONS, ...options };
  }
}
