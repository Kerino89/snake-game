import { SnakeGame } from "./snake-game";
import { SnakeGameEvent } from "./constants/snake-game-event.enum";

async function main(): Promise<void> {
  const elementScore = document.querySelector("#score span");
  const snakeGame = new SnakeGame("#canvas-game");

  snakeGame.on(
    [SnakeGameEvent.Start, SnakeGameEvent.UpdateScore],
    (event: any) => {
      if (elementScore?.textContent) elementScore.textContent = event.score;
    }
  );

  snakeGame.start();
}

main();
