export class Berry {
  public x: number = 0;
  public y: number = 0;

  constructor(params?: Partial<Berry>) {
    Object.assign(this, params);
  }
}
