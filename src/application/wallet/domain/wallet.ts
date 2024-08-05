import { customError } from "../../../config/exception-handler";
import { TradingCurrency } from "../../crypto-savings/domain/trading-currency";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ synchronize: false })
export class Wallet extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;
    @Column({ unique: true })
    cvu: string;
    @Column({ type: 'json', nullable: true, name: 'compromisedcurrencies' })
    compromisedCurrencies: TradingCurrency[]
    @Column({ type: 'json', nullable: true })
    currencies: TradingCurrency[];
    @CreateDateColumn({name: 'createdate'})
    createDate: Date
    @UpdateDateColumn({name: 'updatedate'})
    updateDate: Date

    deposit(tradingCurrency: TradingCurrency) {
        const newCurrencies: TradingCurrency[] = this.currenciesDeposited(tradingCurrency, this.currencies);
        this.currencies = newCurrencies;
        return this;
    }

    extract(tradingCurrency: TradingCurrency) {
        this.assertExtract(tradingCurrency)
        this.currencies.map(currency => {
            if (currency.type === tradingCurrency.type) {
                currency.amount -= tradingCurrency.amount;
            }
        });
        return this;
    }
    compromiseCurrency(tradingCurrency: TradingCurrency) {
        this.assertExistsNominalToPay(tradingCurrency)
        const newCurrencies: TradingCurrency[] = this.currenciesDeposited(tradingCurrency, this.compromisedCurrencies);
        this.compromisedCurrencies = newCurrencies;
        return this;
    }
    unCompromisedCurrency(tradingCurrency: TradingCurrency) {
        this.compromisedCurrencies.map(currency => {
            if (currency.type === tradingCurrency.type){
                currency.amount =
                    currency.amount > tradingCurrency.amount ? currency.amount - tradingCurrency.amount : 0;
            }
        });
        return this;
    }

    getAmountOf(currency: string): number {
        const tradingCurrency = this.currencies.find(tc => tc.type == currency);
        return tradingCurrency ? tradingCurrency.amount : 0;
    }

    currenciesDeposited(tradingCurrency: TradingCurrency, array: TradingCurrency[]): TradingCurrency[] {
        let currencyToDeposit: TradingCurrency = tradingCurrency;
        const newArray: TradingCurrency[] = [];
        array.forEach(currency => {
            if (currency.type === tradingCurrency.type) {
                currency.amount += tradingCurrency.amount;
                currencyToDeposit = currency;
            } else {
                newArray.push(currency);
            }
        })
        newArray.push(currencyToDeposit);
        return newArray;
    }

    nominalAvailable(tradingCurrency: TradingCurrency): boolean {
        const compromisedCurrency = this.compromisedCurrencies.find(currency => currency.type === tradingCurrency.type);
        const availableCurrency = this.currencies.find(currency => currency.type === tradingCurrency.type);

        return !!availableCurrency
            && availableCurrency!.amount > (compromisedCurrency ? compromisedCurrency!.amount : 0)
    }

    assertExtract(tradingCurrency: TradingCurrency) {
        const currency = this.currencies.find(currency => currency.type === tradingCurrency.type)
        if (!currency || currency.amount < tradingCurrency.amount) {
            customError(400, `Can not extract ${tradingCurrency.amount} ${tradingCurrency.type}`)
        }
    }

    assertExistsNominalToPay(tradingCurrency: TradingCurrency) {
        const isNominalAvaliable = this.nominalAvailable(tradingCurrency);
        if(!isNominalAvaliable) {
            customError(400, `Not enough ${tradingCurrency.type} to operate`)
        }
    }
}
