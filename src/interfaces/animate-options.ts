export interface AnimateOptions {
  readonly duration: number;
  readonly loop: boolean;
  timing(timeFraction: number): number;
}
