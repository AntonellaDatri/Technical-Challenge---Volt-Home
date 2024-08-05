import { BuySellRequestDTO } from "../crypto-savings/domain/buy-sell-request.dto";
import { TradingCurrency } from "../crypto-savings/domain/trading-currency";
import { OperationTypeEnum } from "../order/domain/operation-type.enum";
import { Order } from "../order/domain/order";
import { Transaction } from "./domain/transaction";
import { TransactionRepository } from "./transaction.repository";

export class TransactionService {
    constructor(
        private readonly transactionRepository: TransactionRepository
    ) {}
    create(buySellRequestDto: BuySellRequestDTO, order: Order, tradingCurrencyPrice : TradingCurrency) {
        const transaction : Transaction = new Transaction()
        transaction.buyingOwnerCvu =
            buySellRequestDto.operationType === OperationTypeEnum.BUY ? buySellRequestDto.ownerCvu : order.ownerCVU;
        transaction.sellerOwnerCvu =
            buySellRequestDto.operationType === OperationTypeEnum.SELL ? buySellRequestDto.ownerCvu : order.ownerCVU;
        transaction.tradingCurrency = buySellRequestDto.tradingCurrency
        transaction.payingCurrency = tradingCurrencyPrice
        return this.transactionRepository.save(transaction)
    }

}