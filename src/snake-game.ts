import { randomInt } from "./helpers/random-int";

import { SnakeGameEvent } from "./constants/snake-game-event.enum";
import { EventEmitter } from "./libs/event-emitter";
import { Canvas } from "./modules/canvas";
import { Animate } from "./modules/animate";
import { Snake } from "./models/snake";
import { Berry } from "./models/berry";
import { Tail } from "./models/tail";

import { KeyCode } from "./constants/key-code.enum";

import type { SnakeGameOptions } from "./interfaces/snake-game-options";
import type { SnakeEvent, SnakeGameStatus } from "./interfaces/snake-game";

export const DEFAULT_SNAKE_OPTIONS: SnakeGameOptions = {
  startTails: 10,
  sizeCell: 20,
} as const;

export class SnakeGame {
  private _options: SnakeGameOptions;
  private _canvas: Canvas;
  private _animate: Animate;
  private _score: number = 0;
  private _speed: number = 8;
  private _status: SnakeGameStatus = "stopped";
  private _eventEmitter: EventEmitter;
  private _snake: Snake | null = null;
  private _berry: Berry;

  constructor(
    selector: HTMLCanvasElement | string,
    options?: Partial<SnakeGameOptions>
  ) {
    this._canvas = new Canvas(selector);
    this._animate = new Animate({ loop: true });
    this._eventEmitter = new EventEmitter();
    this._berry = new Berry();

    this._options = { ...DEFAULT_SNAKE_OPTIONS, ...options };
  }

  public on(
    event: string | string[],
    listener: (event?: SnakeEvent) => void
  ): void {
    this._eventEmitter.on<SnakeEvent>(event, listener);
  }

  public off(
    event: string | string[],
    listener: (event?: SnakeEvent) => void
  ): void {
    this._eventEmitter.off<SnakeEvent>(event, listener);
  }

  public start(): void {
    const { startTails, sizeCell } = this._options;
    const { height: canvasHeight, width: canvasWidth } = this._canvas;
    this._status = "playing";
    let count = 0;

    this._snake = new Snake({
      x: (canvasWidth / sizeCell / 2) * sizeCell,
      y: (canvasHeight / sizeCell / 2) * sizeCell,
      dx: 0,
      dy: -sizeCell,
      startTails,
    });

    this._score = 0;
    this.updateBerry();
    document.addEventListener("keydown", this.initialControls);

    this._animate.start(() => {
      if (this._status === "stopped") {
        this.stop();

        return void 0;
      }

      if (++count < this._speed) return void 0;
      count = 0;

      this.update();
      this.draw();
    });

    this._eventEmitter.emit(SnakeGameEvent.Start, { score: this._score });
  }

  public stop(): void {
    this._status = "stopped";
    this._animate.stop();

    document.removeEventListener("keydown", this.initialControls);
    this._eventEmitter.emit(SnakeGameEvent.Stop, { score: this._score });
  }

  private update(): void {
    if (!this._snake) return void 0;

    this.updateSnake();

    if (this._berry.x === this._snake.x && this._berry.y === this._snake.y) {
      const { tails } = this._snake;
      const lastTail = tails.at(tails.length);

      this._score += 10;
      tails.push(new Tail({ x: lastTail?.x, y: lastTail?.y }));
      this._eventEmitter.emit(SnakeGameEvent.UpdateScore, {
        score: this._score,
      });

      this.updateBerry();
    }
  }

  private draw(): void {
    const { height: canvasHeight, width: canvasWidth, ctx } = this._canvas;

    if (!this._snake) return void 0;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    this.drawBerry();
    this.drawSnake();
  }

  private drawSnake(): void {
    const { sizeCell } = this._options;
    const { ctx } = this._canvas;

    if (!this._snake) return void 0;

    ctx.fillStyle = "#94c41a";
    ctx.fillRect(this._snake.x, this._snake.y, sizeCell, sizeCell);

    this._snake.tails.forEach((tail) => {
      ctx.fillStyle = "#B9F621";
      ctx.fillRect(tail.x, tail.y, sizeCell, sizeCell);
    });
  }

  private updateSnake(): void {
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

    for (let index = this._snake.tails.length - 1; index >= 3; index--) {
      const tail = this._snake.tails[index];

      if (tail.x === this._snake.x && tail.y === this._snake.y) {
        this._status = "stopped";
      }
    }
  }

  private drawBerry(): void {
    const { sizeCell } = this._options;
    const { ctx } = this._canvas;

    ctx.fillStyle = "#B6134A";
    ctx.fillRect(this._berry.x, this._berry.y, sizeCell, sizeCell);
  }

  private updateBerry(): void {
    const { sizeCell } = this._options;
    const { height: canvasHeight, width: canvasWidth } = this._canvas;

    this._berry.x = randomInt(0, canvasWidth / sizeCell) * sizeCell;
    this._berry.y = randomInt(0, canvasHeight / sizeCell) * sizeCell;
  }

  private initialControls = (event: KeyboardEvent): void => {
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
