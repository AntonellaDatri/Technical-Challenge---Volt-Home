import { CryptoPriceQuotation } from "./domain/cypto-price-quotation";

export class CryptoPriceQuotationRepository {

    findAll(): CryptoPriceQuotation[] | PromiseLike<CryptoPriceQuotation[]> {
        return CryptoPriceQuotation.find();
    }
    save(cryptoPriceQuotation: CryptoPriceQuotation) {
        return cryptoPriceQuotation.save();
    }

    async findOneBy(cryptoType: string): Promise<CryptoPriceQuotation|null> {
        const cryptoPrice = await CryptoPriceQuotation.findOneBy({ currency: cryptoType})
        if (cryptoPrice) {
            cryptoPrice.priceInUsd = parseFloat(cryptoPrice.priceInUsd.toString())
        }
        return cryptoPrice
    }
}