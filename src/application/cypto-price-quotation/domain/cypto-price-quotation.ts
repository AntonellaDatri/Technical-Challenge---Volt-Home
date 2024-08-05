import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class CryptoPriceQuotation extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;
    @Column({ unique: true })
    currency: string;
    @Column({name: 'priceinusd', type: 'decimal'})
    priceInUsd: number
    @CreateDateColumn({name: 'createdate'})
    createDate: Date
    @UpdateDateColumn({name: 'updatedate'})
    updateDate: Date

}
