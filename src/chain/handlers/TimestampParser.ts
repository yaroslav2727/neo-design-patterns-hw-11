import { AbstractHandler } from "../AbstractHandler";
import { DataRecord } from "../../models/DataRecord";

export class TimestampParser extends AbstractHandler {
  protected process(record: DataRecord): DataRecord {
    if (!record.timestamp) {
      throw new Error("Missing timestamp");
    }

    const timestamp = new Date(record.timestamp);
    if (isNaN(timestamp.getTime())) {
      throw new Error("Invalid timestamp format");
    }

    return record;
  }
}
