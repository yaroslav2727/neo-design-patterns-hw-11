import { DataRecord } from "../models/DataRecord";
import { AccessLogWriter } from "./writers/AccessLogWriter";
import { TransactionWriter } from "./writers/TransactionWriter";
import { ErrorLogWriter } from "./writers/ErrorLogWriter";
import { RejectedWriter } from "./writers/RejectedWriter";

export class ProcessingMediator {
  private writerMap: Record<string, any>;
  private rejectedWriter: RejectedWriter;
  constructor(
    accessLogWriter: AccessLogWriter,
    transactionWriter: TransactionWriter,
    errorLogWriter: ErrorLogWriter,
    rejectedWriter: RejectedWriter
  ) {
    this.writerMap = {
      access_log: accessLogWriter,
      transaction: transactionWriter,
      system_error: errorLogWriter,
    };
    this.rejectedWriter = rejectedWriter;
  }

  onSuccess(record: DataRecord) {
    const writer = this.writerMap[record.type];
    if (writer) {
      writer.write(record);
    }
  }

  onRejected(original: DataRecord, error: string) {
    this.rejectedWriter.write(original, error);
  }

  async finalize() {
    await Promise.all([
      this.writerMap.access_log.finalize(),
      this.writerMap.transaction.finalize(),
      this.writerMap.system_error.finalize(),
      this.rejectedWriter.finalize(),
    ]);
  }
}
