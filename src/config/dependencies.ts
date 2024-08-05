import { CryptoSavingsService } from "../application/crypto-savings/crypto-savings.service";
import { CryptoPriceQuotationRepository } from "../application/cypto-price-quotation/crypto-price-quotation.repository";
import { CryptoPriceQuotationService } from "../application/cypto-price-quotation/crypto-price-quotation.service";
import { OrderRepository } from "../application/order/order.repository";
import { OrderService } from "../application/order/order.service";
import { TransactionRepository } from "../application/transaction/transaction.repository";
import { TransactionService } from "../application/transaction/transaction.service";
import { WalletRepository } from "../application/wallet/wallet.repository";
import { WalletService } from "../application/wallet/wallet.service";


export const walletRepository = new WalletRepository();
export const walletService  = new WalletService(walletRepository);


export const orderRepository = new OrderRepository();
export const orderService = new OrderService(orderRepository);

export const transactionRepository = new TransactionRepository();
export const transactionService = new TransactionService(transactionRepository);

export const cryptoPriceQuotationRepository = new CryptoPriceQuotationRepository();
export const cryptoPriceQuotationService = new CryptoPriceQuotationService(cryptoPriceQuotationRepository);

export const cryptoSavingsService = new CryptoSavingsService(orderService, transactionService, walletService, cryptoPriceQuotationService);
