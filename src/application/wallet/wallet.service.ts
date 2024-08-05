import { assertNotNull } from "../../shared/functions";
import { BuySellRequestDTO } from "../crypto-savings/domain/buy-sell-request.dto";
import { CurrencyTypeEnum } from "../crypto-savings/domain/currency-type-enum";
import { TradingCurrency } from "../crypto-savings/domain/trading-currency";
import { Wallet } from "./domain/wallet";
import { WalletRepository } from "./wallet.repository";

export class WalletService {
    constructor(
        private readonly walletRepository: WalletRepository
    ) {}

    findOneByCvu(walletCvu: string): Promise<Wallet|null>{
        return this.walletRepository.findOneBy({cvu: walletCvu})
    }

    async deposit(tradingCurrency: TradingCurrency, walletCVU: string): Promise<Wallet>{
        const wallet: Wallet | null = await this.walletRepository.findOneBy({ cvu: walletCVU });
        assertNotNull(wallet, `wallet with CVU ${walletCVU} not found`)
        const updatedWalled = wallet!.deposit(tradingCurrency);
        return this.walletRepository.save(updatedWalled);
    }

    async extract(tradingCurrency: TradingCurrency, walletCVU: string): Promise<Wallet>{
        const wallet: Wallet | null = await this.walletRepository.findOneBy({ cvu: walletCVU });
        assertNotNull(wallet, `wallet with CVU ${walletCVU} not found`)
        const updatedWalled = wallet!.extract(tradingCurrency);
        return this.walletRepository.save(updatedWalled);
    }

    async compromiseCurrency(walletCVU: string, tradingCurrency: TradingCurrency) {
        const wallet: Wallet | null = await this.walletRepository.findOneBy({ cvu: walletCVU });
        assertNotNull(wallet, `wallet with CVU ${walletCVU} not found`)
        const updatedWalled = wallet!.compromiseCurrency(tradingCurrency)
        this.walletRepository.save(updatedWalled)
    }

    async transfer(
            buySellRequestDto: BuySellRequestDTO,
            buyerOwner: string,
            sellerOwner: string,
            cryptoTradinCurrency: TradingCurrency
        ){
        await this.extract(cryptoTradinCurrency, buyerOwner);
        await this.extract(buySellRequestDto.tradingCurrency, sellerOwner);
        await this.deposit(buySellRequestDto.tradingCurrency, buyerOwner);
        await this.deposit(cryptoTradinCurrency, sellerOwner);
        await this.unCompromisedCurrency(sellerOwner, buySellRequestDto.tradingCurrency)
        await this.unCompromisedCurrency(buyerOwner, cryptoTradinCurrency)
    }

    async unCompromisedCurrency(walletCVU: string, tradingCurrency: TradingCurrency) {
        const wallet: Wallet | null = await this.walletRepository.findOneBy({ cvu: walletCVU });
        assertNotNull(wallet, `wallet with CVU ${walletCVU} not found`)
        const updatedWalled = wallet!.unCompromisedCurrency(tradingCurrency)
        this.walletRepository.save(updatedWalled)
    }

}