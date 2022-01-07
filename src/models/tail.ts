export class Tail {
  public x!: number;
  public y!: number;

  constructor(params?: Partial<Tail>) {
    Object.assign(this, params);
  }
}
