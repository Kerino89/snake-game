import { SnakeGameEventType } from "../constants/snake-game-event.enum";

export type SnakeGameStatus = "stopped" | "playing";
export type SnakeGameEvent = { score: number; type: SnakeGameEventType };
