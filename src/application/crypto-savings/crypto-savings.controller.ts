import { Body, Controller, Get, Post, Query, Route } from "tsoa";
import { BuyOrderEnum, CryptoSavingsService, SellOrderEnum } from "./crypto-savings.service";
import { BuySellRequestDTO } from "./domain/buy-sell-request.dto";
import { cryptoSavingsService } from "../../config/dependencies";
import { CurrencyTypeEnum } from "./domain/currency-type-enum";
import { customError } from "../../config/exception-handler";
import { PortfolioResponseDTO } from "./domain/portfolio-response.dto";
import { CryptoSavingRequestDTO } from "./domain/crypto-saving-request.dto";
import { OperationTypeEnum } from "../order/domain/operation-type.enum";
@Route("api")
export class CryptoSavingsController extends Controller {
    private cryptoSavingsService: CryptoSavingsService = cryptoSavingsService

    /**
     * @param buyRequestDto.tradingCurrency to purchase in demanded nominals (for example buy 1 BTC)
     * @param buyRequestDto.ownerCvu to extract buying currency from for purchase
     * @returns BUY ORDER PENDING | BUY ORDER COMPLETED
     */
    @Post("/buy")
    async buy(@Body() cryptoSavingRequestDTO: CryptoSavingRequestDTO): Promise<BuyOrderEnum> {
        const buyRequestDto: BuySellRequestDTO = {
            tradingCurrency: cryptoSavingRequestDTO.tradingCurrency,
            ownerCvu: cryptoSavingRequestDTO.ownerCvu,
            operationType: OperationTypeEnum.BUY
        };
        return this.cryptoSavingsService.buy(buyRequestDto)
    }

    /**
     * @param buyRequestDto.tradingCurrency to sell in offered nominals (for example sell 1 BTC)
     * @param buyRequestDto.ownerCvu to extract selling currency from for selling
     * @returns SELL ORDER PENDING | SELL ORDER COMPLETED
     */
    @Post("/sell")
    async sell(@Body() cryptoSavingRequestDTO: CryptoSavingRequestDTO): Promise<SellOrderEnum> {
        const sellRequestDto: BuySellRequestDTO = {
            tradingCurrency: cryptoSavingRequestDTO.tradingCurrency,
            ownerCvu: cryptoSavingRequestDTO.ownerCvu,
            operationType: OperationTypeEnum.SELL
        };
        return this.cryptoSavingsService.sell(sellRequestDto)
    }

    /**
     * @param cvu
     * @param currency to cotize
     * @returns PortfolioResponseDTO.currency: amount of cotized currency in wallet
     * @returns PortfolioResponseDTO.nominalValues: equivalent value of cotized currency in USD and ARS
     */
    @Get("/portfolio")
    async portfolio(@Query() cvu: string, @Query() currency: CurrencyTypeEnum): Promise<PortfolioResponseDTO> {
        this.assertCurrencyTypeEnum(currency)
        return this.cryptoSavingsService.portfolio(cvu, currency)
    }

    private assertCurrencyTypeEnum(currency: CurrencyTypeEnum) {
        if (!CurrencyTypeEnum[currency as keyof typeof CurrencyTypeEnum]){
            customError(400, "Invalid currency type")
        }
    }
}
