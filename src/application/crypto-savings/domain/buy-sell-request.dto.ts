import { OperationTypeEnum } from "../../order/domain/operation-type.enum";
import { TradingCurrency } from "./trading-currency";

export interface BuySellRequestDTO {
    tradingCurrency: TradingCurrency,
    ownerCvu: string,
    operationType: OperationTypeEnum
}
