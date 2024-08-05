import { CurrencyTypeEnum } from "./currency-type-enum";

export interface TradingCurrency {
    type: CurrencyTypeEnum;
    amount: number;
}

export const toTradingCurrency = (type: CurrencyTypeEnum, amount: number) => {
    const tradingCurrency: TradingCurrency = {
        type: type,
        amount: amount
    }
    return tradingCurrency
}