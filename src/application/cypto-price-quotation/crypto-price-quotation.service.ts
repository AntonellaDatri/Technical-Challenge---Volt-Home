
import { getCryptoPrice } from "../crypto-api/crypto-api.client";
import { CurrencyTypeEnum } from "../crypto-savings/domain/currency-type-enum";
import { CryptoPriceQuotationRepository } from "./crypto-price-quotation.repository";
import { CryptoPriceQuotation } from "./domain/cypto-price-quotation";

export class CryptoPriceQuotationService {
    constructor(
        private readonly cryptoPriceQuotationRepository: CryptoPriceQuotationRepository
    ){}

    async getCurrentPrice(cryptoType: string): Promise<CryptoPriceQuotation> {
        let cryptoPriceQuotation = await this.cryptoPriceQuotationRepository.findOneBy(cryptoType);
        if (cryptoPriceQuotation === null) {
            const usdPrice = await getCryptoPrice(cryptoType, CurrencyTypeEnum.USD);
            cryptoPriceQuotation = this.createCurrentPrice(cryptoType, usdPrice[CurrencyTypeEnum.USD]);
            await this.cryptoPriceQuotationRepository.save(cryptoPriceQuotation);
        }
        return cryptoPriceQuotation!
    }

    async updatePrices() {
        const currencies: CryptoPriceQuotation[] = await this.cryptoPriceQuotationRepository.findAll();
        currencies.forEach(currency => this.setCurrentPrice(currency));
    }


    private async setCurrentPrice(crypto: CryptoPriceQuotation) {
        const usdPrice = await getCryptoPrice(crypto.currency, CurrencyTypeEnum.USD);
        crypto!.priceInUsd = usdPrice.amount;
        this.cryptoPriceQuotationRepository.save(crypto!);
    }

    createCurrentPrice(cryptoType: string, priceInUsd: number): CryptoPriceQuotation{
        const cryptoPriceQuotation = new CryptoPriceQuotation();
        cryptoPriceQuotation.currency = cryptoType;
        cryptoPriceQuotation.priceInUsd = priceInUsd;
        return cryptoPriceQuotation;
    }


}