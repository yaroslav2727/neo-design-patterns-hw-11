import * as fs from "fs/promises";
import { buildAccessLogChain } from "./chain/chains/AccessLogChain";
import { buildTransactionChain } from "./chain/chains/TransactionChain";
import { buildSystemErrorChain } from "./chain/chains/SystemErrorChain";
import { ProcessingMediator } from "./mediator/ProcessingMediator";
import { AccessLogWriter } from "./mediator/writers/AccessLogWriter";
import { TransactionWriter } from "./mediator/writers/TransactionWriter";
import { ErrorLogWriter } from "./mediator/writers/ErrorLogWriter";
import { RejectedWriter } from "./mediator/writers/RejectedWriter";
import { DataRecord } from "./models/DataRecord";

const handlerMap = {
  access_log: buildAccessLogChain,
  transaction: buildTransactionChain,
  system_error: buildSystemErrorChain,
};

async function main() {
  try {
    // зчитування даних
    const data = await fs.readFile("src/data/records.json", "utf-8");
    const records: DataRecord[] = JSON.parse(data);

    console.log(`[INFO] Завантажено записів: ${records.length}`);

    // створення mediator
    const mediator = new ProcessingMediator(
      new AccessLogWriter(),
      new TransactionWriter(),
      new ErrorLogWriter(),
      new RejectedWriter()
    );

    let successCount = 0;
    let rejectedCount = 0;

    // цикл по records:
    for (const record of records) {
      try {
        // вибір handler-а через handlerMap
        const buildHandler = handlerMap[record.type];
        if (!buildHandler) {
          throw new Error(`Unknown record type: ${record.type}`);
        }

        const handler = buildHandler();
        const processedRecord = handler.handle(record);

        // успішна обробка
        mediator.onSuccess(processedRecord);
        successCount++;
      } catch (error) {
        // помилка обробки
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        mediator.onRejected(record, errorMessage);
        rejectedCount++;
      }
    }

    // finalize
    await mediator.finalize();

    console.log(`[INFO] Успішно оброблено: ${successCount}`);
    console.log(`[WARN] Відхилено з помилками: ${rejectedCount}`);
    console.log(`[INFO] Звіт збережено у директорії output/`);
  } catch (error) {
    console.error(`[ERROR] ${error}`);
  }
}

main();
