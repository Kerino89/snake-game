import { isUndefined } from "../helpers/types-guard";
import { Tail } from "./tail";

export class Snake {
  x: number = 0;
  y: number = 0;
  dx: number = 0;
  dy: number = 0;
  tails: Array<Tail> = [];
  startTails: number = 0;

  constructor(params?: Partial<Snake>) {
    Object.assign(this, params);

    const { startTails, tails, ...restSnake } = this;

    if (Object.values(restSnake).every((v) => !isUndefined(v))) {
      this.tails = Array.from(
        { length: startTails },
        (_, i) => new Tail({ x: this.dx * i, y: this.dy * i })
      );
    }
  }
}
