import { clamp } from "./helpers/clamp";
import { isString } from "./helpers/types-guard";

import { Canvas } from "./modules/canvas";
import { Animate } from "./modules/animate";

import type { SnakeGameOptions } from "./interfaces/snake-game-options";

export const DEFAULT_SNAKE_OPTIONS = {};

export class SnakeGame {
  private _options: SnakeGameOptions;
  private _canvas: Canvas;
  private _animate: Animate;

  constructor(
    selector: HTMLCanvasElement | string,
    options?: Partial<SnakeGameOptions>
  ) {
    this._canvas = new Canvas(selector);
    this._animate = new Animate({ loop: true });
    this._options = { ...DEFAULT_SNAKE_OPTIONS, ...options };

    // this._animate.start(() => {
    //   this.update();
    //   this.draw();
    // });
  }

  private update(): void {}

  private draw(): void {}
}
