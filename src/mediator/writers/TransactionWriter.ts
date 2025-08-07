import { TransactionRecord } from "../../models/DataRecord";
import * as fs from "fs/promises";

export class TransactionWriter {
  private lines: string[] = ["timestamp,amount,currency"];
  write(record: TransactionRecord) {
    this.lines.push(`${record.timestamp},${record.amount},${record.currency}`);
  }
  async finalize() {
    await fs.mkdir("output", { recursive: true });
    await fs.writeFile("output/transactions.csv", this.lines.join("\n"));
  }
}
