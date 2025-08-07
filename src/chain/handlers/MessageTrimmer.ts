import { AbstractHandler } from "../AbstractHandler";
import { SystemErrorRecord } from "../../models/DataRecord";

export class MessageTrimmer extends AbstractHandler {
  protected process(record: SystemErrorRecord): SystemErrorRecord {
    if (!record.message) {
      throw new Error("Missing message");
    }

    const message =
      record.message.length > 255
        ? record.message.substring(0, 255)
        : record.message;

    return { ...record, message };
  }
}
