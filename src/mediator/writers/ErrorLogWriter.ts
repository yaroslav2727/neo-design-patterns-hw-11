import { SystemErrorRecord } from "../../models/DataRecord";
import * as fs from "fs/promises";

export class ErrorLogWriter {
  private lines: string[] = [];
  write(record: SystemErrorRecord) {
    this.lines.push(JSON.stringify(record));
  }
  async finalize() {
    await fs.mkdir("output", { recursive: true });
    await fs.writeFile("output/errors.jsonl", this.lines.join("\n"));
  }
}
