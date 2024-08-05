import { Body, Controller, Post, Route, SuccessResponse } from "tsoa";
import { TradingCurrency } from "../crypto-savings/domain/trading-currency";
import { WalletService } from "./wallet.service";
import { walletService } from "../../config/dependencies";
import { Wallet } from "./domain/wallet";

@Route("api/wallet")
export class WalletController extends Controller {
  private walletService: WalletService
  constructor() {
    super()
    this.walletService = walletService
  }

  /**
   * @param body.tradingCurrency type and amount to deposit
   * @param body.cvu to deposit into
   * @returns Deposit completed
   */
  @Post("/deposit")
  @SuccessResponse("200", "Deposit completed")
  async deposit(@Body() requestBody: {tradingCurrency: TradingCurrency, cvu: string}): Promise<Wallet> {
    return this.walletService.deposit(requestBody.tradingCurrency, requestBody.cvu)
  }

  /**
   * @param body.tradingCurrency type and amount to extract
   * @param body.cvu to extract from
   * @returns Withdrawal completed
   */
  @Post("/extract")
  @SuccessResponse("200", "Withdrawal completed")
  async extract(@Body() requestBody: {tradingCurrency: TradingCurrency, cvu: string}): Promise<Wallet> {
    return this.walletService.extract(requestBody.tradingCurrency, requestBody.cvu)
  }
}

export default WalletController;