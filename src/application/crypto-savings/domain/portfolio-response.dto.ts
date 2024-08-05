import { TradingCurrency } from "./trading-currency"

export interface PortfolioResponseDTO {
    currency: TradingCurrency
    nominalValues: TradingCurrency[]
}