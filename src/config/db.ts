import { DataSource } from "typeorm";
import { Wallet } from "../application/wallet/domain/wallet";
import { Transaction } from "../application/transaction/domain/transaction";
import { Order } from "../application/order/domain/order";
import dotenv from "dotenv";
import { CryptoPriceQuotation } from "../application/cypto-price-quotation/domain/cypto-price-quotation";
import { PopulateWallet1722775293484 } from "../migrations/1722775293484-PopulateWallet";

dotenv.config();

export default new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "crypto_saving",
    entities: [Wallet, Transaction, Order, CryptoPriceQuotation],
    synchronize: true,
    logging: true,
    migrations: [PopulateWallet1722775293484],
});
