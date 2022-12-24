import type { Events } from "./event-emitter.interface";

export class EventEmitter {
  public constructor(protected events: Events = {}) {}

  public on(event: string | string[], listener: (context?: any) => void): void {
    this.eventToArray(event).forEach((event) => {
      if (!this.has(event)) {
        this.events[event] = [];
      }

      if (!this.events[event].includes(listener)) {
        this.events[event].push(listener);
      }
    });
  }

  public off(event: string | string[], listener: (context?: any) => void) {
    this.eventToArray(event).forEach((event) => {
      if (!this.has(event)) return void 0;

      const index = this.events[event].findIndex((l) => l === listener);

      if (index === -1) {
        throw new Error("The listener doesn't exist");
      }

      this.events[event].splice(index, 1);

      if (!this.events[event].length) delete this.events[event];
    });
  }

  public emit(event: string | string[], context?: any): void {
    this.eventToArray(event).forEach((event) => {
      if (!this.has(event)) return void 0;

      this.events[event].forEach((listener) => listener(context));
    });
  }

  public has(event: string): boolean {
    if (typeof event !== "string") {
      throw new TypeError("Event must be a string");
    }

    return Object.prototype.hasOwnProperty.call(this.events, event);
  }

  private eventToArray(event: string | string[]): string[] {
    return Array.isArray(event) ? event : event.split(" ");
  }
}
