import { AbstractHandler } from "../AbstractHandler";
import { TransactionRecord } from "../../models/DataRecord";

export class CurrencyNormalizer extends AbstractHandler {
  protected process(record: TransactionRecord): TransactionRecord {
    if (!record.currency) {
      throw new Error("Missing currency");
    }

    return { ...record, currency: record.currency.toUpperCase() };
  }
}
