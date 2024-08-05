import { BuySellRequestDTO } from "../crypto-savings/domain/buy-sell-request.dto";
import { OperationTypeEnum } from "./domain/operation-type.enum";
import { Order } from "./domain/order";
import { State } from "./domain/state.enum";
import { OrderRepository } from "./order.repository";

export class OrderService {
    constructor(
        private readonly orderRepository: OrderRepository
    ){}

    save(order: Order) {
        return this.orderRepository.save(order);
    }

    findOrder(buySellRequestDto: BuySellRequestDTO, operationType: OperationTypeEnum): Promise<Order | null> {
        return this.orderRepository.findOneBy({
            operationType: operationType,
            state: State.PENDING,
            currencyType: buySellRequestDto.tradingCurrency.type,
            currencyAmount: buySellRequestDto.tradingCurrency.amount
        });
    }

    async expire() {
        const orders: Order[] = await this.orderRepository.find({state: State.PENDING})
        orders.forEach(order => order.markAsExpiredIfCorrespond())
    }

}