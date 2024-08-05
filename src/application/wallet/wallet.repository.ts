import { Wallet } from "./domain/wallet";

export class WalletRepository {

    findOneBy(params: any): Promise<Wallet|null> {
        return Wallet.findOneBy(params)
    }

    save(wallet: Wallet): Promise<Wallet> {
        return wallet.save()
    }
}