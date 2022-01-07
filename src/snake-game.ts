import { SnakeGameEvent } from "./constants/snake-game-event.enum";
import { EventEmitter } from "./libs/event-emitter";
import { Canvas } from "./modules/canvas";
import { Animate } from "./modules/animate";
import { Snake } from "./models/snake";

import { KeyCode } from "./constants/key-code.enum";

import type { SnakeGameOptions } from "./interfaces/snake-game-options";

export const DEFAULT_SNAKE_OPTIONS: SnakeGameOptions = {
  startTails: 3,
  sizeCell: 12,
} as const;

export class SnakeGame {
  private _options: SnakeGameOptions;
  private _canvas: Canvas;
  private _animate: Animate;
  private _score: number = 0;
  private _eventEmitter: EventEmitter;
  private _snake: Snake | null = null;

  constructor(
    selector: HTMLCanvasElement | string,
    options?: Partial<SnakeGameOptions>
  ) {
    this._canvas = new Canvas(selector);
    this._animate = new Animate({ loop: true });
    this._eventEmitter = new EventEmitter();

    this._options = { ...DEFAULT_SNAKE_OPTIONS, ...options };
  }

  public on(
    event: string | string[],
    listener: (context?: unknown) => void
  ): void {
    this._eventEmitter.on(event, listener);
  }

  public off(
    event: string | string[],
    listener: (context?: unknown) => void
  ): void {
    this._eventEmitter.off(event, listener);
  }

  public start(): void {
    const { startTails, sizeCell } = this._options;
    this._snake = new Snake({ x: 0, y: 0, dx: 0, dy: sizeCell, startTails });
    let count = 0;

    document.addEventListener("keydown", this.initialControls);

    this._animate.start((progress) => {
      if (++count < 4) return void 0;
      count = 0;

      this.update();
      this.draw();
    });

    this._eventEmitter.emit(SnakeGameEvent.Start, { score: this._score });
  }

  public stop(): void {
    this._animate.stop();

    document.removeEventListener("keydown", this.initialControls);
    this._eventEmitter.emit(SnakeGameEvent.Stop, { score: this._score });
  }

  private update(): void {
    const { sizeCell } = this._options;
    const { height: canvasHeight, width: canvasWidth } = this._canvas;

    if (!this._snake) return void 0;

    for (let index = this._snake.tails.length - 1; index >= 0; index--) {
      const tail = this._snake.tails[index];

      if (index === 0) {
        tail.x = this._snake.x;
        tail.y = this._snake.y;
      } else {
        const prevTail = this._snake.tails[index - 1];

        tail.x = prevTail.x;
        tail.y = prevTail.y;
      }
    }

    this._snake.x += this._snake.dx;
    this._snake.y += this._snake.dy;

    if (this._snake.x < 0) this._snake.x = canvasWidth - sizeCell;
    else if (this._snake.x >= canvasWidth) this._snake.x = 0;

    if (this._snake.y < 0) this._snake.y = canvasHeight - sizeCell;
    else if (this._snake.y >= canvasHeight) this._snake.y = 0;
  }

  private draw(): void {
    const { sizeCell } = this._options;
    const { height: canvasHeight, width: canvasWidth, ctx } = this._canvas;

    if (!this._snake) return void 0;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = "#FA0556";
    ctx.fillRect(this._snake.x, this._snake.y, sizeCell, sizeCell);

    this._snake.tails.forEach((tail, index) => {
      ctx.fillStyle = "#A00034";
      ctx.fillRect(tail.x, tail.y, sizeCell, sizeCell);
    });
  }

  private initialControls = (event: KeyboardEvent) => {
    const { sizeCell } = this._options;

    if (!this._snake) return void 0;

    switch (event.key) {
      case KeyCode.ArrowUp:
        if (this._snake.dy === 0) {
          this._snake.dy = -sizeCell;
          this._snake.dx = 0;
        }

        break;
      case KeyCode.ArrowRight:
        if (this._snake.dx === 0) {
          this._snake.dx = sizeCell;
          this._snake.dy = 0;
        }

        break;
      case KeyCode.ArrowDown:
        if (this._snake.dy === 0) {
          this._snake.dy = sizeCell;
          this._snake.dx = 0;
        }

        break;
      case KeyCode.ArrowLeft:
        if (this._snake.dx === 0) {
          this._snake.dx = -sizeCell;
          this._snake.dy = 0;
        }

        break;
    }
  };
}
