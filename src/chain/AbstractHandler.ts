import { DataRecord } from "../models/DataRecord";

export abstract class AbstractHandler {
  private next: AbstractHandler | null = null;

  setNext(handler: AbstractHandler): AbstractHandler {
    this.next = handler;
    return handler;
  }

  handle(record: any): any {
    const processed = this.process(record);
    if (this.next) {
      return this.next.handle(processed);
    }
    return processed;
  }

  protected abstract process(record: any): any;
}
