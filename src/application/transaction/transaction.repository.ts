import { Transaction } from "./domain/transaction"

export class TransactionRepository {

    save(transaction: Transaction): Promise<Transaction> {
        return transaction.save()
    }
}