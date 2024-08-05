import { Order } from "./domain/order";

export class OrderRepository {
    save(order: Order): Promise<Order | null> {
        return order.save()
    }

    findOneBy(params: any) : Promise<Order | null> {
        return Order.findOneBy(params)
    }

    async find(params: any): Promise<Order[]> {
        return Order.find(params)
    }
}