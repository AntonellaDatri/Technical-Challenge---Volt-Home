import { assertNotNull } from "../../shared/functions";
import { getCryptoPrice } from "../crypto-api/crypto-api.client";
import { CryptoPriceQuotationService } from "../cypto-price-quotation/crypto-price-quotation.service";
import { OperationTypeEnum } from "../order/domain/operation-type.enum";
import { Order } from "../order/domain/order";
import { OrderService } from "../order/order.service";
import { TransactionService } from "../transaction/transaction.service";
import { Wallet } from "../wallet/domain/wallet";
import { WalletService } from "../wallet/wallet.service";
import { BuySellRequestDTO} from "./domain/buy-sell-request.dto"
import { CurrencyTypeEnum } from "./domain/currency-type-enum";
import { PortfolioResponseDTO } from "./domain/portfolio-response.dto";
import { TradingCurrency, toTradingCurrency } from "./domain/trading-currency";

export class CryptoSavingsService {
    constructor(
        private readonly orderService : OrderService,
        private readonly transactionService : TransactionService,
        private readonly walletService : WalletService,
        private readonly cryptoPriceQuotationService: CryptoPriceQuotationService
    ) {}

    async buy(buySellRequestDto: BuySellRequestDTO): Promise<BuyOrderEnum> {
        return this.processOrder(
            buySellRequestDto,
            OperationTypeEnum.SELL,
            BuyOrderEnum.COMPLETED,
            BuyOrderEnum.PENDING
        );
    }
    async sell(buySellRequestDto: BuySellRequestDTO): Promise<SellOrderEnum> {
        return this.processOrder<SellOrderEnum>(
            buySellRequestDto,
            OperationTypeEnum.BUY,
            SellOrderEnum.COMPLETED,
            SellOrderEnum.PENDING
        );
    }

    async processOrder<T extends BuyOrderEnum | SellOrderEnum>(
        buySellRequestDto: BuySellRequestDTO,
        operationType: OperationTypeEnum,
        completedStatus: T,
        pendingStatus: T
    ){
        let orderResult: T;
        let order: Order | null = await this.orderService.findOrder(buySellRequestDto, operationType);
        const cryptoPrice = await this.cryptoPriceQuotationService.getCurrentPrice(buySellRequestDto.tradingCurrency.type);
        const tradingCurrency: TradingCurrency = toTradingCurrency(CurrencyTypeEnum.USD, cryptoPrice.priceInUsd);
        if (order != null) {
            orderResult = completedStatus;
            await this.walletService.transfer(
                buySellRequestDto,
                buySellRequestDto.operationType === OperationTypeEnum.BUY ? buySellRequestDto.ownerCvu : order.ownerCVU,
                buySellRequestDto.operationType === OperationTypeEnum.BUY ? order.ownerCVU : buySellRequestDto.ownerCvu,
                tradingCurrency
            );
            await this.transactionService.create(buySellRequestDto, order, tradingCurrency);
            order = order.setCompleteState();
        } else {
            orderResult = pendingStatus;
            await this.walletService.compromiseCurrency(
                buySellRequestDto.ownerCvu,
                buySellRequestDto.operationType === OperationTypeEnum.BUY ? tradingCurrency: buySellRequestDto.tradingCurrency)
            order = Order.createWith(buySellRequestDto);
        }

        await this.orderService.save(order);
        return orderResult;
    }

    async portfolio(walletCVU: string, currency: CurrencyTypeEnum) {
            const wallet: Wallet | null = await this.walletService.findOneByCvu(walletCVU);
            assertNotNull(wallet, `wallet with CVU ${walletCVU} not available`);
            const currencyAmount: number  = wallet!.getAmountOf(currency);
            const cotization: Promise<any> = await getCryptoPrice(currency, 'USD,ARS');
            return this.cotizations(currency, currencyAmount, cotization);
    }

    async cotizations(currencyTypeEnum: CurrencyTypeEnum, currencyAmount: number, cotization: Promise<any>): Promise<PortfolioResponseDTO> {
        return {
            currency: {
                type: currencyTypeEnum,
                amount: currencyAmount
            },
            nominalValues:
            await Promise.all(
                [CurrencyTypeEnum.USD, CurrencyTypeEnum.ARS].map(
                    (currencyType) => {
                        return {
                            type: currencyType,
                            amount: cotization[currencyType] * currencyAmount
                        }
                    }))
        }
    }
}

export enum BuyOrderEnum {
    COMPLETED = 'BUY ORDER COMPLETED',
    PENDING = 'BUY ORDER PENDING'
}

export enum SellOrderEnum {
    COMPLETED = 'SELL ORDER COMPLETED',
    PENDING = 'SELL ORDER PENDING'
}