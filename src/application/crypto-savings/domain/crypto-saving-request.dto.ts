import { TradingCurrency } from "./trading-currency";

export interface CryptoSavingRequestDTO {
    tradingCurrency: TradingCurrency,
    ownerCvu: string,
}