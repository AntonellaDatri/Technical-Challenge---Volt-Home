import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TradingCurrency } from "../../crypto-savings/domain/trading-currency";

@Entity()
export class Transaction extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: string;
    @Column({name: 'buyingownercvu'})
    buyingOwnerCvu: string;
    @Column({name: 'sellerownercvu'})
    sellerOwnerCvu: string;
    @Column({ type: 'json', nullable: true, name: 'tradingcurrency'})
    tradingCurrency: TradingCurrency;
    @Column({ type: 'json', nullable: true, name: 'payingcurrency'})
    payingCurrency: TradingCurrency;
    @CreateDateColumn({name: 'createdate'})
    createDate: Date
    @UpdateDateColumn({name: 'updatedate'})
    updateDate: Date
}
