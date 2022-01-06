import { isString } from "../helpers/types-guard";

import type { CanvasOptions } from "../interfaces/canvas-options";

const DEFAULT_CANVAS_OPTIONS: CanvasOptions = {
  minWidth: 600,
  minHeight: 450,
};

export class Canvas {
  private _options: CanvasOptions;
  public element: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;

  constructor(
    selector: HTMLCanvasElement | string = "canvas",
    options?: Partial<CanvasOptions>
  ) {
    this.element = (
      isString(selector) ? document.querySelector(selector) : selector
    ) as HTMLCanvasElement;

    if (!(this.element instanceof HTMLCanvasElement)) {
      throw new Error("Selector can be a string or HTMLCanvasElement");
    }

    this.ctx = this.element.getContext("2d") as CanvasRenderingContext2D;

    if (!(this.ctx instanceof CanvasRenderingContext2D)) {
      throw new Error("Failed to get CanvasRenderingContext2D");
    }

    this._options = { ...DEFAULT_CANVAS_OPTIONS, ...options };
    this.updateSizeCanvas();
  }

  private updateSizeCanvas(): void {
    const { minHeight, minWidth } = this._options;
    const attrs = new Map([
      ["width", minWidth],
      ["height", minHeight],
    ]);

    attrs.forEach((value, attr) => {
      this.element.setAttribute(attr, String(value));
    });
  }
}
