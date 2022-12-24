import { SnakeGame } from "./snake-game";
import { SnakeGameEventType } from "./constants/snake-game-event.enum";

async function main(): Promise<void> {
  const [btnStart] =
    document.querySelectorAll<HTMLButtonElement>("#controls button");
  const elementScore = document.querySelector<HTMLSpanElement>("#score span");
  const snakeGame = new SnakeGame("#canvas-game");

  snakeGame.on(
    [
      SnakeGameEventType.Start,
      SnakeGameEventType.Stop,
      SnakeGameEventType.UpdateScore,
    ],
    ({ score, type }) => {
      if (elementScore?.textContent) {
        elementScore.textContent = score.toString();
      }

      if (!btnStart) return void 0;

      switch (type) {
        case SnakeGameEventType.Start:
          btnStart.style.visibility = "hidden";
          break;

        case SnakeGameEventType.Stop:
          btnStart.style.visibility = "visible";
          break;
      }
    }
  );

  btnStart.addEventListener("click", () => snakeGame.start());
}

document.addEventListener("DOMContentLoaded", main, { once: true });
