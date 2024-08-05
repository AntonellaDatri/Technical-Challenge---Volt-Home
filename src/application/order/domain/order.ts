import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BuySellRequestDTO } from "../../crypto-savings/domain/buy-sell-request.dto";
import { OperationTypeEnum } from "./operation-type.enum";
import { State } from "./state.enum";
@Entity()
export class Order extends BaseEntity {
    static createWith(buySellRequestDto: BuySellRequestDTO): Order {
        const order = new Order();
        order.ownerCVU = buySellRequestDto.ownerCvu;
        order.currencyType = buySellRequestDto.tradingCurrency.type;
        order.currencyAmount = buySellRequestDto.tradingCurrency.amount;
        order.state = State.PENDING;
        order.operationType = buySellRequestDto.operationType;
        return order
    }
    @PrimaryGeneratedColumn()
    id: string;
    @Column()
    ownerCVU: string;
    @Column()
    currencyType: string;
    @Column({name: 'currencyamount'})
    currencyAmount: number;
    @Column()
    state: State;
    @Column({name: 'operation_type'})
    operationType: OperationTypeEnum;
    @CreateDateColumn({name: 'createdate'})
    createDate: Date
    @UpdateDateColumn({name: 'updatedate'})
    updateDate: Date

    setCompleteState(): Order{
        this.state=State.COMPLETE
        return this
    }

    markAsExpiredIfCorrespond(): void {
        const now: Date = new Date()
        if (this.createDate >= now){
            this.state = State.EXPIRED
        };
    }

}