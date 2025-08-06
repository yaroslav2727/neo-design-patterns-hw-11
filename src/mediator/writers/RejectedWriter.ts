import { DataRecord } from "../../models/DataRecord";
import * as fs from "fs/promises";

export class RejectedWriter {
  private lines: string[] = [];
  write(record: DataRecord, error: string) {
    // TODO
  }
  async finalize() {
    // TODO
  }
}
