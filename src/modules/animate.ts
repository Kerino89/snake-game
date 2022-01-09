import { clamp } from "../helpers/clamp";
import { isUndefined } from "../helpers/types-guard";

import type { AnimateOptions } from "../interfaces/animate-options";

const linear = (timeFraction: number) => timeFraction;

const DEFAULT_OPTIONS_ANIMATE: AnimateOptions = {
  duration: 1000,
  loop: false,
  timing: linear,
} as const;

export class Animate {
  private _options: AnimateOptions;
  private _animationID?: number;

  constructor(options?: Partial<AnimateOptions>) {
    this._options = { ...DEFAULT_OPTIONS_ANIMATE, ...options };
  }

  public start = (
    animate: (progress: number) => void,
    options?: Partial<AnimateOptions>
  ) => {
    const { duration, timing, loop } = { ...this._options, ...options };
    const start = performance.now();

    const callback = (time: DOMHighResTimeStamp) => {
      const timeFraction = clamp(0, (time - start) / duration, 1);
      const progress = timing(timeFraction);

      animate(progress);

      if (timeFraction < 1) {
        this._animationID = requestAnimationFrame(callback);
      } else if (loop && !isUndefined(this._animationID)) {
        this.start(animate, options);
      }
    };

    this._animationID = requestAnimationFrame(callback);
  };

  public stop() {
    if (!isUndefined(this._animationID)) {
      cancelAnimationFrame(this._animationID);
      this._animationID = undefined;
    }
  }
}
