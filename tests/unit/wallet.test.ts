import { CurrencyTypeEnum } from "../../src/application/crypto-savings/domain/currency-type-enum";
import { TradingCurrency } from "../../src/application/crypto-savings/domain/trading-currency";
import { Wallet } from "../../src/application/wallet/domain/wallet";
import { customError } from "../../src/config/exception-handler";

jest.mock("../../src/config/exception-handler", () => ({
    customError: jest.fn((statusCode: number, message: string) => {
      const error = new Error(message);
      error.name = 'CustomError';
      // @ts-ignore
      error.statusCode = statusCode;
      throw error;
    })
  }));

describe("Wallet", () => {
  let wallet: Wallet;

  beforeEach(() => {
    wallet = new Wallet();
    wallet.currencies = [];
    wallet.compromisedCurrencies = [];
  });

  describe("deposit", () => {
    it("should deposit currency correctly", () => {
      const tradingCurrency: TradingCurrency = { type: CurrencyTypeEnum.BTC, amount: 1 };
      wallet.deposit(tradingCurrency);
      expect(wallet.currencies).toEqual([tradingCurrency]);
    });
  });

  describe("extract", () => {
    it("should extract currency correctly", () => {
      wallet.currencies = [{ type: CurrencyTypeEnum.BTC, amount: 2 }];
      const tradingCurrency: TradingCurrency = { type: CurrencyTypeEnum.BTC, amount: 1 };
      wallet.extract(tradingCurrency);
      expect(wallet.currencies).toEqual([{ type: CurrencyTypeEnum.BTC, amount: 1 }]);
    });

    it("should throw error if not enough currency to extract", () => {
      const tradingCurrency: TradingCurrency = { type: CurrencyTypeEnum.BTC, amount: 1 };
      expect(() => wallet.extract(tradingCurrency)).toThrow();
      expect(customError).toHaveBeenCalledWith(400, "Can not extract 1 BTC");
    });
  });

  describe("compromiseCurrency", () => {
    it("should compromise currency correctly", () => {
      wallet.currencies = [{ type: CurrencyTypeEnum.BTC, amount: 2 }];
      const tradingCurrency: TradingCurrency = { type: CurrencyTypeEnum.BTC, amount: 1 };
      wallet.compromiseCurrency(tradingCurrency);
      expect(wallet.compromisedCurrencies).toEqual([tradingCurrency]);
    });

    it("should throw error if not enough currency to compromise", () => {
      const tradingCurrency: TradingCurrency = { type: CurrencyTypeEnum.BTC, amount: 1 };
      expect(() => wallet.compromiseCurrency(tradingCurrency)).toThrow();
      expect(customError).toHaveBeenCalledWith(400, "Not enough BTC to operate");
    });
  });

  describe("unCompromisedCurrency", () => {
    it("should unCompromise currency correctly", () => {
      wallet.compromisedCurrencies = [{ type: CurrencyTypeEnum.BTC, amount: 2 }];
      const tradingCurrency: TradingCurrency = { type: CurrencyTypeEnum.BTC, amount: 1 };
      wallet.unCompromisedCurrency(tradingCurrency);
      expect(wallet.compromisedCurrencies).toEqual([{ type: CurrencyTypeEnum.BTC, amount: 1 }]);
    });
  });
});